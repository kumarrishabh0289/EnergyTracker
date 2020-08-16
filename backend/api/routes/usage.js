const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Usage = require('../models/usage');
const e = require('express');


router.get('/:project_id', async (req, res) => {

    try {

        const usage = await Usage.find({ project: req.params.project_id, user_id: req.query.user }).populate('project').sort({ date: 1 });

        res.send(usage);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});


router.get('/getAllUsage/:project_id', async (req, res) => {

    try {
        let response = {};

        const selfUsage = await Usage.find({ project: req.params.project_id, user_id: req.query.user }).populate('project').lean();

        for (let use of selfUsage)
            use["carbon"] = use.electricity * 0.524 + use.gas * 13.446;

        const usages = await Usage.find({ project: req.params.project_id, user_id: { $ne: req.query.user } }).populate('project').sort({ user_id: 1 }).lean();

        for (let usage of usages) {

            const carbon = usage.electricity * 0.524 + usage.gas * 13.446;

            if (!response[usage.user_id]) {
                response[usage.user_id] = [];
            }
            response[usage.user_id].push({ ...usage, carbon });

        }

        response = Object.values(response);

        let averageObj = {
            "electricity": calculateAverage("electricity", selfUsage, response),
            "gas": calculateAverage("gas", selfUsage, response),
            "carbon": calculateAverage("carbon", selfUsage, response)
        };

        console.log('averages', averageObj)

        res.send({ selfUsage: selfUsage, data: response, average: averageObj });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});


let calculateAverage = (param, selfUsage, response) => {

    let count = Array(selfUsage.length).fill(0);

    let sum = response.reduce((r, a) => a.map((b, i) => {
        if (b[param] != "") count[i]++;

        return (r[i] || 0) + +b[param]
    }), []);

    return count.map((val, index) => {return { date: selfUsage[index].date, val: sum[index] / val}});

}


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