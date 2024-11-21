

const nodemailer = require("nodemailer");
const {EMAIL_PASSWORD,EMAIL_USER}=require("../config/config")
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  async function VerifyEmail(email,verificationLink) {
   
    const mailOptions = {
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', 
        to: email,  // Recipient's email address
        subject:"Verify your Email",  // Subject line
        html: `<b>verify Your Email Click the Link :</b> <a class=button href="http://localhost:8000/api/v1/user/verify/${verificationLink}"><button>Verify Email</button></a>`, 
      };
    
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.response);
        return {
          success: true,
          message: 'Verification email sent successfully.',
        };
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email.');
      }
    };
  



    async function VerifyEmailOtp(email,otp) {
   
      const mailOptions = {
          from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', 
          to: email,  // Recipient's email address
          subject:"Your OTP for Password Reset",  // Subject line
          html:  `<b>Your OTP is:</b> <h2>${otp}</h2>`, 
        };
      
        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Verification email sent:', info.response);
          return {
            success: true,
            message: 'Verification email sent successfully.',
          };
        } catch (error) {
          console.error('Error sending verification email:', error);
          throw new Error('Error sending verification email.');
        }
      };
    


 module.exports={
    VerifyEmail,
    VerifyEmailOtp
 }