const express = require('express');
const app = express();
const port = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// Map을 간단한 DB로 사용
const productDB = new Map();

// 모든 상품 조회
app.get('/products', (req, res) => {
  const products = Array.from(productDB.values());
  res.json(products);
});

// 상품 ID로 조회
app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const product = productDB.get(parseInt(id));

  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }

  res.json(product);
});

// 상품 등록
app.post('/products', (req, res) => {
  const { id, name, price } = req.body;

  if (!id || !name || typeof price !== 'number') {
    return res.status(400).json({ message: '유효하지 않은 요청입니다.' });
  }

  if (productDB.has(id)) {
    return res.status(409).json({ message: '이미 존재하는 상품 ID입니다.' });
  }

  const newProduct = { id, name, price };
  productDB.set(id, newProduct);

  res.status(201).json(newProduct);
});

app.listen(port, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});