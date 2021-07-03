const { response, request } = require('express');
const { Categoria, } = require('../model');

// obternerCategorias - Paginado - total -populate
const obternerCategorias = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [totalRegistros, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        totalRegistros,
        categorias
    });
};
// obternerCategoria - populate {}
const obternerCategoria = async(req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
};

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre} ya existe`
        });
    }

    //Generar el registro
    const data = {
        nombre,
        usuario: req.usuario._id
    };

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria);

};

// actualizarCategoria

const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;

    const { estado, usuario, ...dataCat } = req.body;

    console.log(estado, usuario, dataCat, "dataCat");

    dataCat.nombre = dataCat.nombre.toUpperCase();
    dataCat.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, dataCat, { new: true });
    console.log(categoria);

    res.json(categoria);
};

//borrarCategoria - estado:false

const borrarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(categoriaBorrada);
}

module.exports = {
    obternerCategorias,
    obternerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}