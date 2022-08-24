import Joi from 'joi';

const loginSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required()
})

const registerSchema = Joi.object({
    userName: Joi.string().min(2).max(32).required(),
    password: Joi.string().min(8).required(),
    repeat_password: Joi.ref("password"),
    gender: Joi.valid("1", "2"),
    contact: Joi.string().min(12).required(),
    image: Joi.string()
})

export {
    loginSchema, registerSchema
}
