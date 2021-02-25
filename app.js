var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const sessionconfig  = require('./config/sessionset.json');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs');
const AWS = require('aws-sdk');
const http = require("http");
const socketio = require("socket.io");

var app = express();

// routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); // 회원관리, 로그인, 로그아웃 기능 등
var board_1_Router = require('./routes/board_1'); // 1번 게시판
var board_2_Router = require('./routes/board_2'); // 2번 게시판
var board_3_Router = require('./routes/board_3'); // 3번 게시판

// Create the http server
const server = require('http').createServer(app); 

// Create the Socket IO server on the top of http server 
const io = socketio(server);
const socketIOHandler = require('./serverside_functions/socketIOHandler.js')(io);

// view engine : pug (=jade)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '5mb', extended: false, parameterLimit: 10000}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: sessionconfig.secret,
  store: new MySQLStore(sessionconfig.storeset),
  resave: false,
  saveUninitialized: true,
  cookie: sessionconfig.cookieset
}))

// multer S3 setting
AWS.config.loadFromPath('./config/aws_s3_set.json');
const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'myboardbucket',
    key: function(req, file, cb) {
      const extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: 'public-read-write',
    limits: { fileSize: 5 * 1024 * 1024 } // 용량 제한 5mb
  }),
});

// 이미지 저장 post 처리
app.post('/upload/image', upload.single('file'), function(req, res) {
  io.to(req.body.socket).emit('image_insert', {url : req.file.location});
  res.status(204).end()
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board_1', board_1_Router);
app.use('/board_2', board_2_Router);
app.use('/board_3', board_3_Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app:app, server:server}; 
