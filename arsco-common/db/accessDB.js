var mongoose = require('mongoose');
var Config = require('../config');

var connent = function () {
    mongoose.connect(Config.db.uri,
        {
            useNewUrlParser: true,
        }).catch((error) => { console.log(error); });
    return mongoose;
}

var close = function(){
    mongoose.connection.close();
}

module.exports = {
    connect: connent,
    close : close
}