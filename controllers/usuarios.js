const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../model/usuario');

const usuariosGet = (req = request, res = response) => {
    const { q, nombre = 'No name', apikey, page = 1, limit = 10 } = req.query;
    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardando registro
    await usuario.save();

    res.json({
        usuario
    });
};

const usuariosPut = async(req, res = response) => {

    const { usuarioId } = req.params;

    const { _id, password, google, correo, ...lodemas } = req.body;

    // Validando base de datos
    if (password) {
        //Encriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        lodemas.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(usuarioId, lodemas);

    res.json({
        msg: 'put API - Controlador',
        usuario
    });
};

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - Controlador'
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    });
};


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}