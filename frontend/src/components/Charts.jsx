import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import Form from 'react-bootstrap/Form';

class Charts extends Component {
    state = {
        labels: {
            "electricity": {
                "title": "Electricity",
                "yAxis": "Usage Values (kWh)",
                "units": "kWh"
            },
            "gas": {
                "title": "Natural Gas",
                "yAxis": "Usage Values (therms)",
                "units": "therms"
            },
            "carbon": {
                "title": "Carbon Footprint",
                "yAxis": "Carbon Emission (lbs)",
                "units": "lbs"
            },
        }
    };

    generateData = () => {
        const { selfData, usageData, average } = this.props.data;
        const { param } = this.props;
        let userData = [];

        userData.push({
            "name": "Your Usage",
            "color": "red",
            "data":
                selfData.filter(data => data[param] != "").map(data => {
                    return [new Date(data.date).getTime() - 86400000, +data[param]];
                })
            ,
            "type": "line",
            "zIndex": 10,
            "lineWidth": 2.5
        });

        let map = usageData.map((user, index) => {
            let obj = {
                "name": "Class Usage",
                "color": "black",
                "data":
                    user.filter(data => data[param] != "").map(data => {
                        return [new Date(data.date).getTime() - 86400000, +data[param]];
                    })
                ,
                "type": "line",
                "zIndex": 10,
                "lineWidth": 2.5
            };

            if (index) obj["linkedTo"] = ':previous';

            return obj;
        });

        userData.push({
            "name": "Average Class Usage",
            "color": "green",
            "data":
                average[param] && average[param].filter(data => data.val != null).map((data, index) => {
                    return [new Date(data.date).getTime() - 86400000, +data.val];
                })
            ,
            "type": "line",
            "zIndex": 10,
            "lineWidth": 2.5
        });

        return [...userData, ...map];

    };

    render() {
        const { selfData, usageData } = this.props.data;
        const { param } = this.props;
        const self = this;

        let userData = this.generateData();

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
                "type": "datetime",
                "dateTimeLabelFormats": {
                    "day": "%b-%d"
                },
                "title": {
                    "text": "Date"
                },
                "plotBands": [
                    {
                        "to": selfData.length && new Date(selfData[0].project.ConservationStartDate).getTime() - 86400000,
                        "from": selfData.length && new Date(selfData[0].project.StartDate).getTime() - 86400000,
                        "color": "#ffffcc",
                        "label": {
                            "text": "Baseline Period",
                            "style": {
                                "font-size": "medium"
                            },
                            "y": -10
                        }
                    },
                    {
                        "to": selfData.length && new Date(selfData[0].project.EndDate).getTime() - 86400000,
                        "from": selfData.length && new Date(selfData[0].project.ConservationStartDate).getTime() - 86400000,
                        "color": "#cbffcb",
                        "label": {
                            "text": "Conservation Period",
                            "style": {
                                "font-size": "medium"
                            },
                            "y": -10
                        }
                    }
                ]
            },
            "plotOptions": {
                "scatter": {
                    "marker": {
                        "symbol": "circle"
                    }
                },
                "line": {
                    "marker": {
                        "enabled": true
                    }
                }
            },
            "title": {
                "text": this.state.labels[param].title
            },
            "yAxis": {
                "title": {
                    "text": this.state.labels[param].yAxis
                }
            },
            "legend": {
                "enabled": true,
                useHTML: true,
                symbolWidth: 0,
                labelFormatter: function () {
                    return '<div class="d-flex align-items-center mx-3 chart-legend"><input type="checkbox" class="mx-2" ' + (this.visible ? 'checked ><span>' : '><span>') + this.name + '</span></div>'
                }
            },
            "tooltip": {
                "formatter": function () {
                    let date = new Date(this.x);
                    let text = date.toLocaleString('default', { month: 'short' }) + " " + (date.getDate() + 1);

                    return `Day:  ${text} <br /> ${param == 'carbon' ? "Emissions due to usage" : "Usage"}:  ${this.y} ${self.state.labels[param].units}`;
                }
            },
            "series": userData
        };

        return (
            <div className="charts-wrapper p-3" >
                <ReactHighcharts config={chartData} />
            </div>
        );
    }
}

export default Charts;