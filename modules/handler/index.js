const { Socket } = require('socket.io');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.GMAIL_NAME,
      pass: process.env.GMAIL_PASS,
  },
});

// Gửi email xác nhận
function sendVerificationEmail(email, code) {
  console.log(process.env.GMAIL_NAME, process.env.GMAIL_PASS, email, code);
  const mailOptions = {
      from: process.env.GMAIL_NAME,
      to: email,
      subject: 'Cảnh báo',
      html: `Lượng khí gas đang vượt mức vui lòng chú ý`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
      } else {
          console.log('thanh cong');
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
  /**
   * Emit mảng giá trị mới nhất
   * @param {'tialua'|'nhietdo'|'doam'|'khigas'} event
   * @param {DataSnapshot} snapshot
   * @param {Socket} socket
   * @returns {void}
   */
  emitNewestValue(event, snapshot, socket) {
    const data = snapshot.val();
    socket.emit('canhbao',`Khí gas đang vượt mức cho phép `)
        sendVerificationEmail("dinhnguyen110298@gmail.com",dataArray[dataArray.length-1].value )
    let url = `http://localhost:8000/${event}`;
    fetch(url, { ...this.requestOptions, body: JSON.stringify({value: data, time: new Date()}) })
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
