document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#loginForm");
    const meuUsuarioInput = document.querySelector("#meuUsuario");
    const minhaSenhaInput = document.querySelector("#minhaSenha");
    const button = document.querySelector("#entrar");

    gsap.to("form input, #entrar", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
    });


    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const usuario = meuUsuarioInput.value;
        const senha = minhaSenhaInput.value;

//aq vc muda sua senha e usuario
        if (usuario === "admin" && senha === "admin") {
            alert("Acesso aceito");
            window.location.href = "qsomos.html";
        } else {
            alert("Acesso negado");
        }
    });


    button.onmouseover = () => {
        gsap.to(button, {
            scale: 1.1,
            duration: 0.2,
            ease: "power1.inOut",
            repeat: -1, 
            yoyo: true, 
        });
    };


    button.onmouseout = () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.2
        }); 
    };
});