import Joi from "joi";

export const commentSchema = Joi.object({
  comment: Joi.string().min(1).required(),
});