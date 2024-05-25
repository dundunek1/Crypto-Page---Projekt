const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const qs = require("querystring");

const port = 8080;

// Przechowywanie danych użytkowników
let users = [];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === "GET") {
    // Serwowanie plików HTML
    if (pathname === "/" || pathname === "/login.html" || pathname === "/register.html" || pathname === "/register2.html" || pathname === "/register3.html") {
      const filePath = path.join(__dirname, pathname === "/" ? "app.html" : pathname.substring(1));
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Błąd serwera");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content, "utf-8");
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Strona nie znaleziona");
    }
  } else if (req.method === "POST") {
    // Obsługa formularza logowania i rejestracji
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const formData = qs.parse(body);
      AccessToWebsite(formData, res);
    });
  }
});

server.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});

function AccessToWebsite(formData, res) {
  const { value } = formData;
  // Dane użytkownika
  var userData = JSON.parse(sessionStorage.getItem("userData")) || {};

  if (value === "login") {
    const { loginToCheck, passwordToCheck } = formData;
    const user = users.find((u) => (u.email === loginToCheck || u.phone === loginToCheck) && u.userPassword === passwordToCheck);
    if (user) {
      // Pomyślne logowanie - przekierowanie na stronę główną
      res.writeHead(302, { Location: "/app.html" });
      res.end();
    } else {
      // Nieudane logowanie - przekierowanie na stronę logowania z komunikatem błędu
      res.writeHead(302, { Location: "/login.html?error=invalid_credentials" });
      res.end();
    }
  } else if (value === "register") {
    const { userName, userSurname, userCountry, email, phone, userPassword } = formData;
    // Walidacja rejestracji
    const personalError = validateRegistration(userName, userSurname, userCountry, email, phone, userPassword);
    if (personalError) {
      // Jeśli są błędy walidacji, przekierowanie na stronę rejestracji z komunikatem błędu
      res.writeHead(302, { Location: "/register.html?error=" + encodeURIComponent(personalError) });
      res.end();
    } else {
      // Sprawdzenie czy użytkownik o podanym emailu lub numerze telefonu już istnieje
      const existingUser = users.find((u) => u.email === email || u.phone === phone);
      if (existingUser) {
        // Użytkownik już istnieje - przekierowanie na stronę rejestracji z komunikatem błędu
        res.writeHead(302, { Location: "/register.html?error=user_exists" });
        res.end();
      } else {
        // Dodanie nowego użytkownika do tablicy
        users.push({
          userName: userName,
          userSurname: userSurname,
          userCountry: userCountry,
          email: email,
          phone: phone,
          userPassword: userPassword,
        });
        // Pomyślna rejestracja - przekierowanie na kolejny krok rejestracji lub stronę główną
        res.writeHead(302, { Location: "/register2.html" });
        res.end();
      }
    }
  }
}

function validateRegistration(userName, userSurname, userCountry, email, phone, userPassword) {
  // Walidacja pól rejestracji
  if (!userName || !userSurname || !userCountry) {
    return "Proszę wypełnić wszystkie pola";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d+$/;
  if (!emailRegex.test(email) && !phoneRegex.test(phone)) {
    return "Podaj poprawny adres email lub numer telefonu";
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+=])(?=.{8,})/;
  if (!passwordRegex.test(userPassword)) {
    return "Hasło musi zawierać: 8 znaków, małą i dużą literę, znak specjalny.";
  }
  return null;
}
