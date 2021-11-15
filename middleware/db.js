const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/';
const crypto = require('crypto');

module.exports = {
	uuid: () => {
		return crypto.randomUUID();
	},
	connect: async () => {
		try {
			let dbo = await MongoClient.connect(uri);
			this.db = dbo.db('blog');
		} catch (err) {
			throw err;
		}
	},
	find: async (table, query) => {

		let collection = this.db.collection(table);
		if (!collection) throw new Error('collection does\'nt exist');

		return await new Promise((resolve, reject) => {
			collection.find(query).toArray((err, result) => {
				if (err) reject(err);
				resolve(result);
			});
		});
	},
	findOne: async (table, query) => {

		let collection = this.db.collection(table);
		if (!collection) throw new Error('collection does\'nt exist');

		return await new Promise((resolve, reject) => {
			collection.findOne(query, (err, result) => {
				if (err) reject(err);
				resolve(result);
			});
		});
	},
	insertOne: async (table, query) => {

		let collection = this.db.collection(table);
		if (!collection) throw new Error('collection does\'nt exist');

		return await new Promise((resolve, reject) => {
			collection.insertOne(query, (err, result) => {
				if (err) reject(err);
				resolve(result);
			});
		});
	}
};