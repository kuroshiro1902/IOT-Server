const { Socket, Server } = require('socket.io');
const Firebase = require('../firebase');

/**
 * @param {Server} io
 * @param {Firebase} firebase
 * @param {Socket} socket
 */
function controller(io, firebase, socket) {
  console.log('Client connected');

  firebase.on('baochay', 'value', (snapshot) => {
    const data = Object.values(snapshot.val() ?? {}).reverse();
    console.log('baochay');
    socket.emit('data', data);
  });
  firebase.on('nhietdodoam ', 'value', (snapshot) => {
    const data = Object.values(snapshot.val() ?? {}).reverse();
    console.log('nhietdodoam ', data);
    socket.emit('fireStatus', data);
  });
  firebase.on('tialua', 'value', (snapshot) => {
    const data = Object.values(snapshot.val() ?? {}).reverse();
    console.log('tialua ', data);
    socket.emit('fireStatus', data);
  });

  // Ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
}

module.exports = controller;
