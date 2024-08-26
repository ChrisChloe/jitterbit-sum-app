import { MongoClient, ObjectId } from "mongodb";
import { config } from "dotenv";

config();

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

export async function createSumObject(collection, object) {
  const sumObject = {
    number1: object.number1,
    number2: object.number2,
    result: null,
    calculationStatus: "pending",
  };
  return await collection.insertOne(sumObject).then(
    (response) => {
      return response;
    },
    (error) => {
      console.error(error);
    }
  );
}

export async function findSumById(collection, id) {
  return await collection.findOne({ _id: new ObjectId(id) });
}

export async function updateSumObject(collection, name, updatedFields) {
  await collection.updateMany({ name }, { $set: updatedFields });
}

export async function calcAsync(sumObject) {
  const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}.hck2o.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGODB_CLUSTER_NAME}`;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("operations");
    const collection = db.collection("sum");
    return await createSumObject(collection, sumObject);
  } catch {
    console.error("calcAsync error");
  } finally {
    await mongoClient.close();
  }
}

export async function getResults(id) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("operations");
    const collection = db.collection("sum");

    return await findSumById(collection, id).then(
      (response) => {
        return response;
      },
      (err) => {
        console.log(err);
      }
    );
  } catch {
    console.error("getResults error");
  } finally {
    await mongoClient.close();
  }
}
