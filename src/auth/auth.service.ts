import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';
import { Request } from 'express';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(()=>DoctorService))private readonly doctorService : DoctorService,
    @Inject(forwardRef(()=>PatientService))private readonly patientService : PatientService,
    @Inject(forwardRef(()=>AdminService))private readonly adminService : AdminService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly emailService:EmailService
  ){}


  async generateAccessToken(user){
    try {
      // console.log("ppppppppppppppppppp")
      // console.log(user)
      return await this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          role: user.profileId.role
        },
        {
          secret: this.authConfiguration.accessTokenSecret,
          expiresIn: this.authConfiguration.accessTokenExpireIn
        }
      )
    } catch (error) {
      throw error
    }
  }
  async generateRefreshToken(user){
    try {
      return await this.jwtService.signAsync(
        {
          id: user.id,
          role: user.profileId.role
        },
        {
          secret: this.authConfiguration.refreshTokenSecret,
          expiresIn: this.authConfiguration.refreshTokenExpireIn
        }
      )
    } catch (error) {
      throw error
    }
  }


  async login(loginAuthDto: LoginAuthDto) {
    try {
      let user;
      if(loginAuthDto.role === "doctor"){
        user = await this.doctorService.isValidCredentials(loginAuthDto.email , loginAuthDto.password)
      } else if(loginAuthDto.role === "patient"){
        user = await this.patientService.isValidCredentials(loginAuthDto.email , loginAuthDto.password)
      } else if(loginAuthDto.role === "admin"){
        user = await this.adminService.isValidCredentials(loginAuthDto.email , loginAuthDto.password)
      } else{
        throw new BadRequestException("Invalid Role Provided.....It shold be admin,doctor or patient ")
      }

      if(!user){
        throw new NotFoundException("Invalid credentials...")
      }

      // console.log(user)

      let accessToken = await this.generateAccessToken(user)
      let refreshToken = await this.generateRefreshToken(user)

      //store refreshtoken to data base


      if(loginAuthDto.role === "doctor"){
        await this.doctorService.setRefreshToken(user.id ,refreshToken)
      } else if(loginAuthDto.role === "patient"){
        await this.patientService.setRefreshToken(user.id ,refreshToken)
      } else if(loginAuthDto.role === "admin"){
        await this.adminService.setRefreshToken(user.id ,refreshToken)
      }


      return {cookies: [
          {
            name: 'accessToken',
            value: accessToken,
          }
        ]
      };

    } catch (error) {
      throw error
    }
  }



  logout() {
    try {

      return {
        clearCookies: ['accessToken'],
        message: 'Cookie cleared'
      };
      // if (token.accessToken) {
      //   return res.clearCookie('accessToken').status(200).json({ success: "LoggedOut..." })
      // } else {
      //   return res.status(200).json({ success: "You are not logged In!!!" })
      // }
    } catch (error) {
      throw error

    }
  }

  async decodeAccessToken(accessToken: string) {
    try {
      // Verify and decode the token
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.authConfiguration.accessTokenSecret,
      });

      return payload;
    } catch (error) {
      // Handle different error types
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid Access token');
      }
      throw error;
    }
  }
  async decodeRefreshToken(refreshToken: string) {
    try {
      // Verify and decode the token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.authConfiguration.refreshTokenSecret,
      });

      return payload;
    } catch (error) {
      // Handle different error types
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }
  


  async regenerateTokens(req: Request){
    try {
      let accessToken = req.cookies.accessToken
      if(!accessToken){
        throw new UnauthorizedException("Unauthorized Access...")
      }
      let payloadOfaccesstoken = await this.decodeAccessToken(accessToken)
  
      if (!payloadOfaccesstoken) {
        throw new NotFoundException("Unauthorized access....")
      }
  
      // console.log("-------------------------------------------------------------------")
      // console.log(payloadOfaccesstoken)
  
      let user;
      let refreshToken;
      if(payloadOfaccesstoken.role === "doctor"){
        user = await this.doctorService.findOne(payloadOfaccesstoken.id)
      } else if(payloadOfaccesstoken.role === "patient"){
        user = await this.patientService.findOne(payloadOfaccesstoken.id)
      } else if(payloadOfaccesstoken.role === "admin"){
        user = await this.adminService.findOne(payloadOfaccesstoken.id)
      }
      console.log(user)
      if(!user){
        throw new NotFoundException("No User found....")
      }
  

      // console.log("ooooo")
      // console.log(user.refreshToken)
      let payloadRefreshToken = await this.decodeRefreshToken(user.refreshToken)
      // console.log(payloadRefreshToken)
  
      let newAccessToken = await this.generateAccessToken(user)
      let newRefreshToken = await this.generateRefreshToken(user)
  
      if(payloadOfaccesstoken.role === "doctor"){
        await this.doctorService.setRefreshToken(user.id ,newRefreshToken)
      } else if(payloadOfaccesstoken.role === "patient"){
        await this.patientService.setRefreshToken(user.id ,newRefreshToken)
      } else if(payloadOfaccesstoken.role === "admin"){
        await this.adminService.setRefreshToken(user.id ,newRefreshToken)
      }
  
       return {cookies: [
          {
            name: 'accessToken',
            value: newAccessToken,
          }
        ]
      };
    } catch (error) {
      throw error
    }

  }


  async verificationEmail(email:string , role:string){
    try {
      let user;
      if(role === "doctor"){
        user = await this.doctorService.findByEmail(email)
      } else if(role === "patient"){
        user = await this.patientService.findByEmail(email)
      } else if(role === "admin"){
        user = await this.adminService.findByEmail(email)
      } else{
        throw new BadRequestException("No such role available...")
      }

      if(!user){
        throw new NotFoundException("Email not found...")
      }

      let verificationNumber: number= Math.floor(10000 + Math.random() * 90000);
      let verificationString:string = verificationNumber.toString()

      let hash = await bcrypt.hash(verificationString, 10)

      if(role === "doctor"){
        user = await this.doctorService.setHashValue(user.id , hash)
      } else if(role === "patient"){
        user = await this.patientService.setHashValue(user.id , hash)
      } else if(role === "admin"){
        user = await this.adminService.setHashValue(user.id , hash)
      }
      let emailSubject = "verify Email"
      let emailText = "Verify Your Email...";
      let emailHtml = `<div> 
             <button><a href=http://localhost:3000/auth/verify-email/hash-expiry?hash=${hash}&email=${user.email}&role=${user.profileId.role}>Click Here!!</a></button>
             </div>`
      
      let res = await this.emailService.sendMsg(user.email ,emailSubject, emailText , emailHtml)

      return res
    } catch (error) {
      throw error
    }
  }

  async isHashExpired(email:string , role:string){
    try {
      let isExpired = true;
      if(role === "doctor"){
        isExpired = await this.doctorService.isHashExpired(email)
      } else if(role === "patient"){
        isExpired = await this.patientService.isHashExpired(email)
      } else if(role === "admin"){
        isExpired = await this.adminService.isHashExpired(email)
      } else{
        throw new BadRequestException("Role not exist....")
      }
      if(!isExpired){
        return {message:"Hash not Expired"}
      } else{
        throw new Error("Hash Expired..")
      }
    } catch (error) {
      throw error
    }
  }

  async resetPassword(role:string ,email:string, hash:string , newPassword:string){
    try {
      let resetPass;
      if(role === "doctor"){
        resetPass = await this.doctorService.resetPassword(email , hash , newPassword)
      } else if(role === "patient"){
        resetPass = await this.patientService.resetPassword(email , hash , newPassword)
      } else if(role === "admin"){
        resetPass = await this.adminService.resetPassword(email , hash , newPassword)
      } else{
        throw new BadRequestException("Role not exist....")
      }
      return resetPass
    } catch (error) {
      throw error
    }
  }
  
}
