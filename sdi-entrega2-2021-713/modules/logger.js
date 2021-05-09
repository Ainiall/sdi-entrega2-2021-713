//Importación del módulo log4js
const { configure, getLogger } = require('log4js');

/**
 * Módulo que contiene un logger para mantener un trazado de datos sobre el uso de la aplicación.
 * Este módulo es exportado a distintas partes de la aplicación para mantener un registro unificado.
 */
configure({
    appenders: {
        console: { type: 'console' },
        fileAppender: {type: 'file', filename: './logs/sdi2021-713.log'}
    },
    categories: {
        default: { appenders: ['console','fileAppender'], level: 'info' },
    }
});

const logger = getLogger();
logger.level = 'info'
module.exports = {logger};
