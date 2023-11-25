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
  requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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

    if (event === 'nhietdo' && this.currentData > 26) {
      // Reset trạng thái email đã được gửi
      this.emailSent = false;

      // Gửi sự kiện cảnh báo đến client
      // socket.emit('canhbao', `Nhiệt độ đang vượt mức cho phép`);
    }

    let url = `http://localhost:8000/${event}`;
    fetch(url, { ...this.requestOptions, body: JSON.stringify({ value: this.currentData, time: new Date() }) })
      .then((res) => res.json())
      .then((data) => {
        if (!!data) {
          socket.emit(event, data);
        }
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Handler;
