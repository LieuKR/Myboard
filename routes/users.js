var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json'); // 암호화 데이터
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');
const MailHandler = require('../config/mailhandler.json');

const alert = require('../serverside_functions/alertfunctions.js');
const functions = require('../serverside_functions/usersfunctions.js')

/* 회원가입 폼 작성 페이지*/
router.get('/sign_up', function(req, res) {
  res.render('sign_up', {pageinfo: 'Sign_up', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert});
});

/* 회원가입 기능 페이지*/
router.post('/sign_up', function(req, res) {
  // crypto를 통한 비밀번호 암호화 -> 콜백함수 하나로 sql에 저장
  crypto.pbkdf2(req.body.password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
    cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.board_main.query(`INSERT INTO users (id, password, name, email, class) VALUES 
        ('${req.body.id}', '${derivedKey.toString('hex')}', '${req.body.name}', '${req.body.email}' ,'0');`, 
        (err, rows) => {
          if(err){
            alert.yellow(res, '에러가 발생하였습니다');
            res.redirect('/');
          } else {
            alert.green(res, '회원가입이 성공하였습니다!');
            res.redirect('/');
          };
        });
    });
});

/* 로그인 폼 작성 페이지*/
router.get('/login', function(req, res) {
  res.render('login', {pageinfo: 'login', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert});
});

/* 로그인 기능 페이지*/
router.post('/login', function(req, res) {
  crypto.pbkdf2(req.body.password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
    cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.board_main.query(`SELECT \`id\`, \`name\`, \`email\`, \`class\` FROM users WHERE id='${req.body.id}' and password='${derivedKey.toString('hex')}'`, 
        (err, rows) => {
          if (rows[0] == null) {
            alert.yellow(res, '아이디, 비밀번호가 잘못되었습니다.');
            res.redirect('/');
          } else {
            alert.green(res, '로그인 되었습니다.');
            req.session.loginid = rows[0];
            res.redirect('/');
          };
        });
    });
});

/* 로그아웃 기능 페이지*/
router.get('/logout', function(req, res) {
  req.session.destroy();
  alert.green(res, '로그아웃 되었습니다');
  res.redirect('/');
});

/* 이메일 인증 폼 작성 페이지 */
router.get('/email', function(req, res) {
  if(req.session.loginid){
    if(req.session.emailauth == undefined){
      functions.makerandomkey(req, functions.savekeytosession);
      res.redirect('/users/email/sendmail');
      } else {
        res.render('mail_auth', {pageinfo: 'mail_auth', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert});
      }
  } else {
    alert.yellow(res, '로그인이 되어있지 않습니다');
    res.redirect('/');
  }
});

/* 인증번호 이메일 전송 페이지 */
router.get('/email/sendmail', function(req, res) {
  functions.sendemail(MailHandler, req.session.loginid.email,'Myboard의 인증번호입니다',`인증번호 : ${req.session.emailauth}`);
  alert.green(res, `${req.session.loginid.email}로 인증번호가 전송되었습니다.`);
  res.redirect('/users/email');
});

/* 이메일 인증번호 처리 페이지 */
router.post('/email', function(req, res) {
  if(req.session.emailauth == req.body.authnumber){
    MySqlHandler.board_main.query(`UPDATE \`users\` SET \`class\` = '1' WHERE (\`email\` = '${req.session.loginid.email}');`, 
        (err, rows) => {if(err){
            throw err;
          } else {
            alert.green(res, '이메일 인증이 성공하였습니다. 다시 로그인해주세요');
            req.session.destroy();
            res.redirect('/');
          }
        });
  } else {
    alert.yellow(res, '잘못된 인증번호가 입력되었습니다.');
    res.redirect('/users/email');
  }
});

/* 이메일 주소 변경 입력 페이지 */
router.get('/mail_change', function(req, res) {
  if(req.session.loginid){
    res.render('mail_change', {pageinfo: 'mail_change', loginid: req.session.loginid, greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert});
  } else {
    alert.yellow(res, '로그인이 되어있지 않습니다');
    res.redirect('/');
  }
});

