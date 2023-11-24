const App = require('./modules/app');
const Firebase = require('./modules/firebase');
const Handler = require('./modules/handler');
const IO = require('./modules/socket');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = new App(3000);
app.use('/', indexRouter);
app.use('/users', usersRouter);

const firebase = new Firebase();

const io = new IO(app.server);

const handler = new Handler();

io.on('connection', (socket) => {
  firebase.on('tialua', 'value', (snapshot) => handler.emitNewestValue('tialua', snapshot, socket));
  firebase.on('khigas', 'value', (snapshot) => handler.emitNewestValue('khigas', snapshot, socket));
  firebase.on('doam', 'value', (snapshot) => handler.emitNewestValue('doam', snapshot, socket));
  firebase.on('nhietdo', 'value', (snapshot) => handler.emitNewestValue('nhietdo', snapshot, socket));
});

app.start();
