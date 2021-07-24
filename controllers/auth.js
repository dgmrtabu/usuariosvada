const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const usuario = require("../models/usuario");

const login = async(req, res = response) => {
    const { correo, password } = req.body;

    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos",
            });
        }
        //Si el usuario esta actiVo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Estado inactivos",
            });
        }

        // Verificar la contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            console.log(holas);
            return res.status(400).json({
                msg: "Contraseña incorrecta",
            });
        }

        //  Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador",
        });
    }
};

const googleSignin = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, correo, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                // Crear usuario
                nombre,
                correo,
                password: ":P",
                img,
                google: true,
            };
            usuario = new Usuario(data);
            await usuario.save();
        }
        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Hable con el administrador del sistema",
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        res.status(400).json({
            msg: "Token de Goolge no es valido",
        });
    }
};

module.exports = {
    login,
    googleSignin,
};