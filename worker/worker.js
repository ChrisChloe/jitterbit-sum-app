import amqp from "amqplib/callback_api.js";
import { MongoClient, ObjectId } from "mongodb";
import { config } from "dotenv";

config();
const amqpURI = process.env.RMQ_URI

amqp.connect(amqpURI, function (err, conn) {
  conn.createChannel(function (err, ch) {
    let q = "Sum App";

    ch.assertQueue(q, { durable: false });
    ch.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(
      q,
      function (data) {
        console.log(" [x] Received %s", data.content);
        const sumObj = JSON.parse(data.content);
        calcSum(sumObj);
      },
      { noAck: true }
    );
  });
});

function calcSum(sumObj) {
  const result = sumObj.number1 + sumObj.number2;

  updateResult(result, sumObj.id);
}

export async function updateResult(sumResult, id) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("operations");
    const collection = db.collection("sum");
    const myquery = { _id: new ObjectId(id) };
    const newvalues = {
      $set: { result: sumResult, calculationStatus: "done" },
    };
    await collection.updateOne(myquery, newvalues, function (err, res) {
      console.log(res);
      if (err) {
        console.error(err);
      }
    });
  } catch {
    console.error("calcAsync error");
  } finally {
    await mongoClient.close();
  }
}

export async function connectToCluster(uri) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    console.log("Connecting to MongoDB Atlas cluster...");
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB Atlas!");

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}
