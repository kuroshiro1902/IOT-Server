const { Socket, Server } = require('socket.io');
const Firebase = require('../firebase');

/**
 * @param {Server} io
 * @param {Firebase} firebase
 * @param {Socket} socket
 */
function controller(io, firebase, socket) {
  console.log('Client connected');


  firebase.on('khigas','value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse()

    console.log(dataArray);
    // console.log(data);
    socket.emit('khigas', dataArray);
  });
  firebase.on('nhietdodoam','value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse()

    console.log(dataArray);
    // console.log(data);
    socket.emit('nhietdodoam', dataArray);
  });
  firebase.on('tialua','value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse()

    console.log(dataArray);
    // console.log(data);
    socket.emit('tialua', dataArray);

  });

  // Ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
}

module.exports = controller;
