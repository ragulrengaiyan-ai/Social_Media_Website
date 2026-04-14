import feedServices from "../services/feed.service.js";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

export const getFeed = async (req, res) => {
    try {
        const {userId} = req.params
        const {limit = 10, skip =0} = req.query

        if (!ObjectId.isValid(userId)) {
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message:"Invalid userId"})
        }

        const posts = await feedServices.getFeed(
            userId,
            parseInt(limit),
            parseInt(skip)
        )
        res.status(StatusCodes.OK).json({posts})
    }
    catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({message:err.message})
    }
}