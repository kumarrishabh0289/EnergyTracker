const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Usage = require('../models/usage');


router.get('/:project_id', async (req, res) => {

    try {
        
        const usage = await Usage.find({ project: req.params.project_id }).populate('project').sort({ date: 1 });

        res.send(usage);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});



module.exports = router;