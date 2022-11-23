// const { MongoMemoryServer } = require("mongodb-memory-server");
// const { MongoClient, MongoClient } = require("mongodb");

// let database = null;

// async function startDatabase() {
//   const mongo = new MongoMemoryServer();
//   const mongoDBURL = await mongo.getConnectontring();
//   const connection = await MongoClient.connect(mongoDBURL, {
//     useNewUrlParse: true,
//   });
//   database = connection.db();
// }

// async function getDatabase() {
//   if (!database) await startDatabase();
//   return database;
// }

// module.exports = {
//   getDatabase,
//   startDatabase,
// };
