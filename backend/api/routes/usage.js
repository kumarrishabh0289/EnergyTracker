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
        };

        let statistics = {
            selfSection: {
                "electricity": calcSelfSection("electricity", selfUsage),
                "gas": calcSelfSection("gas", selfUsage),
                "carbon": calcSelfSection("carbon", selfUsage)
            },

            classSection: calcClassSection(response, selfUsage) 
        }
        console.log('statistics', statistics)

        res.send({ selfUsage, data: response, average: averageObj, weeklyAverage, selfWeekly });

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

let calcClassSection = (classUsage, selfUsage) => {
    if (!classUsage.length || !classUsage[0].length) return {};

    const firstUsage = classUsage[0][0];
    const baseDays = (new Date(firstUsage.project.ConservationStartDate) - new Date(firstUsage.project.StartDate)) / (1000 * 3600 * 24);
    const totalDays = ((new Date(firstUsage.project.EndDate) - new Date(firstUsage.project.StartDate)) / (1000 * 3600 * 24));
    const conservationDays = totalDays - baseDays;

    let electricity = [0, 0],
        gas = [0, 0],
        carbon = [0, 0];

    classUsage.forEach(student => {

        student.forEach((usage, index) => {
            if (index < baseDays) {
                electricity[0] += +usage["electricity"];
                gas[0] += +usage["gas"];
                carbon[0] += +usage["carbon"];
            }
            else {
                electricity[1] += +usage["electricity"];
                gas[1] += +usage["gas"];
                carbon[1] += +usage["carbon"];
            }
        });
    });
    
    selfUsage.forEach((usage, index) => {
        if (index < baseDays) {
            electricity[0] += +usage["electricity"];
            gas[0] += +usage["gas"];
            carbon[0] += +usage["carbon"];
        }
        else {
            electricity[1] += +usage["electricity"];
            gas[1] += +usage["gas"];
            carbon[1] += +usage["carbon"];
        }
    });

    return {
        "electricity": {
            baseAvg: +(electricity[0] / (baseDays * (classUsage.length + 1))).toFixed(2),
            conserveAvg: +(electricity[1] / (conservationDays * (classUsage.length + 1))).toFixed(2),
            percentChange: +((electricity[1] / (conservationDays * (classUsage.length + 1)) - electricity[0] / (baseDays * (classUsage.length + 1))) * 100 / (electricity[0] / (baseDays * (classUsage.length + 1)))).toFixed(2)
        },
        "gas": {
            baseAvg: +(gas[0] / (baseDays * (classUsage.length + 1))).toFixed(2),
            conserveAvg: +(gas[1] / (conservationDays * (classUsage.length + 1))).toFixed(2),
            percentChange: +((gas[1] / (conservationDays * (classUsage.length + 1)) - gas[0] / (baseDays * (classUsage.length + 1))) * 100 / (gas[0] / (baseDays * (classUsage.length + 1)))).toFixed(2)
        },
        "carbon": {
            baseAvg: +(carbon[0] / (baseDays * (classUsage.length + 1))).toFixed(2),
            conserveAvg: +(carbon[1] / (conservationDays * (classUsage.length + 1))).toFixed(2),
            percentChange: +((carbon[1] / (conservationDays * (classUsage.length + 1)) - carbon[0] / (baseDays * (classUsage.length + 1))) * 100 / (carbon[0] / (baseDays * (classUsage.length + 1)))).toFixed(2)
        }
    }

};

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

let calcSelfSection = (param, selfUsage) => {
    const baseDays = selfUsage.length && (new Date(selfUsage[0].project.ConservationStartDate) - new Date(selfUsage[0].project.StartDate)) / (1000 * 3600 * 24);
    const totalDays = selfUsage.length && ((new Date(selfUsage[0].project.EndDate) - new Date(selfUsage[0].project.StartDate)) / (1000 * 3600 * 24));
    const conservationDays = totalDays - baseDays;

    let baseSum = 0, conservationSum = 0;

    selfUsage.forEach((usage, index) => {

        if (index < baseDays)
            baseSum += +usage[param];
        else
            conservationSum += +usage[param];

    });
    
    return {
        baseAvg: +(baseSum / baseDays).toFixed(2),
        conserveAvg: +(conservationSum / conservationDays).toFixed(2),
        percentChange: +((conservationSum / conservationDays - baseSum / baseDays) * 100 / (baseSum / baseDays)).toFixed(2)
    }

};


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