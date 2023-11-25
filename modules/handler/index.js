const { Socket } = require('socket.io');

class Handler {
  requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  /**
   * Emit mảng giá trị mới nhất
   * @param {'tialua'|'nhietdo'|'doam'|'khigas'} event
   * @param {DataSnapshot} snapshot
   * @param {Socket} socket
   * @returns {void}
   */
  emitNewestValue(event, snapshot, socket) {
    const data = snapshot.val();
    let url = `http://localhost:3000/${event}`;
    fetch(url, { ...this.requestOptions, body: JSON.stringify({value: data, time: new Date()}) })
      .then((res) => res.json())
      .then((data) => {
        if (!!data) {
          console.log("data",data)
          // socket.emit(event, data);
        }
      })
      .catch((err) => console.log(err));
  }
}
module.exports = Handler;
