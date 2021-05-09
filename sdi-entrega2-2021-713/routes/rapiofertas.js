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

        gestorBD.obtener('usuarios', criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                let token = app.get('jwt').sign(
                    {
                        usuario: criterio.email,
                        tiempo: Date.now() / 1000
                    }, 'secreto');
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
        gestorBD.obtener('ofertas', criterio, function (ofertas) {
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
    app.get('/api/mensajes/:ofertaId', function (req, res) {
        logger.info('Acceso API chat oferta: ' + req.params.ofertaId);
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.ofertaId)}

        let criterioChat = {
            $and: [{
                'ofertaId': gestorBD.mongo.ObjectID(req.params.ofertaId)
            },
                {'interesado': res.usuario}]
        }

        gestorBD.obtener('ofertas', criterio, function (ofertas) {
            if (ofertas == null) {
                logger.error('Error al obtener la oferta' + req.params.ofertaId);
                res.status(500);
                res.json({error: 'Se ha producido un error al obtener las ofertas'})
            } else {
                gestorBD.obtener('chats', criterioChat, function (chats) {
                    if (chats === null || chats.length === 0) {
                        logger.error('Error al obtener el chat: Chat vacío');
                        res.status(500);
                        res.json({error: 'No hay mensajes en este chat'})
                    } else {
                        criterio = {chatId: chats[0]._id}
                        gestorBD.obtener('mensajes', criterio, function (mensajes) {
                            if (mensajes === null) {
                                logger.error('Error al obtener los mensajes');
                                res.status(500);
                                res.json({error: 'Se ha producido un error al obtener los mensajes'})
                            } else {
                                logger.info('Chat obtenido a través de la API:' + req.params.ofertaId);
                                res.status(200);
                                res.send(JSON.stringify(mensajes));
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * Inserción de mensajes en un chat de una oferta determinada por parámetro
     */
    app.post('/api/mensajes/:ofertaId', function (req, res, next) {
            let ofertaId = gestorBD.mongo.ObjectID(req.params.ofertaId);
            let chatId = null;

            let criterio = {'_id': ofertaId};

            gestorBD.obtener('ofertas', criterio, function (ofertas) {
                if (ofertas == null) {
                    utils.manejoErrores('Intento de mandar un mensaje a una oferta inexistente:' + ofertaId,
                        'La oferta a la que quiere enviar un mensaje no existe', next)
                } else {
                    if (ofertas[0].comprador !== null) {
                        utils.manejoErrores('Intento de mandar un mensaje a una oferta vendida:' + ofertaId,
                            'La oferta a la que quiere enviar un mensaje ya ha sido vendida', next)
                    } else {
                        let mensaje = {
                            interesado: res.usuario,
                            vendedor: ofertas[0].vendedor,
                            texto: req.body.texto,
                            chatId: chatId,
                            fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
                            leido: false
                        }

                        criterio = {
                            $and: [{'interesado': res.usuario},
                                {'vendedor': ofertas[0].vendedor},
                                {'ofertaId': ofertaId}]
                        };

                        gestorBD.obtener('chats', criterio, function (chats) {
                            if (chats === null || chats.length === 0) {
                                if (res.usuario === ofertas[0].vendedor) {
                                    utils.manejoErrores('Intento de mandar un mensaje a una oferta vendida:' + ofertaId,
                                        'La oferta a la que quiere enviar un mensaje ya ha sido vendida', next);
                                } else {
                                    let chat = {
                                        interesado: res.usuario,
                                        ofertaId: ofertaId,
                                        vendedor: ofertas[0].vendedor
                                    }
                                    gestorBD.insertar('chats', chat, function (id) {
                                        if (id === null) {
                                            logger.error('Error al insertar el chat');
                                            res.status(500);
                                            res.json({error: 'Se ha producido un error al insertar el chat'})
                                        } else {
                                            mensaje.chatId = id;
                                            insertarMensaje(req, res, ofertaId, mensaje);
                                        }
                                    });
                                }
                            } else {
                                mensaje.chatId = chats[0]._id;
                                insertarMensaje(req, res, ofertaId, mensaje);
                            }
                        });
                    }
                }
            });
        }
    );

    /**
     * Eliminación de un chat de una oferta determinada por parámetro
     */
    app.delete('/api/mensajes/:id', function (req, res) {
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.id)}
        let oferta_id = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = res.usuario;

        // TODO cambiar
        let errors = new Array();
        esVendedor(usuario, oferta_id, function (isAutor) {
            if (isAutor) {
                gestorBD.eliminar('ofertas', criterio, function (ofertas) {
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


    /**
     * Función auxiliar que inserta el mensaje
     */
    function insertarMensaje(req, res, ofertaId, mensaje) {
        utils.validarMensaje(mensaje, function (errors) {
            if (errors !== null && errors.length > 0) {
                logger.error('Errores de vaidación del comentario' + errors);
                res.status(403);
                res.json({errores: errors});
            } else {
                gestorBD.insertar('mensajes', mensaje, function (id) {
                    if (id == null) {
                        logger.error('Error al insertar el mensaje');
                        errors.push('Se ha producido un error');
                        res.status(500);
                        res.json({errores: errors})
                    } else {
                        logger.info('Mensaje insertado: ' + id);
                        res.status(201);
                        res.json({
                            mensaje: 'Mensaje insertado',
                            _id: id
                        })
                    }
                });
            }
        });
    }
};