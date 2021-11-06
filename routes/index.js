var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const db = require('../database/connect/maria');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// get sample from db
router.get('/sample', function (req, res) {
  db.query('SELECT * FROM student_csv AS t1 JOIN (SELECT id FROM student_csv ORDER BY RAND() LIMIT 5) as t2 ON t1.id=t2.id', function (err, rows, fields) {
    if (!err) {
      res.send(rows);
    } else {
      console.log('err: ' + err);
      res.send(err);
    }
  });
});

// Create table in db
router.get('/create', function (req, res) {
  var tableName = req.query.table_name;

  if (!tableName || tableName === '')
    res.send('생성할 테이블 명을 쿼리에 입력해 주세요.  (/create?table_name={테이블명})');
  else {
    var sql = 'show tables where tables_in_apm_mobile = "' + tableName + '"';
    db.query(sql, function (err, rows, fields) {
      if (!err && rows.length === 0) {
        var sql = 'CREATE TABLE ' + tableName + '('
          + 'id INT(5) NOT NULL,'
          + 'NAME VARCHAR(200) NULL DEFAULT NULL COLLATE utf8mb3_general_ci,'
          + 'PRIMARY KEY (id) USING BTREE)';
        db.query(sql, function (err, rows, fields
        ) {
          if (!err) {
            res.send('데이터베이스에 "' + tableName + '"라는 테이블이 생성 되었습니다.');
          } else {
            console.log('err: ' + err);
            res.send(err);
          }
        });
      } else {
        res.send('해당 명의 테이블이 존재합니다. 다른 명을 사용하세요!');
      }
    });
  }
});

// Delete table from db
router.get('/drop', function (req, res) {
  var tableName = req.query.table_name;

  if (!tableName || tableName === '')
    res.send('삭제할 테이블 명을 쿼리에 입력해 주세요.  (/drop?table_name={테이블명})');
  else {
    var sql = 'show tables where tables_in_apm_mobile = "' + tableName + '"';
    db.query(sql, function (err, rows, fields) {
      if (!err && rows.length !== 0) {
        var sql = 'DROP TABLE ' + tableName;
        db.query(sql, function (err, rows, fields
        ) {
          if (!err) {
            res.send('데이터베이스에서 테이블"' + tableName + '"을 삭제하였습니다.');
          } else {
            res.send(err);
            console.log('err: ' + err);
          }
        });
      } else {
        res.send('해당 명의 테이블이 존재하지 않습니다. 다른 테이블을 삭제하세요!');
      }
    });
  }
});
//////////////////////////////////////////////////////

// Insert data into table
router.post('/insert', function (req, res) {
  var stdName = req.query.stdName;
  var stdSubject = req.query.stdSubject;
  var stdScore = req.query.stdScore;
  var stdGender = req.query.stdGender;
  var stdAddress = req.query.stdAddress;
  var stdPhone = req.query.stdPhone;

  if (!stdName || stdName === '' || !stdSubject || stdSubject === '' || !stdScore || stdScore === ''){
    res.send('학생의 "이름, 방, 점수"의 3가지 정보를 꼭 입력해 주세요.');
  }
  else {
    var sql = 'insert into student_csv (name, subject, score, gender, address, phone) values (?, ?, ?, ?, ?, ?)';
    var params = [stdName, stdSubject, stdScore, stdGender, stdAddress, stdPhone];
    db.query(sql, params, function (err, rows, fields) {
      if (!err) {
        res.send('데이터베이스에 학생 정보를 저장하였습니다.');
      } else {
        console.log('err: ' + err);
        res.send(err);
      }
    });
  }
});

// Select data from table
router.post('/select', function (req, res) {
  var stdName = req.query.stdName;
  var stdSubject = req.query.stdSubject;
  var stdScore = req.query.stdScore;
  var stdGender = req.query.stdGender;
  var stdAddress = req.query.stdAddress;
  var stdPhone = req.query.stdPhone;

  if ((stdName && stdName !== '') || (stdSubject && stdSubject !== '') || (stdScore && stdScore !== '')){
    var sql = 'select * from student_csv where name=? || subject=? || score=?;';
    var params = [stdName, stdSubject, stdScore];
    db.query(sql, params, function (err, rows, fields) {
      if (!err) {
        res.send(rows);
      } else {
        console.log('err: ' + err);
        res.send(err);
      }
    });    
  } else {
    res.send('학생의 "이름, 방, 점수" 중 1개라도 입력해야 해당 학생들 정보를 볼 수 있습니다.');
  }
})

// Update data into table
router.post('/update', function (req, res) {
  var stdId = req.query.stdId;
  var stdName = req.query.stdName;
  var stdSubject = req.query.stdSubject;
  var stdScore = req.query.stdScore;
  var stdGender = req.query.stdGender;
  var stdAddress = req.query.stdAddress;
  var stdPhone = req.query.stdPhone;

  if (!stdName || stdName === '' && !stdSubject || stdSubject === '' && !stdScore || stdScore === ''){
    console.log('b1');
    res.send('학생의 "이름, 방, 점수"의 정보를 꼭 입력해 주세요.');
  }
  else {
    var sql = 'UPDATE student_csv set name=?, subject=?, score=?, gender=?, address=?, phone=? where id=?';
    var params = [stdName, stdSubject, stdScore, stdGender, stdAddress, stdPhone, stdId];
    console.log(sql);
    console.log(params);
    db.query(sql, params, function (err, rows, fields) {
      if (!err) {
        res.send('학생 "' + stdName + '"의 정보를 수정하였습니다.');
      } else {
        console.log('err: ' + err);
        res.send(err);
      }
    });
  }
});

// Delete data from table
router.post('/delete', function (req, res) {
  var stdId = req.query.stdId;
  var stdName = req.query.stdName;
  var stdSubject = req.query.stdSubject;
  var stdScore = req.query.stdScore;
  var stdGender = req.query.stdGender;
  var stdAddress = req.query.stdAddress;
  var stdPhone = req.query.stdPhone;

  if ((stdId && stdId !== '') && (stdName && stdName !== '')){
  var sql = 'delete from student_csv where id=? && name=?';
  params = [stdId, stdName];
  db.query(sql, params, function (err, result) {
    if (!err) {
      console.log(result.affectedRows)
      res.send('데이터베이스에서 해당 학생 정보를 삭제했습니다.');
    } else {
      console.log('err: ' + err);
      res.send(err);
    }
  });
  } else {
    res.send('해당 학생 정보가 없습니다.');
  }
});

/* GET method. */
router.get('/api/get/demo', function (req, res) {
  res.status(200).json({
    'message': 'call get api demo'
  });
});

/* POST method. */
router.post('/api/post/demo', function (req, res) {
  res.status(200).json({
    'message': 'call post api demo'
  });
});

module.exports = router;