const { Server: SocketServer } = require('socket.io');
const { Server } = require('http');
const Firebase = require('../firebase');
const controller = require('../controller');

class IO {
  /**
   * @type {SocketServer}
   */
  io;
  firebase;

  /**
   * @param {Server} server
   * @param {Firebase} firebase
   */
  constructor(server, firebase) {
    this.io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.firebase = firebase;

    this.io.on('connection', (socket) => controller(this.io, firebase, socket));
  }
}

module.exports = IO;
