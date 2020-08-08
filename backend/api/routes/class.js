const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Class = require('../models/class');

router.post('/addClass', async (req,res) => {

    const newClass = new Class({
        name: req.body.name
    });

    try {
        let result = await newClass.save();
    
        res.send(result);
        
    } catch (error) {        
        res.status(400).send(error);
    }

});

module.exports = router;