// server.js
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

app.get('/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./medicineData.json', 'utf8'));
  res.json(data);
});

app.post('/data', (req, res) => {
  fs.writeFileSync('./medicineData.json', JSON.stringify(req.body, null, 2));
  res.json({ status: 'saved' });
});

app.listen(3001, () => {
  console.log('API running at http://localhost:3001');
});

