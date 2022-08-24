import { Router } from "express";
import roleController from "../controllers/role.controller.js";
import tokenCheck from "../middlewares/checkToken.js";

const roleRouter = Router()

roleRouter.route("/roles")
    .get( tokenCheck, roleController.GET )
    .post( tokenCheck, roleController.POST )
    .put( tokenCheck, roleController.PUT )
    .delete( tokenCheck, roleController.DELETE )

export default roleRouter;