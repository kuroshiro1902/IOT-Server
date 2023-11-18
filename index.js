const App = require('./modules/app');
const Firebase = require('./modules/firebase');
const IO = require('./modules/socket');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = new App(3000);
const io = new IO(app.server);

const firebase = new Firebase();

app.use('/', indexRouter);
app.use('/users', usersRouter);

io.on('connection', (socket) => {
  console.log('Client connected');

  firebase.addSocketEvent(socket);

  // Ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.start();
