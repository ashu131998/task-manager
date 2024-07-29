const { user } = require('../models/user')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex')
}

const signup = async (body, teamClientAccount) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isUserExist = await user.findOne({ email: body.email})
            if (isUserExist) {
                throw new Error('An email is already registered')
            }
            const secretCode = hashPassword(body.login_code)
            body.secret_code = secretCode
            const userData = await user(body).save()
            const secret = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
            resolve(secret)
        }
        catch (error) {
            console.log(error, 'error is here')
            reject(error.message || error)
        }
    })
}

const verifyAndLogin = async (loginCode, email) => {
    try {
        const checkUserUrl = await user.findOne({ email: email }, { first_name: 1, last_name: 1, email: 1, secret_code: 1 }).lean()

        if (checkUserUrl) {
            const code = checkUserUrl.secret_code
            const compareHashCode = hashPassword(loginCode)
            if (code == compareHashCode) {
                const jwtSign = jwt.sign({ token: checkUserUrl._id, email: email }, process.env.JWT_TOKEN_SECRET, { expiresIn: '5m' })
                return { secret_code: jwtSign, first_name: checkUserUrl.first_name, last_name: checkUserUrl.last_name, email: checkUserUrl.email, user_id: checkUserUrl._id }
            }
            throw new Error('invalid login code')
        }
        throw new Error('no user found')
    }
    catch (error) {
        throw new Error(error.message || error)
    }
}

const manageUserData = async (body) => {
    try {
        let updated_user = body.user
        const checkUserUrl = await user.findOne({ email: updated_user.email }).lean()

        if (checkUserUrl) {
            update_id = checkUserUrl['_id']
            delete updated_user['_id']
            const userData = await user.updateOne({ _id: update_id }, updated_user)
            return userData
        }
        throw new Error('no user found')
    }
    catch (error) {
        throw new Error(error.message || error)
    }
}

const allUsersList = async (body, role) => {
    try {
        if (role == "admin") {
            const checkUserUrl = await user.find().lean()
            return checkUserUrl
        }
        throw new Error('no user found')
    }
    catch (error) {
        throw new Error(error.message || error)
    }
}


module.exports = { signup, verifyAndLogin, allUsersList, manageUserData }

