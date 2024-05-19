const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); 

const queues = {};

app.post('/api/:queue_name', (req, res) => {
  const queueName = req.params.queue_name;
  const message = req.body;

  if (!queues[queueName]) {
    queues[queueName] = [];
  }

  queues[queueName].push(message);

  res.status(201).send({ message: 'Message added to the queue', queue: queueName, data: message });
});

app.get('/api/:queue_name', (req, res) => {
    const queueName = req.params.queue_name;
    const timeout = parseInt(req.query.timeout) || 10000; 
  
    if (!queues[queueName] || queues[queueName].length === 0) {
      setTimeout(() => {
        res.status(204).send(); 
      }, timeout);
    } else {
      const message = queues[queueName].shift();
      res.status(200).send({ message: 'Next message retrieved from the queue', queue: queueName, data: message });
    }
  });  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});