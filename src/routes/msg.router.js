import { Router } from "express";
import msgController from "../controllers/msg.controller.js";
import tokenCheck from "../middlewares/checkToken.js";

const msgRouter = Router();

msgRouter
  .route("/messages")
  .get(tokenCheck, msgController.GET)
  .post(tokenCheck, msgController.POST)

msgRouter
  .route("/messages/:userId")
  .get(tokenCheck, msgController.GET)
  .delete(tokenCheck, msgController.DELETE);

export default msgRouter;
