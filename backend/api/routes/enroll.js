const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Enroll = require('../models/enroll');
const Course = require('../models/course');
const Permission = require('../models/permission');
const Project = require('../models/project');
const Usage = require('../models/usage');


router.get('/', (req, res, next) => {
    Enroll.find()
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

router.get('/getStudentList', (req, res) => {
    const course_id = req.query.course_id;

    
    console.log("course_id",course_id)
    

    Enroll.find({ course_id: course_id })
        .exec()
        .then(doc => {
        console.log("From database",doc);
        if (doc.length>0){
            res.status(200).json(doc);
        }
        else {
            res.status(201).json({message:"not a valid course_id"});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    })

});

router.get('/status', (req, res, next) => {
    const status = req.query.status;
    const course = req.query.course;
    Enroll.find({ status: status, course_id: course })
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

router.get('/getEnrolledCourses/:name', async (req, res) => {

    const student = req.params.name;
    let projects = [];

    try {
        let results = await Enroll.find({ student: student }, 'course_id').populate('course_id');

        for (let result of results) {
            let courseProjects = await Project.find({ course_id: result.course_id._id });

            projects = [...projects, ...courseProjects];
        }

        res.send({ courses: results, projects: projects });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }

});

router.get('/one', (req, res, next) => {
    Enroll.findOne().sort({ enroll_id: 'desc', _id: -1 }).limit(1)
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

//Drop A Courese From Student Dashboard
router.put("/", (req, res, next) => {
    const email = req.body.email;
    const course_id = req.body.course_id;

    Enroll.remove({ course_id: course_id, student: email })
        .exec()
        .then(result => {

            Course.findOne({ course_id: req.body.course_id })
                .exec()
                .then(docs => {
                    console.log(docs);
                    var total_enroll = docs.total_enroll;
                    console.log("total_enroll", total_enroll);
                    total_enroll = total_enroll - 1;
                    console.log("total_enroll", total_enroll);
                    Course.update({ course_id: course_id }, {
                        $set: {
                            total_enroll: total_enroll,

                        }
                    })
                        .exec()
                        .then(result => {
                            console.log(result);
                            res.status(200).json({ message: "Dropped Successfully" });

                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });


                })
        })


        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            });
        });
});


router.patch("/", (req, res, next) => {


    const email = updateOps.email;
    console.log("updateOps", updateOps);
    console.log("email", email);
    Profile.update({ email: email }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Update Was Successfull"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//Student Enroll for a Course 
router.post('/', async (req, res) => {
    console.log("ENROLL!");

    try {
        const currEnrollment = await Enroll.findOne({ course_id: req.body.course_id, student: req.body.student });

        if (currEnrollment) {
            res.status(201).json({ message: "Student Already Enrolled" });
        }
        else {
            const newEnroll = new Enroll({
                course_id: req.body.course_id,
                student: req.body.student
            });

            const result = await newEnroll.save();

            const course = await Enroll.populate(newEnroll, "course_id");

            let courseProjects = await Project.find({ course_id: course.course_id._id });

            for (let project of courseProjects) {

                const entries = getDaysArray(new Date(project.StartDate), new Date(project.EndDate), project._id, course.course_id._id, req.body.student);;

                const usageRecords = await Usage.insertMany(entries);

            }

            res.send({courseProjects, course});

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }

});


var getDaysArray = function (start, end, project_id, course_id, student) {
    let returnArr = [];

    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
        var m = new Date(dt);
        returnArr.push({
            project: project_id,
            course: course_id,
            date: m,
            user_id: student
        });
    }

    return returnArr;
};

module.exports = router;