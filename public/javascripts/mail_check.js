const socket = io();

// socket.io를 이용한 Email 서버 전송
Emailinputed.oninput = function() {
        socket.emit('checkEmail', {postEmail: Emailinputed.value, socket_id : socket.id});
    };

// socket.io를 이용한 Email 유효성 검사 결과 출력
socket.on('mailcheck', function (data) {
    if(data.checkvalue == 1){
        document.getElementById("checknotice").innerHTML = '중복되는 이메일 주소가 존재합니다.'
        document.getElementById("checknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
    } else if(data.checkvalue == 0) {
        document.getElementById("checknotice").innerHTML = '사용 가능한 이메일입니다!'
        document.getElementById("checknotice").style = 'color:blue'
        document.getElementById('sign_submit_button').disabled = false;
    } else if(data.checkvalue == 2) {
        document.getElementById("checknotice").innerHTML = '올바른 이메일 양식이 아닙니다.'
        document.getElementById("checknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
    }
});