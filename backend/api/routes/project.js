const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../models/project');
const Class = require('../models/class');

router.post('/addProject', async (req,res) => {

    const newProject = new Project({
        name: req.body.name,
        baseStart: req.body.baseStart,
        conserveStart: req.body.conserveStart,
        conserveEnd: req.body.conserveEnd,
        class: req.body.classId
    });

    try {
        let result = await newProject.save();

        let projectClass = await Class.findById(req.body.classId);
        projectClass.projects.push(result._id);

        let updatedClass = await projectClass.save();
    
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
        let result = await Class.find({'students': req.params.name}).populate('projects');

        for (let result of results) {
            projects = [...projects, ...result.projects];
        }
    
        res.send({courses: result, projects: projects});
        
    } catch (error) {        
        console.log('error', error)
        res.status(400).send(error);
    }   

});

module.exports = router;