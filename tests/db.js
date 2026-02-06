const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

class InMemoryDB {
  constructor() {
    this.mongoServer = null;
  }

  async connect() {
    this.mongoServer = await MongoMemoryServer.create();
    const uri = this.mongoServer.getUri();
    await mongoose.connect(uri);
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async clear() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}

module.exports = new InMemoryDB();
