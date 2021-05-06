// Módulo logger para registrar acciones
const {logger} = require('../modules/logger');
let utils = require('../utils/utils');

/**
 * Router que maneja las acciones de los usuarios
 * @param app Aplicación sobre la que actúa
 * @param swig Vista usada
 * @param gestorBD Nexo de unión con la base de datos
 */
module.exports = function (app, swig, gestorBD) {
    /**
     * Acceso a la vista de registro
     */
    app.get('/registrarse', function (req, res) {
        logger.info('Acceso al formulario de registro');
        res.send(swig.renderFile('views/bregistro.html', {}));
    });

    /**
     * Acceso a la vista de identificación
     */
    app.get('/identificarse', function (req, res) {
        logger.info('Acceso al formulario de inicio de sesión');
        res.send(swig.renderFile('views/bidentificacion.html', {}));
    });

    /**
     * Desconexión de usuario y redirección al formulario de inicio de sesión
     */
    app.get('/desconectarse', function (req, res) {
        logger.info('Usuario desconectado:' + req.session.usuario);
        req.session.destroy();
        res.redirect('/identificarse');
    });

    /**
     * Registro de un usuario
     */
    app.post('/registrarse', function (req, res, next) {
        let seguro = app.get('crypto').createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let usuario = {
            email: req.body.email,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            password: seguro,
            dinero: 100.00,
            rol: 'USUARIO'
        }
        let criterio = {email: req.body.email, password: seguro}

        // las contraseñas deben coincidir
        if (req.body.password === req.body.password2) {
            // validaciones longitud email y @?
            if (req.body.password < 8) {
                utils.manejoAvisos(res, 'Contraseña introducida demasiado pequeña'
                    , 'registrarse', 'La contraseña debe tener 8 o más caracteres');
            } else {
                gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                    // email no existente en el sistema
                    if (usuarios == null || usuarios.length === 0) {
                        if (!utils.validarEmailFormato(req.body.email)) {
                            utils.manejoAvisos(res, 'El email introducido no tiene el formato ' +
                                'correcto', 'registrarse', 'Email debe tener @');
                        } else {
                            gestorBD.insertarUsuario(usuario, function (id) {
                                if (id == null) {
                                    utils.manejoErrores('Error al registrar usuario',
                                        'Error al registrar usuario', next)
                                } else {
                                    req.session.usuario = usuario.email;
                                    req.session.dinero = usuario.dinero;
                                    req.session.rol = usuario.rol;

                                    res.redirect('/ofertas');
                                }
                            });
                        }
                    } else {
                        utils.manejoAvisos(res, ' Intento de registro con un email existente: ' +
                            req.body.email, 'registrarse', 'Ya existe un usuario con ese email');
                        req.session.destroy();
                    }
                });
            }
        } else {
            utils.manejoAvisos(res, 'Las contraseñas introducidas no coinciden'
                , 'registrarse', 'Las contraseñas deben coincidir');
        }
    });

    app.post('/identificarse', function (req, res, next) {
        let seguro = app.get('crypto').createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {email: req.body.email, password: seguro}

        if (!utils.validarEmailFormato(req.body.email)) {
            utils.manejoAvisos(res,'Intento de inicio de sesión fallido por email con formato incorrecto:'
                + req.body.email, 'identificarse', 'Intento de inicio de sesión fallido por email con' +
                ' formato incorrecto');
            req.session.destroy();
        } else if (utils.validarCampoVacio(req.body.email) || utils.validarCampoVacio(req.body.password)) {
            utils.manejoAvisos(res,'Intento de inicio de sesión fallido por campos incorrectos',
                'identificarse', 'Los campos no pueden estar vacíos ni tener ' +
                'más de 20 caracteres');
            req.session.destroy();
        } else {
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length === 0) {
                    req.session.destroy();
                    utils.manejoAvisos(res,'Intento de inicio de sesión con email o pass incorrecto:' +
                        req.body.email, 'identificarse', 'Email o password incorrecto');
                } else {
                    logger.info('Usuario identificado:' + usuarios[0].email);

                    req.session.usuario = usuarios[0].email;
                    req.session.rol = usuarios[0].rol;
                    req.session.dinero = usuarios[0].dinero;

                    req.session.favoritos = [];

                    if (usuarios[0].rol === 'ADMIN') {
                        res.redirect('/admin');
                    } else {
                        res.redirect('/ofertas');
                    }
                }
            });
        }
    });
};