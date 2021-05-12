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

        gestorBD.obtenerPg('ofertas', criterio, pg, function (ofertas, total) {
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
                        actual: pg,
                        busqueda: req.query.busqueda
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
    app.post('/ofertas', function (req, res, next) {
        let oferta = {
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            fecha: new Date().toISOString().slice(0, 10),
            precio: parseFloat(req.body.precio),
            vendedor: req.session.usuario,
            comprador: null,
            destacada: req.body.destacada
        }
        let criterio = {'email': req.session.usuario}
        gestorBD.obtener('usuarios', criterio, function (usuarios) {
            if (usuarios === null) {
                utils.manejoErrores('Error al obtener usuario actual de la BBDD:' + req.session.usuario,
                    'Error al obtener datos del usuario actual de la BBDD', next);
            } else {
                if (utils.validarAgregarOferta(res, oferta, usuarios[0])) {
                    gestorBD.insertar('ofertas', oferta, function (id) {
                        if (id == null) {
                            utils.manejoErrores('Error al crear una nueva oferta por usuario:' + req.session.usuario,
                                'Error al insertar la oferta', next);
                        } else {
                            gestorBD.modificar('usuarios', criterio, usuarios[0], function (result) {
                                if (result === null) {
                                    utils.manejoErrores('Error al actualizar el dinero del usuario:' + req.session.usuario,
                                        'Error al actualizar el dinero del usuario', next);
                                } else {
                                    req.session.dinero = usuarios[0].dinero;
                                    logger.info('Nueva oferta creada por usuario:' + req.session.usuario);
                                    res.redirect('/ofertas/mis-ofertas?mensaje=Oferta agregada');
                                }
                            })

                        }
                    });
                }
            }
        })

    });

    /**
     * Listado de ofertas propias
     */
    app.get('/ofertas/mis-ofertas', function (req, res, next) {
        logger.info('Acceso a la página de ofertas propias');
        let criterio = {vendedor: req.session.usuario};
        gestorBD.obtener('ofertas', criterio, function (ofertas) {
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
        gestorBD.obtener('ofertas', criterio, function (ofertas) {
            if (ofertas === null) {
                utils.manejoErrores('Error al obtener ofertas propias',
                    'Error al obtener ofertas propias', next);
            } else {
                if (utils.validarEliminarOferta(ofertas[0].vendedor, req.session.usuario,
                    ofertas[0].comprador, req.params.id, next)) {
                    gestorBD.eliminar('ofertas', criterio, function (ofertas) {
                        if (ofertas == null) {
                            utils.manejoErrores('Error al eliminar una oferta',
                                'Error al eliminar la oferta.', next);
                        } else {
                            let criterio = {'ofertaId': req.params.id}
                            gestorBD.eliminarChats(criterio, function (chats){
                                if(chats === null){
                                    utils.manejoErrores('Error al eliminar chats de la oferta'
                                        + req.params.id, 'Error al eliminar la oferta.', next);
                                }else{
                                    logger.info('Oferta eliminada: ' + req.params.id)
                                    res.redirect('/ofertas/mis-ofertas?mensaje=Oferta eliminada');
                                }
                            } );
                        }
                    });
                }
            }
        });
    });

    /**
     * Compra de una oferta
     * En cada paso se realizan comprobaciones que podrían asumirse
     */
    app.get('/ofertas/comprar/:id', function (req, res, next) {
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.id)}
        let origen =  req.get('Referrer').replace('https://localhost:8081/','');
        // la oferta debe existir
        gestorBD.obtener('ofertas', criterio, function (ofertas) {
            if (ofertas === null) {
                utils.manejoErrores('Intento de compra de oferta inexistente:' + req.params.id,
                    'No se puede comprar una oferta inexistente', next);
            } else {
                if (utils.validarCompra(ofertas[0].vendedor, req.session.usuario, ofertas[0].comprador,
                    req.params.id, next)) {

                    // el comprador debe existir
                    let criterio2 = {'email': req.session.usuario}
                    gestorBD.obtener('usuarios', criterio2, function (usuarios) {
                        if (usuarios === null) {
                            utils.manejoErrores('Error usuario vendedor inexistente: ' + req.session.usuario,
                                'Usuario vendedor inexistente', next);
                        } else {
                            // no se puede comprar si el saldo es menor -> informar al usuario
                            if (usuarios[0].dinero < ofertas[0].precio) {
                                utils.manejoAvisos(res, 'Intento de compra de una oferta con salgo ' +
                                    'insuficiente por:' + req.session.usuario, origen, 'Saldo ' +
                                    'insuficiente. No se puede comprar la oferta seleccionada');
                            } else {
                                // modificar el estado como vendido
                                let oferta = {'comprador': req.session.usuario}
                                gestorBD.modificar('ofertas', criterio, oferta, function (comprador) {
                                    if (comprador == null) {
                                        utils.manejoErrores('Error al actualizar la oferta',
                                            'Error al actualizar la oferta', next);
                                    } else {
                                        logger.info('Estado de la oferta ' + req.params.id +
                                            'actualizado');
                                        let criterioComprador = {'_id': usuarios[0]._id}
                                        let saldo = Math.round((usuarios[0].dinero - ofertas[0].precio + Number.EPSILON) * 100) / 100;
                                        let usuario = {'dinero': saldo}
                                        // modificar precio comprador
                                        gestorBD.modificar('usuarios', criterioComprador, usuario,
                                            function (usuarios) {
                                                if (usuarios === null) {
                                                    utils.manejoErrores('Error al actualizar el comprador',
                                                        'Error al actualizar el comprador', next);
                                                } else {
                                                    // obtener vendedor
                                                    let criterioVendedor = {'email': ofertas[0].vendedor}
                                                    gestorBD.obtener('usuarios', criterioVendedor, function (vendedor) {
                                                        if (vendedor === null) {
                                                            utils.manejoErrores('Error al obtener el vendedor',
                                                                'Error al obtener el comprador', next);
                                                        } else {
                                                            let usuarioModificado = {'dinero': vendedor[0].dinero + ofertas[0].precio}
                                                            gestorBD.modificar('usuarios', criterioVendedor, usuarioModificado,
                                                                function (result) {
                                                                    if (result === null) {
                                                                        utils.manejoErrores('Error al actualizar el vendedor',
                                                                            'Error al actualizar el vendedor', next);
                                                                    } else {
                                                                        logger.info('Oferta comprada: ' + req.params.id +
                                                                            ' por usuario:' + req.session.usuario);

                                                                        req.session.dinero = saldo;
                                                                        res.redirect('/ofertas/mis-compras?mensaje=Oferta comprada')
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
        });
    });

    /**
     * Listado de compras realizadas
     */
    app.get('/ofertas/mis-compras', function (req, res, next) {
        let criterio = {'comprador': req.session.usuario};
        gestorBD.obtener('ofertas', criterio, function (ofertas) {
                if (ofertas == null) {
                    utils.manejoErrores('Error al listar las compras del usuario: ' + req.session.usuario,
                        'Error al listar las compras del usuario', next);
                } else {
                    logger.info('Compras obtenidas de usuario: ' + req.session.usuario);
                    let respuesta = swig.renderFile('views/bcompras.html',
                        {
                            compras: utils.filtrarCompras(ofertas),
                            usuario: req.session.usuario,
                            dinero: req.session.dinero,
                            rol: req.session.rol
                        });
                    res.send(respuesta);
                }
            }
        );
    });

    /**
     * Listado de ofertas destacadas
     */
    app.get('/ofertas/destacadas', function (req, res, next) {
        logger.info('Acceso a la página de ofertas destacadas');

        let criterio = {
            $and: [{'vendedor': {$not: {$regex: req.session.usuario}}},
                {'destacada': true}]
        };

        gestorBD.obtener('ofertas', criterio, function (ofertas) {
            if (ofertas == null) {
                utils.manejoErrores('Error al listar ofertas destacadas',
                    'Error al listar ofertas destacadas', next);
            } else {
                let respuesta = swig.renderFile('views/bdestacadas.html',
                    {
                        ofertas: utils.filtrarOfertas(ofertas),
                        usuario: req.session.usuario,
                        dinero: req.session.dinero,
                        rol: req.session.rol
                    });
                res.send(respuesta);
            }
        });
    });

    /**
     * Destacar ofertas propias
     */
    app.get('/ofertas/destacar/:id', function (req, res, next) {
        let criterio = {'email': req.session.usuario}
        gestorBD.obtener('usuarios', criterio, function (usuarios) {
            if (usuarios === null) {
                utils.manejoErrores('Error al obtener usuario actual de la BBDD:' + req.session.usuario,
                    'Error al obtener datos del usuario actual de la BBDD', next);
            } else {
                let criterio2 = {'_id': gestorBD.mongo.ObjectID(req.params.id)};
                gestorBD.obtener('ofertas', criterio2, function (ofertas) {
                    if (ofertas === null) {
                        utils.manejoErrores('Error al obtener oferta' + req.params.id,
                            'Error al obtener oferta', next);
                    } else {
                        if (utils.validarDestacarOferta(res, ofertas[0], usuarios[0], next)) {
                            gestorBD.modificar('usuarios', criterio, usuarios[0], function (result) {
                                if (result === null) {
                                    utils.manejoErrores('Error al actualizar el dinero del usuario:' + req.session.usuario,
                                        'Error al actualizar el dinero del usuario', next);
                                } else {
                                    gestorBD.modificar('ofertas', criterio2, ofertas[0], function (result) {
                                        if (result === null) {
                                            utils.manejoErrores('Error al actualizar la oferta destacada:' + ofertas[0]._id,
                                                'Error al actualizar la oferta destacada', next);
                                        } else {
                                            logger.info('Nueva oferta ' + ofertas[0] +
                                                'destacada por usuario:' + req.session.usuario);
                                            req.session.dinero = usuarios[0].dinero;
                                            res.redirect('/ofertas/mis-ofertas?mensaje=Oferta destacada');
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    app.get('/ofertas*', function (req, res) {
        res.redirect('/ofertas')
    });

};
