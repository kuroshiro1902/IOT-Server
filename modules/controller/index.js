const { Socket, Server } = require('socket.io');
const Firebase = require('../firebase');
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * @param {Server} io
 * @param {Firebase} firebase
 * @param {Socket} socket
 */


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


function controller(io, firebase, socket) {
  console.log('Client connected');

  firebase.on('khigas', 'value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    // dataArray.reverse();
    // for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[dataArray.length-1].value > 1) {
        console.log("canh bao")
        socket.emit('canhbao',`Khí gas đang vượt mức cho phép `)
        sendVerificationEmail("dinhnguyen110298@gmail.com",dataArray[dataArray.length-1].value )
        // break;
      }
    // }
    console.log(dataArray);
    // console.log(data);
    socket.emit('khigas', dataArray);
  });
  firebase.on('nhietdo', 'value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse();

    console.log(dataArray);
    // console.log(data);
    socket.emit('nhietdo', dataArray);
  });
  firebase.on('doam', 'value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse();

    console.log(dataArray);
    // console.log(data);
    socket.emit('doam', dataArray);
  });
  firebase.on('tialua', 'value', (snapshot) => {
    const data = snapshot.val();
    var dataArray = Object.values(data);
    dataArray.reverse();

    console.log(dataArray);
    // console.log(data);
    socket.emit('tialua', dataArray);
  });

  // Ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  socket.on('fireToDate', (data) => {
    console.log('socket data lưa', data);
    firebase.onDate(
      'tialua',
      'value',
      (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        var dataArray = Object.values(data ?? {});
        dataArray.reverse();

        console.log("gui dataas",dataArray);
        // console.log(data);
        socket.emit('fireToDate', dataArray);
      },
      data,
    );
  });

  socket.on('gasToDate', (data) => {
    console.log('socket data gas', data);
    firebase.onDate(
      'khigas',
      'value',
      (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        var dataArray = Object.values(data ?? {});
        dataArray.reverse();

        console.log(dataArray);
        // console.log(data);
        socket.emit('gasToDate', dataArray);
      },
      data,
    );
  });
  socket.on('nhietdoToDate', (data) => {
    console.log('socket data nhiet do', data);
    firebase.onDate(
      'nhietdo',
      'value',
      (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        var dataArray = Object.values(data ?? {});
        dataArray.reverse();

        console.log(dataArray);
        // console.log(data);
        socket.emit('nhietdoToDate', dataArray);
      },
      data,
    );
  });
  socket.on('doamToDate', (data) => {
    console.log('socket data do am', data);
    firebase.onDate(
      'doam',
      'value',
      (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        var dataArray = Object.values(data ?? {});
        dataArray.reverse();

        console.log(dataArray);
        // console.log(data);
        socket.emit('doamToDate', dataArray);
      },
      data,
    );
    // socket.emit(("fireToDate", data))
  });
}

module.exports = controller;
