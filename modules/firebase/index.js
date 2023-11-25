const { database } = require('firebase-admin');

class Firebase {
  admin;
  database;
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
    this.khigasRef = this.database.ref('/gas');
    this.nhietdoRef = this.database.ref('/temp');
    this.doamRef = this.database.ref('/hum');
    this.tialuaRef = this.database.ref('/fire');
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
  * @param { 'gas' | 'fire' | 'hum'|'temp'} type
   * @param {| 'value'| 'child_added' | 'child_changed' | 'child_moved' | 'child_removed'} event
   * @param {(a: database.DataSnapshot, b?: string | null) => any} handler
   */
  on(type, event, handler) {
    const ref =
       type === 'khigas'
        ? this.khigasRef
        : type === 'tialua'
        ? this.tialuaRef
        : type === 'nhietdo'
        ? this.nhietdoRef
        : this.doamRef;
    ref.on(event, handler);

  }
  onDate(type, event, handler, date) {
    const startTimestamp = `${date} 00:00:00`
    const endTimestamp =`${date} 23:59:59`
    const ref =
      type === 'khigas'
        ? this.khigasRef
        : type === 'tialua'
        ? this.tialuaRef
        : type === 'nhietdo'
        ? this.nhietdoRef
        : this.doamRef;
    ref.orderByChild('time').startAt(startTimestamp).endAt(endTimestamp).on(event, handler);

  }
}

module.exports = Firebase;
