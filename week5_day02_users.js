const express = require('express');
const router = express.Router();
const db = require('../db');

router.use(express.json());

// 로그인
router.post('/signin', (req, res) => {
  const { userId, userPw } = req.body;

  const query = 'SELECT * FROM members WHERE user_id = ?';
  db.query(query, userId, (error, results) => {
    if (error)
      return res.status(500).json({ success: false, message: '처리 중 오류가 발생했습니다.' });

    const user = results[0];
    if (!user || user.user_pw !== userPw) {
      return res.status(401).json({ success: false, message: '입력한 정보를 다시 확인해주세요.' });
    }

    res.status(200).json({ success: true, message: `${user.display_name}님, 환영합니다.` });
  });
});

// 회원가입
router.post('/register', (req, res) => {
  const { userId, displayName, userPw, phone } = req.body;

  if (!userId || !displayName || !userPw || !phone) {
    return res.status(400).json({ success: false, message: '모든 항목을 입력해주세요.' });
  }

  const query = 'INSERT INTO members (user_id, display_name, user_pw, phone) VALUES (?, ?, ?, ?)';
  const params = [userId, displayName, userPw, phone];

  db.query(query, params, (error, result) => {
    if (error)
      return res.status(500).json({ success: false, message: '계정 생성 중 문제가 발생했습니다.' });

    res.status(201).json({ success: true, message: '계정이 성공적으로 생성되었습니다.' });
  });
});

// 사용자 조회
router.get('/member', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, message: '아이디가 필요합니다.' });

  const query = 'SELECT * FROM members WHERE user_id = ?';
  db.query(query, userId, (error, results) => {
    if (error)
      return res.status(500).json({ success: false, message: '정보를 가져오는 데 실패했습니다.' });

    res.status(200).json({ success: true, data: results });
  });
});

// 계정 삭제
router.delete('/member', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, message: '아이디가 필요합니다.' });

  const query = 'DELETE FROM members WHERE user_id = ?';
  db.query(query, userId, (error, result) => {
    if (error)
      return res.status(500).json({ success: false, message: '계정을 삭제할 수 없습니다.' });

    res.status(200).json({ success: true, message: '계정이 삭제되었습니다.' });
  });
});

module.exports = router;
