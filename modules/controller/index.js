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
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse();

    console.log(dataArray);
    // console.log(data);
    socket.emit('data', dataArray);
  });

  // Ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
}

module.exports = controller;
