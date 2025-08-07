import { ConfigModule, registerAs } from "@nestjs/config";


const authConfig = registerAs('auth' , ()=>({
    accessTokenSecret : process.env.JWT_ACCESSTOKEN_SECRET || 'default_access_secret',
    refreshTokenSecret: process.env.JWT_REFRESHTOKEN_SECRET || 'default_refresh_secret',
    accessTokenExpireIn: parseInt(process.env.JWT_ACCESSTOKEN_EXPIRETIME || '3600'), // in seconds
    refreshTokenExpireIn: parseInt(process.env.JWT_REFRESHTOKEN_EXPIRETIME || '86400')
}))

export default authConfig

// export const asProvider=()=>({
//     imports:[ConfigModule.forFeature(authConfig)],
//     useFactory:()
// })

export const asProvider = () => ({
  imports: [ConfigModule.forFeature(authConfig)],
  useFactory: (config: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpireIn: number;
    refreshTokenExpireIn: number;
  }) => ({
    secret: config.accessTokenSecret,
    signOptions: { 
      expiresIn: `${config.accessTokenExpireIn}s` 
    }
  }),
  inject: [authConfig.KEY]
});