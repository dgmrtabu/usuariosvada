const path = require('path');
const { response } = require('express');

const cargarArchivo = (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).send({ msg: 'No hay archivos que subir' });
        return;
    }

    const { archivo } = req.files;

    const uploadPath = path.join(__dirname, '../uploads/', archivo.name);

    archivo.mv(uploadPath, function(err) {
        if (err) {
            return res.status(500).json({ err });
        }

        res.json({ msg: 'El archivo se subio' + uploadPath });
    });
}

module.exports = {
    cargarArchivo
};