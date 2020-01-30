const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Profile = require('../models/profile');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');







router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});





router.post('/', (req, res, next) => {
    var cipher = crypto.createCipher('aes-256-ecb', 'password');
    var mystr = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');


    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        name: req.body.name,
        password: mystr,
        role: req.body.role
    });
    user
        .save()
        .then(result => {
            console.log(result);

            const profile = new Profile({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                image: "",
                mobile: "",
                about: "",
                city: "",
                country: "",
                company: "",
                school: "",
                hometown: "",
                languages: "",
                gender: "",

            });
            profile
                .save()
                .then(result1 => {
                    console.log(result1);
                })
        })
        .catch(err => console.log(err));
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end("User Created");


});


router.get('/:userId', (req, res, next) => {
    const email = req.params.userId;
    User.findOne({ email: email })
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({ message: "not a valid ID" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});

router.post('/login', (req, res, next) => {

    var cipher = crypto.createCipher('aes-256-ecb', 'password');
    var mystr = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');

    User.findOne({ email: req.body.username })
        .exec()
        .then(doc => {
            console.log("From database", doc);

            if (doc.password === mystr && doc.role === req.body.role) {

                res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });

                const body = { user: doc.name };
                const token = jwt.sign({ user: body }, 'rishabh');
                res.status(200).json({
                    email: doc.email,
                    name: doc.name,
                    role: doc.role,
                    jwt: 'Bearer '+token,
                });
            }
            else {
                res.status(404).json({ message: "not a valid ID" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});

module.exports = router;