import express from "express";
const router = express.Router();
import UserController from "../controller/user.controller.js";
const userController = new UserController();
import passport from "passport";

//ruta Post para generar un usuario y almacenarlo en mongodb
router.get("/", userController.getAllUsers);
router.get("/admin",passport.authenticate("jwt", { session: false }),async (req, res) => {
  
    if (req.user.role !== "admin") {
      return res.status(403).send("Acceso Denegado");
    }
    res.render("admin");
  }
);  
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.post("/",userController.createUser); 
router.delete("/:id", userController.deleteUser);




export default router;
