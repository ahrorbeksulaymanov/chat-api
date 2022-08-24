import sha256 from "sha256";
import { InternalServerError } from "../utils/errors.js";
import { read, write } from "../utils/index.js";
import jwt from "../utils/jwt.js";

let userController = {
  GET: (req, res, next) => {
    try {
      let users = read("users").filter(user => delete user.password);

      let {id} = req.params;

      if(id){
        return res.status(200).send(users.find(i => i.id == id))
      }

      res.status(200).send(JSON.stringify(users));
    } catch (error) {
      return next(new InternalServerError(500, error.message))
    }
  },

  POST: (req, res, next) => {
    try {
      let { userName, password, gender, contact } = req.body;
      let fileName = Date.now() + req.files.image.name.replace(/\s/g, "")

      let users = read("users");
      let newUser = {
        id: users?.at(-1).id + 1,
        userName,
        password: sha256(password),
        gender,
        contact,
        image: fileName
      };
      users.push(newUser);

      req.files.image.mv(path.join(process.cwd(), 'src', 'uploads', fileName))
      write("users", users);
      delete newUser.password
      return res.status(201).send({
        status: 201,
        message: "succes",
        data: newUser,
        token: jwt.sign({ id: newUser.id }),
      });
    } catch (error) {
      return next(new InternalServerError(500, error.message))
    }
  },

  PUT: (req, res, next) => {
    try {
      let data = read("users");
      const { userName, password, gender, contact } = req.body;
      let {id} = req.params;
      let newData = {};
      if (id) {
        newData = data.find((item) => item.id == id);
        newData.userName = userName ? userName : newData.userName;
        newData.gender = gender ? gender : newData.gender;
        newData.contact = contact ? contact : newData.contact;
        newData.password = password ? sha256(password) : newData.password;
        newData.id = id;
      }
      write("users", data);
      res.status(201).send(JSON.stringify({ status: 201, message: "user is edited!" }));
    } catch (error) {
      return next(new InternalServerError(500, error.message))
    }
  },

  DELETE: (req, res) => {
    try {
      let data = read("users");
      let {id} = req.params;
      if (id) {
        data = data.filter((i) => i.id != id);
      }
      write("users", data);
      res.status(201).send(JSON.stringify({ status: 201, message: "user is deleted!" }));
    } catch (error) {
      return next(new InternalServerError(500, error.message))
    }
  },
};
export default userController;
