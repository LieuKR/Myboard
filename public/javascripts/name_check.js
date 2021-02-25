const socket = io();

// socket.io를 이용한 닉네임 서버 전송
Nameinputed.oninput = function() {
    socket.emit('checkName', {postname: Nameinputed.value, socket_id : socket.id});
};
// socket.io를 이용한 닉네임 유효성 검사 결과 출력
socket.on('namecheck', function (data) {
    if(data.checkvalue == 2){
        document.getElementById("checknotice").innerHTML = '닉네임을 입력해 주세요'
        document.getElementById("checknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
    } else if(data.checkvalue == 1){
        document.getElementById("checknotice").innerHTML = '중복되는 닉네임이 존재합니다.'
        document.getElementById("checknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
    } else if(data.checkvalue == 0) {
        document.getElementById("checknotice").innerHTML = '사용 가능한 닉네임입니다!'
        document.getElementById("checknotice").style = 'color:blue'
        document.getElementById('sign_submit_button').disabled = false;
    };
});