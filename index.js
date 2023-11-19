const App = require('./modules/app');
const Firebase = require('./modules/firebase');
const IO = require('./modules/socket');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = new App(3000);
app.use('/', indexRouter);
app.use('/users', usersRouter);

const firebase = new Firebase();

const io = new IO(app.server, firebase);

app.start();
