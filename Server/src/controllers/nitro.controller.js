import nitroModel from "../models/nitro.model.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMyNitro = async (req, res, next) => {
    try {
        const nitro = await nitroModel.findOne({
            user: req.user._id,
            status: "active",
            endDate: {
                $gt: new Date(),
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    hasNitro: !!nitro,
                    nitro,
                },
                "Nitro status fetched successfully"
            )
        );

    } catch (error) {
        next(error);
    }
};