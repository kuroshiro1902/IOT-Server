const { Socket, Server } = require('socket.io');
const Firebase = require('../firebase');

/**
 * @param {Server} io
 * @param {Firebase} firebase
 * @param {Socket} socket
 */
function controller(io, firebase, socket) {
console.log(socket.id)
  socket.on("disconnect", ()=> console.log("disconnect"));
  firebase.on('khigas','value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse()

    socket.emit('khigas', dataArray);
  });
  // socket.emit("khigas",[123])
  firebase.on('nhietdo','value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse()

    socket.emit('nhietdo', dataArray);
  });
  firebase.on('doam','value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse()

    socket.emit('doam', dataArray);
  });
  firebase.on('tialua','value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse()

    socket.emit('tialua', dataArray);

  });

  // Ngắt kết nối
  socket.on('disconnect', () => {
  });
}

module.exports = controller;
