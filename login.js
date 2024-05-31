//Dane uzytkownika
var userData = JSON.parse(sessionStorage.getItem("userData")) || {};

function AccessToWebsite(value) {
  if (value == "login") {
    let loginToCheck = document.getElementById("loginToCheck").value;
    let passwordToCheck = document.getElementById("passwordToCheck").value;
    let loginError = document.getElementById("loginError");
    if (loginToCheck === userData.email || loginToCheck === userData.phone) {
      if (passwordToCheck === userData.userPassword) {
        loginError.innerHTML = "";
        alert("Gratulacje, zalogowales sie");
      } else {
        loginError.innerHTML = "Błędne hasło";
      }
    } else {
      loginError.innerHTML = "Błędny login";
    }
  }
  if (value == "firstStepRegister") {
    let acceptConditions = document.getElementById("acceptConditions");
    let emailOrNumber = document.getElementById("emailOrNumber").value;
    let emailNumberError = document.getElementById("emailNumberError");
    if (acceptConditions.checked) {
      addContact(emailOrNumber);
    } else {
      emailNumberError.innerHTML = "Akceptacja regulaminu jest niezbędna, <br> by kontynuować";
    }
  }
  if (value == "mainPageBegin") {
    let mainPageEmailOrNumber = document.getElementById("mainPageEmailOrNumber").value;
    addContact(mainPageEmailOrNumber);
  }
  if (value == "secondStepRegister") {
    let userName = document.getElementById("userName").value;
    let userSurname = document.getElementById("userSurname").value;
    let userCountry = document.getElementById("userCountry").value;
    const personalError = document.getElementById("personalError");
    if (userName && userSurname && userCountry) {
      userData.userName = userName;
      userData.userSurname = userSurname;
      userData.userCountry = userCountry;
      sessionStorage.setItem("userData", JSON.stringify(userData));
      window.location.href = "register3.html";
    } else {
      personalError.innerHTML = "Proszę wypełnić wszystkie pola";
    }
  }
  if (value == "thirdStepRegister") {
    let userPassword = document.getElementById("userPassword").value;
    let userPasswordRepeat = document.getElementById("userPasswordRepeat").value;
    let passwordError = document.getElementById("passwordError");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+=])(?=.{8,})/;

    if (userPassword && userPasswordRepeat) {
      if (passwordRegex.test(userPassword) && passwordRegex.test(userPasswordRepeat)) {
        if (userPassword === userPasswordRepeat) {
          userData.userPassword = userPassword;
          sessionStorage.setItem("userData", JSON.stringify(userData));
          window.location.href = "app.html";
        } else {
          passwordError.innerHTML = "Hasła nie są takie same!";
        }
      } else {
        passwordError.innerHTML = "Hasła muszą zawierać: <br>-8 znaków, <br> -małą i duża literę,  <br> - znak specjalny.";
      }
    } else {
      passwordError.innerHTML = "Proszę wypełnić pola haseł";
    }
  }
}
function addContact(emailOrNumber) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d+$/;
  if (emailRegex.test(emailOrNumber) || phoneRegex.test(emailOrNumber)) {
    if (emailRegex.test(emailOrNumber)) {
      userData.email = emailOrNumber;
    }
    if (phoneRegex.test(emailOrNumber)) {
      userData.phone = emailOrNumber;
    }
    sessionStorage.setItem("userData", JSON.stringify(userData));
    window.location.href = "register2.html";
  }
}

document.querySelectorAll(".fa-eyes").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Pobierz powiązane pole hasła
    const passwordInput = btn.previousElementSibling;

    if (btn.classList.contains("fa-eye-slash")) {
      passwordInput.type = "text";
      btn.classList.remove("fa-eye-slash");
      btn.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      btn.classList.remove("fa-eye");
      btn.classList.add("fa-eye-slash");
    }
  });
});
