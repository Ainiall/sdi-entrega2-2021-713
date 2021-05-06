//Modules
const {logger} = require('./modules/logger');
let utils = require('../utils/utils');
let express = require('express');
let app = express();

let rest = require('request');
app.set('rest', rest);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, UPDATE, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});

let jwt = require('jsonwebtoken');
app.set('jwt', jwt);

let fs = require('fs');
let https = require('https');

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');
let mongo = require('mongodb');
let swig = require('swig'); // plantilla

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

let gestorBD = require('./modules/gestorBD.js');
gestorBD.init(app, mongo);

// router Usuario Token
let routerUsuarioToken = express.Router();
routerUsuarioToken.use(function (req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {// verificar el token
        jwt.verify(token, 'secreto', function (err, infoToken) {
            if (err || (Date.now() / 1000 - infoToken.tiempo) > 240) {
                res.status(403); // Forbidden
                res.json({acceso: false, error: 'Token invalido o caducado'});
                // También podríamos comprobar que intoToken.usuario existe
                return;
            } else {// dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });
    } else {
        res.status(403); // Forbidden
        res.json({acceso: false, mensaje: 'No hay Token'});
    }
});
// Aplicar router Usuario Token
app.use('/api/cancion', routerUsuarioToken);

/**
 * Router que se encarga de manejar las vistas privadas del usuario
 * @type {Router}
 */
let routerSesionPrivadaUser = express.Router();
routerSesionPrivadaUser.use(function (req, res, next) {
    logger.info('Accediendo al router de sesión privada de usuario')
    utils.areaPrivada('USUARIO', req,res, next);
});

//Aplicar router Sesion Privada Usuario
app.use('/ofertas*', routerSesionPrivadaUser);
app.use('/ofertas/*', routerSesionPrivadaUser);

/**
 * Router que se encarga de manejar las vistas privadas del administrador
 * @type {Router}
 */
let routerSesionPrivadaAdmin = express.Router();
routerSesionPrivadaAdmin.use(function (req, res, next) {
    logger.info('Accediendo al router de sesión privada de administrador')
    utils.areaPrivada('ADMIN', req, res, next);
});
// Aplicar router Sesion Privada Admin
app.use('/admin', routerSesionPrivadaAdmin);
app.use('/admin/*', routerSesionPrivadaAdmin);

/**
 * Router encargado de manejar el acceso a zonas exclusivamente públicas
 * @type {Router}
 */
let routerSesionPublica = express.Router();
routerSesionPublica.use(function (req, res, next) {
    logger.info('Accediendo al router de sesión pública')
    if (!req.session.usuario) {
        next();
    } else {
        logger.info('Usuario identificado va a : ' + req.originalUrl);
        res.redirect('/home');
    }
});

//Aplicar router Sesión Pública
app.use('/registrarse', routerSesionPublica);
app.use('/identificarse', routerSesionPublica);

app.use(express.static('public'));

//Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi@sdi-entrega2-shard-00-00.dmatw.mongodb.net:27017,' +
    'sdi-entrega2-shard-00-01.dmatw.mongodb.net:27017,' +
    'sdi-entrega2-shard-00-02.dmatw.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet' +
    '=atlas-103fus-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

//Rutas/controladores por lógica
require('./routes/rusuarios.js')(app, swig, gestorBD);
require('./routes/rofertas.js')(app, swig, gestorBD);
require('./routes/radmin.js')(app,swig, gestorBD);

require('./routes/rapicanciones.js')(app, gestorBD);

/**
 * Redirección de la vista principal
 */
app.get('/', function (req, res) {
    logger.info('Redirección desde raíz a la página principal')
    res.redirect('/home');
})

/**
 * Vista principal de la aplicación
 */
 app.get('/home', function (req, res) {
    logger.info('Acceso a la vista principal de la aplicación');
    let respuesta = swig.renderFile('views/home.html', {
        usuario: req.session.usuario,
        dinero: req.session.dinero,
        rol: req.session.rol
    });
    res.send(respuesta);
});


/**
 * Manero error páginas inexistentes
 */
app.get('*', (req, res, next) => {
    next(new Error('Página no encontrada'))
});

/**
 * Manejo de errores 
 */
app.use(function (err, req, res,next) {
    logger.error('APP ERROR: '+err);
    if (!res.headersSent) {
        res.status(400);
        let respuesta = swig.renderFile('views/error.html', {
            mensaje:  err.message,
            tipoMensaje: 'alert-danger',
            usuario: req.session.usuario,
            dinero: req.session.dinero,
            rol: req.session.rol
        });
        res.send(respuesta);
    }
});

/**
 * Lanza el servidor
 */
https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function () {
    logger.info('Servidor activo');
});


