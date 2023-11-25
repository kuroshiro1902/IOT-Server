const { Socket } = require('socket.io');

class Handler {
  headers = {
    'Content-Type': 'application/json',
  };
  getConfig = {
    headers: this.headers,
    method: 'GET',
  };
  postConfig = {
    headers: this.headers,
    method: 'POST',
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
    const url = `${process.env.DB_URL}${event}`;
    fetch(url, {
      ...this.postConfig,
      body: JSON.stringify({ value: data, time: new Date().getTime() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!!data) {
          socket.emit(event, data);
        }
      })
      .catch((err) => console.log(err));
  }

  /**
   * Lọc dữ liệu theo thời gian
   * @param {string} start yyyy/mm/dd
   * @param {string} end yyyy/mm/dd
   * @param {'tialua'|'nhietdo'|'doam'|'khigas'} type
   * @param {Socket} socket
   */
  async emitFilterByTime(start, end, type, socket) {
    start = new Date(start).getTime();
    end = new Date(end + ' 23:59:59').getTime();
    const url = `${process.env.DB_URL}${type}?time_gte=${start}&time_lte=${end}`;
    try {
      const data = await (await fetch(url)).json();
      if (!!data) {
        socket.emit("filter-by-time", data)
      }
    } catch (error) {}
  }
}
module.exports = Handler;
