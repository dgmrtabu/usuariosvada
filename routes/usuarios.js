const { Router } = require("express");
const { check } = require("express-validator");

const { esRolValido, correoNoRepetido, existeUsuarioPorId } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} = require("../controllers/usuarios");

const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio con mas de 6 caracteres').isLength({ min: 6 }),
    check('correo').custom(correoNoRepetido),
    // check('rol').custom((rol) => esRolValido(rol)),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.put('/:usuarioId', [
    check('usuarioId', 'No es un ID valido').isMongoId(),
    check('usuarioId').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.delete('/', usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router;