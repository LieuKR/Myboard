const socket = io();
test = [0,0,0,0,0]; // test == [1,1,1,1,1]일때 회원가입 가능한 상태

// socket.io를 이용한 ID 서버 전송
IDinputed.oninput = function() {
    socket.emit('checkID', {postid: IDinputed.value, socket_id : socket.id});
};
// socket.io를 이용한 닉네임 서버 전송
Nameinputed.oninput = function() {
    socket.emit('checkName', {postname: Nameinputed.value, socket_id : socket.id});
};
// socket.io를 이용한 Email 서버 전송
Emailinputed.oninput = function() {
    socket.emit('checkEmail', {postEmail: Emailinputed.value, socket_id : socket.id});
};

// socket.io를 이용한 ID 유효성 검사 결과 출력
socket.on('idcheck', function (data) {
    if(data.checkvalue == 1){
        document.getElementById("IDchecknotice").innerHTML = '중복되는 아이디가 존재합니다.'
        document.getElementById("IDchecknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[0] = 0;
    } else if(data.checkvalue == 2) {
        document.getElementById("IDchecknotice").innerHTML = 'ID는 영문과 숫자로 구성된 8~20자리여야 합니다.'
        document.getElementById("IDchecknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[0] = 0;
    } else if(data.checkvalue == 0) {
        document.getElementById("IDchecknotice").innerHTML = '사용 가능한 아이디입니다!'
        document.getElementById("IDchecknotice").style = 'color:blue'
        test[0] = 1;
        if(test.reduce((a, b) => a + b, 0) == 5){
            document.getElementById('sign_submit_button').disabled = false;
        }
    }
});
// socket.io를 이용한 닉네임 유효성 검사 결과 출력
socket.on('namecheck', function (data) {
    if(data.checkvalue == 2){
        document.getElementById("Namechecknotice").innerHTML = '닉네임을 입력해 주세요'
        document.getElementById("Namechecknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[1] = 0;
    } else if (data.checkvalue == 1){
        document.getElementById("Namechecknotice").innerHTML = '중복되는 닉네임이 존재합니다.'
        document.getElementById("Namechecknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[1] = 0;
    } else if(data.checkvalue == 0) {
        document.getElementById("Namechecknotice").innerHTML = '사용 가능한 닉네임입니다!'
        document.getElementById("Namechecknotice").style = 'color:blue'
        test[1] = 1;
        if(test.reduce((a, b) => a + b, 0) == 5){
            document.getElementById('sign_submit_button').disabled = false;
        }
    };
});
// socket.io를 이용한 Email 유효성 검사 결과 출력
socket.on('mailcheck', function (data) {
    if(data.checkvalue == 1){
        document.getElementById("Mailchecknotice").innerHTML = '중복되는 이메일 주소가 존재합니다.'
        document.getElementById("Mailchecknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[2] = 0;
    } else if(data.checkvalue == 0) {
        document.getElementById("Mailchecknotice").innerHTML = '사용 가능한 이메일입니다!'
        document.getElementById("Mailchecknotice").style = 'color:blue'
        document.getElementById('sign_submit_button').disabled = true;
        test[2] = 1;
        if(test.reduce((a, b) => a + b, 0) == 5){
            document.getElementById('sign_submit_button').disabled = false;
        }
    } else if(data.checkvalue == 2) {
        document.getElementById("Mailchecknotice").innerHTML = '올바른 이메일 양식이 아닙니다.'
        document.getElementById("Mailchecknotice").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[2] = 0;
    }
});
// 입력된 PW 유효성 검사. 보안상의 문제로 클라이언트에서 검사 후 사용.
// PW 양식 확인

PWinputed_1.oninput = function() {
    if(PWinputed_1.value.length > 20 || PWinputed_1.value.length < 8){
        document.getElementById("PWchecknotice1").innerHTML = '비밀번호는 8자리 이상, 20자리 이하이어야 합니다.'
        document.getElementById('sign_submit_button').disabled = true;
        document.getElementById("PWchecknotice1").style = 'color:red'
        test[3] = 0;
    } else if(!/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/.test(PWinputed_1.value)){
        document.getElementById("PWchecknotice1").innerHTML = '비밀번호는 숫자나, 특수문자를 포함해야 합니다.'
        document.getElementById('sign_submit_button').disabled = true;
        document.getElementById("PWchecknotice1").style = 'color:red'
        test[3] = 0;
    } else {
        document.getElementById("PWchecknotice1").innerHTML = '사용 가능한 비밀번호입니다.'
        document.getElementById("PWchecknotice1").style = 'color:blue'
        test[3] = 1;
        if(test.reduce((a, b) => a + b, 0) == 5){
            document.getElementById('sign_submit_button').disabled = false;
        }
    }
    if(PWinputed_1.value !== PWinputed_2.value){
        document.getElementById("PWchecknotice2").innerHTML = '서로 같은 비밀번호를 입력해 주세요.'
        document.getElementById("PWchecknotice2").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[4] = 0;
    } else {
        document.getElementById("PWchecknotice2").innerHTML = '서로 같은 비밀번호가 입력되었습니다.'
        document.getElementById("PWchecknotice2").style = 'color:blue'
        test[4] = 1;
        if(test.reduce((a, b) => a + b, 0) == 5){
            document.getElementById('sign_submit_button').disabled = false;
        }
    }
};
// 같은 PW 입력 확인
PWinputed_2.oninput = function() {
    if(PWinputed_1.value !== PWinputed_2.value){
        document.getElementById("PWchecknotice2").innerHTML = '서로 같은 비밀번호를 입력해 주세요.'
        document.getElementById("PWchecknotice2").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[4] = 0;
    } else {
        document.getElementById("PWchecknotice2").innerHTML = '서로 같은 비밀번호가 입력되었습니다.'
        document.getElementById("PWchecknotice2").style = 'color:blue'
        test[4] = 1;
        if(test.reduce((a, b) => a + b, 0) == 5){
            document.getElementById('sign_submit_button').disabled = false;
        }
    }
};