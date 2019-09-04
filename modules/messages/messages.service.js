const MessageModel = require('./messages.model');
const limit = 10;
const sort = 'asc';

class MessagesService {
    static add({ author, text, email }, callback) {
        const message = new MessageModel({author, text, email});
        message.save((err, message) => {
            if (err) return callback(err);
            callback(null, message);
        });
    }

    static get(id, callback) {
        MessageModel.findById(id, (err, message) => {
            if (err) return callback(err);
            callback(null, message);
        });
    }

    static getList(page, callback) {
        MessageModel
            .find()
            .sort({data : sort})
            .skip(page * limit)
            .limit(limit)
            .exec((err, data) => {
                if (err) return callback(err);
                callback(null, data);
            });
    }
}

module.exports = MessagesService;