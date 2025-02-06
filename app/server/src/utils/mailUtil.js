import nodemailer from 'nodemailer'

const mailUtil = (email , text )=>{
    
    let transporter = nodemailer.createTransport({
     service:'outlook',
     auth:{
         user:process.env.EMAIL_ADDRESS,
         pass:process.env.EMAIL_PASSWORD
     }
     })
     let mailInfo = {
        from:process.env.EMAIL_ADDRESS, 
        to:email,
        text:text
     }
     transporter.sendMail(mailInfo , (error , info)=>{
     if(!info){
         console.log(error)
     }else{
         console.log(info)
     }
     })
 }

export default mailUtil