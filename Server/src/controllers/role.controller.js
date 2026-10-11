import roleModel from "../models/role.model.js";
import serverModel from "../models/server.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const CreateRole = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { name, permission, color, position } = req.body;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    if (server.owner.toString() !== req.user.id.toString()) {
      throw new ApiError(
        403,
        "Only server owner can create roles"
      );
    }

    const role = await roleModel.create({
      name,
      userId: req.user.id,
      serverId: serverId,
      permission,
      color,
      position,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          role,
          "Role created successfully"
        )
      );

  } catch (error) {
    next(error);
  }
};

export const getAllRoles = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const server = await serverModel.findById(serverId);
    if (!server) throw new ApiError(404, "server is not exist");
    const role = await roleModel.find({ serverId: serverId });
    if (role.length == 0) throw new ApiError(404, "role is empty");
    return res
      .status(200)
      .json(new ApiResponse(200, role, "role fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getSingleRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    const role = await roleModel.findById(roleId);

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, role, "Role fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { name, serverId, userId, color, permission, position } = req.body;
    const role = await roleModel.findById(roleId);
    if (!role) throw new ApiError(404, "role does not exist ");

    if (name) role.name = name;
    if (serverId) role.serverId = serverId;
    if (userId) role.userId = userId;
    if (color) role.color = color;
    if (permission) role.permission = permission;
    if (position) role.position = position;

    await role.save();

    return res
      .status(200)
      .json(new ApiResponse(200, role, "role udate successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async(req, res, next)=>{
    try {
        const{roleId} = req.params;
        const role = await roleModel.findByIdAndDelete(roleId)
         if (!role) {
      throw new ApiError(404, "Role not found");
    }
        return res.status(200).json(
            new ApiResponse(200, "Role deleted successfully")
        )
    } catch (error) {
        next(error)
    }
}
