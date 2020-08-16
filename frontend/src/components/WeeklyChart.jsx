import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';

class WeeklyChart extends Component {
    state = {}

    generateData = () => {
        const { weeklyAverage, selfWeekly } = this.props.data;
        console.log('weeklyAverage', weeklyAverage)
        console.log('selfWeekly', selfWeekly)
        let userData = [];

        userData.push({
            "name": "Weekly Class Usage",
            "color": "black",
            "data": weeklyAverage["electricity"] || [],
            "type": "line",
            "zIndex": 10,
            "lineWidth": 2.5
        });

        userData.push({
            "name": "Your Weekly Usage",
            "color": "red",
            "data": selfWeekly["electricity"] || [],
            "type": "line",
            "zIndex": 10,
            "lineWidth": 2.5
        });

        return userData;
    }

    render() {
        let seriesData = this.generateData();

        let chartData = {
            "chart": {
                "renderTo": "myDiv",
                "type": "scatter",
                "marginRight": "25",
                "shadow": "false",
                "animation": "false",
                "showCheckBox": "true"
            },
            "xAxis": {
                "title": {
                    "text": "Weeks"
                },
                "tickInterval": 1,
                "labels": {
                    "formatter": function () {
                        return `Week-${this.value + 1}`
                    }
                }
            },
            "plotOptions": {
                "scatter": {
                    "marker": {
                        "symbol": "circle"
                    }
                },
                "line": {
                    "marker": {
                        "enabled": false
                    }
                }
            },
            "title": {
                "text": "Weekly Averages for Electricity Usage"
            },
            "yAxis": {
                "title": {
                    "text": "Usage Values (kWh)"
                }
            },
            "legend": {
                "enabled": true
            },
            "tooltip": {
                "formatter": function () {
                    return '' + `Week-${this.x + 1} : ` + this.y + ' kWh';
                }
            },
            "series": seriesData
        };

        return (
            <div className="weekly-wrapper">
                <ReactHighcharts config={chartData} />
            </div>
        );
    }
}

export default WeeklyChart;