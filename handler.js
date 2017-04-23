'use strict';
const Users = require('./users');

let users = new Users();

module.exports.userCreate = (event, context, callback) => {
    users.create(JSON.parse(event.body), function (err, user) {
        var response;
        if (err.length > 0) {
            response = {
                statusCode: 200,
                body: JSON.stringify({errors: err})
            }
        } else {
            response = {
                statusCode: 200,
                body: JSON.stringify({user: user})
            }
        }
        callback(null, response);
    });
};

module.exports.index = (event, context, callback) => {
    users.index(function(err, users) {
        var response = {
            statusCode: 200,
            body: JSON.stringify(users)
        };
        callback(null, response);
    })
};
