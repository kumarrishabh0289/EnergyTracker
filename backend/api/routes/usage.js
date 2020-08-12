const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Usage = require('../models/usage');


router.get('/:project_id', async (req, res) => {

    try {

        const usage = await Usage.find({ project: req.params.project_id, user_id: req.query.user }).populate('project').sort({ date: 1 });

        res.send(usage);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});


router.post('/updateUsage', async (req, res) => {

    const usages = req.body;

    try {

        for (let usage of usages) {
            const result = await Usage.findOneAndUpdate({ _id: usage._id }, { gas: usage.gas, electricity: usage.electricity });
        }

        res.send("Success!");

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})



module.exports = router;