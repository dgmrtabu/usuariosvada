const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { crearCategoria, 
        obternerCategorias, 
        obternerCategoria, 
        actualizarCategoria,
        borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

/*{{url/api/categorias}}*/

// Obtener todas las categorias - publico
router.get('/', obternerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obternerCategoria);

// Obtener una categoria por id - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    
], actualizarCategoria);

// Borrar - privado - cualquier persona con un token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;