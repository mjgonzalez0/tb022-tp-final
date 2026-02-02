import { redirect, ROUTES } from "./routes.js";
import { API_URL } from "./constants.js";
import { saveAccessToken } from "./token.js";

const formulario = document.getElementById("formulario");

const inputCorreo = document.getElementById("correo");
const inputPassword = document.getElementById("contraseña");

const mensajesCorreo = document.getElementById("mensajeCorreo");
const mensajesPassword = document.getElementById("mensajeContraseña");

const mensajeButtonLogin = document.getElementById("mensajeIniciarSesion")

const botonCrearNuevaCuenta = document.getElementById('crea-cuenta');

const buttonlogin = document.getElementById("botonIniciarSesion");

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;


inputCorreo.addEventListener("input",() => {

    if (inputCorreo.value.length > 255 || !EMAIL_REGEX.test(inputCorreo.value)) {
        mensajesCorreo.textContent = "La estructura del correo es invalida"
    }else {
        mensajesCorreo.textContent = ""

    }
})

botonCrearNuevaCuenta.addEventListener("click", () => {

    redirect( ROUTES.SIGNIN );

} )

inputPassword.addEventListener("keyup", (event) => {  
    if (event.getModifierState("CapsLock")) {
        mensajesPassword.textContent = "Mayusculas activadas";
    } else {
        mensajesPassword.textContent = "";   
    }})
    
    formulario.addEventListener("submit", async(evento) => {

    evento.preventDefault();

    mensajesCorreo.textContent = "";
    mensajesPassword.textContent = "";


    
    if(!formulario.checkValidity() ){
        formulario.reportValidity();
        if (inputCorreo.value === ""){
            mensajesCorreo.textContent = "Es obligatorio colocar un correo "
        }
    
        if(inputPassword.value === "") {
            mensajesPassword.textContent = "Es obligatorio colocar una contraseña";
        }
        return;
        }

    const datos = {
        email: inputCorreo.value,
        password: inputPassword.value,
    };
    
    try {

        const respuesta = await fetch( `${API_URL}/users/login` , {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
        });
    
    
        if (respuesta.ok) {
            mensajeButtonLogin.textContent = respuesta.messaje;
            
            const { access_token } = await respuesta.json();
            saveAccessToken(access_token);
            
            redirect(ROUTES.HOME);
            formulario.reset();
            
        }else {
            const errorData = await respuesta.json();
            if (respuesta.status === 400) {
                
                mensajeButtonLogin.textContent = "";
        
                mensajeButtonLogin.textContent = errorData.error ;
            
            }else {
            alert("Error: " + errorData.error);
            }}
    } catch (error) {
        mensajeButtonLogin.textContent = "Error de conexión con el servidor";
    }
});
