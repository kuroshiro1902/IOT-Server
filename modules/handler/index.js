const { Socket } = require('socket.io');
require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_NAME,
    pass: process.env.GMAIL_PASS,
  },
});

// Gửi email xác nhận
function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: process.env.GMAIL_NAME,
    to: email,
    subject: 'Cảnh báo',
    html: `Lượng khí gas đang vượt mức, vui lòng chú ý`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent successfully');
    }
  });
}

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


  constructor() {
    // Biến để theo dõi trạng thái email
    this.emailSent = false;

    // Thiết lập interval kiểm tra mỗi giây
    setInterval(() => {
      if (this.emailSent) {
        // Hủy sự kiện nếu email đã được gửi
        return;
      }

      // Kiểm tra điều kiện (data > 26)
      if (this.currentEvent === 'nhietdo' && this.currentData > 26) {
        // Gửi email và đặt trạng thái email đã được gửi
        sendVerificationEmail('dinhnguyen110298@gmail.com', this.currentData);
        this.emailSent = true;
        this.Ref.emit('canhbao', `Nhiệt độ đang vượt mức cho phép`);
      }
    }, 60000); // Kiểm tra mỗi giây
  }

  /**
   * Emit mảng giá trị mới nhất
   * @param {'tialua'|'nhietdo'|'doam'|'khigas'} event
   * @param {DataSnapshot} snapshot
   * @param {Socket} socket
   * @returns {void}
   */
  emitNewestValue(event, snapshot, socket) {
    this.currentEvent = event;
    this.currentData = snapshot.val();
    this.Ref=socket

    if (event === 'nhietdo' && this.currentData > 40) {
      // Reset trạng thái email đã được gửi
      this.emailSent = false;

      // Gửi sự kiện cảnh báo đến client
      // socket.emit('canhbao', `Nhiệt độ đang vượt mức cho phép`);
    }

    const url = `${process.env.DB_URL}${event}`;
    fetch(url, {
      ...this.postConfig,
      body: JSON.stringify({ value: this.currentData, time: new Date().getTime() }),
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
    console.log({start,end})
    // start = new Date(start).getTime();
    // end = new Date(end + ' 23:59:59').getTime();
    const url = `${process.env.DB_URL}${type}?time_gte=${start}&time_lte=${end}`;
    try {
      const data = await (await fetch(url)).json();
      if (!!data) {
        console.log({data})
        socket.emit("filter-by-time", data,type)
      }
    } catch (error) {}
  }

  async emitFilterBy10( type, socket) {
    console.log({type})
    // start = new Date(start).getTime();
    // end = new Date(end + ' 23:59:59').getTime();
    const url = `${process.env.DB_URL}${type}?_sort=time&_order=desc&_limit=10`;
    try {
      const data = await (await fetch(url)).json();
      if (!!data) {
        console.log({data})
        socket.emit("last-ten", data,type)
      }
    } catch (error) {}
  }


}

module.exports = Handler;
