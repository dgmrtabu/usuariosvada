const { response, request } = require('express');
const { Producto } = require('../models');


// obternerCProductos - Paginado - total -populate
const obtenerProductos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [totalRegistros, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        totalRegistros,
        productos
    });
};

// Obtener Producto - Populate
const obtenerProducto = async(req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
};

const crearProducto = async(req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: body.nombre })

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        });
    }

    // Generando el Registro Producto

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    };

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);

};

// actualizarCategoria
const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    const { estado, usuario, ...dataProd } = req.body;

    if (dataProd.nombre) {
        dataProd.nombre = dataProd.nombre.toUpperCase();
    }


    dataProd.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, dataProd, { new: true });

    res.json(producto);
};

const borrarProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(productoBorrado);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}