module.exports = function (app, swig, gestorBD) {
    app.get('/usuarios', function (req, res) {
        res.send('ver usuarios');
    });

    app.get('/registrarse', function (req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });

    app.get('/identificarse', function (req, res) {
        let respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });

    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.send('Usuario desconectado');
    });

    app.post('/usuario', function (req, res,next) {
        let seguro = app.get('crypto').createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let usuario = {
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            password: seguro,
            money: 100.00
        }
        let password1 = req.body.password;
        let password2 = req.body.password2;
        let criterio = {email: req.body.email, password: seguro}

        // TODO: Externalizar a clase utils los metodos de comprobacion

        // las pass deben coincidir
        if(password1 === password2){
            // validaciones longitud email y @?
            if(password1.length < 8){
                req.session.usuario = null;
                next(new Error('La contraseña debe tener 8 o más caracteres'));
            }else{
                gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                    // email no existente en el sistema
                    if (usuarios == null || usuarios.length === 0) {
                        if(!req.body.email.toString().contains('@')){
                            req.session.usuario = null;
                            next(new Error('Email debe tener @.'));
                        }else{
                            gestorBD.insertarUsuario(usuario, function (id) {
                                if (id == null) {
                                    next(new Error('Error al registrar usuario.'));
                                } else {
                                    // deberia redirigir al listado?
                                    req.session.usuario = usuarios[0].email;
                                    req.session.favoritos = [];
                                    res.redirect('/publicaciones');
                                }
                            });
                        }
                    } else {
                        req.session.usuario = null;
                        next(new Error('Email o password incorrecto.'));
                    }
                });
            }
        }
    });

    app.post('/identificarse', function (req, res, next) {
        let seguro = app.get('crypto').createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        let criterio = {email: req.body.email, password: seguro}
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                req.session.usuario = null;
                next(new Error('Email o password incorrecto.'));
            } else {
                req.session.usuario = usuarios[0].email;
                req.session.favoritos = [];
                res.redirect('/publicaciones');
            }
        });
    });
};