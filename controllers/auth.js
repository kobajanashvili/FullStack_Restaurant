const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        //check password user exits bolzovatel sushestvuet
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            //generation token, password true
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            //passwords do not match!
            res.status(401).json({
                message: 'passwords do not match, try again!'
            })
        }
    } else {
        //  user empty, error
        res.status(404).json({
            message: 'User with such Email not found!'
        })
    }
}

module.exports.register = async function(req, res) {
    // email password
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        //user exists (send error)
        res.status(409).json({
            message: 'This Email alredy busy, try another!'
        })
    } else {
        //must create user
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save() 
            res.status(201).json(user)
        } catch(e) {
            //error work obrabotka ashibka
            errorHandler(res, e)
        }
    }
}