const {logger} = require('../modules/logger');

module.exports = {
    areaPrivada: function areaPrivada(area, req, res, next) {
        if (req.session.usuario) {
            if (req.session.rol === area) {
                next();
            } else {
                logger.error('Acceso restringido. Intenta acceder a ' + req.originalUrl);
                next(new Error('Acceso restringido'));
            }

        } else {
            logger.info('Usuario sin identificar va a : ' + req.originalUrl);
            res.redirect('/identificarse');
        }
    },

    filtrarUsuario: function filtrarUsuario(objeto) {
        let filtrados = [];
        for (let i = 0; i < objeto.length; i++) {
            const filtado = (({_id, email, nombre, apellidos}) => ({
                _id,
                email,
                nombre,
                apellidos,
            }))(objeto[i]);
            filtrados.push(filtado);
        }
        return filtrados;
    },
    filtrarCompras: function filtrarCompras(ofertas) {
        let filtrados = [];
        for (let i = 0; i < ofertas.length; i++) {
            const filtado = (({titulo, descripcion, precio, vendedor}) => ({
                titulo,
                descripcion,
                precio,
                vendedor
            }))(ofertas[i]);
            filtrados.push(filtado);
        }
        return filtrados;
    },
    filtrarOfertas: function filtrarOfertas(ofertas) {
        let filtrados = [];
        for (let i = 0; i < ofertas.length; i++) {
            const filtado = (({_id,titulo,descripcion,precio,comprador}) => ({
                _id,
                titulo,
                descripcion,
                precio,
                comprador
            }))(ofertas[i]);
            filtrados.push(filtado);
        }
        return filtrados;
    },
    filtrarOfertasPropias: function filtrarOfertasPropias(ofertas) {
        let filtrados = [];
        for (let i = 0; i < ofertas.length; i++) {
            const filtado = (({_id,titulo,descripcion,precio, comprador, destacada}) => ({
                _id,
                titulo,
                descripcion,
                precio,
                comprador,
                destacada
            }))(ofertas[i]);
            filtrados.push(filtado);
        }
        return filtrados;
    },
    criterioEmailSeleccionado: function criterioEmailSeleccionado(array, chechbox) {
        if (Array.isArray(chechbox)) {
            for (let i = 0; i < chechbox.length; i++) {
                array.push(chechbox[i]);
            }
            return {'email': {$in: array}};
        } else {
            return {'email': chechbox};
        }
    },
    criterioVendedorSeleccionado: function criterioVendedorSeleccionado(array, chechbox) {
        if (Array.isArray(chechbox)) {
            for (let i = 0; i < chechbox.length; i++) {
                array.push(chechbox[i]);
            }
            return {'vendedor': {$in: array}};
        } else {
            return {'vendedor': chechbox};
        }
    },
    criterioCompradorSeleccionado: function criterioCompradorSeleccionado(array, chechbox) {
        if (Array.isArray(chechbox)) {
            for (let i = 0; i < chechbox.length; i++) {
                array.push(chechbox[i]);
            }
            return {'comprador': {$in: array}};
        } else {
            return {'comprador': chechbox};
        }
    },
    manejoErrores: function manejoErrores(log, error, next) {
        logger.error(log);
        next(new Error(error));
    },
    manejoAvisos: function manejoAvisos(res, log, vista, error) {
        logger.error(log)
        res.redirect('/' + vista + '?mensaje=' + error + '&tipoMensaje=alert-danger');
    },

    validarEmailFormato: function validarEmailFormato(email) {
        let exp = /\S+@\S+\.\S+/;
        return exp.test(email);
    },
    validarCampoVacio: function validarCampoVacio(campo) {
        return (campo === null || typeof campo === 'undefined'
            || campo.trim() === '');
    },
    validarCampoDentroLimites: function validarCampoDentroLimites(campo, min, max) {
        return campo.trim().length >= min && campo.trim().length <= max;
    },
    esTexto: function esTexto(text) {
        return text.trim().length === 0 ? "" : text;
    },

    validarRegistro: function validarRegistro(res, email, nombre, apellidos, pass1, pass2) {
        if (this.validarCampoVacio(email) || this.validarCampoVacio(nombre)
            || this.validarCampoVacio(apellidos)) {
            this.manejoAvisos(res, 'Campo vacío introducido',
                'registrarse', 'Los campos no pueden estar vacíos');
            return false;
        }
        if (!this.validarEmailFormato(email)) {
            this.manejoAvisos(res, 'El email introducido no tiene el formato ' +
                'correcto', 'registrarse', 'Email debe tener @');
            return false;
        }
        if (pass1 !== pass2) {
            this.manejoAvisos(res, 'Las contraseñas introducidas no coinciden'
                , 'registrarse', 'Las contraseñas deben coincidir');
            return false;
        }
        if (pass1 < 8) {
            this.manejoAvisos(res, 'Contraseña introducida demasiado pequeña'
                , 'registrarse', 'La contraseña debe tener 8 o más caracteres');
            return false;
        }
        return true;
    },

    validarInicio: function validarInicio(res, email, pass) {
        if (this.validarCampoVacio(email) || this.validarCampoVacio(pass)) {
            this.manejoAvisos(res, 'Intento de inicio de sesión fallido por campos incorrectos',
                'identificarse', 'Los campos no pueden estar vacíos');
            return false;
        }
        if (!this.validarEmailFormato(email)) {
            this.manejoAvisos(res, 'Intento de inicio de sesión fallido por email con formato incorrecto:'
                + email, 'identificarse', 'Intento de inicio de sesión fallido por email con' +
                ' formato incorrecto');
            return false;
        }
        return true;
    },

    validarAgregarOferta: function validarAgregarOferta(res, oferta, usuario) {
        // por defecto checkbox solo envía info si está pulsado
        // por lo que se debe asignar el valor correcto
        if(oferta.destacada ==='on'){
            oferta.destacada = true;
        }else{
            oferta.destacada = false;
        }
        // no puede tener campos vacíos
        if (this.validarCampoVacio(oferta.titulo) || this.validarCampoVacio(oferta.descripcion)) {
            this.manejoAvisos(res, 'Intento de creación de oferta con campos vacíos',
                'ofertas/agregar', 'Los campos no pueden estar vacíos');
            return false;
        }
        if (!this.validarCampoDentroLimites(oferta.titulo, 1, 50) ||
            !this.validarCampoDentroLimites(oferta.descripcion, 1, 50)) {
            this.manejoAvisos(res, 'Intento de creación de oferta con campos vacíos o demasiado grandes',
                'ofertas/agregar', 'Los campos no pueden tener más de 50 caracteres');
            return false;
        }
        // no puede tener precio negativo
        if (oferta.precio < 0) {
            this.manejoAvisos(res, 'Intento de creación de oferta con precio negativo:' + oferta.precio,
                'ofertas/agregar', 'El precio no puede ser negativo');
            return false;
        }
        // no se puede destacar si no se ha seleccionado y se tiene saldo suficiente
        if (usuario.dinero < 20 && oferta.destacada !== true) {
            oferta.destacada = false;
            this.manejoAvisos(res, 'Intento de creación de oferta destacada con dinero insuficiente:'
                + usuario.dinero, 'ofertas/agregar', 'No tienes dinero para crear una oferta destacada');
            return false;
            //si se ha seleccionado y el saldo es suficiente
        } else if(oferta.destacada === true && usuario.dinero >=20){
            let saldo = Math.round((usuario.dinero - 20 + Number.EPSILON) * 100) / 100;
            usuario.dinero = saldo;
        }
        return true;
    },

    validarEliminarOferta: function validarEliminarOferta(vendedor, usuario, comprador, oferta, next) {
        //solo se pueden eliminar ofertas propias
        if (vendedor === usuario) {
            if (comprador !== null) {
                this.manejoErrores('Intento de eliminar una oferta ya vendida',
                    'No se puede eliminar una oferta ya vendida.', next);
                return false;
            }
        } else {
            this.manejoErrores('Intento de eliminar una oferta que no le pertenece:'
                + oferta, 'No se puede eliminar una oferta de otra persona', next);
            return false;
        }
        return true;
    },

    validarCompra: function validarCompra(vendedor, usuario, comprador, oferta, next) {
        // no puede comprarse una oferta propia
        if (vendedor === usuario) {
            this.manejoErrores('Intento de compra de una oferta propia:' + oferta,
                'No se puede comprar una oferta propia', next);
            return false;
        }
        //no se puede comprar una oferta ya vendida
        if (comprador !== null) {
            this.manejoErrores('Intento de compra de una oferta vendida: ' + oferta,
                'No se puede comprar una oferta ya vendida', next);
            return false;
        }
        return true;
    },
    validarMensaje: function validarMensaje(mensaje, funcionCallback) {
        let errors = [];
        // longitud máxima, no vacío
        if (this.validarCampoVacio(mensaje.texto)) {
            errors.push('El mensaje no puede  estar vacio');
        } else if (!this.validarCampoDentroLimites(mensaje.texto, 1, 200)) {
            errors.push('El mensaje no puede tener más de 200 caracteres ni menos de 1');
        }

        if (errors.length > 0) {
            funcionCallback(errors);
        } else {
            funcionCallback(null);
        }
    },
    validarDestacarOferta: function validarDestacarOferta(res, oferta, usuario, next) {
        // no puede comprarse una oferta de otro usuario
        if (oferta.vendedor !== usuario.email) {
            this.manejoErrores('Intento de destacar una oferta de otro usuario:' + oferta,
                'No se puede destacar una oferta de otro usuario', next);
            return false;
        }
        //no se puede destacar una oferta ya vendida
        if (oferta.comprador !== null) {
            this.manejoErrores('Intento de destacar una oferta vendida: ' + oferta,
                'No se puede destacar una oferta ya vendida', next);
            return false;
        }
        // no se puede destacar si ya esta destacada
        if(oferta.destacada === true){
            this.manejoErrores('Intento de destacar una oferta ya destacada: ' + oferta,
                'No se puede destacar una oferta ya destacada', next);
            return false;
        }
        if(usuario.dinero <20){
            this.manejoAvisos(res, 'Intento de destacar oferta con dinero insuficiente:' + usuario.dinero,
                'ofertas/mis-ofertas', 'No tienes dinero suficiente para destacar una oferta (20€)');
            return false;
        } else {
            let saldo = Math.round((usuario.dinero - 20 + Number.EPSILON) * 100) / 100;
            usuario.dinero = saldo;
            oferta.destacada = true;
        }
        return true;
    },
}