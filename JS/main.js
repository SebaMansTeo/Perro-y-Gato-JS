//VARIABLES
let contador = document.querySelector("#contador");
let contenedor = document.querySelector("#conteiner");

//CREO MI ARRAY DE OBJETO E INGRESO A MANO LAS REMERAS, PUEDO IR AGREGANDO Y SACANDO
let remeras = [];
$.ajax({
  url: "../models/data.json",
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
    card.classList.add("card", "col-sm-12", "col-lg-2", "col-md-6");
    let html = `<img src=${remera.imagen} class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${remera.modelo}</h5>
          <p class="card-text">$ ${remera.precio}</p>
          <a class="btn btn-dark agregarCarrito" onClick="agregarAlCarrito(${indice})">Agregar al carrito</a>
        </div>`;
    card.innerHTML = html;
    contenedor.append(card);
    $("body").fadeIn(2000);
  });
};

//ACTUALIZAR STORAGE Y HACER VISIBLE EL CONTADOR DE CARRITO
const actualizarStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  
  if (cart.length > 0) {
    contador.style.display = "inline-block";
    
  } else {
    contador.style.display = "none";
  }
};

//DIBUJO EL CARRITO DENTRO DEL MODAL
const contenedorCarrito = document.querySelector("#listaCarrito");
const dibujarCarrito = () => {
  let total = 0;
  let cantidadCarrito = 0;
  contenedorCarrito.className = "cart";
  contenedorCarrito.innerHTML = "";
  if (cart.length > 0) {
    cart.forEach((remera, indice) => {
      total = total + remera.precio * remera.cantidad;
      cantidadCarrito = cantidadCarrito + remera.cantidad;
      const fila = document.createElement("div");
      fila.className = "row p-3 border-bottom border-dark";
      fila.innerHTML = `<div class="col itemMod"><img src="../${
        remera.imagen
      }" width="50"></div>
      <div class="col itemMod"><a> ${remera.modelo}</a></div>
      <div class="col itemMod"><a>$ ${remera.precio}</a></div>
      <div class="col itemMod"><a> ${remera.cantidad}</a></div>
      
      <div class="col itemMod">$ ${remera.precio * remera.cantidad}</div>
      <div class="col itemMod"  id="remove-product" onClick="removeProduct(${indice})"><i class="far fa-trash-alt eliminar"></i></div>
         `;
      contenedorCarrito.append(fila);
      contador.innerHTML = cantidadCarrito;
    });
    // Dibujo el total y lo appendeo en el div capturado y guardado en la variable modalCarrito
    const totalContainer = document.createElement("div");
    totalContainer.className = "total-carrito";
    totalContainer.innerHTML = `<div class= "totalMod"> TOTAL $ ${total}</div>
    `;
    contenedorCarrito.append(totalContainer);
  } else {
    contenedorCarrito.classList.remove("cart");
  }
};

let cart = [];
// si existen datos en el local storage hago la carga inicial desde local storage.
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  dibujarCarrito();
}

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
  }
  Swal.fire("BIEN HECHO!", "AGREGASTE UN NUEVO PRODUCTO AL CARRITO", "success");
  $('html, body').animate({
    scrollTop: $("header").offset().top  
  }, 2000);

};

//ELIMINAR PRODUCTO
const removeProduct = (indice) => {
  cart.splice(indice, 1);
  actualizarStorage(cart);
  dibujarCarrito();
};

//VACIAR CARRITO
$("#vaciarCarrito").click(function vaciarCarrito(e) {
  e.preventDefault();
  if (e.target.id == "vaciarCarrito") {
    cart = [];
    actualizarStorage(cart);
    dibujarCarrito();
  }
});

//FINALIZAR COMPRA
const finalizarCompra = (e) => {
  const total = document.getElementsByClassName("totalMod")[0].innerHTML;
  contenedor.innerHTML = "";
  const compraFinalizada = `<div class="mensajeCompra text-center"><div class="compra-finalizada"><p class="compra-parrafo text-center"> GRACIAS POR COMPRAR EN COMO PERRO Y GATO <br> EL MONTO DE TU COMPRA ES EL SIGUIENTE:<br> ${total}</p></div>
<div class="datos-cliente">
<p class="datos-parrafo text-center"> DEBES COMPLETAR EL SIGUIENTE FORMULARIO PARA COORDINAR LA ENTREGA DE TUS PRODUCTOS</p>
<button class= "btn formulario" id="formulario" onClick="dibujarFormu()"> FORMULARIO </button>
</div></div>`;
  contenedor.innerHTML = compraFinalizada;
};

//DIBUJA EL FORMULARIO
const dibujarFormu = () => {
  contenedor.innerHTML = "";
  const formulario = `
<h2 class="text-center"> DATOS PARA EL ENVÍO </h2>
<form class="row g-3">
  <div class="col-md-6">
    <label for="inputEmail4" class="form-label">NOMBRE *</label>
    <input type="name" class="form-control" id="nombre">
  </div>
  <div class="col-md-6">
    <label for="inputPassword4" class="form-label">EMAIL</label>
    <input type="email" class="form-control" id="inputEmail">
  </div>
  <div class="col-12">
    <label for="inputAddress" class="form-label">DOMICILIO *</label>
    <input type="text" class="form-control" id="domicilio" placeholder="1234 Main St">
  </div>
  
  <div class="col-md-6">
    <label for="inputCity" class="form-label">CIUDAD *</label>
    <input type="text" class="form-control" id="inputCiudad">
  </div>
  
  <div class="col-md-2">
    <label for="inputZip" class="form-label">CÓDIGO POSTAL *</label>
    <input type="text" class="form-control" id="inputCod">
  </div>
  
  <div class="contact-button">
       <button type="button" class="btn btn-danger envio" onClick="mostrarMensaje()" >Confirmar</button>
  </div>
</form>
`;
  contenedor.innerHTML = formulario;
};

