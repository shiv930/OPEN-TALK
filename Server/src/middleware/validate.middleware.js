import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    console.log("Request body:", req.body);


    if (!errors.isEmpty()) {
        return next(
            new ApiError(
                400,
                "Validation failed",
                errors.array()
            )
        );
    }

    next();
};

