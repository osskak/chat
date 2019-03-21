const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('../config');

mongoose.set('useCreateIndex', true);
mongoose.set('debug', config.get('mongodb:debug'));
mongoose.plugin(beautifyUnique);
mongoose.connect(config.get('mongodb:uri'), { useNewUrlParser: true }, err => {
    if (err) console.error(err);
    else console.log('successfully connected');
});

module.exports = mongoose;