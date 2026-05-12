const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URI; // from env

if (!mongoURL) {
    console.error("MONGO_URI not defined");
    process.exit(1);
}

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB server...')
});

db.on('error', (err) => {
    console.log('MongoDB connection Error:- ', err)
});

db.on('disconnected', () => {
    console.log('Disconnected to MongoDB server')
});

module.exports = db;

// sudo systemctl start mongod
// sudo systemctl stop mongod