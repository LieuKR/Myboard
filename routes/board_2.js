var express = require('express');
var router = express.Router();
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');
const alert = require('../serverside_functions/alertfunctions.js');
const board_func = require('../serverside_functions/board_func.js');

let board_name = '제 2 게시판';
let board_address = 'board_2';

// 글 목록 페이지
router.get('/list/:page', function(req, res, next) {
  MySqlHandler.board_2.query(`SELECT * FROM \`board\` ORDER BY \`no\` DESC LIMIT ${15 * (req.params.page - 1)},15`,
        (err, rows1) => {
          if(err) {throw err}
          else {
            rows1.map(x => board_func.dateform_list_time(x));
            MySqlHandler.board_2.query('SELECT COUNT(*) FROM \`board\`',
              (err, rows2) => {
                res.render('list', {pageinfo: board_name, greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
                  board_address : board_address , loginid : req.session.loginid, list : rows1, page : parseInt(req.params.page), maxpage : Math.ceil(Object.values(rows2[0])[0] / 15)});
              });
            }
        });
});

// 검색 페이지
router.get('/search/:page', function(req, res) {
  if(req.query.search_type == 'title&contents'){
    MySqlHandler.board_2.query(`SELECT * FROM \`board\` WHERE \`title\` LIKE '%${req.query.keyword}%' OR \`contents_plain\` LIKE '%${req.query.keyword}%'
    ORDER BY \`no\` DESC`,
    (err, rows1) => {
      rows1.map(x => board_func.dateform_list_time(x));
      if(err) {throw err}
      else {
        res.render('list_search', {pageinfo: board_name+' 검색', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
        board_address : board_address, loginid : req.session.loginid, list : rows1, page : parseInt(req.params.page), maxpage : Math.ceil(rows1.length / 15)});
      };
    })
  } else if(req.query.search_type == 'title'){
    MySqlHandler.board_2.query(`SELECT * FROM \`board\` WHERE \`title\` LIKE '%${req.query.keyword}%' ORDER BY \`no\` DESC`,
    (err, rows1) => {
      if(err) {throw err}
      else {
        res.render('list_search', {pageinfo: board_name+' 검색', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
        board_address : board_address, loginid : req.session.loginid, list : rows1, page : parseInt(req.params.page), maxpage : Math.ceil(rows1.length / 15)});
      };
    })
  } else if(req.query.search_type == 'contents'){
    MySqlHandler.board_2.query(`SELECT * FROM \`board\` WHERE \`contents_plain\` LIKE '%${req.query.keyword}%' ORDER BY \`no\` DESC`,
    (err, rows1) => {
      if(err) {throw err}
      else {
        res.render('list_search', {pageinfo: board_name+' 검색', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
        board_address : board_address, loginid : req.session.loginid, list : rows1, page : parseInt(req.params.page), maxpage : Math.ceil(rows1.length / 15)});
      };
    })
  } else if(req.query.search_type == 'writer'){
    MySqlHandler.board_2.query(`SELECT * FROM \`board\` WHERE \`writer\` LIKE '%${req.query.keyword}%' ORDER BY \`no\` DESC`,
    (err, rows1) => {
      if(err) {throw err}
      else {
        res.render('list_search', {pageinfo: board_name+' 검색', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
        board_address : board_address, loginid : req.session.loginid, list : rows1, page : parseInt(req.params.page), maxpage : Math.ceil(rows1.length / 15)});
      };
    })
  }
});

// 글 쓰기 페이지
router.get('/write', function(req, res, next) {
  if(req.session.loginid == undefined){
    alert.yellow(res, '로그인이 필요합니다')
    res.redirect('back')
  } else if(req.session.loginid.class == 1){
    res.render('write', {pageinfo: board_name+' 글 쓰기', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
    board_address : board_address, loginid : req.session.loginid});
  } else {
    alert.yellow(res, '이메일 인증이 필요합니다')
    res.redirect('back')
  }
});

// 글 저장 post 페이지
router.post('/write', function(req, res) {
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  MySqlHandler.board_2.query(`INSERT INTO \`board\` (title, contents, contents_plain, writer, writer_id, time, readnumber, commentnumber) VALUES ('${req.body.title}',
     '${req.body.contents}', '${req.body.contents_plain}',  '${req.session.loginid.name}', '${req.session.loginid.id}', '${date}', '0', '0');`, 
        (err, rows) => {
          if(err) {throw err}
          else {
            alert.green(res, '글이 작성되었습니다');
            res.redirect(`/${board_address}/list/1`);
          }
        });
});

