function ingresar() {

    // 1. Obtenemos los valores del formulario
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("clave").value;

    // 2. Validamos que no estén vacíos
    if (user === "" || pass === "") {
        mostrarError("Por favor completá todos los campos");
        return;
    }

    // 3. Llamamos al backend
    fetch(`http://localhost:8080/tp1/login?user=${user}&pass=${pass}`)
        .then(response => response.json())
        .then(data => {
            if (data.respuesta === "OK") {
                // 4a. Login exitoso → redirigimos a lista.html
                window.location.href = "lista.html";
            } else {
                // 4b. Login fallido → mostramos el error
                mostrarError(data.mje);
            }
        })
        .catch(error => {
            mostrarError("Error al conectar con el servidor");
        });
}

function mostrarError(mensaje) {
    const div = document.getElementById("mensaje");
    div.textContent = mensaje;
    div.className = "error";
    div.style.display = "block";
}