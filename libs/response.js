const response = (response, statusCode, error, data) => {
    response.status(statusCode);
    response.json({
        'success' : statusCode >= 200 && statusCode <= 299,
        'error' : error,
        'data' : data
    });
};
const sendError = (res, err) => {
    console.error(err);
    return response(res, 500, 'Internal Server Error', null);
};

module.exports = {
    response,
    sendError
};