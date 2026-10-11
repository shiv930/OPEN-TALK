import channelModel from "../models/channel.model.js";
import messageModel from "../models/message.model.js";
import serverModel from "../models/server.model.js";
import serverMemberModel from "../models/serverMember.model.js";
import { getIo } from "../services/socket.services.js";
import sendFiles from "../services/storage.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


export const createMessage = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    // Read text safely; image-only messages can have empty content.
    const content =
      typeof req.body?.content === "string"
        ? req.body.content
        : "";

    const files = Array.isArray(req.files) ? req.files : [];

    if (!content.trim() && files.length === 0) {
      throw new ApiError(
        400,
        "Message must contain text or an attachment"
      );
    }

    const channel = await channelModel.findById(channelId);

    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    const member = await serverMemberModel.findOne({
      server: channel.serverId,
      user: req.user._id,
    });

    const server = await serverModel
      .findById(channel.serverId)
      .select("isPublic");

    const isPrivateChannel =
      channel.type === "private" ||
      channel.isPrivate === true ||
      channel.isPrivate === "true";

    if (
      (!member && !server?.isPublic) ||
      (isPrivateChannel && !member)
    ) {
      throw new ApiError(
        403,
        "You are not a member of this server"
      );
    }

    // Upload attachments to your existing storage service.
    const attachments = await Promise.all(
      files.map(async (file) => {
        if (!file.buffer) {
          throw new ApiError(
            400,
            "Uploaded file buffer is missing"
          );
        }

        const uploadFile = await sendFiles(
          file.buffer,
          file.originalname
        );

        return {
          url: uploadFile.url,
          type: file.mimetype.startsWith("image/")
            ? "image"
            : file.mimetype.startsWith("video/")
              ? "video"
              : "file",
          name: file.originalname,
        };
      })
    );

    // Save the message, even when content is empty but files exist.
    const messageDetails = await messageModel.create({
      content: content.trim(),
      author_id: req.user._id,
      channel_id: channelId,
      attachments,
    });

    // Populate author details for real-time chat updates.
    const populatedMessage = await messageModel.aggregate([
      {
        $match: {
          _id: messageDetails._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author_details",
        },
      },
      {
        $unwind: "$author_details",
      },
      {
        $project: {
          content: 1,
          channel_id: 1,
          author_id: 1,
          attachments: 1,
          createdAt: 1,
          updatedAt: 1,
          "author_details._id": 1,
          "author_details.username": 1,
          "author_details.profile_pic": 1,
        },
      },
    ]);

    getIo()
      .to(channelId)
      .emit("newMessage", populatedMessage[0] || messageDetails);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          messageDetails,
          "Message created successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getAllMessage = async (req, res, next) => {
  try {
        const message = await messageModel.findOne({ _id: req.params.messageId, channel_id: req.params.channelId }).populate("author_id", "profile_pic username fullname");
        if (!message) throw new ApiError(404, "Message not found");
        return res.status(200).json(new ApiResponse(200, message, "Message fetched successfully"));
    } catch (error) { next(error); }
};

export const getAllChannelMessage = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channel = await channelModel.findById(channelId);

    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    const member = await serverMemberModel.findOne({
      server: channel.serverId,
      user: req.user._id,
    });
    const server = await serverModel.findById(channel.serverId).select("isPublic");
    const isPrivateChannel = channel.type === "private" || channel.isPrivate === true || channel.isPrivate === "true";
    if ((!member && !server?.isPublic) || (isPrivateChannel && !member)) {
      throw new ApiError(403, "You are not a member of this server");
    }

    const message = await messageModel.aggregate([
      {
        $match: {
          channel_id: channel._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author_details",
        },
      },
      {
        $unwind: "$author_details",
      },
      {
        $lookup: {
          from: "nitros",
          let: { authorId: "$author_details._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$authorId"] },
                    { $eq: ["$status", "active"] },
                    { $gt: ["$endDate", new Date()] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "activeNitro",
        },
      },
      {
        $addFields: {
          "author_details.hasNitro": { $gt: [{ $size: "$activeNitro" }, 0] },
        },
      },
      {
        $project: {
          channel_id: 1,
          author_id: 1,
          content: 1, //1 means include
          createdAt: 1,
          updatedAt: 1,
          attachments: 1,
          "author_details._id": 1,
          "author_details.username": 1,
          "author_details.profile_pic": 1,
          "author_details.hasNitro": 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, message, "message fetched successfully"));
  } catch (error) {
    next(error);
  }
};


export const updateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await messageModel.findById(messageId);
    if (!message) throw new ApiError(404, "Message not found");

    if (message.author_id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You can only edit your own messages");
    }

    message.content = content.trim();
    await message.save();

    const updatedMessage = {
      _id: message._id,
      channel_id: message.channel_id,
      author_id: message.author_id,
      content: message.content,
      attachments: message.attachments,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
    getIo().to(message.channel_id.toString()).emit("messageUpdated", updatedMessage);

    return res.status(200).json(
      new ApiResponse(200, updatedMessage, "Message updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await messageModel.findById(messageId);
    if (!message) throw new ApiError(404, "Message not found");

    const channel = await channelModel.findById(message.channel_id);
    if (!channel) throw new ApiError(404, "Channel not found");

    // Authors may delete their own messages; moderators need MANAGE_MESSAGES.
    const member = await serverMemberModel.findOne({
      server: channel.serverId,
      user: req.user._id,
    }).populate("role", "permission");

    const isAuthor = message.author_id.toString() === req.user._id.toString();
    const canManageMessages = member?.role?.permission?.includes("MANAGE_MESSAGES");

    if (!isAuthor && !canManageMessages) {
      throw new ApiError(403, "You cannot delete this message");
    }

    await message.deleteOne();
    getIo().to(channel._id.toString()).emit("messageDeleted", { messageId, channelId: channel._id });

    return res.status(200).json(
      new ApiResponse(200, null, "Message deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};