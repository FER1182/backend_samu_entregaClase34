import CartModel from "../models/cart.model.js";

class CartRepository {
  //agrega el carrito con el producto
  async addCart() {
    try {
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.log("error al crear carrito nuevo", error);
      throw error;
    }
  }

  async getCarts() {
    try {
      const nuevoArray = await CartModel.find();
      return nuevoArray;
    } catch (error) {
      console.log("Error al cargar los carritos", error);
    }
  }

  //lista productos que pertenezcan al carrito
  async getCartById(id) {
    try {
      const cart = await CartModel.findById(id).populate("products.product");
      
      if (!cart) {
        console.error(`Error: Carrito con id ${id} no encontrado.`);
      } else {
        return cart;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  // Actualizamos algun producto:
  async updateCartYagrega(idCart, idProduct, quantity = 1) {
    try {
      const cart = await this.getCartById(idCart);
      
      const existeProducto = cart.products.find(
        (item) => item.product._id.toString() === idProduct
      );

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        cart.products.push({ product: idProduct, quantity });
      }

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  // eliminamos algun producto de un carrito:
  async deleteProductCart(idCart, idProduct) {
    try {
      const cart = await CartModel.findById(idCart);
      const deletProduct = cart.products.filter(
        (item) => item.product.toString() === idProduct
      );
      console.log(deletProduct);
      if (!deletProduct) {
        console.error(
          `Error: Producto con id ${id} no encontrado en el carrito.`
        );
        return null;
      } else {
        console.log("producto eliminado del carrito");
        cart.products = cart.products.filter(
          (item) => item.product.toString() !== idProduct
        );
        await cart.save();
        return cart;
      }
    } catch (error) {
      console.log("Error al actualizar el carrito", error);
    }
  }

  // actualizar todo el carrito:
  async actualizarCarrito(idCart,  products) {
    console.log("en cart repository",products)
    try {
      const cart = await CartModel.findById(idCart);
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      cart.products = products;
      console.log("se logro actualizar todo el carrito con exito");
      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al actualizar el carrito", error);
    }
  }

  async updateCart(idCart, idProduct, quantity = 1) {
    try {
      const cart = await this.getCartById(idCart);
      console.log(cart)
      const existeProducto = cart.products.find(
        (item) => item.product.toString() === idProduct
      );
      
      if (existeProducto) {
        existeProducto.quantity += quantity;

        cart.markModified("products");
        await cart.save();
        return cart;
      } else {
        return res
          .status(404)
          .json({ message: "Producto no encontrado en el carrito" });
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }
}

export default CartRepository;
