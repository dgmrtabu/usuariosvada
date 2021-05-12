const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    const errorsValidation = validationResult(req);

    if (!errorsValidation.isEmpty()) {
        return res.status(400).json(errorsValidation);
    }

    next();
};

module.exports = {
    validarCampos
};