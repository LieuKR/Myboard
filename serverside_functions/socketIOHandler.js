// Socket.io 클라이언트의 소켓 전송에 대응하는 서버사이드 모듈
const MySqlHandler = require('./MySqlHandler.js');

exports = module.exports = function(io) {
    io.on('connection', (socket)=> {
        // 이 이하는 socket에 대한 이벤트들

        // 아이디 유효성 체크
        socket.on("checkID", function(data) {
            if (!/^[a-zA-Z0-9]{8,20}$/.test(data.postid)){
                io.to(data.socket_id).emit('idcheck', {checkvalue : 2});
            } else {
                MySqlHandler.board_main.query(`SELECT EXISTS (SELECT \`id\` FROM \`users\` WHERE \`id\`='${data.postid}') as success`,
                (err, rows1) => {
                  if(rows1[0].success == 1){
                    io.to(data.socket_id).emit('idcheck', {checkvalue : 1});
                  } else {
                    io.to(data.socket_id).emit('idcheck', {checkvalue : 0});
                  }
                })
            };
        });
        // 닉네임 유효성 체크
        socket.on("checkName", function(data) {
            if(data.postname.length == 0){
                io.to(data.socket_id).emit('namecheck', {checkvalue : 2});
            } else {
              MySqlHandler.board_main.query(`SELECT EXISTS (SELECT \`name\` FROM \`users\` WHERE \`name\`='${data.postname}') as success`,
            (err, rows1) => {
                if(rows1[0].success == 1){
                io.to(data.socket_id).emit('namecheck', {checkvalue : 1});
                } else {
                io.to(data.socket_id).emit('namecheck', {checkvalue : 0});
                }
              })
            }
        });

        // 이메일 유효성 체크
        socket.on("checkEmail", function(data) {
            let emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //이메일 정규식
            if (!emailRule.test(data.postEmail)){
                io.to(data.socket_id).emit('mailcheck', {checkvalue : 2});
            } else {
                MySqlHandler.board_main.query(`SELECT EXISTS (SELECT \`email\` FROM \`users\` WHERE \`email\`='${data.postEmail}') as success`,
                (err, rows1) => {
                  if(rows1[0].success == 1){
                    io.to(data.socket_id).emit('mailcheck', {checkvalue : 1});
                  } else {
                    io.to(data.socket_id).emit('mailcheck', {checkvalue : 0});
                  }
                })
            };
        });
    })
};