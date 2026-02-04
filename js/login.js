import {supabase} from './supabase';

/*TODO --> Precisa realizar o login no supabase, seguindo os pilares da POO
            não sei como trataremos a questão colocar os valores no supabase e to
                com preguiça de saber
*/



document.addEventListener("DOMContentLoaded", function () {
    // Olho que mostra a senha
    const olho = document.getElementById("olho");
    const senhaInput = document.getElementById("senha");

    if (olho && senhaInput) {
        olho.addEventListener("click", function () {
            if (senhaInput.type === "password") {
                senhaInput.type = "text";
                olho.classList.remove("fa-eye");
                olho.classList.add("fa-eye-slash");
            } else {
                senhaInput.type = "password";
                olho.classList.remove("fa-eye-slash");
                olho.classList.add("fa-eye");
            }
        });
    }

    document.getElementById('enviar').addEventListener('click', function() {
    window.location.href = "inicio.html";
});


    // Conferência de campos (comentada)
    /*  const form = document.getElementById("login");
     const email = document.getElementById("email");
 
     form.addEventListener("submit", async function (e) {
          e.preventDefault();
         const emailValue = email.value.trim();
         const senhaValue = senhaInput.value.trim();
 
         const { data, error } = await supabase.auth.signInWithPassword({
             email: emailValue,
             password: senhaValue,
         });
 
         if (error) {
             alert("Erro no login: " + error.message);
         } else { 
             window.location.href = "inicio.html";
         }
     }); */
});