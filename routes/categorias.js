const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { crearCategoria } = require('../controllers/categorias');
const { validarJWT, validarCampos } = require('../middlewares');


const router = Router();

/*{{url/api/categorias}}*/

// Obtener todas las categorias - publico
router.get('/', (req, res) => {
    res.json('get');
});

// Obtener una categoria por id - publico
router.get('/:id', (req, res) => {
    res.json('get-id');
});

// Obtener una categoria por id - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', (req, res) => {
    res.json('put');
});

// Borrar - privado - cualquier persona con un token valido
router.delete('/:id', (req, res) => {
    res.json('delete');
});

module.exports = router;