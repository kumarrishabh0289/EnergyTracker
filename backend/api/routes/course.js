const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/course');
const Project = require('../models/project');


router.get('/', (req, res, next) => {
    Course.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
   
});

router.get('/email', (req, res, next)=>{
    const email = req.query.email;
    Course.find({ faculty_email: email })
        .exec()
        .then(doc => {
        if(doc){
            console.log("From database",doc);
            if (doc.length>0){
                res.status(200).json(doc);
            }
            else {
                res.status(201).json({message:"not a valid Email ID"});
            }
        }
        else{
            res.status(404).json({message:"Something Went Wrong"});
        }
       
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    })
        
});


router.post('/', (req, res, next) => {
    const course = new Course({
        _id : new mongoose.Types.ObjectId(),
        course_id: req.body.id,
        name: req.body.name,
        faculty_email:req.body.faculty_email,
        department:req.body.department,
        term:req.body.term,
     
    });
    course
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: "New Course Created",
        
    });
});


router.post('/createproject', (req, res, next) => {
    const project = new Project({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        course_id: req.body.course_id,
        faculty_email: req.body.faculty_email,
        StartDate: req.body.StartDate,
        ConservationStartDate: req.body.ConservationStartDate,
        EndDate: req.body.EndDate,
        projectname:req.body.projectname
     
    });
    project
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: "New project Created",
        
    });
});

router.get('/project', (req, res, next)=>{
    const course_id = req.query.course_id;
    Project.find({ course_id: course_id })
        .exec()
        .then(doc => {
        if(doc){
            console.log("From database",doc);
            if (doc.length>0){
                res.status(200).json(doc);
            }
            else {
                res.status(201).json({message:"No Project For this course"});
            }
        }
        else{
            res.status(404).json({message:"Something Went Wrong"});
        }
       
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    })
        
});


module.exports = router;