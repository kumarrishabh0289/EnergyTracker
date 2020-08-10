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


router.get('/getRegisteredClasses/:name', async (req, res) => {
    console.log('req', req.params.name)

    try {
        let result = await Class.find({'students': req.params.name});
    
        res.send(result);
        
    } catch (error) {        
        res.status(400).send(error);
    }   

});


router.post('/registerCourse', async (req, res) => {
    console.log('req', req.body)

    try {
        
        let classFound = await Class.findById(req.body.course);

        if (classFound) {

            if (classFound.students.indexOf(req.body.student) > -1) {                
                res.status(500).send({error: "Already Registered"});
            } else {
                classFound.students.push(req.body.student);

                let updated = await classFound.save();
                res.status(200).send({
                    success: true,
                    result: updated
                });
            }

        } else {
            res.status(500).send({error: "No Such Class"});
        }

    } catch (error) {
        res.status(500).end("Error Occurred!");
    }

});

module.exports = router;