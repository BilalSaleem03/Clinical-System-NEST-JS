import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { ILike, Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import * as bcrypt from 'bcrypt'
import { CheckUpService } from 'src/check-up/check-up.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo:Repository<Doctor>,
    private readonly checkUpService : CheckUpService,
    private readonly appointmentService : AppointmentService,
    private readonly profileService : ProfileService
  ){}
  async create(createDoctorDto: CreateDoctorDto) {
    try {
      let emailCheck = await this.doctorRepo.findOne({where:{email:createDoctorDto.email}})
      if(emailCheck){
        throw new Error("Email already exist...")
      }
      let newDoc = this.doctorRepo.create(createDoctorDto);
      newDoc.email = newDoc.email.toLowerCase()
      newDoc.password = await bcrypt.hash(newDoc.password , 10)
      console.log(createDoctorDto);
      let res = await this.doctorRepo.save(newDoc) 
      return res
    } catch (error) {
      throw error
    }
  }

  async findAll(name?:string) {
    try {
      let doctors;
      if(name){
        doctors = await this.doctorRepo.find({
        where: {
          profileId: {
            fullName: ILike(`%${name}%`)
          }
        },
        relations: ['profileId']
      });
      } else {

        doctors = await this.doctorRepo.find()
      }
      if(!doctors.length){
        throw new NotFoundException("No Doctors found....")
      }
      return doctors
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number) {
    try {
      let doctor = await this.doctorRepo.findOneBy({id:id})
      if(!doctor){
        throw new NotFoundException("No Doctor found....")
      }
      return doctor
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto , currPayload:any) {
    //we get id from access token

    try {
      let doc = await this.doctorRepo.findOne({where:{id : currPayload.id}})
      if(!doc){
        throw new NotFoundException("Doctor not found..")
      }
      if(updateDoctorDto.email){
        let alreadyExist = await this.doctorRepo.find({where:{email:updateDoctorDto.email}})
        if(alreadyExist){
          throw new Error("Email already exist....")
        }
      }
      if(updateDoctorDto.password){
        doc.password = await bcrypt.hash(updateDoctorDto.password , 10);
      }
      doc.clinicName = updateDoctorDto.clinicName ?? doc.clinicName
      doc.email = updateDoctorDto.email?.toLowerCase() ?? doc.email
      doc.licenseNumber = updateDoctorDto.licenseNumber ?? doc.licenseNumber
      doc.specialization = updateDoctorDto.specialization ?? doc.specialization

      if(doc.profileId){
        doc.profileId.fullName = updateDoctorDto.profileId?.fullName ?? doc.profileId.fullName
        doc.profileId.role = updateDoctorDto.profileId?.role ?? doc.profileId.role
        doc.profileId.phoneNumber = updateDoctorDto.profileId?.phoneNumber ?? doc.profileId.phoneNumber
      }

      return await this.doctorRepo.save(doc);
    } catch (error) {
      throw error
    }
  }

  async remove(id: number , currentPayload:any) {
    try {
      if(id !== currentPayload.id){
        throw new UnauthorizedException("Access Denied...")
      }
      let doc = await this.doctorRepo.findOne({where:{id : currentPayload.id}})

      if(!doc){
        throw new NotFoundException("Doctor not found..")
      }

      await this.profileService.remove(doc.profileId.id)

      await this.doctorRepo.delete(currentPayload.id)
      return {message:'Doctor Deleted....'}
    } catch (error) {
      throw error
    }
  }

  async findByEmail(email:string) {
    try {
      email = email.toLowerCase()
      let doctor = await this.doctorRepo.findOneBy({email:email})
      if(!doctor){
        throw new NotFoundException("No Doctor found....")
      }
      return doctor
    } catch (error) {
      throw error
    }
  }

   async isValidCredentials(email:string , password:string) {
    try {
      email = email.toLowerCase()
      let doctor = await this.doctorRepo.findOneBy({email:email})
      if(!doctor){
        throw new NotFoundException("InValid Credentilas....")
      }
      let isValidPassword = await bcrypt.compare(password , doctor.password)
      
      if(!isValidPassword){
        throw new NotFoundException("InValid Credentilas....")
      }

      return doctor
      
    } catch (error) {
      throw error
    }
  }

  async setRefreshToken(id:number , refreshToken:string){
    try {
      let doc = await this.doctorRepo.findOneBy({id:id})
      if(!doc){
        throw new NotFoundException("Doctor not found..")
      }
      doc.refreshToken = refreshToken;
      return await this.doctorRepo.save(doc);
    } catch (error) {
      throw error
    }
  }

  async setHashValue(id:number , hash:string){
    try {
      let doctor =  await this.doctorRepo.findOneBy({id : id})
      if(!doctor){
        throw new NotFoundException("doctor not found..")
      }
      doctor.emailVerificationHashExpiresIN = new Date(Date.now() + 120 * 1000)
      doctor.emailVerificationHash = hash
      return await this.doctorRepo.save(doctor)
    } catch (error) {
      throw error
    }
  }

  async isHashExpired(email:string ){
    try {
      email = email.toLowerCase()
      let doctor = await this.doctorRepo.findOneBy({email : email})
      if(!doctor){
        throw new NotFoundException("No user Found..")
      }
      
      console.log("doctor",doctor)
  
      if(!doctor.emailVerificationHashExpiresIN || !doctor.emailVerificationHash){
        throw new Error("Link Expired!!!")
      }

      console.log(new Date() < doctor.emailVerificationHashExpiresIN)
      console.log(new Date())
      console.log(doctor.emailVerificationHashExpiresIN)
      // console.log(user.emailVerificationHashExpiresIN)
      
      return new Date() > doctor.emailVerificationHashExpiresIN;
    } catch (error) {
      throw error
    }
  }


  async resetPassword(email:string , hash:string , newPassword:string){
    try {
      email = email.toLowerCase()
      let doctor = await this.findByEmail(email)
      if(!doctor){
        throw new NotFoundException("Doctor not found..")
      }
      if(!doctor.emailVerificationHash  || !doctor.emailVerificationHashExpiresIN  || doctor.emailVerificationHashExpiresIN < new Date()){
        throw new Error("Verification Session Expires....")
      }
      if(doctor.emailVerificationHash !== hash){
        throw new Error("UnAuthorized Access...")
      }
      doctor.emailVerificationHash = ""
      // doctor.emailVerificationHashExpiresIN = null
      doctor.password = await bcrypt.hash(newPassword , 10)
      return await this.doctorRepo.save(doctor)
    } catch (error) {
      throw error
    }
  }

  async allcheckUpsOfOnepatient(patientid:number){
    try {
      return await this.checkUpService.allCheckUpsOfOnePatient(patientid)
    } catch (error) {
      throw error
    }
  }


  async allAppointmentsOfonepatient(patientId:number){
    try {
      return await this.appointmentService.allAppointmentsOfOnePatient(patientId)
    } catch (error) {
      throw error
    }
  }


  async allcheckUpsOfOneDoctor(doctorid:number){
    try {
      return await this.checkUpService.allCheckUpsOfOneDoctor(doctorid)
    } catch (error) {
      throw error
    }
  }


  async allAppointmentsOfoneDoctor(doctorId:number){
    try {
      return await this.appointmentService.allAppointmentsOfOneDoctor(doctorId)
    } catch (error) {
      throw error
    }
  }
}
