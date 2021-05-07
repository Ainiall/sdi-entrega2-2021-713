// Utilidades
const {logger} = require('../modules/logger');
let utils = require('../utils/utils');
/**
 * Router que nos permite manejar la funcionalidad de las ofertas
 *
 * @param app Aplicación sobre la que actúa
 * @param swig Vista usada
 * @param gestorBD Nexo de unión con la base de datos
 */
module.exports = function (app, swig, gestorBD) {
    /**
     * Obtiene el listado principal de ofertas.
     */
    app.get('/ofertas', function (req, res, next) {
        logger.info('Acceso al listado de ofertas principal')
        let criterio = {'vendedor': {$not: {$regex: req.session.usuario}}};
        if (req.query.busqueda != null) {
            criterio = {
                $and: [{
                    'titulo': {
                        $regex: '.*' + utils.esTexto(req.query.busqueda) + '.*',
                        '$options': 'i'
                    }
                }, {'vendedor': {$not: {$regex: req.session.usuario}}}]
            };
        }
        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }

        gestorBD.obtenerOfertasPg(criterio, pg, function (ofertas, total) {
            if (ofertas == null) {
                utils.manejoErrores('Error al listar todas las ofertas de otros usuarios',
                    'Error al listar todas las ofertas de otros usuarios.', next);

            } else {
                let ultimaPg = total / 5;
                if (total % 5 > 0) {// Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                let paginas = []; // paginas mostrar
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                let respuesta = swig.renderFile('views/bofertas.html',
                    {
                        usuario: req.session.usuario,
                        dinero: req.session.dinero,
                        rol: req.session.rol,
                        ofertas: utils.filtrarOfertas(ofertas),
                        paginas: paginas,
                        actual: pg
                    });
                logger.info('Listado de ofertas mostrado')
                res.send(respuesta);
            }
        });
    });

    /**
     * Redirige al formulario de agregar oferta
     */
    app.get('/ofertas/agregar', function (req, res) {
        logger.info('Acceso a la creación de ofertas');
        let respuesta = swig.renderFile('views/bagregar.html',
            {
                usuario: req.session.usuario,
                dinero: req.session.dinero,
                rol: req.session.rol
            });
        res.send(respuesta);
    });

    /**
     * Agregar ofertas nuevas
     */
    app.post('/oferta', function (req, res, next) {
        let oferta = {
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            fecha: new Date().toISOString().slice(0, 10),
            precio: req.body.precio,
            vendedor: req.session.usuario,
            vendida: false
        }
        // no puede tener precio negativo
        if (oferta.precio < 0 || utils.validarCampoVacio(req.body.precio)) {
            utils.manejoAvisos(res, 'Intento de creación de oferta con precio negativo:' + oferta.precio,
                'ofertas/agregar', 'El precio no puede ser negativo')
        } else {
            // no puede tener campos vacíos
            if (utils.validarCampoVacio(req.body.titulo) || utils.validarCampoVacio(req.body.descripcion)){
                utils.manejoAvisos(res, 'Intento de creación de oferta con campos vacíos o demasiado grandes',
                    'ofertas/agregar', 'Los campos no pueden estar vacíos ni tener más de 50' +
                    'caracteres');
            } else {
                gestorBD.insertarOferta(oferta, function (id) {
                    if (id == null) {
                        utils.manejoErrores('Error al crear una nueva oferta por usuario:' + req.session.usuario,
                            'Error al insertar la oferta', next);
                    } else {
                        logger.info('Nueva oferta creada por usuario:' + req.session.usuario);
                        res.redirect('/ofertas/mis-ofertas?mensaje=Oferta agregada');
                    }
                });
            }
        }
    });

    /**
     * Listado de ofertas propias
     */
    app.get('/ofertas/mis-ofertas', function (req, res, next) {
        logger.info('Acceso a la página de ofertas propias');
        let criterio = {vendedor: req.session.usuario};
        gestorBD.obtenerOfertasPropias(criterio, function (ofertas) {
            if (ofertas == null) {
                utils.manejoErrores('Error al listar ofertas propias',
                    'Error al listar ofertas propias', next);
            } else {
                let respuesta = swig.renderFile('views/bofertasPropias.html',
                    {
                        ofertas: utils.filtrarOfertasPropias(ofertas),
                        usuario: req.session.usuario,
                        dinero: req.session.dinero,
                        rol: req.session.rol
                    });
                res.send(respuesta);
            }
        });
    });

    /**
     * Eliminar ofertas propias
     */
    app.get('/ofertas/eliminar/:id', function (req, res, next) {
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas === null) {
                utils.manejoErrores('Error al obtener ofertas propias',
                    'Error al obtener ofertas propias', next);
            } else {
                //solo se pueden eliminar ofertas propias
                if (ofertas[0].vendedor === req.session.usuario) {
                    if (ofertas[0].vendida) {
                        utils.manejoErrores('Intento de eliminar una oferta ya vendida',
                            'No se puede eliminar una oferta ya vendida.',next);
                    } else {
                        gestorBD.eliminarOfertas(criterio, function (ofertas) {
                            if (ofertas == null) {
                                utils.manejoErrores('Error al eliminar una oferta',
                                    'Error al eliminar la oferta.',next);
                            } else {
                                let criterio = {'ofertaId': gestorBD.mongo.ObjectID(req.params.id)}
                                gestorBD.eliminarCompras(criterio, function(compras){
                                    if(compras === null){
                                        utils.manejoErrores('Error al eliminar compras asociadas',
                                            'Error al eliminar las compras asociadas.',next);
                                    }else{
                                        logger.info('Oferta eliminada: '+ req.params.id)
                                        res.redirect('/ofertas/mis-ofertas?mensaje=Oferta eliminada');
                                    }
                                });
                            }
                        });
                    }
                } else {
                    utils.manejoAvisos(res, 'Intento de eliminar una oferta que no le pertenece:'
                        + req.params.id, 'ofertas/mis-ofertas',
                        'No se puede eliminar una oferta de otra persona');
                }
            }
        });
    });

    /**
     * Compra de una oferta
     */
    app.get('/ofertas/comprar/:id', function (req, res, next) {
        let ofertaId = gestorBD.mongo.ObjectID(req.params.id)
        let criterio = {'_id': ofertaId}
        let usuario = req.session.usuario;
        let compra = {usuario: usuario, ofertaId: ofertaId}

        // la oferta debe existir
        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas === null) {
                utils.manejoErrores('Intento de compra de oferta inexistente:' + req.params.id,
                    'No se puede comprar una oferta inexistente', next);
            } else {
                // no puede comprarse una oferta propia
                if (ofertas[0].vendedor === req.session.usuario) {
                    utils.manejoErrores('Intento de compra de una oferta propia:' + req.params.id,
                        'No se puede comprar una oferta propia', next);
                } else {
                    //no se puede comprar una oferta ya vendida
                    if (ofertas[0].vendida) {
                        utils.manejoErrores('Intento de compra de una oferta vendida: ' + req.params.id,
                            'No se puede comprar una oferta ya vendida', next)
                    } else {
                        // el comprador debe existir
                        let criterio = {'email': req.session.usuario}
                        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                            if (usuarios === null) {
                                utils.manejoErrores('Error usuario vendedor inexistente: ' + req.session.usuario,
                                    'Usuario vendedor inexistente', next);
                            } else {
                                // no se puede comprar si el saldo es menor -> informar al usuario
                                if (usuarios[0].dinero < ofertas[0].precio) {
                                    utils.manejoAvisos(res, 'Intento de compra de una oferta con salgo ' +
                                        'insuficiente por:' + req.session.usuario, 'ofertas', 'Saldo ' +
                                        'insuficiente. No se puede comprar la oferta seleccionada');
                                } else {
                                    // modificar el estado como vendido
                                    let oferta = {vendida: true}
                                    gestorBD.modificarOferta(criterio, oferta, function (result) {
                                        if (result == null) {
                                            utils.manejoErrores('Error al actualizar la oferta',
                                                'Error al actualizar la oferta', next);
                                        } else {
                                            logger.info('Estado de la oferta ' + req.params.id +
                                                'actualizado');
                                            let criterioComprador = {'_id': usuarios[0]._id}
                                            let usuario = {'dinero': usuarios[0].dinero - ofertas[0].precio}
                                            // modificar precio comprador
                                            gestorBD.modificarUsuario(criterioComprador, usuario,
                                                function (result) {
                                                    if (result === null) {
                                                        utils.manejoErrores('Error al actualizar el comprador',
                                                            'Error al actualizar el comprador', next);
                                                    } else {
                                                        // obtener vendedor
                                                        let criterioVendedor = {'email': ofertas[0].vendedor}
                                                        gestorBD.obtenerUsuarios(criterioVendedor, function (usuarios) {
                                                            if (usuarios === null) {
                                                                utils.manejoErrores('Error al obtener el vendedor',
                                                                    'Error al obtener el comprador', next);
                                                            } else {
                                                                let usuarioModificado = {'dinero': usuarios[0].dinero + ofertas[0].precio}
                                                                gestorBD.modificarUsuario(criterioVendedor, usuarioModificado,
                                                                    function (result) {
                                                                        if (result === null) {
                                                                            utils.manejoErrores('Error al actualizar el vendedor',
                                                                                'Error al actualizar el vendedor', next);
                                                                        } else {
                                                                            gestorBD.insertarCompra(compra, function (result) {
                                                                                if (result === null) {
                                                                                    utils.manejoErrores('Error al insertar la compra',
                                                                                        'Error al insertar la compra', next);
                                                                                } else {
                                                                                    logger.info('Oferta comprada: ' + req.params.id +
                                                                                        ' por usuario:' + req.session.usuario);
                                                                                    req.session.dinero = usuarios[0].dinero;
                                                                                    res.redirect('/ofertas/mis-compras?mensaje=Oferta comprada')
                                                                                }
                                                                            })

                                                                        }
                                                                    });
                                                            }
                                                        });
                                                    }
                                                });

                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });
    });

    /**
     * Listado de compras realizadas
     */
    app.get('/ofertas/mis-compras', function (req, res, next) {
        let criterio = {'usuario': req.session.usuario};
        gestorBD.obtenerCompras(criterio, function (compras) {
            if (compras == null) {
                utils.manejoErrores('Error al listar las compras del usuario: ' + req.session.usuario,
                    'Error al listar las compras del usuario', next);
            } else {
                let ofertasCompradasIds = [];
                for (let i = 0; i < compras.length; i++) {
                    ofertasCompradasIds.push(compras[i].ofertaId);
                }
                let criterio = {'_id': {$in: ofertasCompradasIds}}
                gestorBD.obtenerOfertas(criterio, function (ofertas) {
                    logger.info('Compras obtenidas de usuario: ' + req.session.usuario);
                    let respuesta = swig.renderFile('views/bcompras.html',
                        {
                            compras: utils.filtrarCompras(ofertas),
                            usuario: req.session.usuario,
                            dinero: req.session.dinero,
                            rol: req.session.rol
                        });
                    res.send(respuesta);
                });
            }
        });
    });

    app.get('/ofertas*', function (req, res) {
        res.redirect('/ofertas')
    });

}
;
