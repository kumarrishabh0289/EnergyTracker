const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Profile = require('../models/profile');
const Role = require('../models/role');
const path = require("path");

router.get('/', (req, res, next) => {
    Profile.find()
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

router.get('/email', (req, res, next)=>{
    const email = req.query.email;
    Profile.findOne({ email: email })
        .exec()
        .then(doc => {
        console.log("From database",doc);
        if (doc){
            res.status(200).json(doc);
        }
        else {
            res.status(404).json({message:"not a valid Email ID"});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    })
        
});

router.patch("/", (req, res, next) => {
    
    
    
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    const email = updateOps.email;
    console.log("updateOps",updateOps);
    console.log("email",email);
    Profile.update({email : email}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message:"Update Was Successfull"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});









module.exports = router;