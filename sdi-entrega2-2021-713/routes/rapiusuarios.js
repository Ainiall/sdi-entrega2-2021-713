// Utilidades
const {logger} = require('../modules/logger');

/**
 * Router que nos permite manejar la API de usuarios
 *
 * @param app Aplicación sobre la que actúa
 * @param gestorBD Nexo de unión con la base de datos
 */
module.exports = function (app, gestorBD) {
    /**
     * Identificación de usuarios por Token por login
     */
    app.post('/api/autenticar', function (req, res) {
        logger.info('Acceso a autenticación vía API');
        let seguro = app.get('crypto').createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtener('usuarios', criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                logger.info('Error en autenticación vía API');
                res.status(401); // Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                logger.info('Autenticación vía API correcta');
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
}