const handleResponse = (res) => res.ok ? res.json() : Promise.reject(new Error('Error en la solicitud'));
const handleError = (err) => console.error("Ocurrió un error", err);

// Enlace json-server
const productosList = () => fetch("http://localhost:3000/Productos").then(handleResponse).catch(handleError);

const createProductos = (Nombre, Precio, Imagen, Descripcion) => {
    return fetch("http://localhost:3000/Productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre, Precio, Imagen, Descripcion })
    }).then(handleResponse).catch(handleError);
}

const deleteProducto = (id) => fetch(`http://localhost:3000/Productos/${id}`, { method: "DELETE" }).catch(handleError);

// Servicios
const services = { productosList, createProductos, deleteProducto };

// Nuevas cartas
const lisCard = document.querySelector("[Cards]");
const Form = document.querySelector("[Form]");

// Crear tarjeta
function createCard({ id, Imagen, Nombre, Precio, Descripcion }) {
    const Card = document.createElement("div");
    Card.className = "Card";
    Card.innerHTML = `
        <img class="img__productos" src="${Imagen}" alt="${Nombre}">
        <h2 class="Title__card">${Nombre}</h2>
        <p class="Descripcion__productos">${Descripcion}</p>
        <div class="Precio">
            <p class="precio__productos">$ ${Precio}</p>
            <button class="delete-button" data-id="${id}">
                <img class="icono_limpiar" src="./assets/borrar (1).png" alt="Borrar">
            </button>  
        </div>
    `;
    Card.querySelector(".delete-button").addEventListener("click", (event) => {
        event.preventDefault();
        services.deleteProducto(id).then(() => Card.remove()).catch(handleError);
    });
    return Card;
}

// Renderizar tarjetas
const render = async () => {
    try {
        const listProduc = await services.productosList();
        listProduc.forEach((producto) => lisCard.appendChild(createCard(producto)));
    } catch (error) {
        handleError(error);
    }
};

// Evento de envío del formulario
Form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nombre = evento.target.querySelector("[buscar-name]").value;
    const precio = evento.target.querySelector("[buscar-precio]").value;
    const imagen = evento.target.querySelector("[buscar-imagen]").value;
    const descripcion = evento.target.querySelector("[buscar-descripcion]").value;
    try {
        const res = await services.createProductos(nombre, precio, imagen, descripcion);
        console.log(res);
        lisCard.appendChild(createCard(res));
    } catch (error) {
        handleError(error);
    }
});

// Inicializar la aplicación
render();