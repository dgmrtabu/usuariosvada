const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../model/usuario');

const validarJWT = async(req= request, res= response, next) =>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }
    
    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        /*const payload = jwt.verify(token,process.env.SECRETORPRIVATEKEY)
        console.log(payload);*/
        //const usuario = await Usuario.findById(uid);

        req.uid = uid;

        next();

        } catch (error) {
            console.log(error);
            res.status(401).json({
                msg: 'Token no valido'
            });
        }

};

module.exports = {
    validarJWT
};