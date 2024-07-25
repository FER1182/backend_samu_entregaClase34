import UsuarioModel from "../models/usuario.model.js";
import cartRepository from "./cart.repository.js";
import { createHash } from "../utils/hashbcrypt.js";
export default class UserRepository {
  async getUsers() {
    try {
      return await UsuarioModel.find();
    } catch (error) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  }

  async getUser(id) {
    try {
      return await UsuarioModel.findById(id);
    } catch (error) {
      throw new Error(`Error getting user with id ${id}: ${error.message}`);
    }
  }

  async addUser(userData) {
    const { first_name, last_name, email, password, age } = userData;

    try {
      //verificar si el correo esta registrado
      const existeUsuario = await UsuarioModel.findOne({ email: email });
      if (existeUsuario) {
        return res.status(400).send("el correo ya esta registrado");
      }
      const creaCarrito = await cartRepository.addCart();
      
      //definimos el rol del usuario
      
      const role = email === "admincoder@coder.com" ? "admin" : "usuario";
      
      //creacion de nuevo usuario
      const nuevoUsuario = await UsuarioModel.create({
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
        carts:creaCarrito._id,
        role,
      });

      return nuevoUsuario;
     
    } catch (error) {
      throw new Error(`Error adding user: ${error.message}`);
    }
  }

  async modifyUser(id, userData) {
    try {
      return await UsuarioModel.findByIdAndUpdate(id, userData, { new: true });
    } catch (error) {
      throw new Error(`Error updating user with id ${id}: ${error.message}`);
    }
  }

  async removeUser(id) {
    try {
      return await UsuarioModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting user with id ${id}: ${error.message}`);
    }
  }
}
