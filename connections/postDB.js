import mongoose from 'mongoose'
const { MONGO_URL_POSTS } = process.env

const postDB = mongoose.createConnection(MONGO_URL_POSTS);

module.exports = postDB