// Utilidades
const {logger} = require('../modules/logger');
let utils = require('../utils/utils');
/**
 * Router utilizado para reiniciar la base de datos con las pruebas
 * @param app Aplicación sobre la que actúa
 * @param swig Vista usada
 * @param gestorBD Nexo de unión con la base de datos
 */
module.exports = function (app, swig, gestorBD) {
    app.get('/test', function (req, res, next) {
        // Reiniciamos los usuarios
        gestorBD.eliminar('usuarios', {'rol': 'USUARIO'}, function (usuarios) {
            if (usuarios === null) {
                utils.manejoErrores('Error al intentar eliminar usuarios de la BBDD para las pruebas',
                    'Error al eliminar los usuarios de la base de datos', next);
            } else {
                //5 nuevos usuarios
                let usuarios = [
                    {
                        'email': 'test1@email.com',
                        'nombre': 'Michael',
                        'apellidos': 'Scott',
                        'password': 'a0fcffb4e8ff04f20c7ac02e890d365d8daf0439098b48d61fb0287fb83856ce',
                        'dinero': 123.8,
                        'rol': 'USUARIO'
                    },
                    {
                        'email': 'test2@email.com',
                        'nombre': 'Dwight ',
                        'apellidos': 'Schrute',
                        'password': 'a0fcffb4e8ff04f20c7ac02e890d365d8daf0439098b48d61fb0287fb83856ce',
                        'dinero': 100.8,
                        'rol': 'USUARIO'
                    },
                    {
                        'email': 'test3@email.com',
                        'nombre': 'Pam',
                        'apellidos': 'Beesley',
                        'password': 'a0fcffb4e8ff04f20c7ac02e890d365d8daf0439098b48d61fb0287fb83856ce',
                        'dinero': 149.7,
                        'rol': 'USUARIO'
                    },
                    {
                        'email': 'test4@email.com',
                        'nombre': 'Jim',
                        'apellidos': 'Halpert',
                        'password': 'a0fcffb4e8ff04f20c7ac02e890d365d8daf0439098b48d61fb0287fb83856ce',
                        'dinero': 49.5,
                        'rol': 'USUARIO'
                    },
                    {
                        'email': 'test5@email.com',
                        'nombre': 'Andy',
                        'apellidos': 'Bernard',
                        'password': 'a0fcffb4e8ff04f20c7ac02e890d365d8daf0439098b48d61fb0287fb83856ce',
                        'dinero': 36.2,
                        'rol': 'USUARIO'
                    },
                    {
                        'email': 'test6@email.com',
                        'nombre': 'Stanley',
                        'apellidos': 'Hudson',
                        'password': 'a0fcffb4e8ff04f20c7ac02e890d365d8daf0439098b48d61fb0287fb83856ce',
                        'dinero': 150.5,
                        'rol': 'USUARIO'
                    },
                    {
                        'email': 'test7@email.com',
                        'nombre': 'Phyllis',
                        'apellidos': 'Lapin-Vance',
                        'password': 'a0fcffb4e8ff04f20c7ac02e890d365d8daf0439098b48d61fb0287fb83856ce',
                        'dinero': 49.5,
                        'rol': 'USUARIO'
                    }
                ];
                // Se insertan los usuarios de prueba en la base de datos
                gestorBD.insertar('usuarios', usuarios, function (usuarios) {
                    if (usuarios === null) {
                        utils.manejoErrores('Error al insertar usuarios en la BBDD para las pruebas',
                            'Error al insertar usuarios', next);
                    } else {
                        logger.info('Usuarios insertados en la base de datos para las pruebas');
                    }
                });
            }
        });

        // Reiniciamos las ofertas
        gestorBD.eliminar('ofertas', {}, function (ofertas) {
            if (ofertas === null) {
                utils.manejoErrores('Error al eliminar ofertas de la BBDD para las pruebas',
                    'Error al eliminar ofertas', next);
            } else {
                let ofertas = [
                    // test1
                    // oferta 1
                    {
                        'titulo': 'Monitor 19 pulgadas',
                        'descripcion': 'Muy poco uso, esta como nuevo. El precio es negociable',
                        'fecha': '2021-05-07',
                        'precio': 5.0,
                        'vendedor': 'test1@email.com',
                        'comprador': 'test2@email.com',
                        'destacada': false
                    },
                    // oferta 2
                    {
                        'titulo': 'Aparador',
                        'descripcion': 'Lo vendo a la mitad de su precio',
                        'fecha': '2021-05-06',
                        'precio': 30.0,
                        'vendedor': 'test1@email.com',
                        'comprador': 'test4@email.com',
                        'destacada': false
                    },
                    // oferta 3
                    {
                        'titulo': 'TV Samsung',
                        'descripcion': 'No funciona. Disponible para piezas',
                        'fecha': '2021-05-05',
                        'precio': 10.3,
                        'vendedor': 'test1@email.com',
                        'comprador': 'test5@email.com',
                        'destacada': false
                    },
                    // test2
                    // oferta 4
                    {
                        'titulo': 'Zapatillas converse',
                        'descripcion': 'Muy poco uso. Talla 38.',
                        'fecha': '2021-05-06',
                        'precio': 15.3,
                        'vendedor': 'test2@email.com',
                        'comprador': 'test3@email.com',
                        'destacada': false
                    },
                    // oferta 5
                    {
                        'titulo': 'Libro El Principito',
                        'descripcion': 'Tapa blanda de bolsillo. Edición francesa',
                        'fecha': '2021-05-04',
                        'precio': 4.0,
                        'vendedor': 'test2@email.com',
                        'comprador': 'test4@email.com',
                        'destacada': false
                    },
                    // oferta 6
                    {
                        'titulo': 'Mesita de noche',
                        'descripcion': 'Comprada en Ikea hace 6 meses. Precio original 40 euros',
                        'fecha': '2021-05-01',
                        'precio': 20.5,
                        'vendedor': 'test2@email.com',
                        'comprador': null,
                        'destacada': false
                    },
                    // test3
                    // oferta 7
                    {
                        'titulo': 'Estuche Roxy',
                        'descripcion': 'Sin estrenar.Su precio original son 30 euros',
                        'fecha': '2021-05-06',
                        'precio': 9.5,
                        'vendedor': 'test3@email.com',
                        'comprador': 'test2@email.com',
                        'destacada': false
                    },
                    // oferta 8
                    {
                        'titulo': 'La Biblia',
                        'descripcion': 'Muy antigua. Perfecta para el coleccionismo',
                        'fecha': '2021-05-02',
                        'precio': 15.0,
                        'vendedor': 'test3@email.com',
                        'comprador': 'test4@email.com',
                        'destacada': false
                    },
                    // oferta 9
                    {
                        'titulo': 'Libros academia C2',
                        'descripcion': 'Usados para el examen Cambridge',
                        'fecha': '2021-05-02',
                        'precio': 50.5,
                        'vendedor': 'test3@email.com',
                        'comprador': 'test5@email.com',
                        'destacada': false
                    },
                    // test4
                    // oferta 10
                    {
                        'titulo': 'Esterilla',
                        'descripcion': 'La vendo porque me he comprado una nueva',
                        'fecha': '2021-05-07',
                        'precio': 4.5,
                        'vendedor': 'test4@email.com',
                        'comprador': 'test1@email.com',
                        'destacada': false
                    },
                    // oferta 11
                    {
                        'titulo': 'Mochila nevera playa',
                        'descripcion': 'Impermeable y con unos 7L de capacidad',
                        'fecha': '2021-05-03',
                        'precio': 10.0,
                        'vendedor': 'test4@email.com',
                        'comprador': 'test3@email.com',
                        'destacada': false
                    },
                    // oferta 12
                    {
                        'titulo': 'Portatil Sony Vaio',
                        'descripcion': 'Funciona perfectamente, aunque va un poco lento',
                        'fecha': '2021-05-01',
                        'precio': 150.0,
                        'vendedor': 'test4@email.com',
                        'comprador': null,
                        'destacada': true
                    },
                    // test5
                    // oferta 13
                    {
                        'titulo': 'Iphone 8 64',
                        'descripcion': 'Sin estrenar.Su precio original son 30 euros',
                        'fecha': '2021-05-03',
                        'precio': 160.5,
                        'vendedor': 'test5@email.com',
                        'comprador': null,
                        'destacada': true
                    },
                    // oferta 14
                    {
                        'titulo': 'Google Home',
                        'descripcion': 'Totalmente nuevo. Me lo dieron en un sorteo, sin usar',
                        'fecha': '2021-05-05',
                        'precio': 20.0,
                        'vendedor': 'test5@email.com',
                        'comprador': null,
                        'destacada': false
                    },
                    // oferta 15
                    {
                        'titulo': 'Taburete con ruedas',
                        'descripcion': 'Giratorio y regulable en altura',
                        'fecha': '2021-05-01',
                        'precio': 17.0,
                        'vendedor': 'test5@email.com',
                        'comprador': 'test1@email.com',
                        'destacada': false
                    },
                    // oferta 16
                    {
                        'titulo': 'Producto para test',
                        'descripcion': 'Producto superior saldo',
                        'fecha': '2021-05-07',
                        'precio': 500.8,
                        'vendedor': 'test5@email.com',
                        'comprador': null,
                        'destacada': false
                    },
                    // test6
                    // oferta 17
                    {
                        'titulo': 'Monitor 27 pulgadas',
                        'descripcion': 'full hd gaming',
                        'fecha': '2021-05-07',
                        'precio': 90.0,
                        'vendedor': 'test6@email.com',
                        'comprador': 'test7@email.com',
                        'destacada': false
                    },
                    // oferta 18
                    {
                        'titulo': 'TV 43 Pulgadas',
                        'descripcion': 'Smart TV lg',
                        'fecha': '2021-05-06',
                        'precio': 150.0,
                        'vendedor': 'test6@email.com',
                        'comprador': null,
                        'destacada': false
                    },
                    // oferta 19
                    {
                        'titulo': 'Flexo Ikea',
                        'descripcion': 'Con un pequeño golpe',
                        'fecha': '2021-05-05',
                        'precio': 5.5,
                        'vendedor': 'test6@email.com',
                        'comprador': 'test7@email.com',
                        'destacada': false
                    },
                    // test7
                    // oferta 20
                    {
                        'titulo': 'Pijama',
                        'descripcion': 'Marca Asos talla S',
                        'fecha': '2021-05-04',
                        'precio': 10.0,
                        'vendedor': 'test7@email.com',
                        'comprador': 'test6@email.com',
                        'destacada': false
                    },
                    // oferta 21
                    {
                        'titulo': 'Patines en linea',
                        'descripcion': 'Talla 37 poco uso',
                        'fecha': '2021-05-06',
                        'precio': 35.0,
                        'vendedor': 'test7@email.com',
                        'comprador': 'test6@email.com',
                        'destacada': false
                    },
                    // oferta 22
                    {
                        'titulo': 'Libro 1984',
                        'descripcion': 'Tapa blanda',
                        'fecha': '2021-05-06',
                        'precio': 7.5,
                        'vendedor': 'test7@email.com',
                        'comprador': null,
                        'destacada': false
                    },
                    // oferta 23
                    {
                        'titulo': 'precio justo',
                        'descripcion': 'Producto saldo 0 test5',
                        'fecha': '2021-05-07',
                        'precio': 28.7,
                        'vendedor': 'test7@email.com',
                        'comprador': null,
                        'destacada': false
                    }
                ];
                // Se insertan las ofertas y compras de prueba en la base de datos
                gestorBD.insertar('ofertas', ofertas, function (ofertas) {
                    if (ofertas === null) {
                        utils.manejoErrores('Error al insertar ofertas en la BBDD para las pruebas',
                            'Error al insertar usuarios', next);
                    } else {
                        logger.info('Ofertas insertadas en la base de datos para las pruebas');
                    }
                });

            }
        });

        //Reiniciamos los mensajes
        gestorBD.eliminar('mensajes', {}, function (mensajes) {
            if (mensajes === null) {
                utils.manejoErrores('Error al eliminar ofertas de la BBDD para las pruebas',
                    'Error al eliminar ofertas', next);
            } else {
                gestorBD.obtener('ofertas', {}, function (ofertas) {
                    if (ofertas === null) {
                        utils.manejoErrores('Error al obtener ofertas de la BBDD para las pruebas',
                            'Error al obtener ofertas', next);
                    } else {
                        let ofertaId = [];
                        for (let i = 0; i < ofertas.length; i++) {
                            ofertaId.push(ofertas[i]._id);
                        }

                        // Creación de chats

                        let chats = [
                            // chat 1-> oferta1 test1 y test2
                            {
                                'interesado': 'test2@email.com',
                                'ofertaId': ofertaId[0],
                                'vendedor': 'test1@email.com'
                            },
                            // chat 2-> oferta 2: test1 y test4
                            {
                                'interesado': 'test2@email.com',
                                'ofertaId': ofertaId[1],
                                'vendedor': 'test1@email.com'
                            },
                            // chat 3-> oferta 3: test1 y test5
                            {
                                'interesado': 'test2@email.com',
                                'ofertaId': ofertaId[2],
                                'vendedor': 'test1@email.com'
                            },
                            //oferta 4: test2 y test3
                            {
                                'interesado': 'test3@email.com',
                                'ofertaId': ofertaId[3],
                                'vendedor': 'test2@email.com'
                            },
                            //oferta 5: test2 y test4
                            {
                                'interesado': 'test4@email.com',
                                'ofertaId': ofertaId[4],
                                'vendedor': 'test5@email.com'
                            },
                            //oferta 6: test2 y test5
                            {
                                'interesado': 'test5@email.com',
                                'ofertaId': ofertaId[5],
                                'vendedor': 'test2@email.com'
                            },
                            //oferta 7: test3 y test2
                            {
                                'interesado': 'test2@email.com',
                                'ofertaId': ofertaId[6],
                                'vendedor': 'test3@email.com'
                            },
                            //oferta 8: test3 y test4
                            {
                                'interesado': 'test4@email.com',
                                'ofertaId': ofertaId[7],
                                'vendedor': 'test3@email.com'
                            },
                            //oferta 9: test3 y test5
                            {
                                'interesado': 'test5@email.com',
                                'ofertaId': ofertaId[8],
                                'vendedor': 'test3@email.com'
                            },
                            //oferta 10: test4 y test1
                            {
                                'interesado': 'test5@email.com',
                                'ofertaId': ofertaId[9],
                                'vendedor': 'test2@email.com'
                            },
                            //oferta 11: test4 y test3
                            {
                                'interesado': 'test3@email.com',
                                'ofertaId': ofertaId[10],
                                'vendedor': 'test4@email.com'
                            },
                            //oferta 12: test4 y test1
                            {
                                'interesado': 'test1@email.com',
                                'ofertaId': ofertaId[11],
                                'vendedor': 'test4@email.com'
                            },
                            //oferta 13: test5 y test2
                            {
                                'interesado': 'test2@email.com',
                                'ofertaId': ofertaId[12],
                                'vendedor': 'test5@email.com'
                            },
                            //oferta 14: test5 y test4
                            {
                                'interesado': 'test4@email.com',
                                'ofertaId': ofertaId[13],
                                'vendedor': 'test5@email.com'
                            },
                            //oferta 15: test5 y test1
                            {
                                'interesado': 'test1@email.com',
                                'ofertaId': ofertaId[14],
                                'vendedor': 'test5@email.com'
                            },
                            //oferta 16: test5 y test2
                            {
                                'interesado': 'test2@email.com',
                                'ofertaId': ofertaId[15],
                                'vendedor': 'test5@email.com'
                            },
                            //oferta 17: test6 y test7
                            {
                                'interesado': 'test7@email.com',
                                'ofertaId': ofertaId[16],
                                'vendedor': 'test6@email.com'
                            },
                            //oferta 18: test6 y test2
                            {
                                'interesado': 'test2@email.com',
                                'ofertaId': ofertaId[17],
                                'vendedor': 'test6@email.com'
                            },
                            //oferta 19: test6 y test7
                            {
                                'interesado': 'test7@email.com',
                                'ofertaId': ofertaId[18],
                                'vendedor': 'test6@email.com'
                            },
                            //oferta 20: test7 y test6
                            {
                                'interesado': 'test6@email.com',
                                'ofertaId': ofertaId[19],
                                'vendedor': 'test7@email.com'
                            },
                            //oferta 21: test7 y test6
                            {
                                'interesado': 'test6@email.com',
                                'ofertaId': ofertaId[20],
                                'vendedor': 'test7@email.com'
                            },
                            //oferta 22: test7 y test1
                            {
                                'interesado': 'test1@email.com',
                                'ofertaId': ofertaId[21],
                                'vendedor': 'test7@email.com'
                            },
                            //oferta 23: test7 y test3
                            {
                                'interesado': 'test3@email.com',
                                'ofertaId': ofertaId[22],
                                'vendedor': 'test7@email.com'
                            }
                        ];
                        // Se insertan los chats de prueba en la base de datos
                        gestorBD.insertar('chats', chats, function (chats) {
                            if (chats === null) {
                                utils.manejoErrores('Error al insertar chats en la BBDD para las pruebas',
                                    'Error al insertar usuarios', next);
                            } else {
                                logger.info('Chats insertados en la base de datos para las pruebas');
                            }
                        });

                        // Obtenemos los chats
                        gestorBD.obtener('chats', {}, function (chats) {
                            if (chats === null) {
                                utils.manejoErrores('Error al obtener los chats de la BBDD para las pruebas',
                                    'Error al obtener chats', next);
                            } else {
                                let chatId = [];
                                for (let i = 0; i < chats.length; i++) {
                                    chatId.push(chats[i]._id);
                                }

                                let mensajes = [
                                    //oferta 1: test1 y test2
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Me interesa ese producto',
                                        'chatId': chatId[0],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Te lo rebajo 2 euros',
                                        'chatId': chatId[0],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Ok, de acuerdo',
                                        'chatId': chatId[0],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Perfecto',
                                        'chatId': chatId[0],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 2: test1 y test4
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Eh, Michael, ¿cuánto pides por el aparador?',
                                        'chatId': chatId[1],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': '60 dólares, pero por ser tú te lo dejo en 30',
                                        'chatId': chatId[1],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'No la he visto más grande en la vida',
                                        'chatId': chatId[1],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Eso dijo ella',
                                        'chatId': chatId[1],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 3: test1 y test5
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': '¿Esta televisión es OLED?',
                                        'chatId': chatId[2],
                                        'fecha': '2021-05-10 17:01',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Sí, es de segunda generación',
                                        'chatId': chatId[2],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Vale, pues me la llevo',
                                        'chatId': chatId[2],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test1@email.com',
                                        'texto': 'Muy bien',
                                        'chatId': chatId[2],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': false
                                    },

                                    //oferta 4: test2 y test3
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': '¿Qué tallas tenéis?',
                                        'chatId': chatId[3],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'Sólo queda la 38',
                                        'chatId': chatId[3],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'La compro, es mi número',
                                        'chatId': chatId[3],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'Excelente',
                                        'chatId': chatId[3],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 5: test2 y test4
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'Dwight, no te voy a comprar El Principito',
                                        'chatId': chatId[4],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': '¿Por qué no?',
                                        'chatId': chatId[4],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'Porque está en francés, Dwight',
                                        'chatId': chatId[4],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'Hecho',
                                        'chatId': chatId[4],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 6: test2 y test5
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'Hola ¿qué tienes por aquí?',
                                        'chatId': chatId[5],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'Una estupenda mesita de noche',
                                        'chatId': chatId[5],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'No me interesa, la verdad',
                                        'chatId': chatId[5],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test2@email.com',
                                        'texto': 'Cierto, no te imagino leyendo un libro',
                                        'chatId': chatId[5],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 7: test3 y test2
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Necesito un estuche. Urgentemente',
                                        'chatId': chatId[6],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Sólo tengo este rosita de Roxy',
                                        'chatId': chatId[6],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Te lo compro, pero no se lo digas a nadie',
                                        'chatId': chatId[6],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'No te preocupes, me llevaré el secreto a la tumba',
                                        'chatId': chatId[6],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 8: test3 y test4
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Mi madre necesita una nueva Biblia',
                                        'chatId': chatId[7],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': '¿Y eso?',
                                        'chatId': chatId[7],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Bueno, es que ha abrazado la fé mormona',
                                        'chatId': chatId[7],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'De acuerdo, este es el precio ',
                                        'chatId': chatId[7],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 9: test3 y test5
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Necesito preparar el examen de Cambridge',
                                        'chatId': chatId[8],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Tenemos los libros a un módico precio',
                                        'chatId': chatId[8],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Para nada es módico, pero me los llevo',
                                        'chatId': chatId[8],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test5@email.com',
                                        'vendedor': 'test3@email.com',
                                        'texto': 'Un placer hacer negocios',
                                        'chatId': chatId[8],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 10: test4 y test1
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Esa esterilla, ¿está en venta?',
                                        'chatId': chatId[9],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Sí',
                                        'chatId': chatId[9],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Me la llevo',
                                        'chatId': chatId[9],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Perfecto, necesitaba deshacerme de ella',
                                        'chatId': chatId[9],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 11: test4 y test3
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Estoy buscando una mochila',
                                        'chatId': chatId[10],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Esta tiene 7L de capacidad y está rebajada',
                                        'chatId': chatId[10],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'La suerte me sonríe esta vez, la compro',
                                        'chatId': chatId[10],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Me alegro, espero que le sirva',
                                        'chatId': chatId[10],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 12: test4 y test1
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Necesito un portátil para navegar por Internet',
                                        'chatId': chatId[11],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Este es un poco lento, pero es barato',
                                        'chatId': chatId[11],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': '150 dólares es un precio elevado',
                                        'chatId': chatId[11],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test4@email.com',
                                        'texto': 'Pues nada, le enseñaré otros modelos',
                                        'chatId': chatId[11],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 13: test5 y test2
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': '¿Algún teléfono barato?',
                                        'chatId': chatId[12],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Dwight, tengo este Iphone nuevo',
                                        'chatId': chatId[12],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': '¿Y vender mi alma a Steve Jobs? Ni hablar',
                                        'chatId': chatId[12],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Me alegra ver que aún quedan hombres con principios',
                                        'chatId': chatId[12],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 14: test5 y test4
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Estaba buscando un sistema Alexa',
                                        'chatId': chatId[13],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'No tenemos Alexa, pero sí Google Home',
                                        'chatId': chatId[13],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'No, gracias, prefiero que Google no tenga mis datos',
                                        'chatId': chatId[13],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test4@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Como si Amazon los fuese a usar de forma distinta...',
                                        'chatId': chatId[13],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 15: test5 y test1
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Quiero un taburete para la barra del desayuno',
                                        'chatId': chatId[14],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Pues mira, este gira y además es de altura regulable',
                                        'chatId': chatId[14],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'De acuerdo, me lo quedo',
                                        'chatId': chatId[14],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Excelente',
                                        'chatId': chatId[14],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 16: test5 y test2
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Andy, deja de mandarme mensajes de testeo',
                                        'chatId': chatId[15],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Esto es un mensaje de prueba',
                                        'chatId': chatId[15],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Te he dicho que pares',
                                        'chatId': chatId[15],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test5@email.com',
                                        'texto': 'Esto es un mensaje de prueba',
                                        'chatId': chatId[15],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },
                                    //oferta 17: test6 y test7
                                    {
                                        'interesado': 'test7@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Me lo llevo',
                                        'chatId': chatId[16],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test7@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Espere que se lo prepare...',
                                        'chatId': chatId[16],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test7@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Rápido, tengo prisa',
                                        'chatId': chatId[16],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test7@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Aquí tiene',
                                        'chatId': chatId[16],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 18: test6 y test2
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'No sé si podré comprarlo...',
                                        'chatId': chatId[17],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Es el mejor momento para hacerlo',
                                        'chatId': chatId[17],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Ya, pero sigue siendo demasiado caro',
                                        'chatId': chatId[17],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test2@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Usted se lo pierde',
                                        'chatId': chatId[17],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 19: test6 y test7
                                    {
                                        'interesado': 'test7@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Tengo que llevarme esto también',
                                        'chatId': chatId[18],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test7@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': '¿Ve? Las prisas no son buenas',
                                        'chatId': chatId[18],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test7@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Venga, sí, dame los chicles',
                                        'chatId': chatId[18],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test7@email.com',
                                        'vendedor': 'test6@email.com',
                                        'texto': 'Que tenga buena tarde',
                                        'chatId': chatId[18],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 20: test7 y test6
                                    {
                                        'interesado': 'test6@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Esta vez quiero comprarle yo una cosa',
                                        'chatId': chatId[19],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test6@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Dígame',
                                        'chatId': chatId[19],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test6@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Necesito este sexador de pollos',
                                        'chatId': chatId[19],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test6@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Mmm...son cinco euros',
                                        'chatId': chatId[19],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 21: test7 y test6
                                    {
                                        'interesado': 'test6@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Hola, también necesito una maquinilla de afeitar',
                                        'chatId': chatId[20],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test6@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Esta Gillete es la mejor',
                                        'chatId': chatId[20],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test6@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Vale, pago con tarjeta',
                                        'chatId': chatId[20],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test6@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Perfecto',
                                        'chatId': chatId[20],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 22: test7 y test1
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Creo que no voy a contratar tu seguro',
                                        'chatId': chatId[21],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': '¿Por qué?',
                                        'chatId': chatId[21],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'No creo que me vaya a pasar nada nunca',
                                        'chatId': chatId[21],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test1@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Esperemos que así sea',
                                        'chatId': chatId[21],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    },

                                    //oferta 23: test7 y test3
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'No me convence esta aspiradora',
                                        'chatId': chatId[22],
                                        'fecha': '2021-05-10 17:02',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': '¿Y eso?',
                                        'chatId': chatId[22],
                                        'fecha': '2021-05-10 17:03',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'No funciona con Alexa',
                                        'chatId': chatId[22],
                                        'fecha': '2021-05-10 17:04',
                                        'leido': true
                                    },
                                    {
                                        'interesado': 'test3@email.com',
                                        'vendedor': 'test7@email.com',
                                        'texto': 'Quizás en e futuro...',
                                        'chatId': chatId[22],
                                        'fecha': '2021-05-10 17:05',
                                        'leido': false
                                    }
                                ];
                                // Se insertan los mensajes de prueba en la base de datos
                                gestorBD.insertar('mensajes', mensajes, function (mensajes) {
                                    if (mensajes === null) {
                                        utils.manejoErrores('Error al insertar mensajes en la BBDD para las pruebas',
                                            'Error al insertar usuarios', next);
                                    } else {
                                        logger.info('Mensajes insertados en la base de datos para las pruebas');
                                    }
                                });
                            }
                        });
                    }
                });

                // Cargamos la vista para mostrar mientras se cargan los datos
                // Este proceso puede durar varios minutos
                res.send(swig.renderFile('views/btest.html', {}));

            }
        });
    });
};
