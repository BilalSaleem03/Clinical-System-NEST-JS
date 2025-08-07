import * as joi from 'joi'


export default joi.object({
    POSTGRE_URL: joi.string().required(),
    JWT_ACCESSTOKEN_SECRET:joi.string().required(),
    JWT_REFRESHTOKEN_SECRET:joi.string().required(),
    JWT_ACCESSTOKEN_EXPIRETIME:joi.string().required(),
    JWT_REFRESHTOKEN_EXPIRETIME:joi.string().required(),


    SENDGRID_API_KEY:joi.string().required(),

    SENDGRID_FROM_EMAIL:joi.string().required(),
    CALENDER_SET_ACCESSTOKEN:joi.string().required()
})