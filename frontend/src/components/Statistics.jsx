import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import ReactHighcharts from 'react-highcharts';
import "../styles/Statistics.css";

class Statistics extends Component {
    state = {}
    render() {
        const { selfSection, classSection, classPercent } = this.props.data.statistics;
        const { weeklyAverage } = this.props.data;

        if (!selfSection && !classSection)
            return <div>Sorry, no data available!</div>;

        let chartData = {
            "chart": {
                "renderTo": "myDiv",
                "type": "column",
                "marginRight": "25",
                "shadow": "false",
                "animation": "false",
                "showCheckBox": "true"
            },
            "xAxis": {
                labels: {
                    enabled: false
                }
            },
            "plotOptions": {
            },
            "title": {
                "text": "Class Consumption Averages"
            },
            "yAxis": {
                "title": {
                    "text": "lbs"
                }
            },
            "legend": {
                "enabled": true
            },
            "tooltip": {
                "formatter": function () {

                    return this.series.name + ': ' + this.y + ' lbs';
                }
            },
            "series": [{
                name: "Baseline Class Average",
                data: [classSection["carbon"].baseAvg]
            }, {
                name: "Conservation Class Average",
                data: [classSection["carbon"].conserveAvg]
            }]
        };

        let percChartData = {
            "chart": {
                "renderTo": "myDiv",
                "type": "column",
                "marginRight": "25",
                "shadow": "false",
                "animation": "false",
                "showCheckBox": "true"
            },
            "xAxis": {
                labels: {
                    enabled: false
                }
            },
            "plotOptions": {
            },
            "title": {
                "text": "How many people made an impact?"
            },
            "yAxis": {
                "title": {
                    "text": " % Students"
                }
            },
            "legend": {
                "enabled": true
            },
            "tooltip": {
                "formatter": function () {

                    return this.series.name + ': ' + this.y + '%';
                }
            },
            "series": [{
                name: "% of students who reduced energy consumption by 5%",
                data: [classPercent[0]]
            }, {
                name: "% of students who reduced energy consumption by 10%",
                data: [classPercent[1]]
            }, {
                name: "% of students who reduced energy consumption by 20%",
                data: [classPercent[2]]
            }]
        };

        return (
            <div className="statistics-wrapper">

                <div className="table-container row">
                    <div className="col-sm-4 electricity-table">
                        <Card className="my-3">
                            <Card.Header>Your Electricity</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Baseline Average</th>
                                            <th>Conservation Average</th>
                                            <th>Percent Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{selfSection["electricity"].baseAvg} kWh</td>
                                            <td>{selfSection["electricity"].conserveAvg} kWh</td>
                                            <td>{selfSection["electricity"].percentChange}%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Card className="my-3">
                            <Card.Header>Your Class Electricity</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Baseline Average</th>
                                            <th>Conservation Average</th>
                                            <th>Percent Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{classSection["electricity"].baseAvg} kWh</td>
                                            <td>{classSection["electricity"].conserveAvg} kWh</td>
                                            <td>{classSection["electricity"].percentChange}%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Card className="my-3">
                            <Card.Header>Weekly Classroom Electricity Average</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Week No.</th>
                                            <th>Average</th>
                                            <th>Maximum Usage</th>
                                            <th>Minimum Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            weeklyAverage["electricity"] && weeklyAverage["electricity"].map((avg, index) => {
                                                return <tr>
                                                    <td>Week {index + 1}</td>
                                                    <td>{avg.average} kWh</td>
                                                    <td>{avg.max} kWh</td>
                                                    <td>{avg.min} kWh</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                    </div>
                    <div className="col-sm-4 gas-table">
                        <Card className="my-3">
                            <Card.Header>Your Natural Gas</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Baseline Average</th>
                                            <th>Conservation Average</th>
                                            <th>Percent Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{selfSection["gas"].baseAvg} therms</td>
                                            <td>{selfSection["gas"].conserveAvg} therms</td>
                                            <td>{selfSection["gas"].percentChange}%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                        <Card className="my-3">
                            <Card.Header>Your Class Natural Gas</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Baseline Average</th>
                                            <th>Conservation Average</th>
                                            <th>Percent Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{classSection["gas"].baseAvg} therms</td>
                                            <td>{classSection["gas"].conserveAvg} therms</td>
                                            <td>{classSection["gas"].percentChange}%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Card className="my-3">
                            <Card.Header>Weekly Classroom Natural Gas Average</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Week No.</th>
                                            <th>Average</th>
                                            <th>Maximum Usage</th>
                                            <th>Minimum Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            weeklyAverage["gas"] && weeklyAverage["gas"].map((avg, index) => {
                                                return <tr>
                                                    <td>Week {index + 1}</td>
                                                    <td>{avg.average} therms</td>
                                                    <td>{avg.max} therms</td>
                                                    <td>{avg.min} therms</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                    </div>
                    <div className="col-sm-4 carbon-table">
                        <Card className="my-3">
                            <Card.Header>Your Carbon Emission</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Baseline Average</th>
                                            <th>Conservation Average</th>
                                            <th>Percent Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{selfSection["carbon"].baseAvg} lbs</td>
                                            <td>{selfSection["carbon"].conserveAvg} lbs</td>
                                            <td>{selfSection["carbon"].percentChange}%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                        <Card className="my-3">
                            <Card.Header>Your Class Carbon Emission</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Baseline Average</th>
                                            <th>Conservation Average</th>
                                            <th>Percent Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{classSection["carbon"].baseAvg} lbs</td>
                                            <td>{classSection["carbon"].conserveAvg} lbs</td>
                                            <td>{classSection["carbon"].percentChange}%</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Card className="my-3">
                            <Card.Header>Weekly Classroom Carbon Emission Average</Card.Header>
                            <Card.Body>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>Week No.</th>
                                            <th>Average</th>
                                            <th>Maximum Usage</th>
                                            <th>Minimum Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            weeklyAverage["carbon"] && weeklyAverage["carbon"].map((avg, index) => {
                                                return <tr>
                                                    <td>Week {index + 1}</td>
                                                    <td>{avg.average} lbs</td>
                                                    <td>{avg.max} lbs</td>
                                                    <td>{avg.min} lbs</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </div>
                </div>


                <div className="perc-chart col-sm-12 my-4">
                    <ReactHighcharts config={percChartData} />
                </div>

                <div className="average-chart col-sm-12 my-4">
                    <ReactHighcharts config={chartData} />
                </div>

            </div>
        );
    }
}

export default Statistics;