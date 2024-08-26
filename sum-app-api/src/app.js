import express from 'express';
import amqp from 'amqplib/callback_api.js'
import { calcAsync, getResults } from './sumRequest.js';

const app = express();
const PORT = process.env.PORT || 3000;
const amqpURI = process.env.RMQ_URI;

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

function sendToWorker(data) {
  amqp.connect(amqpURI, function (err, conn) {
    conn.createChannel(function (err, ch) {
        let q = 'Sum App';
        ch.assertQueue(q, { durable: false });     
        ch.sendToQueue(q, new Buffer(data));
        console.log(" [x] Sent %s", data);
        if (err) {
          console.error(err)
        }
    });
    setTimeout(function () { conn.close(); }, 500);
    if (err) {
      console.error(err)
    }
  });
}

app.get("/GetResults/:id", async (req, res) => {
  const sumObject = await getResults(req.params.id);
  res.send(sumObject);
});

app.post("/CalcAsync", async (req, res) => {
  const sumObject = req.body;
  const result = await calcAsync(sumObject);
  const workerMsg = JSON.stringify({ ...sumObject, id: result.insertedId});
  console.log(workerMsg)
  sendToWorker(workerMsg);
  res.send({ insertedId: result.insertedId });
});