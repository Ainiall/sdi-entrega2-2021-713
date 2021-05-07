// Utilidades
const {logger} = require('../modules/logger');
let utils = require('../utils/utils');

/**
 * Router que nos permite manejar la API
 *
 * @param app Aplicación sobre la que actúa
 * @param gestorBD Nexo de unión con la base de datos
 */
module.exports = function (app, gestorBD) {
    /**
     * Identificación de usuarios por Token por login
     */
    app.post('/api/autenticar', function (req, res) {
        let seguro = app.get('crypto').createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now() / 1000}, 'secreto');
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                })
            }
        });
    });

    /**
     * Obtención del listado de ofertas de otros usuarios
     */
    app.get('/api/ofertas', function (req, res) {
        logger.info('Acceso API listado de ofertas');
        let criterio = {'vendedor': {$not: {$regex: res.usuario}}};
        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.error('Error al obtener el listado de ofertas via API');
                res.status(500);
                res.json({error: 'Se ha producido un error al obtener las ofertas'})
            } else {
                logger.info('Listado de ofertas obtenido via API');
                res.status(200);
                res.send(JSON.stringify(ofertas));
            }
        });
    });

    /**
     * Obtención de un chat de una oferta determinada por parámetro
     */
    app.get('/api/chat/:ofertaId', function (req, res) {
        logger.info('Acceso API chat oferta' + req.params.ofertaId);
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.ofertaId)}
        let criterioChat = {
            $and: [{
                'ofertaId': gestorBD.mongo.ObjectID(req.params.ofertaId)
            },
                {'autor': res.usuario}]
        }

        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.error('Error al obtener la oferta' + req.params.ofertaId);
                res.status(500);
                res.json({error: 'Se ha producido un error al obtener las ofertas'})
            } else {
                if(ofertas[0].vendida){
                    logger.error('No se puede tener chats de ofertas vendidas' + req.params.ofertaId);
                    res.status(500);
                    res.json({error: 'No se pueden tener chats de ofertas vendidas'})
                }else{
                    gestorBD.obtenerMensajes(criterioChat, function (mensajes) {
                        if (mensajes === null) {
                            logger.error('Error al obtener los mensajes');
                            res.status(500);
                            res.json({error: 'Se ha producido un error al obtener los mensajes'})
                        } else {
                            logger.info('Chat obtenido a través de la API:' + req.params.ofertaId);
                            res.status(200);
                            res.send(JSON.stringify(ofertas[0], mensajes));
                        }
                    });
                }
            }
        });
    });

    /**
     * Inserción de mensajes en un chat de una oferta determinada por parámetro
     */
    app.post('/api/mensaje/:ofertaId', function (req, res) {
        let ofertaId = gestorBD.mongo.ObjectID(req.params.ofertaId);
        let mensaje = {
            autor: res.usuario,
            texto: req.body.texto,
            ofertaId: ofertaId,
            fecha: new Date().toISOString().slice(0, 10),
            leido: false
        }

        utils.validar(mensaje, ofertaId, res.usuario, function (errors) {
            if (errors !== null && errors.length > 0) {
                res.status(403);
                res.json({errores: errors})
            } else {
                gestorBD.insertarMensaje(mensaje, function (id) {
                    if (id == null) {
                        logger.error('Error al insertar el mensaje');
                        errors.push('Se ha producido un error');
                        res.status(500);
                        res.json({errores: errors})
                    } else {
                        logger.info('Mensaje insertado' + id);
                        res.status(201);
                        res.json({mensaje: 'Mensaje insertado', _id: id})
                    }
                });
            }
        });
    });

    /**
     * Eliminación de un chat de una oferta determinada por parámetro
     */
    app.delete('/api/chat/:id', function (req, res) {
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.id)}
        let oferta_id = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = res.usuario;

        // TODO cambiar
        let errors = new Array();
        esVendedor(usuario, oferta_id, function (isAutor) {
            if (isAutor) {
                gestorBD.eliminarOferta(criterio, function (ofertas) {
                    if (ofertas == null) {
                        res.status(500);
                        errors.push('Se ha producido un error al eliminar la oferta');
                        res.json({errores: errors})
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(ofertas));
                    }
                });
            } else {
                res.status(403);
                errors.push('El usuario no es el vendedor de la oferta que intenta eliminar')
                res.json({errores: errors})
            }
        })
    });


    function validar(mensaje, ofertaID, usuario, funcionCallback) {
        let errors = [];

        // longitud máxima, no vacío
        if (mensaje.texto === null || typeof mensaje.texto === 'undefined'
            || mensaje.texto.trim() === '') {
            errors.push('El mensaje no puede  estar vacio');
        } else if (mensaje.texto.length > 50) {
            errors.push('El mensaje no puede tener más de 50 caracteres');
        } else {
            let criterio = {'_id': ofertaID};
            gestorBD.obtenerOfertas(criterio, function (ofertas) {
                if (ofertas == null) {
                    errors.push('La oferta a la que quiere enviar un mensaje no existe');
                } else {
                    if (ofertas[0].vendida) {
                        errors.push('La oferta ya está vendia');
                    }
                    if (ofertas[0].autor === usuario) {
                        errors.push('No se puede mensajear a uno mismo');
                    }
                }
            });
        }
        if (errors.length > 0) {
            funcionCallback(errors);
        } else {
            funcionCallback(null);
        }
    }
}