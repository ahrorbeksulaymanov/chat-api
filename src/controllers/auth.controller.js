import { read, write } from "../utils/index.js";
import sha256 from "sha256";
import jwt from "../utils/jwt.js";
import path from 'path';
import { AuthorizationError, InternalServerError } from "../utils/errors.js";

let registerController = (req, res, next) => {
    try {
        let { userName, password, gender, role, contact, img } = req.body;
        let fileName = new Date() + req.files?.image?.name?.replace(/\s/g, "")
        let users = read("users");
        
        let newUser = {
          id: +users?.at(-1).id + 1 || 1,
          userName, password: sha256(password), gender, role, contact, image: fileName
        };
        users.push(newUser)
        req.files?.image?.mv(path.join(process.cwd(), 'src', 'uploads', fileName))
        write("users", users);
        delete newUser.password;
          return res.status(201).send({
              status: 201,
              message: "success",
              data: newUser,
              token: jwt.sign({id: newUser.id})
          });
      } catch (error) {
        next(new InternalServerError(500, error.message))
      }
};

let loginController = (req, res, next) => {
  try {
    let { userName, password } = req.body;
    let users = read("users");
    let user = users.find( user => user.userName == userName && user.password == sha256(password) );
    
    if(!user){
      return next(new AuthorizationError(401, "password or login is incorrect"))
    }
    delete user.password
    return res.status(200).send({
      status: 200,
      message: "ok",
      data: user,
      token: jwt.sign({id: user.id})
    });

  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
};

export { registerController, loginController };
