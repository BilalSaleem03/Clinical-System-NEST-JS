import { forwardRef, Inject } from "@nestjs/common";
import { PatientService } from "src/patient/patient.service";




export class GoogleAuthService{
    constructor(private readonly patientService : PatientService){}

    async setGoogleAccessToken(id:number , accessToken:string){
        try {
            console.log("here.......")
            
            let res =  await this.patientService.setGoogleAccessTokenForPatient(id , accessToken)
            console.log("res   :  " , res)
            return res
        } catch (error) {
            throw error
        }
    }
}