const nodemailer = require('nodemailer');

// 이메일 보내는 함수
exports.sendemail = function sendemail(MailHandler, toemail, title, txt){
    const transporter = nodemailer.createTransport(MailHandler);
    let mailoption = {
      form: 'stockpredict',
      to: toemail,
      subject: title,
      text: txt
    };
    transporter.sendMail(mailoption, function(err, info){
      if (err) {
          console.log(err);
      }
      transporter.close()
      });
  };
  
// Randomkey 생성 후 콜백에 보내주는 함수
exports.makerandomkey = function makerandomkey(req, callback){
    let randomkey = Math.floor(Math.random() * 10000000000 - 1);
    callback(req, randomkey);
  };
  
// 세션에 랜덤키를 저장해주는 함수
exports.savekeytosession = function savekeytosession(req, randomkey) {
    req.session.emailauth = randomkey;
  }