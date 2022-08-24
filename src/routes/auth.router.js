import { Router } from "express";
import {registerController, loginController} from "../controllers/auth.controller.js";
import validation from "../middlewares/validation.js";

const authRouter = Router()

authRouter.post( "/register", validation, registerController )
authRouter.post( "/login", validation, loginController )
    

export default authRouter;