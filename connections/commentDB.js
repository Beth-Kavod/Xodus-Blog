import mongoose from 'mongoose'
const { MONGO_URL_COMMENTS } = process.env

const commentDB = mongoose.createConnection(MONGO_URL_COMMENTS);

module.exports = commentDB
