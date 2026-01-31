import { redirect, ROUTES } from "./routes.js";
import { API_URL } from "./constants.js";

const formulario = document.getElementById("formulario");

const inputUser = document.getElementById("usuario");
const inputPassword = document.getElementById("contraseña");

const mensajesUser = document.getElementById("mensajeUsuario");
const mensajePassword = document.getElementById("mensajeContraseña");

const mensajeButtonLogin = document.getElementById("botonIniciarSesion")

const botonCrearNuevaCuenta = document.getElementById('crea-cuenta');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

botonCrearNuevaCuenta.addEventListener('click', () => {
    redirect(ROUTES.REGISTER); 
});

inputCorreo.addEventListener("input",() => {

    if (inputCorreo.value.length > 255 || !EMAIL_REGEX.test(inputCorreo.value)) {
        mensajesCorreo.textContent = "La estructura del correo es invalida"
    }else {
        mensajesCorreo.textContent = ""

    }
})
inputUser.addEventListener("input", () =>{
    if(inputUser.value === "" ){
        mensajesUser.textContent = "Es obligatorio colocar un usuario";
    } else {
        mensajesUser.textContent = "";      
}})


inputPassword.addEventListener("input",() => {
    if (inputPassword.value.length < 8) {
        mensajePassword1.textContent = "La contraseña debe tener al menos 8 caracteres";
    } else {
        mensajePassword1.textContent = "";
        
}})

inputConfirmPassword.addEventListener("input",() => {
    if (inputConfirmPassword.value !== inputPassword.value) {
        mensajePassword2.textContent = "Las contraseñas no coinciden";
    } else {
        mensajePassword2.textContent = "";
}})

formulario.addEventListener("submit", async(evento) => {

    evento.preventDefault();

    mensajesUser.textContent = "";
    mensajesCorreo.textContent = "";
    mensajePassword1.textContent = "";
    mensajePassword2.textContent = "";
    
    
    if(!formulario.checkValidity() ){
        formulario.reportValidity();
        if (inputUser.value === ""){
            mensajesUser.textContent = "Es obligatorio colocar un usuario"
        }
        if (inputCorreo.value === ""){
            mensajesCorreo.textContent = "Es obligatorio colocar un correo"
        }
        if (inputCorreo.value.length > 255 || !EMAIL_REGEX.test(inputCorreo.value)) {
            mensajesCorreo.textContent = "La estructura del correo es inválida";
        }
        if(inputPassword.value === "") {
            mensajePassword1.textContent = "Es obligatorio colocar una contraseña";
        }
        if(inputConfirmPassword.value === "") {
            mensajePassword2.textContent = "Es obligatorio colocar una contraseña";
        }
        return;
        }

        const datos = {
            email: inputCorreo.value,
            username: inputUser.value,
            password: inputPassword.value,
            password_confirmation: inputConfirmPassword.value,
        };
        
        try {
            const respuesta = await fetch( `${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
            });
        
        
            if (respuesta.ok) {
                
                alert("Cuenta creada con éxito");
                redirect(ROUTES.LOGIN);
                formulario.reset();
                
            }else {
                const errorData = await respuesta.json();
                if (respuesta.status === 409) {
                    
                    mensajesUser.textContent = "";
                    mensajesCorreo.textContent = "";
            
                    mensajesUser.textContent = errorData.error ;
                    mensajesCorreo.textContent = errorData.error ;
                
                }else {
                alert("Error: " + errorData.error);
                }}
        } catch (error) {
            mensajeButtonRegister.textContent = "Error de conexión con el servidor";
    }
});
