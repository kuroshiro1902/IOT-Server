const { Server: SocketServer, Socket } = require('socket.io');
const { Server } = require('http');

class IO {
  /**
   * @type {SocketServer}
   */
  io;

  /**
   * @param {Server} server
   */
  constructor(server) {
    this.io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
  }

  /**
   * @param {string} event
   * @param {(socket: Socket) => void} handler
   */
  on(event, handler) {
    this.io.on(event, handler);
  }
}

module.exports = IO;
