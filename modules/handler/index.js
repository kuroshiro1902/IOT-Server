const { Socket } = require('socket.io');

class Handler {
  /**
   * Emit mảng giá trị mới nhất
   * @param {String} event
   * @param {DataSnapshot} snapshot
   * @param {Socket} socket
   * @returns {void}
   */
  emitNewestValue(event, snapshot, socket) {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse();
    socket.emit(event, dataArray);
  }
}
module.exports = Handler;
