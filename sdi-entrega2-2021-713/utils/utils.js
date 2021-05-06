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
            const filtado = (({email, nombre, apellidos}) => ({
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
            const filtado = (({titulo, descripcion, precio, vendido}) => ({
                titulo,
                descripcion,
                precio,
                vendido
            }))(ofertas[i]);
            filtrados.push(filtado);
        }
        return filtrados;
    },
    filtrarOfertasPropias: function filtrarOfertasPropias(ofertas) {
        let filtrados = [];
        for (let i = 0; i < ofertas.length; i++) {
            const filtado = (({titulo, descripcion, precio}) => ({
                titulo,
                descripcion,
                precio
            }))(ofertas[i]);
            filtrados.push(filtado);
        }
        return filtrados;
    },
    criterioSeleccionado: function criterioSeleccionado(array, req) {
        if (Array.isArray(req.body.userEmail)) {
            for (let i = 0; i < req.body.userEmail.length; i++) {
                array.push(req.body.userEmail[i]);
            }
            return {'email': {$in: array}};
        } else {
            return {'email': req.body.userEmail};
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
        return (campo === null || typeof campo === undefined || campo.trim().length < 1
            || campo.trim().length > 20);
    },
    esTexto: function esTexto(text) {
        return text.trim().length === 0 ? "" : text;
    }

}