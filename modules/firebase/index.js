const { database } = require('firebase-admin');

class Firebase {
  admin;
  database;
  userRef;
  khigasRef;
  nhietdoRef;
  tialuaRef;
  doamRef;

  constructor(databaseURL) {
    this.admin = require('firebase-admin');
    this.admin.initializeApp({
      credential: this.admin.credential.cert(require('./firebase.json')),
      databaseURL: databaseURL ?? process.env.URL_FIREBASE,
    });

    this.database = this.admin.database();
    this.userRef = this.database.ref('user');
    this.khigasRef = this.database.ref('khigas');
    this.nhietdoRef = this.database.ref('nhietdo');
    this.doamRef = this.database.ref('doam');
    this.tialuaRef = this.database.ref('tialua');

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
   * @param {'user' | 'baochay' | 'tialua' | 'nhietdo'|'doam'} type
   * @param {| 'value'| 'child_added' | 'child_changed' | 'child_moved' | 'child_removed'} event
   * @param {(a: database.DataSnapshot, b?: string | null) => any} handler
   */
  on(type, event, handler) {
    const ref =
      type === 'user'
        ? this.userRef
        : type === 'khigas'
        ? this.khigasRef
        : type === 'tialua'
        ? this.tialuaRef:
        type === 'nhietdo'
        ?this.nhietdoRef:this.doamRef
        ref.orderByChild('time').limitToLast(10).on(event, handler);
  }
}

module.exports = Firebase;
