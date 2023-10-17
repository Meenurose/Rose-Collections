
// const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
// const verifySid= process.env.VERIFYSID

// module.exports.sendotp = (phonenumber, callback) => {
//   client.verify.v2
//     .services(process.env.verifySid)
//     .verifications.create({ to: phonenumber, channel: "whatsapp" })
//     .then((verification) => callback(verification.status))
//     .catch((verification) => callback(verification.status));
// };
// module.exports.verifyotp = (phonenumber, otpCode, callback) => {
//   client.verify.v2
//     .services(process.env.verifySid)
//     .verificationChecks.create({ to: phonenumber, code: otpCode })
//     .then((verification_check) => callback(verification_check.status))
//     .catch((verification_check) => callback(verification_check.status));
// };



// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

// module.exports.otpFunction = ()  => {
// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+916235540514", channel: "whatsapp" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+916235540514", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });  
// }






// const transporter = nodemailer.createTransport({
//   service: 'gmail', 
//   auth: {
//     user: 'meenu.roses20@gmail.com',
//     pass: 'roqoquytsszpkstz'
//   }
// });

// Generate a random 6-digit OTP          //no
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// Send OTP via email
// function sendOtp(email) {
//   otp = Math.floor(100000 + Math.random() * 900000);
//   const mailOptions = {
//     from: 'meenu.roses20@gmail.com',
//     to: email,
//     subject: 'Your OTP Code',
//     text: `Your OTP code is: ${otp}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending OTP:', error);
//     } else {
//       console.log('OTP sent:', info.response);
//     }
//   });
// }

// Generate OTP and send it to an email       //no
//const email = document.getElementById("email")
//const otp = generateOTP();
//sendOTP(email, otp);

// module.exports = {
//   sendOtp
// }

































//const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
// const twilio = require("twilio")
// const accountSid = process.env.ACCOUNTSID;
// const authToken = process.env.AUTHTOKEN;

// const client = twilio(accountSid, authToken)

// module.exports.sendotp = (phonenumber, callback) => {
//   client.verify.v2
//     .services(process.env.VERIFYSID)
//     .verifications.create({ to: phonenumber, channel: "whatsapp" })
//     .then((verification) => callback(verification.status))
//     .catch((error) => callback(error.status));
// };
// module.exports.verifyotp = (phonenumber, otpCode, callback) => {
//   client.verify.v2
//     .services(process.env.VERIFYSID)
//     .verificationChecks.create({ to: phonenumber, code: otpCode })
//     .then((verification_check) => callback(verification_check.status))
//     .catch((error) => callback(error.status));
// };