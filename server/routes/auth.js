const express = require('express');
const controller = require('../controller/auth');
const middleware = require('../middleware/verifyToken');
const router = express.Router();

function validateEmail(email) {
    // Regular expression for basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

// Status check endpoint
router.get('/status', async (req, res) => {
   return res.status(200).send({ status: 'OK'});
})

router.post('/signup', async (req, res) => {
    try {
        const body = req.body;

        if (!(body.first_name && body.email, body.login_code)) {
            return res.status(400).send({ status: false, message: 'invalid request body' })
        }

        if (!validateEmail(body.email)) {
            return res.status(400).send({ status: false, message: 'Invalid Email!' })
        }

        const signUp = await controller.signup(body, false)
        return res.send({ status: true, secret: signUp, message: 'Successfully signup the user' })
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message || error })
    }
})

router.post('/login', async (req, res) => {
    try {
        const password = req.body.login_code;
        const email = req.body.email;

        if (!password) {
            return res.status(400).send({ status: false, message: 'invalid request body' })
        }
        const loginDetails = await controller.verifyAndLogin(password, email)
        return res.send({ status: true, userData: loginDetails, message: 'Successfully login' })
    }
    catch (error) {
        return res.status(400).send({ status: false, message: error.message || error })
    }
})
module.exports = router
