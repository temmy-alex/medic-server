const routes = require('express').Router();
const AuthenticationApiController = require('../../modules/authentication/api.controller');

routes.post('/login', AuthenticationApiController.login);

module.exports = routes;