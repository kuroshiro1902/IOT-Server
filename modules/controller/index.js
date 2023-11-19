const { Socket, Server } = require('socket.io');
const Firebase = require('../firebase');

/**
 * @param {Server} io
 * @param {Firebase} firebase
 * @param {Socket} socket
 */
function controller(io, firebase, socket) {
  console.log('Client connected');

  firebase.on('baochay','value', (snapshot) => {
    const data = snapshot.val();
    console.log(1, { data });
    socket.emit('fireStatus', data);
  });

  // Ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
}

module.exports = controller;
