
function validateEmail(email) {
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  // Function to handle form submission
  function handleSubmit(event) {
  
    const emailInput = document.getElementById("email");
    const email = emailInput.value;
  
    const emailError = document.getElementById("emailError");

    if (email === "") {
      emailError.textContent = "Email cannot be blank.";
      event.preventDefault();
      return; 
    }
    if (validateEmail(email)) {
      emailError.textContent = ""; // Clear the error message
      // Perform other form submission actions
    } else {
      emailError.textContent = "Invalid email address! eg.give- test@email.com";
      event.preventDefault();
    }
  
  
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;
    const passwordError = document.getElementById("passwordError");
    if (password === "") {
      passwordError.textContent = "Password cannot be blank";
      event.preventDefault();
      return;
    }
  }
  
  // Add event listener to form submit event
  const form = document.getElementById("loginform");
  form.addEventListener("submit", handleSubmit);
  