//MENSAJE FINAL
const mostrarMensaje = () => {
  const nombreCliente = document.querySelector("#nombre").value;
  const domicilioCliente = document.querySelector("#domicilio").value;
  const ciudadCliente = document.querySelector("#inputCiudad").value;
  const codigoCliente = document.querySelector("#inputCod").value;
  
  //VALIDO Q INGRESEN LOS DATOS OBLIGATORIOS
  if(nombreCliente != "" & domicilioCliente != "" & ciudadCliente != "" & codigoCliente != ""){
    contenedor.innerHTML = "";
    let mensaje = `<div id="mensaje" style="display: none" class="mensaje-final text-center">Gracias ${nombreCliente} por su compra!<br> En breve nos pondremos en contacto con usted para pautar la entrega en la calle ${domicilioCliente} </div>`;
    contenedor.innerHTML = mensaje;
    $("#mensaje").fadeIn(2000);
    localStorage.clear("cart");
  }else{
    Swal.fire({
      title: 'ALGUNOS DATOS SON OBLIGATORIOS, VUELVE A COMPLETAR EL FORMULARIO',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })   
    
  };
};


//SOBRE NOSOTROS//
$("#sobreNos").click("click", () => {
  
  $("#cards").html(`<div id="nuevaSeccion" style="display: none" class="container-md"><h2 class="text-center">NUESTRA HISTORIA</h2><div class="row align-items-start">
  <div class="col-sm-12 col-lg col-md-6">
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta vel dolorum officiis vitae voluptates hic repudiandae nisi maxime amet at, aliquam officia quas, earum eos enim unde, nam incidunt eius.
  Expedita optio atque assumenda illo, maxime laboriosam voluptate inventore nemo modi. Voluptatem nemo iure illo sequi voluptatibus voluptas. Quos delectus natus itaque in ipsum rem provident beatae aut exercitationem cum!
  Autem distinctio eos sunt. Nihil beatae aperiam maxime eaque totam voluptatem distinctio nulla dolorum quidem a odio saepe autem consectetur quis dignissimos unde dicta, atque sapiente provident officiis dolorem quod?
  Debitis, error ipsam velit autem iste explicabo perferendis minus earum ab quisquam facilis reprehenderit veritatis a vero, ut, commodi natus cum nemo ipsum illo rem quam ullam vel. Possimus, cumque?
  Exercitationem officia quis, quae repellat aliquid sapiente alias doloribus dolor impedit nostrum sint molestias doloremque voluptas culpa, expedita natus eveniet neque laudantium? Soluta repellat deleniti, incidunt deserunt similique cum neque.</p>
  </div>
  <div class="col-sm-12 col-lg col-md-6">
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta vel dolorum officiis vitae voluptates hic repudiandae nisi maxime amet at, aliquam officia quas, earum eos enim unde, nam incidunt eius.
  Expedita optio atque assumenda illo, maxime laboriosam voluptate inventore nemo modi. Voluptatem nemo iure illo sequi voluptatibus voluptas. Quos delectus natus itaque in ipsum rem provident beatae aut exercitationem cum!
  Autem distinctio eos sunt. Nihil beatae aperiam maxime eaque totam voluptatem distinctio nulla dolorum quidem a odio saepe autem consectetur quis dignissimos unde dicta, atque sapiente provident officiis dolorem quod?
  Debitis, error ipsam velit autem iste explicabo perferendis minus earum ab quisquam facilis reprehenderit veritatis a vero, ut, commodi natus cum nemo ipsum illo rem quam ullam vel. Possimus, cumque?
  Exercitationem officia quis, quae repellat aliquid sapiente alias doloribus dolor impedit nostrum sint molestias doloremque voluptas culpa, expedita natus eveniet neque laudantium? Soluta repellat deleniti, incidunt deserunt similique cum neque.</p>
  </div>
  <div class="col-sm-12 col-lg col-md-6">
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta vel dolorum officiis vitae voluptates hic repudiandae nisi maxime amet at, aliquam officia quas, earum eos enim unde, nam incidunt eius.
  Expedita optio atque assumenda illo, maxime laboriosam voluptate inventore nemo modi. Voluptatem nemo iure illo sequi voluptatibus voluptas. Quos delectus natus itaque in ipsum rem provident beatae aut exercitationem cum!
  Autem distinctio eos sunt. Nihil beatae aperiam maxime eaque totam voluptatem distinctio nulla dolorum quidem a odio saepe autem consectetur quis dignissimos unde dicta, atque sapiente provident officiis dolorem quod?
  Debitis, error ipsam velit autem iste explicabo perferendis minus earum ab quisquam facilis reprehenderit veritatis a vero, ut, commodi natus cum nemo ipsum illo rem quam ullam vel. Possimus, cumque?
  Exercitationem officia quis, quae repellat aliquid sapiente alias doloribus dolor impedit nostrum sint molestias doloremque voluptas culpa, expedita natus eveniet neque laudantium? Soluta repellat deleniti, incidunt deserunt similique cum neque.</p>
  </div></div></div>`);
  $("#nuevaSeccion").fadeIn(2000);
})


