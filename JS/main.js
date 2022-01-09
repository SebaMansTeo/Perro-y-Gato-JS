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
  let contenedor = document.getElementById("conteiner");

  //CON FOREACH CREO UN CARD POR CADA PRODUCTO Y LO METO DENTRO DEL DIV QUE CREE ANTES
  remeras.forEach((remera) => {
    let card = document.createElement("div");
    card.classList.add("card", "col-sm-12", "col-lg-2");
    let html = `<img src=${remera.imagen} class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${remera.modelo}</h5>
        <p class="card-text">$ ${remera.precio}</p>
        <a href="#cart" class="btn btn-dark agregarCarrito" data-id="${remera.id}">Agregar al carrito</a>
      </div>`;
    card.innerHTML = html;
    contenedor.appendChild(card);
  });
};
//VARIABLES

const contenedorCarrito = document.querySelector("#listaCarrito");
const vaciarCarritobtn = $("#vaciarCarrito");
const listaRemeras = $("#conteiner");
const eliminar = $("#listaCarrito");
const finalizarCompra = $("#finalizarCompra");
let articulosCarrito = [];
let contador = document.querySelector("#contador");
const total = $("#total");




cargarEventListener();
function cargarEventListener() {
  
  //MUESTRA LOS PRODUCTOS DEL STORAGE
  document.addEventListener("DOMContentLoaded", () =>{
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoHtml();
  })
}

// FUNCIONES

// AGREGAR PRODUCTO AL CARRITO
$("#conteiner").click (function (e) {
  e.preventDefault();
  if (e.target.classList.contains("agregarCarrito")) {
    const remeraSeleccionada = e.target.parentElement.parentElement;
    leerDatosRemera(remeraSeleccionada);
    Swal.fire(
      'Bien Hecho!',
      "Agresgaste un producto al carrito",
      'success'
    );
  }
  
    
});


// EJEMPLO DE ANIMACION CON CALLBACK
// $("#conteiner").click (function (e) {
//   e.preventDefault();
//   if (e.target.classList.contains("agregarCarrito")) {
//     const remeraSeleccionada = e.target.parentElement.parentElement;
//     leerDatosRemera(remeraSeleccionada);
//     $("#conteiner").fadeOut("slow", function(){
//       //Cuando termina de ocultarse el elemento lo mostramos nuevamente
//       $("#conteiner").fadeIn(1000, function(){
//         Swal.fire(
//           'Bien Hecho!',
//           "Agresgaste un producto al carrito",
//           'success'
//         );
//       });});
      
// }});


//ELIMINAR PRODUCTO
$("#listaCarrito").click(function eliminarProducto(e){
  e.preventDefault();

  if (e.target.classList.contains("borrarProducto")){
    const remeraId = e.target.getAttribute("data-id");
    //ELIMINAR DEL CARRITO
    articulosCarrito = articulosCarrito.filter(remeraSeleccionada => remeraSeleccionada.id !== remeraId);
    
    //LLAMO A LA FUNCION PARA DIBUJAR EL CARRO EN EL HTML
    carritoHtml();
  };
  
});

//VACIAR CARRITO
$("#vaciarCarrito").click(function vaciarCarrito(e){
  e.preventDefault();
  if (e.target.id == "vaciarCarrito"){
    articulosCarrito = [];
    carritoHtml();
  }
  
});

//FINALIZAR COMPRA
$("#finalizarCompra").click(function finalizar(e){
  e.preventDefault();
  
  const mensaje = document.createElement("div");
  mensaje.innerHTML = `<div class="compra-finalizada"><p class="compra-parrafo"> YA CASI ES TUYA LA COMPRA, REVISA LOS  PRODUCTOS INGRESADOS Y COMPLETA EL FORMULARIO DE ENTREGA </p></div>
  <div class="datos-cliente">
  <p class="datos-parrafo"> Complete el formulario con sus datos para coordinar la entrega</p>
  <button class= "btn btn-danger formulario" id="formulario" onClick="dibujarFormu()"> FORMULARIO </button>
  </div>`;
  contenedorCarrito.appendChild(mensaje);
});

function leerDatosRemera(remeraSeleccionada) {
  //CREAR OBJETO CON EL CONTENIDO
  const infoRemera = {
    imagen: remeraSeleccionada.querySelector("img").src,
    modelo: remeraSeleccionada.querySelector("h5").textContent,
    precio: remeraSeleccionada.querySelector("p").textContent,
    id: remeraSeleccionada.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  //REVISA SI EL ELEMENTO YA EXISTE EN EL CARRITO
  const existe = articulosCarrito.some(
    (remeraSeleccionada) => remeraSeleccionada.id === infoRemera.id
  );
  if (existe) {
    //ACTUALIZAMOS LA CANTIDAD
    const remeraDup = articulosCarrito.map(remeraSeleccionada => {
      if (remeraSeleccionada.id === infoRemera.id) {
        remeraSeleccionada.cantidad++;
        return remeraSeleccionada; //RETORNA EL OBJETO ACTUALIZADO
      } else {
        return remeraSeleccionada; //RETORNA LOS OBJETOS QUE NO ESTAN DUPLICADOS
      }
    });
    articulosCarrito = [...remeraDup];
  } else {
    //AGREGA ELEMENTOS AL CARRITO
    articulosCarrito = [...articulosCarrito, infoRemera];
  }
  
  console.log(articulosCarrito);
  
  
  carritoHtml();
  
}

//MUESTRA EL CARRITO EN EL HTML
function carritoHtml() {
  limpiarHtml();
  //RECORRE EL CARRITO Y GENERA EL HTML
  
  articulosCarrito.forEach((remeraSeleccionada) => {
    
    
    const fila = document.createElement("div")
      fila.className = "row";
      fila.innerHTML = `<div class="col itemMod"><img src="${remeraSeleccionada.imagen}" width="50"></div>
      <div class="col itemMod"><a> ${remeraSeleccionada.modelo}</a></div>
      <div class="col itemMod"><a> ${remeraSeleccionada.precio}</a></div>
      <div class="col itemMod"><a> ${remeraSeleccionada.cantidad}</a></div>
      
      <div class="col itemMod"><a href="#" class="borrarProducto" data-id="${remeraSeleccionada.id}">X</a></div>`; 
      //AGREGO EL HTML DEL CARRITO 
      
      contenedorCarrito.appendChild(fila);   
       
  });
  

  //AGREGAR EL CARRITO AL LOCAL STORAGE
  sincronizarStorage();
  
}

//LOCALSTORAGE
function sincronizarStorage(){
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito))
  if(articulosCarrito.length > 0){
    contador.style.display = "inline-block"
  }else{
    contador.style.display = "none"
  }
}

//LIMPIA LOS PRODUCTOS DEL CARRITO
function limpiarHtml() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}


