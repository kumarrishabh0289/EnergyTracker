const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Profile = require('../models/profile');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var bcrypt = require("bcrypt-nodejs");
var mysql = require("../../config/db.js");
const Role = require('../models/role');

router.post('/login', (req, res, next) => {

    var cipher = crypto.createCipher('aes-256-ecb', 'password');
    var mystr = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
    console.log("mystr", mystr)
    User.findOne({ email: req.body.username })
        .exec()
        .then(doc => {
            console.log("From database", doc);

            if (doc.password === mystr && doc.role === req.body.role) {

                res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });

                const body = { user: doc.email };
                const token = jwt.sign({ user: body }, 'greenninja', { expiresIn: 900000 });
                res.status(200).json({
                    email: doc.email,
                    name: doc.name,
                    role: doc.role,
                    jwt: 'Bearer ' + token,
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

router.post('/greenninjalogin', function (req, res) {
    var query =
        "select username, email, password from users where username=? or email=?";
    var values = [req.body.username, req.body.username];


    console.log(query);
    mysql.fetchData(
        values,
        function (err, results) {
            if (err) {
                res.status(400).json({ status: 400, results: err });
                return;
            } else {
                console.log("results", results);

                if (results.length > 0 && results.length <= 1) {

                    if (bcrypt.compareSync(req.body.password, results[0].password)) {
                        var innerQuery =
                            "SELECT u.username, u.email, u.first_name, u.last_name, r.name as role, u.transportation_access " +
                            "FROM users u JOIN user_role ur " +
                            "ON u.user_id = ur.user_id " +
                            "JOIN role r ON ur.role_id = r.role_id " +
                            "WHERE u.username = ?";
                        var values = [results[0].username];

                        mysql.fetchData(
                            values,
                            function (err, results) {
                                console.log("error", err);
                                if (err) {
                                    res.status(400).json({
                                        status: 400,
                                        result: "User doesn't exist"
                                    });
                                    return;
                                } else {
                                    if (results.length <= 0) {
                                        res.status(400).json({
                                            status: 400,
                                            results: "You are not assigned any user role, contact Admin!"
                                        });
                                        return;
                                    } else {
                                        console.log("User Details:", results[0]);
                                        res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });
                                        const body = { user: results[0].username };
                                        const token = jwt.sign({ user: body }, 'greenninja', { expiresIn: 900000 });



                                        const role = new Role({
                                            _id: new mongoose.Types.ObjectId(),
                                            email: results[0].username,
                                            role: results[0].role

                                        });
                                        role
                                            .save()
                                            .then(result => {
                                                console.log("result", result);
                                            })




                                        res.status(200).json({
                                            username: results[0].username,
                                            name: results[0].first_name + " " + results[0].last_name,
                                            role: results[0].role,
                                            jwt: 'Bearer ' + token
                                        });

                                    }
                                }
                            },
                            innerQuery
                        );
                    } else {
                        res.status(400).json({ status: 400, results: "Invalid Password" });
                        return;
                    }
                } else {
                    res.status(400).json({ status: 400, results: "User doesn't exist" });
                    return;
                }
            }
        },
        query
    );

});


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


router.post('/checkrole', (req, res, next) => {
    Role.findOne({ email: req.body.email })
    .exec()
    .then(docs => {
        console.log("checkrole", docs);
        if (!docs) {
            res.status(202).json({
                msg:"No Role attached"
            });
        }
        else{
            res.status(200).json(docs);

        }
      
           
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});


router.post('/google', (req, res, next) => {
    Profile.findOne({ email: req.body.email })
        .exec()
        .then(docs => {
            console.log("docs", docs);
            if (!docs) {
                const profile = new Profile({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    fname: req.body.fname,
                    lname: req.body.lname,

                });
                profile
                    .save()
                    .then(result => {
                        console.log("result", result);

                        res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });
                        const body = { user: req.body.email };
                        const token = jwt.sign({ user: body }, 'greenninja', { expiresIn: 900000 });

                        res.status(200).json({
                            username: req.body.email,
                            name: req.body.fname + " " + req.body.lname,
                            jwt: 'Bearer ' + token
                        });

                    });
            }
            else {

                res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });
                const body = { user: req.body.email };
                const token = jwt.sign({ user: body }, 'greenninja', { expiresIn: 900000 });
                res.status(200).json({
                    username: docs.email,
                    name: docs.fname + " " + docs.lname,
                    role: "",
                    jwt: 'Bearer ' + token
                });

            }



        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });

        });

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



module.exports = router;