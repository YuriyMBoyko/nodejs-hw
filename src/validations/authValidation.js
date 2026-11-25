import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(8).required()
  })
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().required()
  })
};
