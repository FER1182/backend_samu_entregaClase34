import CartRepository from "../repositories/cart.repository.js";
const cartRepository = new CartRepository();
import ProductRepository from "../repositories/product.repository.js";
const productRepository = new ProductRepository();
import TicketRepository from "../repositories/ticket.repository.js";
const ticketRepository = new TicketRepository();

export default class CartsController {
  async getCarts(req, res) {
    try {
      const carts = await cartRepository.getCarts();
      res.json(carts);
    } catch (error) {
      res.status(500).send("Error al obtener los carritos");
    }
  }

  async getCartById(req, res) {
    try {
      const id = req.params.cid;
      const cart = await cartRepository.getCartById(id);
      
      let totalCart = 0;
       for (let item of cart.products) {
         totalCart += item.product.price * item.quantity;
       }
       res.render("cart", { 
        cartId : id,
         cart: cart.products , 
         totalCart: totalCart
       }); //res.json(cart);
    } catch (error) {
      res.status(500).send("Error al obtener el carrito");
    }
  }

  async addCart(req, res) {
    try {
      const cart = await cartRepository.addCart();
      res.json(cart);
    } catch (error) {
      res.status(500).send("Error al crear el carrito");
    }
  }
  async updateCart(req, res) {
    if (req.user.role !== "admin") {
      try {
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        const cantProdAgregado = req.body.quantity;
        const cart = await cartRepository.updateCartYagrega(
          idCart,
          idProduct,
          cantProdAgregado
        );
        if (!cart) {
          return res.json({
            error: "Carrito no encontrado",
          });
        }
        res.redirect("/api/carts/" + idCart);
      } catch (error) {
        res.status(500).send("Error al actualizar el carrito");
      }
    } else {
      res.send("El administrador no puede agregar productos al carrito");
    }
  }

  async deleteProductCart(req, res) {
    try {
      const idCart = req.params.cid;
      const idProduct = req.params.pid;
      const cart = await cartRepository.deleteProductCart(idCart, idProduct);
      if (!cart) {
        return res.json({
          error: "Carrito no encontrado",
        });
      }
      res.send({ message: "producto eliminado con exito del carrito" });
      res.json(cart);
    } catch (error) {
      res.status(500).send("Error al actualizar el carrito");
    }
  }
  async emptyCart(req, res) {
    try {
      const idCart = req.params.cid;
      const products = [];

      const producto = await manager.actualizarCarrito(idCart, { products });
      res.send({ message: "se vacio el carrito" });
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  async purchaseCart(req, res) {
    try {
      const idCart = req.params.cid;
      const cart = await cartRepository.getCartById(idCart);
      let insufficientStockItems = [];
      let cartTicket =[]
      let totalCart = 0;
      
      for (let item of cart.products) {
        
        const product = await productRepository.getProductById(item.product._id);
        
        if (product.stock < item.quantity) {
          insufficientStockItems.push(item);
        }else{
          product.stock -= item.quantity
          await productRepository.updateProduct(item.product._id, product)
          
          totalCart += item.product.price * item.quantity;
          console.log(totalCart)
          cartTicket.push(item)
        }
      }
      

      console.log(insufficientStockItems)
      const cartUpdated = await cartRepository.actualizarCarrito(idCart,  insufficientStockItems );
      console.log("en cart controller",cartUpdated)
      const ticket = await ticketRepository.addTickets( totalCart, req.user.usuario);
      if (insufficientStockItems.length > 0) {
        return res.status(400).json({
          message: 'algunos productos no tienen stock , se realizo una parte de la compra, y quedaron estos productos pendientes',
          insufficientStockItems,
        });
      }
      res.send({ message: "se realizo la compra" });
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
