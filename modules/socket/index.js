const { Socket } = require('socket.io');

class IO {
  io;
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
   *
   * @param {string} event
   * @param {(socket: Socket) => any} handler
   */
  on(event, handler) {
    this.io.on(event, handler);
  }
}

module.exports = IO;
