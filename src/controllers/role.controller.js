import {read, write} from '../utils/index.js'


let roleController = {
    GET: (req, res) => {
        let data = read("roles");
        return res.status(200).send(JSON.stringify(data))
    },

    POST: (req, res) => {
        let data = read("roles");
        const { name } = req.body
        let newData = {};
        if(name){
            newData.name = name;
            newData.id = data.at(-1).id + 1 || 1
        }
        data.push(newData);
        write("roles", data);
        res.status(201).send(JSON.stringify({status: 201, message: "role created!"}))
    },

    PUT: (req, res) => {
        let data = read("roles");
        const { name, id } = req.body
        let newData = {};
        if(id){
            newData = data.find(item => item.id == id)
            newData.name = name ? name : newData.name;
            newData.id = id
        }
        write("roles", data);
        res.status(201).send(JSON.stringify({status: 201, message: "role is edited!"}))
    },

    DELETE: (req, res) => {
        let data = read("roles");
        const { id } = req.body
        if(id){
            data = data.filter(i => i.id != id)
        }
        write("roles", data);
        res.status(201).send(JSON.stringify({status: 201, message: "role is deleted!"}))
    }
}
export default roleController;