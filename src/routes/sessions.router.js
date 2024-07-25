import express from "express";
const router = express.Router();
import UsuarioModel from "../models/usuario.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";

import jwt from "jsonwebtoken";

//login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const usuario = await UsuarioModel.findOne({ email: email });
      
    if (usuario) {
      //if (usuario.password === password) {
      if (isValidPassword(password, usuario)) {
        //*********CON SESSIONS *******/
        //*****************************/
        req.session.login = true;
        req.session.user = {
          email: usuario.email,
          first_name: usuario.first_name,
          last_name: usuario.last_name,
          role: usuario.role,
        };

        const token = jwt.sign(
          {
            usuario: usuario.email,
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            role: usuario.role,
            idCart: usuario.carts,
          },
          "coderhouse",
          { expiresIn: "1h" }
        );

        res.cookie("coderCookieToken", token, {
          maxAge: 3600000,
          httpOnly: true,
        });

        res.redirect("/api/products");
      } else {
        res.status(401).send("contraseña no valida");
      }
    } else {
      res.status(404).send("usuario no encontrado");
    }
  } catch (error) {
    res.status(400).send("error en el login");
  }
});

//logout

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.clearCookie("coderCookieToken");
  res.redirect("/login");
});

export default router;
