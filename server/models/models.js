var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_ck8sl4p8:vpt62j2p9pkb6ppopjl86jmdf@ds153609.mlab.com:53609/heroku_ck8sl4p8');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión!'));
db.once('open', function callback() {
    console.log('Base de datos Teamapp abierta');
});

module.exports = mongoose;