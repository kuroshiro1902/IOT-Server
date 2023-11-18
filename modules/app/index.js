const express = require('express');
class App {
  port;
  app;
  server;

  /**
   *
   * @param {number} port
   */
  constructor(port) {
    this.port = port;
    this.app = express();
    this.app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*'); // Cho phép tất cả các origin
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Credentials', true);
      next();
    });
    this.app.set('port', port ?? process.env.PORT);
    this.app.use(require('cors')());
    this.app.use(require('morgan')('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(require('cookie-parser')());

    // catch 404 and forward to error handler
    this.app.use(function (req, res, next) {
      next(require('http-errors')(404));
    });

    // error handler
    this.app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
    });

    //create server
    this.server = require('http').createServer(this.app);
    this.server.on('error', (error) => {
      console.log(error);
    });
    this.server.on('listening', () => {
      console.log('Listening on port ' + this.port + '...');
    });
  }

  start() {
    this.server.listen(this.port);
  }

  /**
   * @param {string} path
   * @param {express.Router} router
   */
  use(path, router) {
    this.app.use(path, router);
  }
  /**
   * @param {string} path
   * @param {express.Router} router
   */
  get(path, router) {
    this.app.get(path, router);
  }
  /**
   * @param {string} path
   * @param {express.Router} router
   */
  post(path, router) {
    this.app.post(path, router);
  }
}

module.exports = App;