// 글 내용 보기 페이지
router.get('/read/:no', function(req, res, next) {
  // 글 내용 DB에서 데이터 가져오기
  MySqlHandler.board_2.query(`SELECT * FROM \`board\` WHERE \`no\`='${req.params.no}'`, 
        (err, rows1) => {
          if(rows1[0] == undefined) {
            alert.yellow(res, '존재하지 않는 글입니다');
            res.redirect(`/${board_address}/list/1`)
          }
          else {
            if(rows1[0].time_update){
              rows1.map(x => board_func.dateform_time_update(x));
            }
            rows1.map(x => board_func.dateform_time_comment(x));
            // 댓글 가져오기
            MySqlHandler.board_2.query(`SELECT * FROM \`comments\` WHERE \`no\`='${req.params.no}' ORDER BY \`target\` ASC LIMIT 0,10`, 
            (err, rows2) => {
              rows2.map(x => board_func.dateform_time_comment(x));
              // 조회수 증가
              MySqlHandler.board_2.query(`UPDATE \`board\` SET readnumber = readnumber + 1 where \`no\` = '${req.params.no}'`,
              (err, rows3) => {
                res.render('read', {pageinfo: rows1[0].title, greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
                board_address : board_address, loginid : req.session.loginid, readdata : rows1[0], commentdata : rows2, comment_page : 1});
              });
            });
          }
        });
});

// 글 내용 보기 - post 댓글 페이징용 페이지
router.post('/read/:no', function(req, res, next) {
  // 글 내용 DB에서 데이터 가져오기
  MySqlHandler.board_2.query(`SELECT * FROM \`board\` WHERE \`no\`='${req.params.no}'`, 
        (err, rows1) => {
    if(rows1[0].time_update){
      rows1.map(x => board_func.dateform_time_update(x));
    }
    rows1.map(x => board_func.dateform_time_comment(x));
    // 댓글 가져오기
    MySqlHandler.board_2.query(`SELECT * FROM \`comments\` WHERE \`no\`='${req.params.no}' ORDER BY \`target\` ASC LIMIT ${10 * (req.body.comment_page - 1)},10`, 
    (err, rows2) => {
      rows2.map(x => board_func.dateform_time_comment(x));
      // 조회수 증가
      MySqlHandler.board_2.query(`UPDATE \`board\` SET readnumber = readnumber + 1 where \`no\` = '${req.params.no}'`,
      (err, rows3) => {
        res.render('read', {pageinfo: rows1[0].title, greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
        board_address : board_address, loginid : req.session.loginid, readdata : rows1[0], commentdata : rows2, comment_page : req.body.comment_page});
      });
    });
  });
});

// 글 수정 작성 페이지
router.get('/update/:no', function(req, res, next) {
  if(req.session.loginid) {
    MySqlHandler.board_2.query(`SELECT * FROM \`board\` WHERE \`no\`='${req.params.no}'`, 
      (err, rows) => {
        if(rows[0] == undefined) {
          alert.yellow(res, '존재하지 않는 글입니다');
          res.redirect(`/${board_address}/list/1`)
        } else if(rows[0].writer_id == req.session.loginid.id) {
          res.render('update', {pageinfo: board_name+' 글 수정', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert, board_name: board_name,
          board_address : board_address, loginid : req.session.loginid, readdata : rows[0]});
        } else {
          alert.yellow(res, '자신의 글만 수정할 수 있습니다')
          res.redirect('back')
        }
    });
  } else {
    alert.yellow(res, '로그인이 필요합니다')
    res.redirect('back')
  }
});

// 글 수정 post 처리 페이지
router.post('/update/:no', function(req, res, next) {
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  MySqlHandler.board_2.query(`UPDATE \`board\` SET \`title\` = '${req.body.title}', \`contents\` = '${req.body.contents}',
    \`contents_plain\` = '${req.body.contents_plain}', \`time_update\` = '${date}'  WHERE \`no\`= ${req.params.no}`, 
    (err, rows) => {
      if(err) {throw err}
      else {
        alert.green(res, '글이 수정되었습니다');
        res.redirect(`/${board_address}/read/${req.params.no}`)
      }
    });
});

// 글 삭제 post 처리
router.post('/delete', function(req, res, next) {
  if(req.session.loginid){
    MySqlHandler.board_2.query(`SELECT \`no\` FROM \`board\` WHERE \`no\`= ${req.body.no} AND \`writer_id\` = '${req.session.loginid.id}'`, 
    (err, rows1) => {
      if(err) {throw err}
      else if (rows1[0] == undefined) {
        alert.yellow(res, '타인의 글은 삭제할 수 없습니다')
        res.redirect(`back`)
      } else {
        // 글 삭제 시퀀스
        MySqlHandler.board_2.query(`DELETE FROM \`board\` WHERE \`no\`= ${rows1[0].no}`, 
          (err, rows2) => {
            // 글에 딸린 댓글 삭제 시퀀스
            MySqlHandler.board_2.query(`DELETE FROM \`comments\` WHERE \`no\`= ${rows1[0].no}`, 
            (err, rows2) => {
              if(err) {throw err}
              else {
                alert.green(res, `${rows1[0].no}번 글이 삭제되었습니다`);
                res.redirect(`/${board_address}/list/1`)
              }
            })
          });
      }
    });
  } else {
    alert.yellow(res, '로그인이 필요합니다')
    res.redirect('back')
  }
});

