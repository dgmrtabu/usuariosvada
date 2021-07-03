const { Usuario, Categoria, Producto } = require('../model');
const Role = require('../model/role');
// const Usuario = require('../model/usuario');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la DB`);
    }
};

//Verificar si el correo existe
const correoNoRepetido = async(correo = '') => {
    const correoIsNotRepeat = await Usuario.findOne({ correo });
    if (correoIsNotRepeat) {
        throw new Error(`El correo: ${correo}, ya está resgistrado`);
    }
};

// Verificar si el ID usuarios existe
const existeUsuarioPorId = async(idUsuario) => {
    const existeUsuario = await Usuario.findById(idUsuario);
    if (!existeUsuario) {
        throw new Error(`El id: ${idUsuario} no existe`);
    }
};

// Verificar si el ID categoria existe
const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id:${id} no existe`);
    }
};

// Verificar si el ID producto existe
const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id:${idProducto} no existe`);
    }
};


module.exports = {
    esRolValido,
    correoNoRepetido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
};