const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models')

const cargarArchivo = async(req, res = response) => {

    try {

        //const nombreImagen = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombreImagen = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombreImagen });

    } catch (msg) {
        res.status(400).json({ msg });
    }

};

const actualizarImagen = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ((coleccion)) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el ID ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el ID ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
            break;
    }


    // Borrar imagenes previas
    if (modelo.img) {
        // hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
};

module.exports = {
    cargarArchivo,
    actualizarImagen
};