const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/course');
const Project = require('../models/project');
const Enroll = require('../models/enroll');
const Usage = require('../models/usage');


router.get('/', (req, res, next) => {
    Course.find()
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

router.get('/email', (req, res, next) => {
    const email = req.query.email;
    Course.find({ faculty_email: email })
        .exec()
        .then(doc => {
            if (doc) {

                if (doc.length > 0) {
                    res.status(200).json(doc);
                }
                else {
                    res.status(201).json({ message: "not a valid Email ID" });
                }
            }
            else {
                res.status(404).json({ message: "Something Went Wrong" });
            }


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});


router.post('/', (req, res, next) => {
    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        course_id: req.body.id,
        name: req.body.name,
        faculty_email: req.body.faculty_email,
        department: req.body.department,
        term: req.body.term,

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


router.post('/createproject', async (req, res) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        course_id: req.body.course_id,
        faculty_email: req.body.faculty_email,
        StartDate: new Date(req.body.StartDate),
        ConservationStartDate: new Date(req.body.ConservationStartDate),
        EndDate: new Date(req.body.EndDate),
        projectname: req.body.projectname

    });


    try {
        const savedProject = await project.save();
        console.log(savedProject);

        const enrolledStudents = await Enroll.find({ course_id: req.body.course_id });

        for (const enroll of enrolledStudents) {

            const entries = getDaysArray(new Date(savedProject.StartDate), new Date(savedProject.EndDate), savedProject._id, req.body.course_id, enroll.student);

            const usageRecords = await Usage.insertMany(entries);
        }

        const selfEntries = getDaysArray(new Date(savedProject.StartDate), new Date(savedProject.EndDate), savedProject._id, req.body.course_id, req.body.faculty_email);

        const selfRecords = await Usage.insertMany(selfEntries);

        res.status(201).json({
            message: "New project Created",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
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


router.post('/updateProject', async (req, res) => {
    console.log("req", req.body);


    try {
        const currProject = await Project.findById(req.body.id);

        const updatedProject = await Project.findByIdAndUpdate(req.body.id, {
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate,
            ConservationStartDate: req.body.ConservationStartDate
        }, { new: true });


        if (new Date(updatedProject.StartDate) - new Date(currProject.StartDate) >= 0) {
            const deleteEntries = await Usage.deleteMany({ project: currProject._id, date: { $lt: updatedProject.StartDate } });
        } else {
            const enrolledStudents = await Enroll.find({ course_id: currProject.course_id });
            let oldDate = new Date(currProject.StartDate);
            oldDate.setDate(oldDate.getDate() - 1);

            for (const enroll of enrolledStudents) {
                const entries = getDaysArray(new Date(updatedProject.StartDate), oldDate, updatedProject._id, updatedProject.course_id, enroll.student);

                const usageRecords = await Usage.insertMany(entries);
            }

            const selfEntries = getDaysArray(new Date(updatedProject.StartDate), oldDate, updatedProject._id, updatedProject.course_id, req.body.faculty_email);

            const selfRecords = await Usage.insertMany(selfEntries);
        }




        if (new Date(updatedProject.EndDate) - new Date(currProject.EndDate) <= 0) {
            const deleteEntries = await Usage.deleteMany({ project: currProject._id, date: { $gt: updatedProject.EndDate } });
        } else {
            const enrolledStudents = await Enroll.find({ course_id: currProject.course_id });
            let oldDate;

            for (const enroll of enrolledStudents) {
                oldDate = new Date(currProject.EndDate);
                oldDate.setDate(oldDate.getDate() + 1);
                console.log('oldDate students', oldDate)
                const entries = getDaysArray(oldDate, new Date(updatedProject.EndDate), updatedProject._id, updatedProject.course_id, enroll.student);


                const usageRecords = await Usage.insertMany(entries);
            }
            oldDate = new Date(currProject.EndDate);
            oldDate.setDate(oldDate.getDate() + 1);
            console.log('oldDate self', oldDate)
            const selfEntries = getDaysArray(oldDate, new Date(updatedProject.EndDate), updatedProject._id, updatedProject.course_id, req.body.faculty_email);


            const selfRecords = await Usage.insertMany(selfEntries);
        }

        res.status(201).send({ message: "Project updated successfully!" });

    } catch (error) {
        console.log(err);
        res.status(500).json({ error: err });

    }


})



router.get('/project', (req, res, next) => {
    const course_id = req.query.course_id;
    Project.find({ course_id: course_id })
        .exec()
        .then(doc => {
            if (doc) {

                if (doc.length > 0) {
                    res.status(200).json(doc);
                }
                else {
                    res.status(201).json({ message: "No Project For this course" });
                }
            }
            else {
                res.status(404).json({ message: "Something Went Wrong" });
            }


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});


module.exports = router;