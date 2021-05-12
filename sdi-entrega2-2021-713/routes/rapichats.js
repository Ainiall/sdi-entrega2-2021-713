// Utilidades
const {logger} = require('../modules/logger');
let utils = require('../utils/utils');

/**
 * Router que nos permite manejar la API de chats
 *
 * @param app Aplicación sobre la que actúa
 * @param gestorBD Nexo de unión con la base de datos
 */
module.exports = function (app, gestorBD) {

    /**
     * Obtención de un chat de una oferta determinada por parámetro
     */
    app.get('/api/mensajes/:ofertaId', function (req, res) {
        logger.info('Acceso API chat oferta: ' + req.params.ofertaId);
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.ofertaId)}

        let criterioChat = {
            $and: [{'ofertaId': gestorBD.mongo.ObjectID(req.params.ofertaId)},
                {$or: [{'vendedor': res.usuario}, {'interesado': res.usuario}]}]
        }

        gestorBD.obtener('ofertas', criterio, function (ofertas) {
            if (ofertas == null) {
                logger.error('Error al obtener la oferta' + req.params.ofertaId);
                res.status(500);
                res.json({error: 'Se ha producido un error al obtener las ofertas'});
            } else {
                gestorBD.obtener('chats', criterioChat, function (chats) {
                    if (chats === null) {
                        logger.error('Error al obtener el chat');
                        res.status(500);
                        res.json({error: 'Error al obtener el chat'});
                    } else if (chats.length === 0) {
                        logger.warn('No hay mensajes en este chat');
                        res.status(500);
                        res.json({error: 'El chat está vacío.Envía un mensaje para comenzar la conversación'});
                    } else {
                        criterio = {chatId: chats[0]._id}
                        gestorBD.obtener('mensajes', criterio, function (mensajes) {
                            if (mensajes === null) {
                                logger.error('Error al obtener los mensajes');
                                res.status(500);
                                res.json({error: 'Se ha producido un error al obtener los mensajes'})
                            } else {
                                logger.info('Chat obtenido a través de la API para la oferta:' + req.params.ofertaId);
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
     * Si no existe el chat se crea. Se crea en este momento para evitar tener chats sin
     * mensajes
     */
    app.post('/api/mensajes/:ofertaId', function (req, res) {
            let ofertaId = gestorBD.mongo.ObjectID(req.params.ofertaId);
            let criterio = {'_id': ofertaId};
            let interesado= req.body.interesado;
            gestorBD.obtener('ofertas', criterio, function (ofertas) {
                if (ofertas == null) {
                    logger.error('Error al obtener la oferta' + req.params.ofertaId);
                    res.status(500);
                    res.json({error: 'Se ha producido un error al obtener la oferta' + req.params.ofertaId})
                } else {
                    let mensaje = {
                        autor: res.usuario,
                        texto: req.body.texto,
                        chatId: null,
                        fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
                        leido: false
                    }
                    // para que puedan contestar ambos, si contesta el vendedor se recupera el usuario interesado
                    criterio = {
                        $and: [{'interesado': ofertas[0].vendedor !== res.usuario ? res.usuario : interesado},
                            {'vendedor': ofertas[0].vendedor},
                            {'ofertaId': ofertaId}]
                    };
                    // si no hay chat, el vendedor no puede iniciarlo
                    gestorBD.obtener('chats', criterio, function (chats) {
                        if (chats === null || chats.length === 0) {
                            if (res.usuario === ofertas[0].vendedor) {
                                logger.error('Error vendedor conversación consigo mismo' + res.usuario +
                                    " en la oferta: " + req.params.ofertaId);
                                res.status(500);
                                res.json({error: 'No se puede iniciar un chat en una oferta propia'});
                            } else {
                                crearChat(req, res, res.usuario, ofertas[0], mensaje);
                            }
                        } else {
                            mensaje.chatId = chats[0]._id;
                            insertarMensaje(req, res, ofertaId, mensaje);
                        }
                    });
                }
            });
        }
    );


    /**
     * Obtención del chats donde participa el usuario
     */
    app.get('/api/chats', function (req, res) {
        logger.info('Acceso API listado de chats');

        let criterio = {$or: [{'vendedor': res.usuario}, {'interesado': res.usuario}]}

        //se obtienen los chats donde participa el usuario actual
        gestorBD.obtener('chats', criterio, function (chats) {
            if (chats == null) {
                logger.error('Error al obtener el listado de chats vía API');
                res.status(500);
                res.json({error: 'Se ha producido un error al obtener los chats'})
            } else {
                logger.info('Listado de chats obtenido vía API');
                res.status(200);
                res.send(JSON.stringify(chats));
            }
        });
    });

    /**
     * Eliminación de un chat de una oferta determinada por parámetro
     */
    app.delete('/api/chats/:id', function (req, res) {
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.id)}
        let usuario = res.usuario;
        gestorBD.obtener('chats', criterio, function (chats) {
            if (chats === null) {
                logger.error('Error al obtener chat vía API' + req.params.id);
                res.status(500);
                res.json({error: 'Se ha producido un error al obtener el chat'})
            } else {
                if (utils.esInterlocutor(res, usuario, chats[0].vendedor, chats[0].interesado)) {
                    // elimina en cascada los mensajes también
                    gestorBD.eliminarChats(criterio, function (chats) {
                        if (chats == null) {
                            logger.error('Error al eliminar chat vía API' + req.params.id);
                            res.status(500);
                            res.json({error: 'Se ha producido un error al eliminar el chat'})
                        } else {
                            logger.info('Chat eliminado a través de la API: ' + req.params.id);
                            res.status(200);
                            res.send(JSON.stringify(chats));
                        }
                    });
                }
            }
        });
    });

    app.put('/api/mensajes/leido/:id', function (req, res) {
        let criterio = {'_id': gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtener('mensajes', criterio, function (mensajes) {
            if (mensajes === null) {
                logger.error('Error al obtener el mensaje');
                res.status(500);
                res.json({error: 'Se ha producido un error al obtener el mensaje'})
            } else {
                //se marcan como leidos si es del otro interlocutor
                if (mensajes[0].autor !== res.usuario) {
                    let mensajes = {'leido': true}
                    gestorBD.modificar('mensajes', criterio, mensajes, function (result) {
                        if (result === null) {
                            logger.error('Error al marcar como leídos los mensajes');
                            res.status(500);
                            res.json({error: 'Se ha producido un error al marcar un mensaje como leído'})
                        } else {
                            logger.info('Mensaje marcado como leído a través de la API: ' + req.params.id);
                            res.status(200);
                            res.send(JSON.stringify(result));
                        }
                    });
                }
            }
        });
    });

    /**
     * Indica el número de mensajes sin leer de un chat
     */
    app.get('/api/chats/notificacion/:id', function (req, res) {
        let criterio = {
            $and: [{'chatId': gestorBD.mongo.ObjectID(req.params.id)},
                {'autor': {$ne: res.usuario}}, {'leido': false}]
        }
        gestorBD.obtener('mensajes', criterio, function (mensajes) {
            if (mensajes === null) {
                logger.error('Error al obtener los mensajes sin leer del chat:' + req.params.id);
                res.status(500);
                res.json({
                    error: 'Se ha producido un error al obtener los mensajes no leídos del chat' +
                        ' seleccionado'
                })
            } else {
                logger.info('Notificaciones vía API obtenidas del chat: ' + req.params.id);
                res.status(200);
                res.send(JSON.stringify(mensajes.length));
            }
        });
    });

    /**
     * Función auxiliar que inserta el mensaje
     */
    function insertarMensaje(req, res, ofertaId, mensaje) {
        utils.validarMensaje(mensaje, function (errors) {
            if (errors !== null && errors.length > 0) {
                logger.error('Errores de vaidación del comentario' + errors);
                res.status(500);
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

    /**
     * Función auxiliar que crea el chat
     */
    function crearChat(req, res, usuario, oferta, mensaje) {
        let chat = {
            interesado: usuario,
            ofertaId: oferta._id,
            vendedor: oferta.vendedor,
            titulo: oferta.titulo
        }
        gestorBD.insertar('chats', chat, function (id) {
            if (id === null) {
                logger.error('Error al insertar el chat');
                res.status(500);
                res.json({error: 'Se ha producido un error al insertar el chat'})
            } else {
                mensaje.chatId = id;
                insertarMensaje(req, res, oferta._id, mensaje);
            }
        });
    }
}