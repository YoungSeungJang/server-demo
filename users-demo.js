// express 모듈 불러오기
const express = require('express');
const app = express();

app.use(express.json());
app.listen(7777);

// 사용자 정보를 저장할 Map 객체
let users = new Map();
let userCounter = 1;

// 회원가입
app.post('/join', (req, res) => {
  const newUser = req.body;

  if (!newUser || !newUser.name || !newUser.userId) {
    return res.status(400).json({ message: '필수 정보를 모두 입력해주세요.' });
  }

  users.set(userCounter, newUser);

  res.status(201).json({
    message: `${newUser.name}님, 가입을 환영합니다!`,
  });

  userCounter++;
});

// 로그인 (추후 구현 가능)
app.post('/login', (req, res) => {
  // 로그인 기능은 아직 구현되지 않음
  res.status(501).json({ message: '로그인 기능은 아직 준비 중입니다.' });
});

// 특정 사용자 조회
app.get('/users/:userId', (req, res) => {
  const requestedId = Number(req.params.userId);
  const foundUser = users.get(requestedId);

  if (!foundUser) {
    return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
  }

  res.status(200).json({
    userId: foundUser.userId,
    name: foundUser.name,
  });
});

// 사용자 탈퇴
app.delete('/users/:userId', (req, res) => {
  const targetId = Number(req.params.userId);
  const deletingUser = users.get(targetId);

  if (!deletingUser) {
    return res.status(404).json({ message: '존재하지 않는 사용자입니다.' });
  }

  users.delete(targetId);

  res.status(200).json({
    message: `${deletingUser.name}님, 탈퇴 처리되었습니다.`,
  });
});

/* 
## 개발 세계에서, 핸들러란?

- 안드로이드에 굉장히 필수적인 개념으로 알려져 있는 용어
- 사실 프로그래밍 언어 모든 곳에서 사용하는 용어, 넓은 의미로 사용되는 단어라, 쓰는 환경에 따라 뜻하는 의미가 조금씩 다름.
- 학문적으로 아직 논쟁이 있다고 봄
- 일반적인 의미는 **요청에 의해 호출되는 메소드를 뜻한다**

---

- HTTP request가 날아오면 자동으로 호출되는 메소드
- 노드 : 콜백함수로 , app.HTTPMETHOD(path, 핸들러)

## HTTP 상태 코드

HTTP(인터넷 상에서 통신할때 사용하는 규약)안에 작성되어서 들어가는 “상태”

- 2** : 성공
    - 조회/수정/삭제 성공 : 200
    - 등록 성공 : 201
- 4** : 클라이언트 잘못
    - 찾는 페이지 없음 (url에 맞는 api 없음) : 404
    - 요청한 연산(처리)을 할 때 필요한 데이터(req)가 덜 왔을 때 : 400
- 5** : 서버 잘못
    - 서버가 죽었을 때 (서버가 크리티컬한 오류를 맞았을 때) : 500

**✨클라이언트(사용자, 화면)와 소통을 정확하게 하기 위함**

---

## 미니실습 (진짜 유튜브 운영하는 것처럼)

회원은 계정 1개당 채널 100개를 가질 수 있다.

- 회원
    - 로그인 **POST /login**
        - 로그인 페이지
            - 화면 완성 API 필요 없다.
            - 로그인 버튼 클릭 ⇒ id, pwd 로그인 시켜줄 API
        - req : body(id, pwd)
        - res : `${name}님 환영합니다.` => **메인 페이지**
    - 회원 가입 **POST /join**
        - 회원 가입 페이지
            - 화면 생성 API 필요없다.
            - 회원 가입 버튼 클릭시 ⇒ id, pwd, 이름 ⇒ 회원 가입 시켜줄 API
        - req : body(id, pwd, name)
        - res : `${name}님 환영합니다` => **로그인 페이지**
    - 회원 탈퇴
        - 마이 페이지
            - 화면 생성 API 필요 ⇒ 회원 개별 정보 조회 API
                - **GET /users/:id**
                - req : URL(id)
                - res : userid, name
            - 회원 탈퇴 클릭시 ⇒ 회원 개별 탈퇴를 시켜줄 API
                - **DELETE /users/:id**
                - req : URL(id)
                - res : `${name}님 다음에 또 뵙겠습니다` =>**메인페이지**
*/