/* 이메일 주소 변경 post 처리 페이지 */
router.post('/mail_change', function(req, res) {
  if(req.session.loginid){
    crypto.pbkdf2(req.body.password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
      cryptoconfig.method, (err, derivedKey) => {
        MySqlHandler.board_main.query(`SELECT * FROM users WHERE id='${req.session.loginid.id}' and password='${derivedKey.toString('hex')}'`, 
          (err, rows) => {
            if (rows[0] == null) {
              alert.yellow(res, '비밀번호가 잘못되었습니다.');
              res.redirect('back');
            } else {
              MySqlHandler.board_main.query(`UPDATE \`users\` SET \`email\` = '${req.body.mail_change}', \`class\` = 0 WHERE (\`id\` = '${req.session.loginid.id}');`, 
                (err, rows) => {if(err){
                  alert.yellow(res, '에러가 발생하였습니다');
                  res.redirect('/');
                } else {
                  alert.green(res, `${req.body.mail_change}로 이메일 주소가 변경되었습니다. 다시 로그인해주세요.`);
                  req.session.destroy();
                  res.redirect('/');
                }
              });
            };
          });
      });
  } else {
    alert.yellow(res, '로그인이 되어있지 않습니다');
    res.redirect('/');
  }
});

/* 내 정보 페이지 */
router.get('/myinfo', function(req, res) {
  if(req.session.loginid){
    res.render('myinfo', {pageinfo: 'myinfo', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, loginid : req.session.loginid});
  } else {
    alert.yellow(res, '로그인이 필요합니다')
    res.redirect('back')
  }
});

/* 닉네임 변경 입력 페이지 */
router.get('/name_change', function(req, res) {
  if(req.session.loginid){
    res.render('name_change', {pageinfo: 'name_change', loginid: req.session.loginid, greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert});
  } else {
    alert.yellow(res, '로그인이 되어있지 않습니다');
    res.redirect('/');
  }
});

/* 닉네임 변경 post 처리 페이지 */
router.post('/name_change', function(req, res) {
  if(req.session.loginid){
    MySqlHandler.board_main.query(`UPDATE \`users\` SET \`name\` = '${req.body.name_change}' WHERE (\`id\` = '${req.session.loginid.id}');`, 
      (err, rows) => {if(err){
        alert.yellow(res, '에러가 발생하였습니다');
        res.redirect('/');
      } 
        else {
          alert.green(res, `${req.body.name_change}로 닉네임이 변경되었습니다.`);
          req.session.loginid.name = req.body.name_change
          res.redirect('/');
        }
      });
  } else {
    alert.yellow(res, '로그인이 되어있지 않습니다');
    res.redirect('/');
  }
});

/* 비밀번호 변경 입력 페이지 */
router.get('/password_change', function(req, res) {
  if(req.session.loginid){
    res.render('password_change', {pageinfo: 'password_change', loginid: req.session.loginid, greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert});
  } else {
    alert.yellow(res, '로그인이 되어있지 않습니다');
    res.redirect('/');
  }
});

/* 닉네임 변경 post 처리 페이지 */
router.post('/password_change', function(req, res) {
  if(req.session.loginid){
    crypto.pbkdf2(req.body.now_password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
      cryptoconfig.method, (err, derivedKey1) => {
        MySqlHandler.board_main.query(`SELECT * FROM users WHERE id='${req.session.loginid.id}' and password='${derivedKey1.toString('hex')}'`, 
          (err, rows) => {
            if (rows[0] == null) {
              alert.yellow(res, '비밀번호가 잘못되었습니다.');
              res.redirect('back');
            } else {
              crypto.pbkdf2(req.body.change_password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
                cryptoconfig.method, (err, derivedKey2) => {
                  MySqlHandler.board_main.query(`UPDATE \`users\` SET \`password\` = '${derivedKey2.toString('hex')}' WHERE (\`id\` = '${req.session.loginid.id}');`, 
                (err, rows) => {if(err){
                  alert.yellow(res, '에러가 발생하였습니다');
                  res.redirect('/');
                } else {
                    alert.green(res, `비밀번호가 변경되었습니다. 다시 로그인해주세요.`);
                    req.session.destroy();
                    res.redirect('/');
                  }
                });
              });
            };
          });
      });
  } else {
    alert.yellow(res, '로그인이 되어있지 않습니다');
    res.redirect('/');
  }
});

module.exports = router;