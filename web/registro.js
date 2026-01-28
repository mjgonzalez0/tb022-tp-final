const form = document.getElementById("formulario");
const password = document.getElementById("contraseña");
const confirmPassword = document.getElementById("confirmarcontraseña");
const passwordNotMatch = document.getElementById("errorcontraseña1");
const passwordNotMatch2  = document.getElementById("errorcontraseña2");
const passwordLength = document.getElementById("largoContraseña")
const formulario = document.getElementById("formulario");

form.addEventListener("submit", (evento) => {
    if(!form.checkValidity()){
        evento.preventDefault(); 
        return;
    }
});

password.addEventListener("input",() => {
if (password.value.length < 8) {
    passwordLength.textContent = "La contraseña debe tener al menos 8 caracteres";
} else {
    passwordLength.textContent = "";
    
}})
confirmPassword.addEventListener("input",() => {
    if (confirmPassword.value !== password.value) {
        passwordNotMatch.textContent = "Las contraseñas no coinciden";
        passwordNotMatch2.textContent = "Las contraseñas no coinciden";
    } else {
        passwordNotMatch.textContent = "";
        passwordNotMatch2.textContent = "";
    }})