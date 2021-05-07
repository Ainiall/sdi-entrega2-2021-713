// Utilidades
const {logger} = require('../modules/logger');
let utils = require('../utils/utils');
/**
 * Router que nos permite manejar la funcionalidad de los administradores
 *
 * @param app Aplicación sobre la que actúa
 * @param swig Vista usada
 * @param gestorBD Nexo de unión con la base de datos
 */
module.exports = function (app, swig, gestorBD) {
    /**
     * Obtención del listado principal de usuarios.
     */
    app.get('/admin', function (req, res, next) {
        logger.info('Acceso al perfil de administración');
        let criterio = {'rol': 'USUARIO'}
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if(usuarios === null){
                utils.manejoErrores('Error al listar usuarios',
                    'Error al listar usuarios.', next);
            }
            logger.info('Lista de usuarios obtenida');
            let respuesta = swig.renderFile('views/badmin.html',
                {
                    usuario: req.session.usuario,
                    rol: req.session.rol,
                    usuarios: utils.filtrarUsuario(usuarios)
                });
            res.send(respuesta);
        });
    });

    /**
     * Eliminación de un usuario y todas sus ofertas
     */
    app.post('/admin/eliminar', function (req, res, next) {
            logger.info('Intentando eliminar usuario: ' + req.body.userEmail);
            let array = [];
            // el formato cambia según sea simple o múltiple
            let criterio = utils.criterioSeleccionado(array, req);

            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if(usuarios === null){
                    utils.manejoErrores(usuarios, 'Intento de eliminar usuarios no existentes',
                        'No se pueden eliminar usuarios no existentes', next);
                }else{
                    gestorBD.eliminarUsuarios(criterio, function (usuarios) {
                        if(usuarios === null){
                            utils.manejoErrores('Error al eliminar usuarios',
                                'Error al eliminar usuarios', next);
                        }else{
                            criterio = {'vendedor': {$in: array}}
                            gestorBD.eliminarOfertas(criterio, function (ofertas) {
                                if(ofertas === null){
                                    utils.manejoErrores('Error al eliminar las ofertas de los usuarios eliminados',
                                        'Error al eliminar ofertas', next);
                                }else{
                                    logger.info('Usuario(s) eliminado(s)');
                                    res.redirect('/admin?mensaje=Usuario(s) eliminado(s)');
                                }
                            });
                        }
                    });
                }
            });
        }
    );

    /**
     * Redirección a la página principal admin
     */
    app.get('/admin*', function (req, res) {
        res.redirect('/admin');
    });
};
