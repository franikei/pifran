
function cargarProductosDesdeJSON() {
  
  return fetch('productos.json')
    .then(response => response.json());
}

$(document).ready(function () {
  function cargarCarritoDesdeLocalStorage() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    return carrito;
  }

  function agregarProductosAlCarritoDOM(productos) {
    const carritoLista = $("#carrito-lista");
    const totalCarrito = $("#total-carrito");
    carritoLista.empty();
    let total = 0;

    productos.forEach(producto => {
      const nuevoItem = $("<li></li>").text(`${producto.nombre} - $${parseFloat(producto.precio).toFixed(2)}`);

      // Boton para eliminar un producto
      const botonEliminar = $("<button></button>")
        .text("Eliminar")
        .css({ backgroundColor: "#ff3333", color: "#fff", margin: "5px" })
        .click(() => eliminarProductoDelCarrito(producto));
      
      nuevoItem.append(botonEliminar);
      carritoLista.append(nuevoItem);

      total += parseFloat(producto.precio);
    });

    const totalFormateado = total.toFixed(2);
    totalCarrito.text(`Total: $${totalFormateado}`);
  }

  function agregarProductoAlCarritoDOM(producto) {
    const carrito = cargarCarritoDesdeLocalStorage();
    // Agregar producto
    producto.cantidad = 1;
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    agregarProductosAlCarritoDOM(carrito);
  }

  function eliminarProductoDelCarrito(producto) {
    const carrito = cargarCarritoDesdeLocalStorage();
    // Para encontrar el índice del producto
    const index = carrito.findIndex(item => item.nombre === producto.nombre);

    if (index !== -1) {
      // Si se encuentra un producto se elimina
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      agregarProductosAlCarritoDOM(carrito);
    }
  }

  function inicializarCarrito() {
    cargarProductosDesdeJSON()
      .then(productos => {
        const carrito = cargarCarritoDesdeLocalStorage();
        agregarProductosAlCarritoDOM(carrito);
      })
      .catch(error => console.error('Error al cargar los productos:', error));
  }

  function vaciarCarrito() {
    localStorage.removeItem("carrito");
    $("#carrito-lista").empty();
    $("#total-carrito").text('Total: $0.00');
  }

  const vaciarCarritoButton = $("#vaciar-carrito");
  vaciarCarritoButton.click(vaciarCarrito);

  const botonesAgregarCarrito = $(".agregar-carrito");

  botonesAgregarCarrito.click(function () {
    const producto = {
      nombre: $(this).parent().find("p").text(),
      precio: parseFloat($(this).parent().find("h3").text().slice(1)),
    };
    agregarProductoAlCarritoDOM(producto);
  });

    
    function mostrarMensajeCompraRealizada() {
      Swal.fire({
        title: '¡Compra realizada!',
        text: '¡Muchas gracias por tu compra!',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then(() => {
        
        vaciarCarrito();
      });
    }
  
    
    document.getElementById("finalizarCompraBtn").addEventListener("click", function () {
      mostrarMensajeCompraRealizada();
    });

  inicializarCarrito();
});