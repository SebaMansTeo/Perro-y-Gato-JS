
//VARIABLES
let contador = document.querySelector("#contador");
let contenedor = document.getElementById("conteiner");


//CREO MI ARRAY DE OBJETO E INGRESO A MANO LAS REMERAS, PUEDO IR AGREGANDO Y SACANDO
let remeras = [];
$.ajax({
  url: "./DATA/data.json",
  dataType: "json",
  success: (respuesta) => {
    cargarProductos(respuesta);
  },
});

//SELECCIONO EL DIV DONDE VOY A METER MIS CARDS DENTRO DEL HTML
const cargarProductos = (respuesta) => {
    remeras = respuesta;
    
  
    //CON FOREACH CREO UN CARD POR CADA PRODUCTO Y LO METO DENTRO DEL DIV QUE CREE ANTES
    remeras.forEach((remera, indice) => {
      let card = document.createElement("div");
      card.classList.add("card", "col-sm-12", "col-lg-2");
      let html = `<img src=${remera.imagen} class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${remera.modelo}</h5>
          <p class="card-text">$ ${remera.precio}</p>
          <a href="#cart" class="btn btn-dark agregarCarrito" onClick="agregarAlCarrito(${indice})">Agregar al carrito</a>
        </div>`;
      card.innerHTML = html;
      contenedor.appendChild(card);
    });
};











const contenedorCarrito = document.querySelector("#listaCarrito");
const dibujarCarrito = () => {
  let total = 0;
  contenedorCarrito.className = "cart";
  contenedorCarrito.innerHTML = "";
  if (cart.length > 0) {
    cart.forEach((remera, indice) => {
      total = total + remera.precio * remera.cantidad;
      
      const fila = document.createElement("div");
      fila.className = "row";
      fila.innerHTML = `<div class="col itemMod"><img src="${remera.imagen}" width="50"></div>
      <div class="col itemMod"><a> ${remera.modelo}</a></div>
      <div class="col itemMod"><a>$ ${remera.precio}</a></div>
      <div class="col itemMod"><a> ${remera.cantidad}</a></div>
      
      <div class="col itemMod">$ ${remera.precio * remera.cantidad}</div>
      <div class="col itemMod"  id="remove-product" onClick="removeProduct(${indice})"><a class="eliminar">X</a></div>
         `;
      contenedorCarrito.appendChild(fila);
    });
    // Dibujo el total y lo appendeo en el div capturado y guardado en la variable modalCarrito
    const totalContainer = document.createElement("div");
    totalContainer.className = "total-carrito";
    totalContainer.innerHTML = `<div class= "total"> TOTAL $ ${total}</div>
    <button class= "btn finalizar"  id="finalizar" onClick="finalizarCompra()" data-bs-dismiss="modal"> FINALIZAR COMPRA </button>`;
    contenedorCarrito.appendChild(totalContainer);
  } else {
    contenedorCarrito.classList.remove("cart");
  }
};

let cart = [];
// si existen datos en el local storage hago la carga inicial desde local storage.
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  dibujarCarrito();
};


//AGREGAR AL CARRITO
const agregarAlCarrito = (indiceDelArrayProducto) => {
    //findIndex devuelve el indice del elemento encontrado
    // si no encuentra nada devuelve menos 1 (-1)
    const indiceEncontradoCarrito = cart.findIndex((elemento) => {
      return elemento.id === remeras[indiceDelArrayProducto].id;
    });
    if (indiceEncontradoCarrito === -1) {
      //agrego el producto
      const remeraAgregar = remeras[indiceDelArrayProducto];
      remeraAgregar.cantidad = 1;
      cart.push(remeraAgregar);
      actualizarStorage(cart);
      dibujarCarrito();
    } else {
      //incremento cantidad
      cart[indiceEncontradoCarrito].cantidad += 1;
      actualizarStorage(cart);
      dibujarCarrito();
    };
    Swal.fire(
        'Bien Hecho!',
        "Agresgaste un producto al carrito",
        'success'
      );
};

//ELIMINAR PRODUCTO
const removeProduct = (indice) => {
cart.splice(indice, 1);
actualizarStorage(cart);
dibujarCarrito();
};

//VACIAR CARRITO
$("#vaciarCarrito").click(function vaciarCarrito(e){
    e.preventDefault();
    if (e.target.id == "vaciarCarrito"){
      cart = [];
      actualizarStorage(cart);
      dibujarCarrito();
    }
    
});

//FINALIZAR COMPRA
const finalizarCompra = (e) => {
const total = document.getElementsByClassName("total")[0].innerHTML;
contenedor.innerHTML = ""
const compraFinalizada = `<div class="compra-finalizada"><p class="compra-parrafo"> YA CASI ES TUYA LA COMPRA, EL   ${total} </p></div>
<div class="datos-cliente">
<p class="datos-parrafo"> Complete el formulario con sus datos para coordinar la entrega</p>
<button class= "btn btn-danger formulario" id="formulario" onClick="dibujarFormu()"> FORMULARIO </button>
</div>`;
contenedor.innerHTML = compraFinalizada;
};

const dibujarFormu = () => {
contenedor.innerHTML = "";
const formulario = `
<h2> DATOS PARA EL ENVÍO </h2>
<div class="contact__secction-container">
    <div class="row">
    <div class="contact__secction__item">
        <label>Nombre</label>
        <input type="text" id="nombre" placeholder="Nombre"  />
    </div>
    <div class="contact__secction__item">
        <label>E-mail</label>
        <input type="text" id="mail" placeholder="E-mail" />
    </div>
    <div class="contact__secction__item">
        <label>Telefono</label>
        <input type="text" id="telefono" placeholder="Telefono"  />
    </div>
    <div class="contact__secction__item">
        <label>Domicilio</label>
        <input type="text" id="domicilio" placeholder="Domicilio" />
    </div>
    <div class="contact-button">
        <button type="button" class="btn btn-danger envio" onClick="mostrarMensaje()" >Confirmar</button>
    </div>
    </div>
</div>`;
contenedor.innerHTML = formulario;
};

const mostrarMensaje = () => {
const nombreCliente = document.getElementById("nombre").value;
const domicilioCliente = document.getElementById("domicilio").value;
contenedor.innerHTML = "";
let mensaje = `<div class="mensaje-final">Gracias ${nombreCliente} por su compra! en 72 horas recibira su paquete en ${domicilioCliente} </div>`;
contenedor.innerHTML = mensaje;
};

const actualizarStorage = (cart) => {
localStorage.setItem("cart", JSON.stringify(cart));
if(cart.length > 0){
    contador.style.display = "inline-block"
  }else{
    contador.style.display = "none"
  }
};



