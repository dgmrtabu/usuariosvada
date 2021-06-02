const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../model/usuario');

const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    /*     const usuarios = await Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const totalRegistros = await Usuario.countDocuments(query);

        APLICACION DE PROMESA PARA REALIZAR CONSULTA SIMULTANEA
     */

    const [totalRegistros, usuarios] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        totalRegistros,
        usuarios,
        // resp
    });
};

const usuariosPost = async(req = request, res = response) => {

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

const usuariosPut = async(req = request, res = response) => {

    const { usuarioId } = req.params;

    const { _id, password, google, correo, ...lodemas } = req.body;

    // Validando base de datos
    if (password) {
        //Encriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        lodemas.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(usuarioId, lodemas);

    res.json(usuario);
};

const usuariosDelete = async(req = request , res = response) => {

    const { usuarioId } = req.params;


    const usuario = await Usuario.findByIdAndUpdate(usuarioId, { estado: false });
    const usuarioAutenticado = req.usuario;

    res.json({usuario,usuarioAutenticado});
}

const usuariosPatch = (req = request, res = response) => {
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
};