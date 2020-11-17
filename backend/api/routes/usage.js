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

        const selfUsage = await Usage.find({ project: req.params.project_id, user_id: req.query.user }).populate('project').sort('date').lean();

        for (let use of selfUsage)
            use["carbon"] = use.electricity == '' && use.gas == '' ? '' : (use.electricity * 0.524 + use.gas * 13.446).toFixed(1);

        const usages = await Usage.find({ project: req.params.project_id, user_id: { $ne: req.query.user } }).populate('project').sort({ user_id: 1, date: 1 }).lean();

        for (let usage of usages) {

            const carbon = usage.electricity == '' && usage.gas == '' ? '' : (usage.electricity * 0.524 + usage.gas * 13.446).toFixed(1);

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

        let classStats = calcClassSection(response, selfUsage);

        let statistics = {
            selfSection: {
                "electricity": calcSelfSection("electricity", selfUsage),
                "gas": calcSelfSection("gas", selfUsage),
                "carbon": calcSelfSection("carbon", selfUsage)
            },

            classSection: classStats.class,

            classPercent: classStats.perc && classStats.perc.map(val => val * 100 / response.length)
        }
        res.send({ selfUsage, data: response, average: averageObj, weeklyAverage, selfWeekly, statistics });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});


let calculateAverage = (param, selfUsage, response) => {

    let count = Array(selfUsage.length).fill(0);

    let sum = response.reduce((r, a) => a.map((b, i) => {
        if (b[param] != "" ) count[i]++;
        if (selfUsage[i][param] != "") count[i]++;

        return (r[i] || 0) + +b[param] + +selfUsage[i][param];
    }), []);

    return count.map((val, index) => { return { date: selfUsage[index].date, val: (sum[index] / val).toFixed(1) } });

}

