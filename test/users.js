var supertest = require('supertest');
var chai = require('chai');
var chaiHtttp = require('chai-http');
var should = chai.should();
var faker = require('faker');
var dupeEmail = faker.internet.email();
chai.use(chaiHtttp);

const endpoint = 'http://localhost:3000';
const client = supertest(endpoint);

describe('User Tests', function () {
    describe('create user', function () {
        it('returns an error if email and password are not present', function (done) {
            client.post('/users')
                .set('Content-type', 'application/json')
                .send({'email': faker.internet.email()})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.errors.length.should.be.at.least(1);
                    done();
                })
        });
        it('requires a password and a password_confirmation to be the same', function (done) {
            client.post('/users')
                .set('Content-type', 'application/json')
                .send({'email': faker.internet.email(), 'password': faker.internet.password()})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.errors.length.should.be.at.least(1);
                    done();
                })
        });
        it('returns an id when a user has successfully been created', function (done) {
            //This will create a user, we will use the same email again to verify that the same email can't be used twice
            var pass = faker.internet.password();
            client.post('/users')
                .set('Content-type', 'application/json')
                .send({'email': dupeEmail, 'password': pass, 'password_confirmation': pass})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.user.id.should.exist;
                    done();
                })
        });
        it('returns a hashed password and does not have a password_confirmation', function (done) {
            var pass = faker.internet.password();
            client.post('/users')
                .set('Content-type', 'application/json')
                .send({'email': faker.internet.email(), 'password': pass, 'password_confirmation': pass})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.user.password.should.not.equal('myawesomepassword');
                    res.body.user.should.not.include.keys('password_confirmation');
                    done();
                })
        });
        it('requires email to pass a basic email regex to be acceptable', function (done) {
            var pass = faker.internet.password();
            client.post('/users')
                .set('Content-type', 'application/json')
                .send({'email': 'cdogg', 'password': pass, 'password_confirmation': pass})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.errors.length.should.be.at.least(1);
                    done();
                })
        });
        it('will ensure that emails are unique', function (done) {
            var pass = faker.internet.password();
            client.post('/users')
                .set('Content-type', 'application/json')
                .send({'email': dupeEmail, 'password': pass, 'password_confirmation': pass})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.errors.length.should.be.at.least(1);
                    done();
                })
        })
    })
});
