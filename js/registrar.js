//Enlace json-server
const productosList = () => {
    return fetch("http://localhost:3000/Productos")
        .then((res) => res.json())
        .catch((err) => console.error("ocurrio un error", err));
};

const createProductos = (Nombre, Precio, Imagen, Descripcion) => {
    return fetch("http://localhost:3000/Productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({

            Nombre,
            Precio,
            Imagen,
            Descripcion

        })
    }).then((res) => res.json()).catch((err) => console.log(err));
}

const deleteProducto = (id) => {
    return fetch(`http://localhost:3000/Productos/${id}`, {
        method: "DELETE",
    }).catch((err) => console.error("error al eliminar", err));
};


const services = {
    productosList,
    createProductos,
    deleteProducto,
};


//Nuevas cartas 
const lisCard = document.querySelector("[Cards]");
const Form = document.querySelector("[Form]");

function createCard(id, Imagen, Nombre, Precio, Descripcion) {
    const Card = document.createElement("div");
    Card.classList.add("Card");
    Card.innerHTML = `
        <img class="img__productos" src="${Imagen}" alt="Imagen 1">
            <h2 class="Title__card">${Nombre}</h2>
            <p class="Descripcion__productos">${Descripcion}</p>
        <div class="Precio">
            <p class="precio__productos">$ ${Precio}</p>
            <button class="delete-button" data-id="${id}">
                <img class="icono_limpiar" src="./assets/borrar (1).png" alt="Imagen 1">
            </button>  
        </div>
    `;

    const deleteButton = Card.querySelector(".delete-button");
    deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        services.deleteProducto(id).then(() => {
            Card.remove();
        }).catch((err) => console.log(err));
    });

    lisCard.appendChild(Card);
    return Card;
}


lisCard.addEventListener(createCard, (events) =>{
    events.preventDefault();
})

const render = async () => {
    try {
        const listProduc = await services.productosList();
        listProduc.forEach(Productos => {
            lisCard.appendChild(createCard(

                Productos.id,
                Productos.Imagen,
                Productos.Nombre,
                Productos.Precio,
                Productos.Descripcion

            ))
        });
    } catch (error) {
        console.log(error)
    }

};

Form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("[buscar-name]").value;
    const precio = document.querySelector("[buscar-precio]").value;
    const imagen = document.querySelector("[buscar-imagen]").value;
    const descripcion = document.querySelector("[buscar-descripcion]").value;

    services.createProductos(nombre, precio, imagen, descripcion)
    .then((res) => {console.log(res);
    })
    .catch((err) => console.log(err));
});

render();
