import { Router } from "express";
import userController from "../controllers/user.controller.js";
import tokenCheck from "../middlewares/checkToken.js";

const router = Router();

router
  .route("/users")
  .get(tokenCheck, userController.GET)
  .post(tokenCheck, userController.POST)

router
  .route("/users/:id")
  .get(tokenCheck, userController.GET)
  .put(tokenCheck, userController.PUT)
  .delete(tokenCheck, userController.DELETE);

export default router;
