const mongoose = require('../../libs/mongoose');
const checkId = id => id && /^[a-z0-9]+$/.test(id) && mongoose.Types.ObjectId.isValid(id);
const checkAuthor = author => author && /^User_\d{7}$/.test(author);

module.exports = {
    checkId,
    checkAuthor
};