import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { EmailService } from 'src/email/email.service';
import { CalendarService } from 'src/calendar/calendar.service';
import { certificatemanager } from 'googleapis/build/src/apis/certificatemanager';
import { AppointmentStatus } from './enum/appointment-status.enum';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) private appointmentRepo : Repository<Appointment>,
    @Inject(forwardRef(()=>DoctorService))private readonly doctorService:DoctorService,
    private readonly patientService:PatientService,
    private readonly emailServer:EmailService,
    private readonly calenderService:CalendarService
  ){}
  async create(createAppointmentDto: CreateAppointmentDto , currPayload:any) {
    try {

      const date = new Date(createAppointmentDto.appointmentDateTime);

      if (date < new Date()) {
        throw new BadRequestException('Date must be in the future');
      }
       
      let doctor = await this.doctorService.findOne(currPayload.id)
      // console.log(doctor)
      // console.log(doctor)
      if(!doctor){
        throw new NotFoundException("No Doctor found....")
      }
      
      //get patient
      let patient = await this.patientService.findOne(createAppointmentDto.patientId)
      // console.log(patient)

      if(!patient){
        throw new NotFoundException("No Patient Found....")
      }

      const newAppointment = this.appointmentRepo.create({
        appointmentDateTime: createAppointmentDto.appointmentDateTime,
        location: createAppointmentDto.location,
        status: createAppointmentDto.status,
        description: createAppointmentDto.description,
        patientId: patient,  
        doctorId: doctor     
      });

      

      // console.log(newAppointment)

      

      //send email to doctor
      
      let emailSubject = "Appointment Email"
      let emailText = "you just made a Appointment..";
      let emailHtml = `<div> 
             <p>You just made a appointment with ${patient.profileId.fullName} at ${newAppointment.appointmentDateTime} </p>
             </div>`
      
      await this.emailServer.sendMsg(doctor.email ,emailSubject, emailText , emailHtml)
      
      //send email to doctor
      
      let emailSubjectP = "Appointment Email"
      let emailTextP = "you have a Appointment..";
      let emailHtmlP = `<div> 
             <p>You have a appointment with ${doctor.profileId.fullName} at ${newAppointment.appointmentDateTime} </p>
             </div>`
      
      await this.emailServer.sendMsg(doctor.email ,emailSubjectP, emailTextP , emailHtmlP)

      //set calender...

      let event = {
        summary: 'Doctors Appointment',
        description: createAppointmentDto.description,
        start: {
          dateTime: createAppointmentDto.appointmentDateTime.toISOString(),
          // timeZone: 'America/New_York',
        },
        end: {
          dateTime: new Date(createAppointmentDto.appointmentDateTime.getTime() + 30 * 60 * 1000).toISOString(),
          // timeZone: 'America/New_York',
        },
        attendees: [
          { email: doctor.email , displayName: doctor.profileId.fullName },
          { email: patient.email, displayName: patient.profileId.fullName },
          { email: "junaid.ahmad026@gmail.com" , displayName: "Junaid Ahmad" },
        ],
        // reminders: {
        //   useDefault: false,
        //   overrides: [
        //     { method: 'email', minutes: 24 * 60 }, // 1 day before
        //     { method: 'popup', minutes: 30 },
        //   ],
        // }
      }
      // let accessToken = "aaa"
      let accessToken = process.env.CALENDER_SET_ACCESSTOKEN 
      if (!accessToken) {
        throw new Error('Calendar access token is not configured....Aurhenticate by google...');
      }
      
      let calenderEventId = await this.calenderService.createEvent(accessToken , event ) 
      if(!calenderEventId){
        throw new Error("Google Calender Error...")
      }

      newAppointment.googleCalendarEventId = calenderEventId

      let savedAppointment = await this.appointmentRepo.save(newAppointment)

      return savedAppointment

    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      let appointment = await this.appointmentRepo.find()
      if(!appointment){
        throw new NotFoundException("No Appointment record found....")
      }
      return appointment
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number) {
     try {
      let appointment = await this.appointmentRepo.findOneBy({id:id})
      if(!appointment){
        throw new NotFoundException("No Appointment record found....")
      }
      return appointment
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto , currPayload:any) {
    try {
      let appointment = await this.appointmentRepo.findOne({where:{id : id} , relations:["doctorId" , "patientId"]})
      console.log(appointment)
      if(!appointment){
        throw new NotFoundException("Appointment Record not found..")
      }

      if(appointment.doctorId.id !== currPayload.id){
        throw new UnauthorizedException("Access Denied.....")
      }
      
      appointment.appointmentDateTime = updateAppointmentDto.appointmentDateTime ?? appointment.appointmentDateTime
      appointment.location = updateAppointmentDto.location ?? appointment.location
      appointment.status = updateAppointmentDto.status ?? appointment.status
      appointment.description = updateAppointmentDto.description ?? appointment.description


      if(appointment.status ===AppointmentStatus.Cancelled ){
        
        //send cancellation email to patient.
        let emailSubject = "Appointment Cancelled!!"
        let emailText = `The Appointment you have with ${appointment.doctorId.profileId.fullName} at ${appointment.appointmentDateTime} has been Cancelled!!!!`;
        let emailHtml = `<div></div>`
        
        await this.emailServer.sendMsg(appointment.patientId.email ,emailSubject, emailText , emailHtml)


      }

      return await this.appointmentRepo.save(appointment);
    } catch (error) {
      throw error
    }
  }

  async remove(id: number , currPayload:any) {
    try {
      let appointment = await this.appointmentRepo.findOne({where:{id : id} , relations:["doctorId"]})
      if(!appointment){
        throw new NotFoundException("No Appointment record found....")
      }

      if(appointment.doctorId.id !== currPayload.id){
        throw new UnauthorizedException("Access Denied.....")
      }
      await this.appointmentRepo.delete(id)
      return {message:'Appointmnet Deleted....'}
    } catch (error) {
      throw error
    }
  }


  async allAppointmentsOfOnePatient(id: number) {
    try {
      // let patient = await this.patientRepo.findOne({where:{id:id}})
      let res =  await this.appointmentRepo.find({
        where: {
          patientId: { id: id } 
        },
        relations: ['patientId'] 
      });
      console.log(res)
      if(!res.length){
        return {message : "No Appointment Found..."}
      }
      return res
    } catch (error) {
      throw error
    }
  }

  async allAppointmentsOfOneDoctor(id: number) {
    try {
      // let patient = await this.patientRepo.findOne({where:{id:id}})
      let res = await this.appointmentRepo.find({
        where: {
          doctorId: { id: id } 
        },
        relations: ['patientId'] 
      });
      console.log(res)
      if(!res.length){
        return {message : "No Appointmnet Found..."}
      }
      return res
    } catch (error) {
      throw error
    }
  }

}
