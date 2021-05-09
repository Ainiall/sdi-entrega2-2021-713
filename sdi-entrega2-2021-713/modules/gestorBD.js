/**
 * Función asíncrona encargada de ser un intermediario entre la base de datos MongoDB y la aplicación
 * @type {
 *      {
 *      mongo: null, app: null, init: module.exports.init,
 *      insertar: module.exports.insertar,
 *      eliminar: module.exports.eliminar,
 *      obtener: module.exports.obtener,
 *      obtenerPg: module.exports.obtenerPg,
 *      modificar: module.exports.modificar
 *      }
 *  }
 */
module.exports = {
    mongo: null, app: null, init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
        // funcion asincrona
    },
    // OPERACIONES CRUD (insertar, obtener, modificar, eliminar)
    insertar: function (tabla, elemento, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(tabla);
                collection.insert(elemento, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtener: function (tabla, criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(tabla);
                collection.find(criterio).toArray(function (err, lista) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(lista);
                    }
                    db.close();
                });
            }
        });
    },
    modificar: function (tabla, criterio, elemento, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(tabla);
                collection.update(criterio, {$set: elemento}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    eliminar: function (tabla, criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(tabla);
                collection.deleteMany(criterio, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerPg: function (tabla, criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(tabla);

                collection.find(criterio).toArray(function (err, lista) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        let pagina = lista.slice((pg - 1) * 5, pg * 5);
                        funcionCallback(pagina, lista.length);
                    }
                    db.close();
                });
            }
        });
    }
};