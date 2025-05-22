// server.js
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Дані зберігаємо в пам'яті (перезаписуються при рестарті сервера)
let stats = {
  date: new Date().toISOString().slice(0, 10),
  visitors: 0,
  totalClicks: 0,
  petitionClicks: {},
};

// Оновлення дати і скидання лічильників щодня
function resetIfNewDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (stats.date !== today) {
    stats = {
      date: today,
      visitors: 0,
      totalClicks: 0,
      petitionClicks: {},
    };
  }
}

// Коли хтось заходить (реєструємо візит)
app.post("/visit", (req, res) => {
  resetIfNewDay();
  stats.visitors++;
  res.json({ visitors: stats.visitors });
});

// Коли хтось клікає по петиції
app.post("/click", (req, res) => {
  resetIfNewDay();
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing id" });

  stats.totalClicks++;
  stats.petitionClicks[id] = (stats.petitionClicks[id] || 0) + 1;

  res.json({
    totalClicks: stats.totalClicks,
    petitionClicks: stats.petitionClicks,
  });
});

// Віддаємо поточну статистику
app.get("/stats", (req, res) => {
  resetIfNewDay();
  res.json(stats);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
