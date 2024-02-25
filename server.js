const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const leaderboardFile = 'leaderboard.txt';

// Middleware, um JSON-Anfragen zu verarbeiten
app.use(express.json());

// Route zum Abrufen des Leaderboards
app.get('/leaderboard', (req, res) => {
  fs.readFile(leaderboardFile, (err, data) => {
    if (err) {
      // Wenn die Datei nicht existiert, sende ein leeres Array
      if (err.code === 'ENOENT') {
        return res.json([]);
      }
      return res.status(500).send('Server error');
    }
    const scores = data.toString().split('\n').filter(line => line).map(line => {
      const [username, score] = line.split(',');
      return { username, score: parseInt(score, 10) };
    });
    res.json(scores);
  });
});

// Route zum Hinzufügen eines neuen Scores
app.post('/submit', (req, res) => {
  const { username, score } = req.body;
  const newEntry = `${username},${score}\n`;

  fs.appendFile(leaderboardFile, newEntry, (err) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    res.status(200).send('Score added');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
