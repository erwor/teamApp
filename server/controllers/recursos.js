var Recurso = require('../models/recursos');
var ObjectId = require('mongoose').Types.ObjectId;

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var async = require('async');

var newRecurso;

exports.guardarRecurso = function (req, res, next) {
    newRecurso = new Recurso({});
    async.series({
        archivos: function (callback) {
            if (req.files.hasOwnProperty('archivos')) {
                if (req.files.archivos.length > 0) {
                    var result = _.map(req.files.archivos, function (file, i) {
                        return guardar_archivos(req, res, i, file);
                    });
                    callback(null, result);
                } else {
                    callback(null, guardar_archivos(req, res, 0, req.files.archivos));
                }
            } else {
                callback(null, []);
            }
        },
        datos: function (callback) {
            var data = {
                remitente: ObjectId(req.session.passport.user._id.toString()),
                destinatarios: req.body.destinatarios.split(','),
                asunto: req.body.asunto
            };
            callback(null, data);
        }
    }, function (err, result) {
        if (!err) {
            guardar_recurso(result, function (recurso) {
                Recurso.populate(recurso, {
                    path: 'remitente',
                    model: 'Usuario',
                    select: 'nombre nombre_usuario'
                }, function (err, recurso) {
                    req.body.recurso = recurso;
                    res.send(recurso);
                    next();
                });
            });
        } else {
            res.send({
                msj: "Falló"
            });
            console.log(err);
        }

    });
};
exports.getRecursosRecibidos = function (req, res, next) {
    Recurso.find({
            destinatarios: req.session.passport.user.nombre_usuario
        })
        .populate('remitente')
        .exec(function (err, recursos) {
            if (err) {
                console.log(err);
            } else {
                res.send(recursos);
            }
        });
};

exports.getRecursosEnviados = function (req, res, next) {
    Recurso.find({
            remitente: req.session.passport.user._id
        })
        .populate('remitente')
        .exec(function (err, recursos) {
            if (err) {
                console.log(err);
            } else {
                res.send(recursos);
            }
        });
};


exports.getDetalleRecurso = function (req, res, next) {
    Recurso.findOne({
            _id: req.params.id_recurso
        })
        .populate('remitente')
        .exec(function (err, recurso) {
            if (!err) {
                res.send(recurso);
            } else {
                console.log(err);
            }
        });
};

/*******************************/
function guardar_archivos(req, res, i, file) {
    var root = path.dirname(require.main.filename);
    var originalFilename = file.originalFilename.split('.');
    var ext = originalFilename[originalFilename.length - 1];
    var nombre_archivo = originalFilename[0] + '_' + newRecurso._id.toString() + '_' + i + '.' + ext;
    var newPath = root + '/public/recursos/' + nombre_archivo;
    var newFile = new fs.createWriteStream(newPath);
    var oldFile = new fs.createReadStream(file.path);
    oldFile.pipe(newFile);
    oldFile.on('end', function () {
        console.log('Cargado');
        res.end('Cargado');
    });
    return nombre_archivo;
}

function guardar_recurso(result, callback) {
    if (Array.isArray(result.archivos)) {
        newRecurso.archivos = result.archivos;
    } else {
        newRecurso.archivos.push(result.archivos);
    }
    newRecurso.asunto = result.datos.asunto;
    newRecurso.destinatarios = result.datos.destinatarios;
    newRecurso.remitente = result.datos.remitente;
    newRecurso.save();
    callback(newRecurso);
}