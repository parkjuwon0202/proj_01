const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let events = []; 

app.get('/events', (req, res) => {
  res.json(events);
});

app.post('/events', (req, res) => {
  const { title, date } = req.body;
  const newEvent = { id: Date.now(), title, date }; 
  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, date } = req.body;

  const eventIndex = events.findIndex(event => event.id === parseInt(id));
  if (eventIndex === -1) return res.status(404).json({ message: 'Event not found' });

  events[eventIndex] = { id: parseInt(id), title, date }; 
  res.json(events[eventIndex]);
});

app.delete('/events/:id', (req, res) => {
  const { id } = req.params;
  events = events.filter(event => event.id !== parseInt(id));
  res.status(204).end(); 
});

app.get('/events/search', (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ message: "검색할 제목을 입력하세요." });
  }

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(title.toLowerCase())
  );

  res.json(filteredEvents);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


