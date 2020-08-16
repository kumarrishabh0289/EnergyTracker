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

        let weeklyAverage = {
            "electricity": calcWeeklyAverage(averageObj["electricity"]),
            "gas": calcWeeklyAverage(averageObj["gas"]),
            "carbon": calcWeeklyAverage(averageObj["carbon"])
        };

        let selfWeekly = {
            "electricity": calcSelfWeekly("electricity", selfUsage),
            "gas": calcSelfWeekly("gas", selfUsage),
            "carbon": calcSelfWeekly("carbon", selfUsage)
        }

        res.send({ selfUsage: selfUsage, data: response, average: averageObj, weeklyAverage: weeklyAverage, selfWeekly });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});


let calculateAverage = (param, selfUsage, response) => {

    let count = Array(selfUsage.length).fill(0);

    let sum = response.reduce((r, a) => a.map((b, i) => {
        if (b[param] != "" || selfUsage[i][param] != "") count[i]++;

        return (r[i] || 0) + +b[param] + +selfUsage[i][param];
    }), []);

    return count.map((val, index) => { return { date: selfUsage[index].date, val: sum[index] / val } });

}

let calcWeeklyAverage = (averages) => {
    let returnArr = [];
    let sum = 0;

    averages.forEach((average, index, averages) => {
        sum += average.val ? average.val : 0;

        if ((index + 1) % 7 == 0 || (index + 1 == averages.length)) {
            returnArr.push(+(sum / 7).toFixed(2));
            sum = 0;
        }
    });

    return returnArr;
}

let calcSelfWeekly = (param, selfAverage) => {
    let returnArr = [];
    let sum = 0;

    selfAverage.forEach((average, index, selfAverage) => {
        sum += average[param] ? +average[param] : 0;

        if ((index + 1) % 7 == 0 || (index + 1 == selfAverage.length)) {
            returnArr.push(+(sum / 7).toFixed(2));
            sum = 0;
        }
    });

    return returnArr;

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