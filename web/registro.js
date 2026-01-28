const formulario = document.getElementById("formulario");

const inputUser = document.getElementById("usuario");
const inputCorreo = document.getElementById("correo");
const inputPassword = document.getElementById("contraseña");
const inputConfirmPassword = document.getElementById("confirmarcontraseña");

const mensajesCorreo = document.getElementById("textCorreo");
const mensajesUser = document.getElementById("textUsuario");
const mensajePassword1 = document.getElementById("mensajeContraseña");
const mensajePassword2  = document.getElementById("mensajeRepContraseña");

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

formulario.addEventListener("submit", (evento) => {

    mensajesUser.textContent = "";
    mensajesCorreo.textContent = "";

    if(!formulario.checkValidity() ){
        evento.preventDefault();
        if (inputUser.value === ""){
            mensajesUser.textContent = "Es obligatorio colocar un usuario"
        }
        if (inputCorreo.value === ""){
            mensajesCorreo.textContent = "Es obligatorio colocar un correo"
        }
        if (inputCorreo.value.length > 255 || !EMAIL_REGEX.test(inputCorreo.value)) {
        mensajesCorreo.textContent = "La estructura del correo es inválida";
    }
    }



});
inputCorreo.addEventListener("input",() => {

    if (inputCorreo.value.length > 255 || !EMAIL_REGEX.test(inputCorreo.value)) {
        mensajesCorreo.textContent = "La estructura del correo es invalida"
    }else {
        mensajesCorreo.textContent = ""

    }
})
inputPassword.addEventListener("input",() => {
    if (inputPassword.value.length < 8) {
        mensajePassword1.textContent = "La contraseña debe tener al menos 8 caracteres";
    } else {
        mensajePassword1.textContent = "";
        
}})
inputConfirmPassword.addEventListener("input",() => {
    if (inputConfirmPassword.value !== inputPassword.value) {
        mensajePassword1.textContent = "Las contraseñas no coinciden";
        mensajePassword2.textContent = "Las contraseñas no coinciden";
    } else {
        mensajePassword1.textContent = "";
        mensajePassword2.textContent = "";
}})
