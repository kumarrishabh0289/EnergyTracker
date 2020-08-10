const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Class = require('../models/class');

router.post('/addClass', async (req,res) => {

    const newClass = new Class({
        name: req.body.name,
        faculty_email: req.body.faculty_email,
        department: req.body.department,
        term: req.body.term,
    });

    try {
        let result = await newClass.save();
        console.log('result', result)
    
        res.send(result);
        
    } catch (error) {        
        console.log('error', error)
        res.status(400).send(error);
    }

});


router.get('/getRegisteredClasses/:name', async (req, res) => {
    console.log('req', req.params.name);
    let projects = [];

    try {
        let results = await Class.find({'students': req.params.name}).populate('projects');

        for (let result of results) {
            projects = [...projects, ...result.projects];
        }
    
        res.send({courses: results, projects: projects});
        
    } catch (error) {        
        console.log('error', error)
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