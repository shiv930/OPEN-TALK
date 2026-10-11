import roleModel from "../models/role.model.js";
import serverModel from "../models/server.model.js";
import serverMemberModel from "../models/serverMember.model.js";
import nitroModel from "../models/nitro.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getServerMembers = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, "server not found ");
    }
    const member = await serverMemberModel
      .find({ server: serverId })
      .populate("user", "username fullname profile_pic")
      .populate("role", "name permission color position");

    const userIds = member.map((entry) => entry.user?._id).filter(Boolean);
    const nitroUserIds = await nitroModel.distinct("user", {
      user: { $in: userIds },
      status: "active",
      endDate: { $gt: new Date() },
    });
    const nitroUserIdSet = new Set(nitroUserIds.map((id) => id.toString()));
    const membersWithNitroStatus = member.map((entry) => {
      const memberData = entry.toObject();
      if (memberData.user) {
        memberData.user.hasNitro = nitroUserIdSet.has(memberData.user._id.toString());
      }
      return memberData;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, membersWithNitroStatus, "server member fetched successfully"));
  } catch (error) {
    next(error);
  }
};


//dought in remove ok ek sath do id aramas se aa sakti hai kya 
export const removeMember = async (req, res, next) => {
  try {
    const { serverId, userId } = req.params;
    const server = await serverModel.findById(serverId);
    if (!server) throw new ApiError(404, "server is not found");

    if (server.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "only server owner can remove members");
    }

    const member = await serverMemberModel.findOne({
      server: serverId,
      user: userId,
    });

    if (!member) {
      throw new ApiError(404, "member not found in this server");
    }

    if (server.owner.toString() === userId.toString()) {
      throw new ApiError(400, "server owner cannot be removed");
    }
    await serverMemberModel.findByIdAndDelete(member._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "member removed successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    const { serverId, userId } = req.params;
    const { roleId } = req.body; 

    const server = await serverModel.findById(serverId);
    if (!server) throw new ApiError(404, "Server not found");

    
    if (server.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only server owner can update member roles");
    }

    const member = await serverMemberModel.findOne({ server: serverId, user: userId });
    if (!member) throw new ApiError(404, "Member not found");

    member.role = roleId; 
    await member.save();

    return res
      .status(200)
      .json(new ApiResponse(200, member, "Member roles updated successfully"));
  } catch (error) {
    next(error);
  }
};
