
const form = document.getElementById("otpform");
const myButton = document.getElementById("sendOtp");
const email = document.getElementById("email")
const otpmessage = document.getElementById('otpmessage');


//  event listener for the send otp button click
myButton.addEventListener("click", function (e) {
  e.preventDefault()
  // Code to execute when the send otp button is clicked

  // fetch("/sendotp", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ phonenumber: form.phonenumber.value }),
  // })


  fetch("/sendotp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: form.email.value , otpmessageId: "otpmessage"}),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OTP_SEND") {
        console.log("OTP sent")
        //otpmessage.textContent = "OTP sent to your whatsapp"
        otpmessage.textContent = "OTP sent to your email"
        }
        else{
          otpmessage.textContent = data.status
        }
    })
    .catch((error) => console.error(error));
   // otpmessage.textContent = "Error sending emailllll... testt"
});

  function validateNumber(event) {
    var input = event.target;
    input.value = input.value.replace(/\D/g, "");
  }
