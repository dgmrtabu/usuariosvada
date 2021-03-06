const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const {
    crearProducto,
    actualizarProducto,
    borrarProducto,
    obtenerProductos,
    obtenerProducto,

} = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

/*{{url/api/categorias}}*/

// Obtener todas las categorias - publico
router.get('/', obtenerProductos);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto);

// Obtener una categoria por id - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de MongoDB').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un id de MongoDB').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar - privado - cualquier persona con un token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;