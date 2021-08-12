const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');


const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'El Id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostarImagen)

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El Id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);
//], actualizarImagen);



module.exports = router;