let calcClassSection = (classUsage, selfUsage) => {
    if (!classUsage.length || !classUsage[0].length) return {
        class: {
            "electricity": {
                baseAvg: 0,
                conserveAvg: 0,
                percentChange: 0
            },
            "gas": {
                baseAvg: 0,
                conserveAvg: 0,
                percentChange: 0
            },
            "carbon": {
                baseAvg: 0,
                conserveAvg: 0,
                percentChange: 0
            }
        },
        perc: [0,0,0]
    };

    const firstUsage = classUsage[0][0];
    const baseDays = (new Date(firstUsage.project.ConservationStartDate) - new Date(firstUsage.project.StartDate)) / (1000 * 3600 * 24);
    let electricity = [0, 0],
        gas = [0, 0],
        carbon = [0, 0],
        studentPercent = [0,0,0],
        electricityDayArr = [0, 0],
        gasDayArr = [0, 0],
        carbonDayArr = [0, 0];

    classUsage.forEach(student => {
        let studentBase = 0, studentConserve = 0, perc;

        student.forEach((usage, index) => {
            if (index < baseDays) {
                electricity[0] += +usage["electricity"];
                gas[0] += +usage["gas"];
                carbon[0] += +usage["carbon"];
                studentBase += +usage["carbon"];
                electricityDayArr[0] += usage["electricity"] != "" ? 1 : 0;
                gasDayArr[0] += usage["gas"] != "" ? 1 : 0;
                carbonDayArr[0] += usage["carbon"] != "" ? 1 : 0;
            }
            else {
                electricity[1] += +usage["electricity"];
                gas[1] += +usage["gas"];
                carbon[1] += +usage["carbon"];
                studentConserve += +usage["carbon"];
                electricityDayArr[1] += usage["electricity"] != "" ? 1 : 0;
                gasDayArr[1] += usage["gas"] != "" ? 1 : 0;
                carbonDayArr[1] += usage["carbon"] != "" ? 1 : 0;
            }
        });

        perc = ((studentConserve - studentBase) * 100) / studentBase;

        if (Math.abs(perc) >= 20) studentPercent[2]++;
        else if (Math.abs(perc) >= 10) studentPercent[1]++;
        else if (Math.abs(perc) >= 5) studentPercent[0]++;
    });
    
    selfUsage.forEach((usage, index) => {
        if (index < baseDays) {
            electricity[0] += +usage["electricity"];
            gas[0] += +usage["gas"];
            carbon[0] += +usage["carbon"];
            electricityDayArr[0] += usage["electricity"] != "" ? 1 : 0;
            gasDayArr[0] += usage["gas"] != "" ? 1 : 0;
            carbonDayArr[0] += usage["carbon"] != "" ? 1 : 0;
        }
        else {
            electricity[1] += +usage["electricity"];
            gas[1] += +usage["gas"];
            carbon[1] += +usage["carbon"];
            electricityDayArr[1] += usage["electricity"] != "" ? 1 : 0;
            gasDayArr[1] += usage["gas"] != "" ? 1 : 0;
            carbonDayArr[1] += usage["carbon"] != "" ? 1 : 0;
        }
    });

    return {
        class: {
            "electricity": {
                baseAvg: +(electricity[0] / electricityDayArr[0]).toFixed(2) || 0,
                conserveAvg: +(electricity[1] / electricityDayArr[1]).toFixed(2) || 0,
                percentChange: +((electricity[1] / electricityDayArr[1] - electricity[0] / electricityDayArr[0]) * 100 / (electricity[0] / electricityDayArr[0])).toFixed(2) || 0
            },
            "gas": {
                baseAvg: +(gas[0] / gasDayArr[0]).toFixed(2) || 0,
                conserveAvg: +(gas[1] / gasDayArr[1]).toFixed(2) || 0,
                percentChange: +((gas[1] / gasDayArr[1] - gas[0] / gasDayArr[0]) * 100 / (gas[0] / gasDayArr[0])).toFixed(1) || 0
            },
            "carbon": {
                baseAvg: +(carbon[0] / carbonDayArr[0]).toFixed(2) || 0,
                conserveAvg: +(carbon[1] / carbonDayArr[1]).toFixed(2) || 0,
                percentChange: +((carbon[1] / carbonDayArr[1] - carbon[0] / carbonDayArr[0]) * 100 / (carbon[0] / carbonDayArr[0])).toFixed(2) || 0
            }
        },
        perc: studentPercent
    }

};

let calcWeeklyAverage = (averages) => {
    let returnArr = [];
    let sum = 0, max = 0, min = 9999999;

    averages.forEach((average, index, averages) => {
        let value = average.val != 'NaN' ? +average.val : 0;
        
        sum += value;
        min = Math.min(min, value);
        max = Math.max(max, value);

        if ((index + 1) % 7 == 0 || (index + 1 == averages.length)) {
            returnArr.push({average: +(sum / 7).toFixed(1), min, max});
            sum = 0;

            if (!(index + 1 == averages.length)) {
                max = 0;
                min = 999999;
            }
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
            returnArr.push(+(sum / 7).toFixed(1));
            sum = 0;
        }
    });

    return returnArr;
}

let calcSelfSection = (param, selfUsage) => {
    const baseDays = selfUsage.length && (new Date(selfUsage[0].project.ConservationStartDate) - new Date(selfUsage[0].project.StartDate)) / (1000 * 3600 * 24);

    let baseSum = 0, conservationSum = 0, baseCount = 0, conservationCount = 0;

    selfUsage.forEach((usage, index) => {

        if (index < baseDays) {
            baseSum += +usage[param];
            baseCount += usage[param] != "" ? 1 : 0;
        }
        else {
            conservationSum += +usage[param];
            conservationCount += usage[param] != "" ? 1 : 0;
        }

    });
    
    return {
        baseAvg: +(baseSum / baseCount).toFixed(1) || 0,
        conserveAvg: +(conservationSum / conservationCount).toFixed(1) || 0,
        percentChange: +((conservationSum / conservationCount - baseSum / baseCount) * 100 / (baseSum / baseCount)).toFixed(1) || 0
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