import { redirect, ROUTES } from "./routes.js";
import { API_URL } from "./constants.js";
import { toast } from "https://unpkg.com/@moaqzdev/toast/utils";

const formulario = document.getElementById("formulario");

const inputUser = document.getElementById("usuario");
const inputCorreo = document.getElementById("correo");
const inputPassword = document.getElementById("contraseña");
const inputConfirmPassword = document.getElementById("confirmarcontraseña");

const mensajesCorreo = document.getElementById("textCorreo");
const mensajesUser = document.getElementById("textUsuario");
const mensajePassword1 = document.getElementById("mensajeContraseña");
const mensajePassword2  = document.getElementById("mensajeRepContraseña");
const mensajeButtonRegister = document.getElementById("mensajeBotonRegistro");

const botonRegister = document.getElementById("botonRegistro");
const botonLogin = document.getElementById("botonLogin"); 
const botonAtras = document.getElementById('boton-atras');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;


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

botonLogin.addEventListener('click', () => {

    redirect( ROUTES.LOGIN ); 
});

botonAtras.addEventListener('click', () => {
    redirect(ROUTES.HOME); 
});

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
        
        
            const resData = await respuesta.json();
          if (respuesta.ok) {
              formulario.reset();
                    redirect(ROUTES.LOGIN);                
            }else if (respuesta.status === 409) {
                
              toast.error({
                  title: "Usuario o correo ya registrado",
                  description: "Intenta con un nombre de usuario o correo diferente.",
                });
                    mensajesUser.textContent = "";
                    mensajesCorreo.textContent = "";
            
                    mensajesUser.textContent = resData.error ;
                    mensajesCorreo.textContent = resData.error ;         
          } else {
            toast.error({
               title: "Error al crear cuenta",
               description: "Ocurrió un problema inesperado.",
             });
            }
        } catch (error) {
          toast.error({
             title: "Error al crear cuenta",
             description: "Ocurrió un problema inesperado.",
           });
            mensajeButtonRegister.textContent = "Error de conexión con el servidor";
            return
    }
});

