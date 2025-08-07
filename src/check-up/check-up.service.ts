import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCheckUpDto } from './dto/create-check-up.dto';
import { UpdateCheckUpDto } from './dto/update-check-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckMetadata } from 'typeorm/browser/metadata/CheckMetadata.js';
import { CheckUp } from './entities/check-up.entity';
import { Repository } from 'typeorm';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class CheckUpService {
  constructor(
    @InjectRepository(CheckUp) private checkUpRepo : Repository<CheckUp>,
    @Inject(forwardRef(()=>DoctorService))private readonly doctorService:DoctorService,
    private readonly patientRepo:PatientService
  ){}

  async create(createCheckUpDto: CreateCheckUpDto , currPayload:any) {
    try {
      //get doctor(will get id fron token)
      
      let doctor = await this.doctorService.findOne(currPayload.id)
      console.log(doctor)
      // console.log(doctor)
      if(!doctor){
        throw new NotFoundException()
      }
      
      //get patient
      let patient = await this.patientRepo.findOne(createCheckUpDto.patientId)
      console.log(patient)

      if(!patient){
        throw new NotFoundException()
      }

       const newCheckUp = this.checkUpRepo.create({
        title: createCheckUpDto.title,
        notes: createCheckUpDto.notes,
        diagnosis: createCheckUpDto.diagnosis,
        prescription: createCheckUpDto.prescription,
        patientId: patient,  // Must match entity property name exactly
        doctorId: doctor     // Must match entity property name exactly
      });

      

      console.log(newCheckUp)

      let res = await this.checkUpRepo.save(newCheckUp)
      return res
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      let checkUp = await this.checkUpRepo.find()
      if(!checkUp){
        throw new NotFoundException("No CheckUp record found....")
      }
      return checkUp
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number) {
    try {
      let checkUp = await this.checkUpRepo.findOneBy({id:id})
      if(!checkUp){
        throw new NotFoundException("No CheckUp record found....")
      }
      return checkUp
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateCheckUpDto: UpdateCheckUpDto , currPayload:any) {
    //we get id from access token
            
    try {
      let checkUp = await this.checkUpRepo.findOne({where:{id : id} , relations:["doctorId"]})
      if(!checkUp){
        throw new NotFoundException("CheckUp Record not found..")
      }

      if(checkUp.doctorId.id !== currPayload.id){
        throw new UnauthorizedException("Access Denied...")
      }
      
      checkUp.title = updateCheckUpDto.title ?? checkUp.title
      checkUp.prescription = updateCheckUpDto.prescription ?? checkUp.prescription
      checkUp.diagnosis = updateCheckUpDto.diagnosis ?? checkUp.diagnosis
      checkUp.notes = updateCheckUpDto.notes ?? checkUp.notes

      return await this.checkUpRepo.save(checkUp);
    } catch (error) {
      throw error
    }
  }

  async remove(id: number , currPayload:any) {
    try {
      let checkUp = await this.checkUpRepo.findOne({where:{id : id} , relations:["doctorId"]})
      if(!checkUp){
        throw new NotFoundException("CheckUp Record not found..")
      }
      // console.log(checkUp)
      // console.log(currPayload.id)
      if(checkUp.doctorId.id !== currPayload.id){
        throw new UnauthorizedException("Access Denied...")
      }
      await this.checkUpRepo.delete(id)
      return {message:'Checkup Deleted....'}
    } catch (error) {
      throw error
    }
  }

  async allCheckUpsOfOnePatient(id: number) {
    try {
      // let patient = await this.patientRepo.findOne({where:{id:id}})
      let res = await this.checkUpRepo.find({
        where: {
          patientId: { id: id } 
        },
        relations: ['patientId'] 
      });
      console.log(res)
      if(!res.length){
        return {message : "No CheckUp Found..."}
      }
      return res
    } catch (error) {
      throw error
    }
  }
  async allCheckUpsOfOneDoctor(id: number) {
    try {
      // let patient = await this.patientRepo.findOne({where:{id:id}})
      let res = await this.checkUpRepo.find({
        where: {
          doctorId: { id: id } 
        },
        relations: ['patientId'] 
      });
      console.log(res)
      if(!res.length){
        return {message : "No CheckUp Found..."}
      }
      return res
    } catch (error) {
      throw error
    }
  }
}
