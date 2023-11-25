const jsonServer = require('json-server');
const database = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

database.use(middlewares);
database.use(router);
module.exports = database;
