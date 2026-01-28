const formulario = document.getElementById("formulario");

const password = document.getElementById("contraseña");
const confirmPassword = document.getElementById("confirmarcontraseña");

const passwordNotMatch = document.getElementById("errorcontraseña1");
const passwordNotMatch2  = document.getElementById("errorcontraseña2");

const passwordLength = document.getElementById("largoContraseña")

const emptyUser = document.getElementById("usuario");
const emptyCorreo = document.getElementById("correo");

const mensajeSinUser = document.getElementById("sin-usuario");
const mensajeSinCorreo = document.getElementById("sin-correo");


formulario.addEventListener("submit", (evento) => {
    mensajeSinUser.textContent = "";
    mensajeSinCorreo.textContent = "";
    if(!formulario.checkValidity()){
        evento.preventDefault();
        if (emptyUser.value === ""){
            mensajeSinUser.textContent = "Es obligatorio colocar un usuario"
        }
        if (emptyCorreo.value === ""){
            mensajeSinCorreo.textContent = "Es obligatorio colocar un correo"
        }
        
    }else {

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