const express = require('express')
const router = express.Router()
const filter = require('leo-profanity')

let { countVotes, isValid_id, getUserWithID } = require("./routeMethods.js")

/* ----------------------------- MongoDB Schemas ---------------------------- */

let Post = require("../models/Post.js")

/* -------------------------------------------------------------------------- */
  
module.exports = router