import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
    [Segments.BODY]: Joi.object(
    {
        emai:Joi.string().email().required(),
        password:Joi.string().min(8).required,
    }
    )
};