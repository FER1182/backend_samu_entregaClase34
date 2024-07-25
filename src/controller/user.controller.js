import UserRepository from "../repositories/user.repository.js";
const userRepository = new UserRepository();
import jwt from "jsonwebtoken";

export default class UserController {
  generateToken(nuevoUsuario) {
    return jwt.sign(
      {
        usuario: nuevoUsuario.email,
        first_name: nuevoUsuario.first_name,
        last_name: nuevoUsuario.last_name,
        role: nuevoUsuario.role,
        idCart: nuevoUsuario.carts,
      },
      "coderhouse",
      { expiresIn: "1h" }
    );
  }
  async getAllUsers(req, res) {
    try {
      const users = await userRepository.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send("Error al obtener los usuarios");
    }
  }

  async getUserById(req, res) {
    try {
      const id = req.params.id;
      
      const user = await userRepository.getUser(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error al obtener el usuario admi");
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const user = await userRepository.addUser(userData);
      const token = this.generateToken(user);
      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.status(201).json(user);
      res.redirect("/api/products");
    } catch (error) {
      res.status(500).send("Error al crear el usuario");
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const userData = req.body;
      const user = await userRepository.modifyUser(id, userData);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error al actualizar el usuario");
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const user = await userRepository.removeUser(id);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error al eliminar el usuario");
    }
  }
}
