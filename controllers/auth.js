const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')
const User = require('../models/user')
const { ObjectId } = require('mongodb')

const Auth = (req, res, next) => {
  const token = req.headers.authorization
  console.log(req.headers)
  const secret = process.env.AUTH_TOKEN_SECRET
  jwt.verify(token, secret, (err, decoded) => {
    if (decoded) {
      const objId = new ObjectId(decoded.userId)
      const user = new User()
      // create a hash of jwt given to the client to compare
      // against an array of hashes in user database 
      const hash = createHash('sha1').update(token).digest('base64')
      user.getSessions(objId).then(
        result => {
          if (result && result.sessions.includes(hash)) {
            req.user = decoded.userId
            next()
          } else {
            res.status(401).send('Token expired')
          }
        }
      ).catch(err => console.error(err))
    } else {
      console.error(err)
      res.status(401).send('Token expired')
    }
  })
}
exports.auth = Auth
