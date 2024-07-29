const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    console.log('verifyToken')
    try {
        const token = req.headers['authorization'] ? req.headers['authorization'].split(" ")[1] : null

        if (!token) {
            return res.status(401).send({ status: false, message: "unauthorized access!" })
        }
        const user = jwt.decode(token, process.env.JWT_TOKEN_SECRET)
        if (!user.token) {
            return res.status(401).send({ status: false, message: "unauthorized access!" })
        }
        req.userId = user.token
        req.email = user.email
        next()
    }
    catch (error) {
        return res.status(401).send({ status: false, message: "something went wrong!" })
    }
}

module.exports = { verifyToken }