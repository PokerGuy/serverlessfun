'use strict';
const Users = require('./users');

let users = new Users();

module.exports.userCreate = (event, context, callback) => {
    users.create(JSON.parse(event.body), function (err, user) {
        var response;
        if (err.length > 0) {
            response = {
                statusCode: 200,
                body: {errors: err}
            }
        } else {
            response = {
                statusCode: 200,
                body: {user: user}
            }
        }
        callback(null, response);
    });
};
