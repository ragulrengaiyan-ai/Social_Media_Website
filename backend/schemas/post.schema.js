import Joi from "joi";

export const createPostSchema = Joi.object({
  post_content: Joi.string().allow("").optional(),
  post_image: Joi.string().uri().optional(),
}).or("post_content", "post_image");