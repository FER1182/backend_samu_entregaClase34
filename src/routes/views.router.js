import express from "express";
const router = express.Router();

import { UserDTO } from "../user.dto.js";
import passport from "passport";
import  logger  from "../utils/logger.js";

router.get("/",(req, res) => {
 
  if (!req.user) {
    return res.redirect("/login");
  }
  res.redirect("/api/products");
});
router.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "admin") {
      res.render("chat", { titulo: "CHAT" });
    } else {
      res.send("No tiene acceso");
    }
  }
);
router.get("/contacto", (req, res) => {
  res.render("contacto");
});

router.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/api/products");
  }
  res.render("login");
});

router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.session.login) {
      return res.redirect("/login");
    }
    console.log(req.user);
    const user = new UserDTO(req.user);
    console.log(user);
    res.render("profile", { user: user });
  }
);

router.get('/loggerTest', (req, res) => {
  
  req.logger.fatal('mensaje de fatal');
  req.logger.error('mensaje de error');
  req.logger.warn('mensaje de warning');
  req.logger.info('mensaje de info');
  req.logger.http('mensaje de http');
  req.logger.debug('mensaje de debug');

  res.send('logs generados');
});

export default router;
