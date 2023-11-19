const { database } = require('firebase-admin');

class Firebase {
  admin;
  database;
  userRef;
  dataRef;

  constructor(databaseURL) {
    this.admin = require('firebase-admin');
    this.admin.initializeApp({
      credential: this.admin.credential.cert(require('./firebase.json')),
      databaseURL: databaseURL ?? process.env.URL_FIREBASE,
    });

    this.database = this.admin.database();
    this.userRef = this.database.ref('user');
    this.dataRef = this.database.ref('data');

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
   * @param {'user' | 'data'} type
   * @param {| 'value'| 'child_added' | 'child_changed' | 'child_moved' | 'child_removed'} event
   * @param {(a: database.DataSnapshot, b?: string | null) => any} handler
   */
  on(type, event, handler) {
    const ref = type === 'user' ? this.userRef : this.dataRef;
    ref.on(event, handler);
  }
}

module.exports = Firebase;
