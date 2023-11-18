const { database } = require('firebase-admin');
const { Socket } = require('socket.io');

class Firebase {
  admin;
  database;
  ref;

  constructor(databaseURL) {
    this.admin = require('firebase-admin');
    this.admin.initializeApp({
      credential: this.admin.credential.cert(require('./firebase.json')),
      databaseURL: databaseURL ?? process.env.URL_FIREBASE,
    });

    this.database = this.admin.database();
    this.ref = this.database.ref();

    // Xử lý lỗi khi kết nối đến Firebase
    this.database.ref('.info/connected').on('value', (snapshot) => {
      if (snapshot.val() === true) {
        console.log('Connected to Firebase');
      } else {
        console.log('Disconnected from Firebase');
      }
    });
  }

  /**
   * @param {Socket} socket
   */
  addSocketEvent(socket) {
    this.onValue(socket);
  }

  onValue(socket) {
    this.ref.on('value', (snapshot) => {
      const data = snapshot.val();
      console.log(1, { data });
      socket.emit('fireStatus', data);
    });
  }

  /**
   * @param {string} event
   * @param {(a: database.DataSnapshot, b?: string | null) => any} handler
   */
  on(event, handler) {
    this.ref.on(event, handler);
  }
}

module.exports = Firebase;
