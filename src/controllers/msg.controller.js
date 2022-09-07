import { InternalServerError } from "../utils/errors.js";
import { read, write } from "../utils/index.js";
import path from 'path'
// import fs from 'fs'

let msgController = {
  GET: (req, res, next) => {
    try {
      let messages = read("msg");
      let users = read("users");

      messages = messages.map(i => {return {
        user: users.find(user => user.id == i.userId),
        ...i
      }})

      let {userId} = req.params;

      if(userId){
        return res.status(200).send(messages.filter(i => i.userId == userId))
      }

      res.status(200).send(JSON.stringify(messages));
    } catch (error) {
      return next(new InternalServerError(500, error.message))
    }
  },


  POST: (req, res, next) => {
    try {
      let { userId, title } = req.body;
      let messages = read("msg");
      const time = new Date()
      let newMsg = {}
      if(req.files?.title){
        let fileName = Date.now() + req.files?.title?.name.replace(/\s/g, "")
        req.files?.title.mv(path.join(process.cwd(), 'src', 'uploads', fileName))
        newMsg = {
          id: messages?.at(-1).id + 1,
          userId,
          title : fileName,
          type: "file",
          created_at: time.getHours() + ":" + time.getMinutes()
        };
      }else{
        newMsg = {
          id: messages?.at(-1).id + 1,
          userId,
          title,
          type: "txt",
          created_at: time.getHours() + ":" + time.getMinutes()
        };
      }
      messages.push(newMsg);
      write("msg", messages);
      return res.status(201).send({
        status: 201,
        message: "succes",
        data: newMsg,
      });
    } catch (error) {
      return next(new InternalServerError(500, error.message))
    }
  },

  DELETE: (req, res) => {
    try {
      let data = read("msg");
      let {userId} = req.params;
      if (userId) {
        data = data.filter((i) => i.id != userId);
      }
      write("msg", data);
      res.status(201).send(JSON.stringify({ status: 201, message: "message is deleted!" }));
    } catch (error) {
      return next(new InternalServerError(500, error.message))
    }
  },
};
export default msgController;