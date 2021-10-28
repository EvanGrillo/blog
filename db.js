const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/";

const mongoConnect = {
	blogs: null,
	connect: async () => {
		try {
			let dbo = await MongoClient.connect(uri);
            this.blogs = dbo.db('blog').collection('blogs');
		} catch (err) {
			throw err;
		}
	},
    getBlogs: async () => {
        return await new Promise((resolve, reject) => {
            this.blogs.find({}).toArray((err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },
    getBlog_ByHandle: async (handle) => {
        return await new Promise((resolve, reject) => {
            this.blogs.findOne({handle: handle}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = mongoConnect;