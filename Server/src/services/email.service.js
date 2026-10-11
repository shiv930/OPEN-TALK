import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAUTH2",
        user:process.env.NODEMAILER_USER,
        clientId: process.env.NODEMAILER_CLIENT_ID,
        clientSecret:process.env.NODEMAILER_CLIENT_SECRET,
        refreshToken:process.env.NODEMAILER_REFRESH_TOKEN
    }
})

transporter.verify((error)=>{
    if(error ){
        console.error('Email server connecction failed :', error.message);
        return;
        
    }
    console.log('Email server is ready to send message');
    
})

const sendEmail = async(to, subject, text, html) =>{
    try {
        const info = await transporter.sendMail({
            from:`DISCORD <${process.env.NODEMAILER_USER}>`,
            to,
            subject,
            text,
            html
        })
        console.log('Message sent : ', info.messageId);
        
        
    } catch (error) {
        console.log('Error sending email:', error.message);
        throw error
        
    }
}

export default  sendEmail