const socket = io()

const formateador = new Intl.NumberFormat('es-ES');
socket.on("productos", (data) => {
    Object.keys(data).forEach((key) => {
        console.log(key, data[key]);
      })
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `
                        <div class="col-md-4">
                            <div class="card" padding: "1em" style="width: 10rem" >
                                <img src="${item.img}" class="card-img-top" height="200px" alt="...">
                                <div class="card-body">
                                     <p> ${item.title}</p>
                                     <h5 class="card-title">${item.title}</h5>
                                     <p> Precio: $ ${formateador.format(item.price)}</p>   
                                     <button> Eliminar Producto </button>
                                </div>
                            </div>
                         </div>   
                    
                        `
        contenedorProductos.appendChild(card)
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item._id)
        })

    })

})

const eliminarProducto = (id) =>{
    socket.emit("eliminarProducto",id)
}


document.getElementById("btnEnviar").addEventListener("click",()=>{
    console.log("agregue")
    agregarProductos();
    
})

const agregarProductos = () =>{
    const producto ={
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value 
        
    };
    document.getElementById("formRealTime").reset();
    socket.emit("agregarProductos",producto);

}