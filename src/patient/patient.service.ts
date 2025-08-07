import { Inject, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
    private readonly profileService:ProfileService
  ) { }

  async create(createPatientDto: CreatePatientDto) {
    try {
      let emailCheck = await this.patientRepo.findOne({ where: { email: createPatientDto.email } })
      if (emailCheck) {
        throw new Error("Email already exist...")
      }

      let newPatient = this.patientRepo.create(createPatientDto)
      // let newPatient = this.patientRepo.create(pat)
      // console.log(newPatient)

      newPatient.email = newPatient.email.toLowerCase()

      //activation email..
      let verificationNumber: number = Math.floor(10000 + Math.random() * 90000);
      let verificationString: string = verificationNumber.toString()
      let hash = await bcrypt.hash(verificationString, 10)

      newPatient.emailVerificationHash = hash
      newPatient.emailVerificationHashExpiresIN = new Date(Date.now() + 86400 * 1000)
      let res = await this.patientRepo.save(newPatient)

      let emailSubject = "Activation Email"
      let emailText = "Set your Password to Activate...";
      let emailHtml = `<div> 
             <button><a href=http://localhost:3000/auth/verify-email/hash-expiry?hash=${hash}&email=${createPatientDto.email}>Click Here!!</a></button>
             </div>`

      let ress = await this.emailService.sendMsg(createPatientDto.email, emailSubject, emailText, emailHtml)

      return res
    } catch (error) {
      throw error
    }
  }

  async findAll(name?:string) {
    try {
      let patients;
      if(name){
        patients = await this.patientRepo.find({
        where: {
          profileId: {
            fullName: ILike(`%${name}%`)
          }
        },
        relations: ['profileId']
      });
      } else {

        patients = await this.patientRepo.find()
      }
      if (!patients.length) {
        throw new NotFoundException("No patients found....")
      }
      return patients
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number) {
    try {
      let patient = await this.patientRepo.findOneBy({ id: id })
      if (!Patient) {
        throw new NotFoundException("Patient Not Found...")
      }
      return patient
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    //we get id from access token

    try {
      let patient = await this.patientRepo.findOne({ where: { id: id } })
      if (!patient) {
        throw new NotFoundException("patient not found..")
      }
      if(updatePatientDto.email){
        let alreadyExist = await this.patientRepo.find({where:{email:updatePatientDto.email}})
        if(alreadyExist){
          throw new Error("Email already exist....")
        }
      }
      // if(updatePatientDto.password){
      //   patient.password = await bcrypt.hash(updatePatientDto.password , 10);
      // }
      patient.age = updatePatientDto.age ?? patient.age
      patient.email = updatePatientDto.email?.toLowerCase() ?? patient.email
      patient.gender = updatePatientDto.gender ?? patient.gender
      patient.address = updatePatientDto.address ?? patient.address

      if (patient.profileId) {
        patient.profileId.fullName = updatePatientDto.profileId?.fullName ?? patient.profileId.fullName
        patient.profileId.role = updatePatientDto.profileId?.role ?? patient.profileId.role
        patient.profileId.phoneNumber = updatePatientDto.profileId?.phoneNumber ?? patient.profileId.phoneNumber
      }

      return await this.patientRepo.save(patient);
    } catch (error) {
      throw error
    }
  }

  async remove(id: number) {
    try {
      let patient = await this.patientRepo.findOne({ where: { id: id } })
      if (!patient) {
        throw new NotFoundException("patient not found..")
      }
      await this.profileService.remove(patient.profileId.id)
      await this.patientRepo.delete(id)
      return {message:'Patient Deleted....'}
    } catch (error) {
      throw error
    }
  }

  async findByEmail(email: string) {
    try {
      email = email.toLowerCase()
      let patient = await this.patientRepo.findOneBy({ email: email })
      if (!Patient) {
        throw new NotFoundException("Patient Not Found...")
      }
      return patient
    } catch (error) {
      throw error
    }
  }


  async isValidCredentials(email: string, password: string) {
    try {
      email = email.toLowerCase()
      let patient = await this.patientRepo.findOneBy({ email: email })
      if (!patient) {
        throw new NotFoundException("InValid Credentilas....")
      }
      let isValidPassword = await bcrypt.compare(password, patient.password)

      if (!isValidPassword) {
        throw new NotFoundException("InValid Credentilas....")
      }

      return patient

    } catch (error) {
      throw error
    }
  }


  async setRefreshToken(id: number, refreshToken: string) {
    try {
      let patient = await this.patientRepo.findOneBy({ id: id })
      if (!patient) {
        throw new NotFoundException("patient not found..")
      }
      patient.refreshToken = refreshToken;
      return await this.patientRepo.save(patient);
    } catch (error) {
      throw error
    }
  }


  async setHashValue(id: number, hash: string) {
    try {
      let patient = await this.patientRepo.findOneBy({ id: id })
      if (!patient) {
        throw new NotFoundException("patient not found..")
      }
      patient.emailVerificationHashExpiresIN = new Date(Date.now() + 120 * 1000)
      patient.emailVerificationHash = hash
      return await this.patientRepo.save(patient)
    } catch (error) {
      throw error
    }
  }

  async isHashExpired(email: string) {
    try {
      email = email.toLowerCase()
      let patient = await this.patientRepo.findOneBy({ email: email })
      if (!patient) {
        throw new NotFoundException("No user Found..")
      }

      // console.log(user)

      if (!patient.emailVerificationHashExpiresIN || !patient.emailVerificationHash) {
        throw new Error("Link Expired!!!")
      }

      console.log(new Date() < patient.emailVerificationHashExpiresIN)
      console.log(new Date())
      console.log(patient.emailVerificationHashExpiresIN)
      // console.log(user.emailVerificationHashExpiresIN)

      return new Date() > patient.emailVerificationHashExpiresIN;
    } catch (error) {
      throw error
    }
  }


  async resetPassword(email: string, hash: string, newPassword: string) {
    try {
      email = email.toLowerCase()
      let patiend = await this.findByEmail(email)
      if (!patiend) {
        throw new NotFoundException("patiend not found..")
      }
      if (!patiend.emailVerificationHash || !patiend.emailVerificationHashExpiresIN || patiend.emailVerificationHashExpiresIN < new Date()) {
        throw new Error("Verification Session Expires....")
      }
      if (patiend.emailVerificationHash !== hash) {
        throw new Error("UnAuthorized Access...")
      }
      patiend.emailVerificationHash = ""
      // doctor.emailVerificationHashExpiresIN = null
      patiend.password = await bcrypt.hash(newPassword, 10)
      return await this.patientRepo.save(patiend)
    } catch (error) {
      throw error
    }
  }


  async activatePatient(email: string, hash: string, newPassword: string) {
    try {
      email = email.toLowerCase()
      let patiend = await this.findByEmail(email)
      if (!patiend) {
        throw new NotFoundException("patiend not found..")
      }
      if (!patiend.emailVerificationHash || !patiend.emailVerificationHashExpiresIN || patiend.emailVerificationHashExpiresIN < new Date()) {
        await this.patientRepo.delete(patiend.id)
        throw new Error("Verification Session Expires....")
      }
      if (patiend.emailVerificationHash !== hash) {
        throw new Error("UnAuthorized Access...")
      }
      patiend.emailVerificationHash = ""
      // doctor.emailVerificationHashExpiresIN = null
      patiend.password = await bcrypt.hash(newPassword, 10)
      return await this.patientRepo.save(patiend)
    } catch (error) {
      throw error
    }
  }



  public async setGoogleAccessTokenForPatient(id:number , googleAccessToken:string){
    try {
      let pat = await this.patientRepo.findOne({where:{id:id}})
      if(!pat){
        throw new NotFoundException("No patient NotFoundException...")
      }
      pat.googleAccessToken = googleAccessToken
      console.log("wwww")
      return await this.patientRepo.save(pat)
    } catch (error) {
      throw error
    }
  }
  async getGoogleAccessToken(id:number){
    try {
      let pat = await this.patientRepo.findOne({where:{id:id}})
      if(!pat){
        throw new NotFoundException("No patient NotFoundException...")
      }
      
      return pat.googleAccessToken
    } catch (error) {
      throw error
    }
  }

  // async allCheckUpsofparticularpatient(){
  //   try {
  //     // return await 
  //   } catch (error) {
  //     throw error
  //   }
  // }
}
