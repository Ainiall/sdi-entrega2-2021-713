// Utilidades
const {logger} = require('../modules/logger');
let utils = require('../utils/utils');

/**
 * Router que nos permite manejar la API de ofertas
 *
 * @param app Aplicación sobre la que actúa
 * @param gestorBD Nexo de unión con la base de datos
 */
module.exports = function (app, gestorBD) {

    /**
     * Obtención del listado de ofertas de otros usuarios
     */
    app.get('/api/ofertas', function (req, res) {
        logger.info('Acceso API listado de ofertas');
        let criterio = {'vendedor': {$not: {$regex: res.usuario}}};
        gestorBD.obtener('ofertas', criterio, function (ofertas) {
            if (ofertas == null) {
                logger.error('Error al obtener el listado de ofertas vía API');
                res.status(500);
                res.json({error: 'Se ha producido un error al obtener las ofertas'})
            } else {
                logger.info('Listado de ofertas obtenido vía API');
                res.status(200);
                res.send(JSON.stringify(utils.filtrarOfertasAPI(ofertas)));
            }
        });
    });
};