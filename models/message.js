const mongoose = require('../libs/mongoose');

const messageSchema = new mongoose.Schema({
    author: {
        type: String,
        required: 'Author cannot be empty',
        validate: [
            {
                validator(value) {
                    return /^User_\d{7}$/.test(value);
                },
                message: 'Invalid author.'
            }
        ]
    },
    email: {
        type: String,
        required: 'E-mail cannot be empty',
        validate: [
            {
                validator(value) {
                    return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
                },
                message: 'Invalid email.'
            }
        ]
    },
    text: {
        type: String,
        required: 'Type a message.',
        validate: [
            {
                validator(value) {
                    return /^.{1,100}$/.test(value);
                },
                message: 'Message cannot be empty or must contain no more the 100 symbols.'
            }
        ],
    },
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;