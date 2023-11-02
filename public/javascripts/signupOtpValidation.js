
// const form = document.getElementById("otpform");
// const myButton = document.getElementById("sendOtp");
// const email = document.getElementById("email")
// const otpmessage = document.getElementById('otpmessage');


// myButton.addEventListener("click", function (e) {
//   e.preventDefault()
//   fetch("/sendotp", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email: form.email.value , otpmessageId: "otpmessage"}),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.status === "OTP_SEND") {
//         console.log("OTP sent")
//         otpmessage.textContent = "OTP sent to your email"
//         }
//         else{
//           otpmessage.textContent = data.status
//         }
//     })
//     .catch((error) => console.error(error));
//    // otpmessage.textContent = "Error sending emailllll... testt"
// });

  

// function validateNumber(event) {
//     var input = event.target;
//     input.value = input.value.replace(/\D/g, "");
//   }




  
//   // fetch("/sendotp", {
//   //   method: "POST",
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //   },
//   //   body: JSON.stringify({ phonenumber: form.phonenumber.value }),
//   // })
