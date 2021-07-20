const { response } = require('express');
const { subirArchivo } = require('../helpers');

const cargarArchivo = async(req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).send({ msg: 'No hay archivos que subir' });
        return;
    }

    const nombreImagen = await subirArchivo(req.files);

    res.json({ nombreImagen });
};

module.exports = {
    cargarArchivo
};