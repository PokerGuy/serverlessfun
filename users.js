const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({'region': 'us-west-2'});

class Users {
    /* constructor(db) {
        this.db = db;
    } */

    create(user, cb) {
        var errors = [];
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log(user);
        if (!('email' in user)) {
            errors.push('Missing an email');
        } else if (!(re.test(user.email))) {
            errors.push('Email is not a valid email');
        }
        if (!('password' in user)) {
            errors.push('Missing a password');
        }
        if (user.password_confirmation !== user.password) {
            errors.push('password_confirmation and password must match')
        }
        if (errors.length === 0) {
            user.id = uuid();
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    user.password = hash;
                    delete user.password_confirmation;
                    var params = {
                        TableName: 'users',
                        Item: user
                    };
                    docClient.put(params, function(err) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(errors, user);
                        }
                    });
                })
            })
        } else {
            cb(errors, user);
        }
    }
}

module.exports = Users;