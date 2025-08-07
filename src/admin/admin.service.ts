import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepo:Repository<Admin>,
    private readonly profileService : ProfileService
  ){}
  async create(createAdminDto: CreateAdminDto) {
    try {
      let emailCheck = await this.adminRepo.findOne({where:{email:createAdminDto.email}})
      if(emailCheck){
        throw new Error("Email already exist...")
      }
      createAdminDto.email = createAdminDto.email.toLowerCase()
      let newAdmin = this.adminRepo.create(createAdminDto)
      newAdmin.password = await bcrypt.hash(newAdmin.password , 10)
      console.log(newAdmin)
      let res = await this.adminRepo.save(newAdmin)
      return res
    } catch (error) {
      throw error
    }
  }

  async findAll(name? : string) {
    try {
      let admin;
      if(name){
        admin = await this.adminRepo.find({
          where: {
            profileId: {
              fullName: ILike(`%${name}%`)
            }
          },
          relations: ['profileId']
        });
      } else{
        admin = await this.adminRepo.find()
      }
      if(!admin.length){
        throw new NotFoundException("No Admin found....")
      }
      return admin
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number) {
    try {
      let admin = await this.adminRepo.findOneBy({id:id})
      if(!admin){
        throw new NotFoundException("No Admin found....")
      }
      return admin
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto , currPayload:any) {
    //we get id from access token
        
    try {
      let admin = await this.adminRepo.findOne({where:{id :id}})
      if(!admin){
        throw new NotFoundException("Admin not found..")
      }
      if(updateAdminDto.email){
        let alreadyExist = await this.adminRepo.find({where:{email:updateAdminDto.email}})
        if(alreadyExist){
          throw new Error("Email already exist....")
        }
      }
      if(currPayload.role !== 'doctor' && currPayload.id !== admin.id){
        throw new UnauthorizedException("Access Denied...")
      }
      if(updateAdminDto.password){
        admin.password = await bcrypt.hash(updateAdminDto.password , 10);
      }
      admin.department = updateAdminDto.department ?? admin.department
      admin.email = updateAdminDto.email?.toLowerCase() ?? admin.email
      admin.accessLevel = updateAdminDto.accessLevel ?? admin.accessLevel


      if(admin.profileId){
        admin.profileId.fullName = updateAdminDto.profileId?.fullName ?? admin.profileId.fullName
        admin.profileId.role = updateAdminDto.profileId?.role ?? admin.profileId.role
        admin.profileId.phoneNumber = updateAdminDto.profileId?.phoneNumber ?? admin.profileId.phoneNumber
      }

      return await this.adminRepo.save(admin);
    } catch (error) {
      throw error
    }
  }

  async remove(id: number , currPayload:any) {
    try {
      let admin = await this.adminRepo.findOne({where:{id :id}})
      if(!admin){
        throw new NotFoundException("Admin not found..")
      }
      if(currPayload.role !== 'doctor' && currPayload.id !== admin.id){
        throw new UnauthorizedException("Access Denied...")
      }
      await this.profileService.remove(admin.profileId.id)
      await this.adminRepo.delete(currPayload.id)
      return {message:'Admin Deleted....'}
    } catch (error) {
      throw error
    }
  }

  async findByEmail(email: string) {
    try {
      email = email.toLowerCase()
      let admin = await this.adminRepo.findOneBy({email:email})
      if(!admin){
        throw new NotFoundException("No Admin found....")
      }
      return admin
    } catch (error) {
      throw error
    }
  }

   async isValidCredentials(email:string , password:string) {
    try {
      email = email.toLowerCase()
      let admin = await this.adminRepo.findOneBy({email:email})
      if(!admin){
        throw new NotFoundException("InValid Credentilas....")
      }
      let isValidPassword = await bcrypt.compare(password , admin.password)
      
      if(!isValidPassword){
        throw new NotFoundException("InValid Credentilas....")

      }
      return admin
      
    } catch (error) {
      throw error
    }
  }


  async setRefreshToken(id:number , refreshToken:string){
    try {
      let admin = await this.adminRepo.findOneBy({id:id})
      if(!admin){
        throw new NotFoundException("Admin not found..")
      }
      admin.refreshToken = refreshToken;
      return await this.adminRepo.save(admin);
    } catch (error) {
      throw error
    }
  }

  async setHashValue(id:number , hash:string){
    try {
      let admin =  await this.adminRepo.findOneBy({id : id})
      if(!admin){
        throw new NotFoundException("admin not found..")
      }
      admin.emailVerificationHashExpiresIN = new Date(Date.now() + 120 * 1000)
      admin.emailVerificationHash = hash
      return await this.adminRepo.save(admin)
    } catch (error) {
      throw error
    }
  }

  async isHashExpired(email:string ){
    try {
      email = email.toLowerCase()
      let admin = await this.adminRepo.findOneBy({email : email})
      if(!admin){
        throw new NotFoundException("No user Found..")
      }
      
      // console.log(user)
  
      if(!admin.emailVerificationHashExpiresIN || !admin.emailVerificationHash){
        throw new Error("Link Expired!!!")
      }

      console.log(new Date() < admin.emailVerificationHashExpiresIN)
      console.log(new Date())
      console.log(admin.emailVerificationHashExpiresIN)
      // console.log(user.emailVerificationHashExpiresIN)
      
      return new Date() > admin.emailVerificationHashExpiresIN;
    } catch (error) {
      throw error
    }
  }

  async resetPassword(email:string , hash:string , newPassword:string){
      try {
        email = email.toLowerCase()
        let admin = await this.findByEmail(email)
        if(!admin){
          throw new NotFoundException("admin not found..")
        }
        if(!admin.emailVerificationHash  || !admin.emailVerificationHashExpiresIN  || admin.emailVerificationHashExpiresIN < new Date()){
          throw new Error("Verification Session Expires....")
        }
        if(admin.emailVerificationHash !== hash){
          throw new Error("UnAuthorized Access...")
        }
        admin.emailVerificationHash = ""
        // doctor.emailVerificationHashExpiresIN = null
        admin.password = await bcrypt.hash(newPassword , 10)
        return await this.adminRepo.save(admin)
      } catch (error) {
        throw error
      }
    }

}
