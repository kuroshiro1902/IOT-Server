const App = require('./modules/app');
const Firebase = require('./modules/firebase');
const Handler = require('./modules/handler');
const IO = require('./modules/socket');
const database= require('./modules/database')
require('dotenv').config();

database.listen(8000, ()=>{
  console.log("Database listening on port 8000...");
})


const app = new App(3000);

const firebase = new Firebase();

const io = new IO(app.server);

const handler = new Handler();

handler.emitAnalyze();

io.on('connection', (socket) => {
  firebase.on('tialua', 'value', (snapshot) => handler.emitNewestValue('tialua', snapshot, socket));
  firebase.on('khigas', 'value', (snapshot) => handler.emitNewestValue('khigas', snapshot, socket));
  firebase.on('doam', 'value', (snapshot) => handler.emitNewestValue('doam', snapshot, socket));
  firebase.on('nhietdo', 'value', (snapshot) => handler.emitNewestValue('nhietdo', snapshot, socket));

  //type: 'tialua'|'nhietdo'|'doam'|'khigas'
  socket.on("filter-by-time", ({start, end}, type )=>{
    handler.emitFilterByTime(start, end, type, socket)
  })
});

app.start();
