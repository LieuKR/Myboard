// 입력된 PW 유효성 검사. 보안상의 문제로 클라이언트에서 검사 후 사용.
test = [0,0];
PWinputed_1.oninput = function() {
    if(PWinputed_1.value.length > 20 || PWinputed_1.value.length < 8){
        document.getElementById("PWchecknotice1").innerHTML = '비밀번호는 8자리 이상, 20자리 이하이어야 합니다.'
        document.getElementById('sign_submit_button').disabled = true;
        document.getElementById("PWchecknotice1").style = 'color:red'
        test[0] = 0;
    } else if(!/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/.test(PWinputed_1.value)){
        document.getElementById("PWchecknotice1").innerHTML = '비밀번호는 숫자나, 특수문자를 포함해야 합니다.'
        document.getElementById('sign_submit_button').disabled = true;
        document.getElementById("PWchecknotice1").style = 'color:red'
        test[0] = 0;
    } else {
        document.getElementById("PWchecknotice1").innerHTML = '사용 가능한 비밀번호입니다.'
        document.getElementById("PWchecknotice1").style = 'color:blue'
        test[0] = 1;
        if(test.reduce((a, b) => a + b, 0) == 2){
            document.getElementById('sign_submit_button').disabled = false;
        }
    }
    if(PWinputed_1.value !== PWinputed_2.value){
        document.getElementById("PWchecknotice2").innerHTML = '서로 같은 비밀번호를 입력해 주세요.'
        document.getElementById("PWchecknotice2").style = 'color:red'
        document.getElementById('sign_submit_button').disabled = true;
        test[1] = 0;
    } else {
        document.getElementById("PWchecknotice2").innerHTML = '서로 같은 비밀번호가 입력되었습니다.'
        document.getElementById("PWchecknotice2").style = 'color:blue'
        test[1] = 1;
        if(test.reduce((a, b) => a + b, 0) == 2){
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
        test[1] = 0;
    } else {
        document.getElementById("PWchecknotice2").innerHTML = '서로 같은 비밀번호가 입력되었습니다.'
        document.getElementById("PWchecknotice2").style = 'color:blue'
        test[1] = 1;
        if(test.reduce((a, b) => a + b, 0) == 2){
            document.getElementById('sign_submit_button').disabled = false;
        }
    }
};