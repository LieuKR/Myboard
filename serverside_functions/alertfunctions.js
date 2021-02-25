/* 알람 함수들. 쿠키를 만들면 그 내용이 알람에 나오게 함.*/

// 좋은 알람 (초록색으로 표시됨)
exports.green = function (res, alerttext) {
    res.cookie('greenalert', alerttext ,{maxAge: 1000 * 1});
  };
  // 안좋은 알람 (노란색으로 표시됨)
exports.yellow = function (res, alerttext) {
    res.cookie('yellowalert', alerttext ,{maxAge: 1000 * 1});
  };