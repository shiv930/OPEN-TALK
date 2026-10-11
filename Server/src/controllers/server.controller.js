
import roleModel from "../models/role.model.js";
import serverMemberModel from "../models/serverMember.model.js";
import serverModel from "../models/server.model.js";
import userModel from "../models/user.model.js";
import { createServerMember } from "../services/serverMember.schema.js";
import sendFiles from "../services/storage.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateInviteCode } from "../utils/inviteCode.js";

export const createServer = async (req, res, next) => {
  try {
    const { name, description, isPublic, category } = req.body;
    const icon = req.files?.icon;
    const banner = req.files?.banner;

    console.log("Body:", req.body);
console.log("Files:", req.files);



    let uploadIcon = null;
    if (icon && icon.length > 0) {
      uploadIcon = await sendFiles(icon[0].buffer, icon[0].originalname);
    }
    let uploadBanner = null;
    if (banner && banner.length > 0) {
      uploadBanner = await sendFiles(banner[0].buffer, banner[0].originalname);
    }

    const inviteCode = generateInviteCode();

    console.log(inviteCode);
    const server = await serverModel.create({
      name,
      description,
      category: category || "Community",
      owner: req.user.id,
      icon: uploadIcon?.url || "",
      banner: uploadBanner?.url || "",
      isPublic: isPublic === true || isPublic === "true",
      inviteCode,
    });
    const ownerRole = await roleModel.create({
      name: "owner",
      serverId: server._id,
      userId:req.user._id,
      permission: [
        "MANAGE_SERVER",
        "MANAGE_CHANNELS",
        "MANAGE_ROLES",
        "MANAGE_MEMBERS",
        "MANAGE_MESSAGES",
      ],
      position: 100,
    });
    await roleModel.create({
      name: "member",
      serverId: server._id,
      userId: req.user._id,
      permission: [],
      position: 0,
    });
    await createServerMember(req.user.id, server._id, [ownerRole._id]);

    return res
      .status(201)
      .json(new ApiResponse(201, server, "server creatd succesfully"));
  } catch (error) {
    next(error);
  }
};


export const getServer = async (req, res, next) => {
  try {
    const memberships = await serverMemberModel
      .find({ user: req.user.id })
      .select("server");
    const serverIds = memberships.map((membership) => membership.server);
    const servers = await serverModel.find({ _id: { $in: serverIds } });

    return res
      .status(200)
      .json(new ApiResponse(200, servers, "Servers fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getPublicServers = async (req, res, next) => {
  try {
    const joinedServerIds = req.user.server || [];
    const servers = await serverModel
      .find({ isPublic: true })
      .select("name description category icon inviteCode")
      .sort({ createdAt: -1 });
    const joinedIds = new Set(joinedServerIds.map((id) => id.toString()));
    const publicServers = servers.map((server) => ({
      ...server.toObject(),
      isMember: joinedIds.has(server._id.toString()),
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, publicServers, "Public servers fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getServerDetails = async (req, res, next) => {
  try {
    const serverDetails = await serverModel
      .findById(req.params.id)
      .populate("owner");
    if (!serverDetails) {
      throw new ApiError(404, "Invalid server id ");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, serverDetails, "server details fetched "));
  } catch (error) {
    next(error);
  }
};

export const updateServer = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    //sirf owner update karega ook

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    if (server.owner.toString() !== req.user.id) {
      throw new ApiError(403, "You are not authorized to update this server");
    }

    const icon = req.files?.icon
    const banner = req.files?.banner;

    if (icon && icon.length > 0) {
      const uploadIcon = await sendFiles(icon[0].buffer, icon[0].originalname);
      server.icon = uploadIcon?.url || server.icon;
    }

    if (banner && banner.length > 0) {
      const uploadBanner = await sendFiles(
        banner[0].buffer,
        banner[0].originalname,
      );
      server.banner = uploadBanner?.url || server.banner;
    }

    const { name, description, isPublic } = req.body;
    if (name !==undefined) server.name = name;
    if (description !==undefined) server.description = description;
if (isPublic !== undefined) {
  server.isPublic = isPublic === "true";
}
    await server.save();
    return (
      res.status(200).
      json(new ApiResponse(200, server, "server updated successfully"))
    );
  } catch (error) {
    next(error);
  }
};

export const deleteServer = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "server not found ");
    }

    if (server.owner.toString() !== req.user.id) {
      throw new ApiError(403, "You are not authorized to delete this server");
    }
    await serverModel.findByIdAndDelete(serverId);
    return res
      .status(200)
      .json(new ApiResponse(200, "server delete successfully"));
  } catch (error) {
    next(error);
  }
};

export const joinServer = async (req, res, next) => {
  try {
    const { inviteCode } = req.params;

    const server = await serverModel.findOne({ inviteCode });

    if (!server) {
      throw new ApiError(404, "Invalid invite code");
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check already member
    const alreadyExist = user.server.some((serverId) => {
      return serverId.toString() === server._id.toString();
    });

    if (alreadyExist) {
      throw new ApiError(
        400,
        "You are already a member of this server"
      );
    }

    // Find member role
    let memberRole = await roleModel.findOne({
      serverId: server._id,
      name: "member",
    });

    if (!memberRole) {
      memberRole = await roleModel.create({
        name: "member",
        serverId: server._id,
        userId: server.owner,
        permission: [],
        position: 0,
      });
    }

    // Add server to user's server list
    user.server.push(server._id);

    await user.save();

    // Create server member
    await createServerMember(
      req.user.id,
      server._id,
      [memberRole._id]
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          server,
          "Server joined successfully"
        )
      );

  } catch (error) {
    next(error);
  }
};

export const leaveServer = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    const user = await userModel.findById(req.user.id);
    const isMember = user.server.some(
      (serverId) => serverId.toString() === server._id.toString(),
    );
    if (!isMember) {
      throw new ApiError(400, "You are not a member of this server");
    }
    user.server = user.server.filter(
      (serverId) => serverId.toString() !== server._id.toString(),
    );
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Server left successfully"));
  } catch (error) {
    next(error);
  }
};
