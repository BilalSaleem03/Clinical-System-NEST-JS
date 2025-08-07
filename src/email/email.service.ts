import { Injectable, NotFoundException } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
    
    constructor(){
        
        const apiKey = process.env.SENDGRID_API_KEY;
        if (!apiKey) {
        throw new Error('SENDGRID_API_KEY environment variable is not defined');
        }
        sgMail.setApiKey(apiKey);
    }


    async sendMsg(recipientEmail:string ,subject:string, text:string , html:string){
        const senderEmail = process.env.SENDGRID_FROM_EMAIL

        if(!senderEmail){
            throw new NotFoundException("sender Email not found...")
        }

        let msg = {
            to:recipientEmail,
            from: senderEmail,
            subject:subject,
            text:text,
            html: html
            // text:"Please verify your email by clicking the following button",
            // html: `<div> 
            // <button><a href=http://localhost:3000/auth/verify-email/hash-expiry?hash=${hash}&email=${senderEmail}>Click Here!!</a></button>
            // </div>`
        }

        // console.log(msg)

        try {
            let res = await sgMail.send(msg);
            console.log(res)
            return { message: "Email sent..." };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
