import channelModel from "../models/channel.model.js";
import serverModel from "../models/server.model.js";
import serverMemberModel from "../models/serverMember.model.js";
import nitroModel from "../models/nitro.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createChannel = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { name, description, topic, type, position } = req.body;
    const server = await serverModel.findById(serverId);
    if (!server) throw new ApiError(404, "server is not found");
    const channel = await channelModel.create({
      name,
      description: description ?? topic,
      type,
      position,
      serverId,
      owner:req.user._id
    });
    return res
      .status(201)
      .json(new ApiResponse(201, channel, "channel is created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllChannel = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);
    if (!server) throw new ApiError(404, "Server not found");

    const channels = await channelModel.find({ serverId });
    const nitro = await nitroModel.exists({
      user: req.user._id,
      status: "active",
      endDate: { $gt: new Date() },
    });
    const visibleChannels = nitro
      ? channels
      : channels.filter((channel) => channel.type !== "voice");

    return res
      .status(200)
      .json(new ApiResponse(200, visibleChannels, "Channels fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getSingleChannel = async (req, res, next) => {
  try {
    const { serverId, channelId } = req.params;
    const server = await serverModel.findById(serverId);

    if (!server) throw new ApiError(404, "server  not found");

    const channel = await channelModel.findById(channelId);
    if (!channel) throw new ApiError(404, "channel  not found");

    if (channel.type === "voice") {
      const nitro = await nitroModel.exists({
        user: req.user._id,
        status: "active",
        endDate: { $gt: new Date() },
      });
      if (!nitro) throw new ApiError(403, "Nitro is required to access voice channels");
    }

    if(channel.type==="private"){
        const member = await serverMemberModel.findOne({server:serverId, user:req.user._id})
        if(!member){
            throw new ApiError(403, "You are not allowed to view this channel");
        }
    }
    return res.status(200).json(
        new ApiResponse(200, channel, "Channels fetched successfully"));
  } catch (error) {
    next(error);
  }
};


export const updateChannel = async (req, res, next) => {
  try {
    const { serverId, channelId } = req.params;
    const{name, description, type, position}= req.body
    const server = await serverModel.findById(serverId);

    if (!server) throw new ApiError(404, "server  not found");

    const channel = await channelModel.findById(channelId);
    if (!channel) throw new ApiError(404, "channel  not found");
     if(
        server.owner.toString()!== req.user._id.toString() &&
        channel.owner.toString() !== req.user._id.toString()
     ){
        throw new ApiError(403, "you  are not allowed to update this channel")
     }

    if(name) channel.name= name
    if(description) channel.description= description
    if(type) channel.type= type
    if(position) channel.position= position

        await channel.save()
         return res
      .status(200)
      .json(new ApiResponse(200, channel, "channel udate successfully"));
  } catch (error) {
    next(error);
  }
};


export const deleteChannel = async (req, res, next) => {
  try {
    const { serverId, channelId } = req.params;

    const server = await serverModel.findById(serverId);
    if (!server) throw new ApiError(404, "Server not found");

    const channel = await channelModel.findById(channelId);
    if (!channel) throw new ApiError(404, "Channel not found");

   
    if (
      server.owner.toString() !== req.user._id.toString() &&
      channel.owner.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(403, "You are not allowed to delete this channel");
    }

    await channelModel.findByIdAndDelete(channelId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Channel deleted successfully"));
  } catch (error) {
    next(error);
  }
};
