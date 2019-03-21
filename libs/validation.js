const textRegex = /^.{1,100}$/;
const emailRegex = /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/;
const methods = {
    'text' : value => value && textRegex.test(value),
    'email' : value => value && emailRegex.test(value)
};

module.exports = (key, value) => methods[key] && methods[key](value);