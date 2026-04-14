// Al cargar la página, traemos todos los usuarios automáticamente
window.onload = function() {
    cargarTodos();
}

// ─── FUNCIÓN: Cargar todos los usuarios ──────────────────────────
function cargarTodos() {
    document.getElementById("txtBuscar").value = "";
    fetch("http://localhost:8080/tp1/lista?action=BUSCAR")
        .then(response => response.json())
        .then(data => cargarTabla(data))
        .catch(error => alert("Error al conectar con el servidor"));
}

// ─── FUNCIÓN: Buscar usuarios por texto ──────────────────────────
function buscar() {
    const texto = document.getElementById("txtBuscar").value;
    fetch(`http://localhost:8080/tp1/lista?action=BUSCAR&usuario=${texto}`)
        .then(response => response.json())
        .then(data => cargarTabla(data))
        .catch(error => alert("Error al conectar con el servidor"));
}

// ─── FUNCIÓN: Cargar datos en la tabla ───────────────────────────
function cargarTabla(usuarios) {
    const cuerpo = document.getElementById("cuerpoTabla");
    const sinResultados = document.getElementById("sinResultados");

    // Limpiamos la tabla antes de cargar nuevos datos
    cuerpo.innerHTML = "";

    // Si no hay usuarios mostramos el mensaje
    if (usuarios.length === 0) {
        sinResultados.style.display = "block";
        return;
    }

    sinResultados.style.display = "none";

    // Recorremos cada usuario y creamos una fila
    usuarios.forEach(u => {
        const fila = document.createElement("tr");

        // Color de fila según si está bloqueado o no
        fila.className = u.bloqueado === "Y" ? "fila-bloqueada" : "fila-activa";

        // Contenido de la fila
        fila.innerHTML = `
            <td>${u.id}</td>
            <td>${u.usuario}</td>
            <td>${u.bloqueado}</td>
            <td>${u.apellido}</td>
            <td>${u.nombre}</td>
            <td>
                <button class="btn-bloquear" 
                        onclick="cambiarEstado(${u.id}, 'Y')">
                    Bloquear
                </button>
            </td>
            <td>
                <button class="btn-desbloquear" 
                        onclick="cambiarEstado(${u.id}, 'N')">
                    Desbloquear
                </button>
            </td>
        `;

        cuerpo.appendChild(fila);
    });
}

// ─── FUNCIÓN: Bloquear o Desbloquear usuario ──────────────────────
function cambiarEstado(idUser, estado) {
    fetch(`http://localhost:8080/tp1/bloquear?idUser=${idUser}&estado=${estado}`)
        .then(response => response.json())
        .then(data => {
            if (data.respuesta === "OK") {
                // Recargamos la tabla para reflejar el cambio
                cargarTodos();
            } else {
                alert("Error: " + data.mje);
            }
        })
        .catch(error => alert("Error al conectar con el servidor"));
}