// 댓글 작성 post 처리 페이지
router.post('/comment', function(req, res, next) {
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  if(req.session.loginid){
    MySqlHandler.board_2.query(`INSERT INTO \`comments\` (no, target, writer, writer_id, time, contents, class) VALUES ('${req.body.no}',
    0, '${req.session.loginid.name}', '${req.session.loginid.id}', '${date}', '${req.body.comment}', 0);`,
    (err, rows1) => {
      if(err) {throw err}
      else {
        MySqlHandler.board_2.query(`UPDATE \`board\` SET commentnumber = commentnumber + 1 where \`no\` = '${req.body.no}'`,
          (err, rows2) => {
            MySqlHandler.board_2.query(`UPDATE \`comments\` SET target = LAST_INSERT_ID() where \`id\` = LAST_INSERT_ID()`,
              (err, rows3) => {
                if(err) {throw err} else {
                  alert.green(res, '댓글이 작성되었습니다')
                  res.redirect('back')
                }  
              })
          });
        };
      })
  } else {
    alert.yellow(res, '로그인이 필요합니다')
    res.redirect('back')
  }
});

// 대댓글 작성 post 처리 페이지
router.post('/comment_comment', function(req, res, next) {
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  if(req.session.loginid){
    MySqlHandler.board_2.query(`INSERT INTO \`comments\` (no, target, writer, writer_id, time, contents, class) VALUES ('${req.body.no}',
    '${req.body.target}', '${req.session.loginid.name}', '${req.session.loginid.id}', '${date}', '${req.body.comment_comment}', 1);`,
    (err, rows1) => {
      if(err) {throw err}
      else {
        MySqlHandler.board_2.query(`UPDATE \`board\` SET commentnumber = commentnumber + 1 where \`no\` = '${req.body.no}'`,
          (err, rows2) => {
            if(err) {throw err} else {
              alert.green(res, '대댓글이 작성되었습니다')
              res.redirect('back')
            }
          });
        };
      })
  } else {
    alert.yellow(res, '로그인이 필요합니다')
    res.redirect('back')
  }
});

// 댓글 삭제 post 처리 페이지
router.post('/deletecomment', function(req, res, next) {
  if(req.session.loginid){
    if(req.session.loginid.id == req.body.writer_id){
      MySqlHandler.board_2.query(`SELECT EXISTS (SELECT * FROM \`comments\` WHERE \`class\`= 1 and \`target\` = '${req.body.commentid}') as success;`, 
        (err, rows1) => {
          if(err) {throw err}
          else if (rows1[0].success == 1){
            alert.green(res, `대댓글이 존재할 경우 삭제할 수 없습니다`);
            res.redirect('back');
          } else {
            MySqlHandler.board_2.query(`DELETE FROM \`comments\` WHERE \`id\`= ${req.body.commentid}`,
            (err, rows2) => {
              if(err) {throw err}
              else {
                MySqlHandler.board_2.query(`UPDATE \`board\` SET commentnumber = commentnumber - 1 where \`no\` = '${req.body.no}'`,
                  (err, rows2) => {
                    if(err) {throw err} else {
                      alert.green(res, '댓글이 삭제되었습니다')
                      res.redirect('back')
                    }
                });
              };
          });
        }
      })
    } else {
      alert.yellow(res, '타인의 댓글은 삭제할 수 없습니다')
      res.redirect(`back`)
      }
  } else {
    alert.yellow(res, '로그인이 필요합니다')
    res.redirect('back')
  }
});

//대댓글 삭제 post 처리 페이지
router.post('/delete_c_comment', function(req, res, next) {
  if(req.session.loginid){
    if(req.session.loginid.id == req.body.c_comment_writer_id){
      MySqlHandler.board_2.query(`DELETE FROM \`comments\` WHERE \`id\`= ${req.body.c_comment_id}`,
      (err, rows1) => {
        if(err) {throw err}
        else {
          MySqlHandler.board_2.query(`UPDATE \`board\` SET commentnumber = commentnumber - 1 where \`no\` = '${req.body.no}'`,
          (err, rows2) => {
            if(err) {throw err} else {
              alert.green(res, '대댓글이 삭제되었습니다')
              res.redirect('back')
            }
          });
        }
      });
    } else {
      alert.yellow(res, '타인의 댓글은 삭제할 수 없습니다')
      res.redirect(`back`)
    }     
  } else {
    alert.yellow(res, '로그인이 필요합니다')
    res.redirect('back')
  }
});

module.exports = router;