import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';

class Charts extends Component {
    state = {};

    render() {
        const { data } = this.props;
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
                        "to": 1596499200000,
                        "from": 1601769600000,
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
                        "to": 1604448000000,
                        "from": 1601769600000,
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
                        "enabled": false
                    }
                }
            },
            "title": {
                "text": "Electricity"
            },
            "yAxis": {
                "title": {
                    "text": "Usage Values (kWh)"
                }
            },
            "legend": {
                "enabled": false
            },
            "tooltip": {
                // "formatter": function () {
                //     return '' + 'Day: ' + ReactHighcharts.dateFormat('%B %e %Y', this.x) + '<br>' + 'Usage: ' + this.y + ' kWh';
                // }
            },
            "series": [
                {
                    "name": "Your Usage",
                    "color": "red",
                    "data": [
                        [
                            1596499200000,
                            2
                        ],
                        [
                            1596585600000,
                            8
                        ],
                        [
                            1596672000000,
                            3
                        ],
                        [
                            1596758400000,
                            7
                        ],
                        [
                            1596844800000,
                            5
                        ],
                        [
                            1601769600000,
                            3
                        ],
                        [
                            1601856000000,
                            4
                        ],
                        [
                            1601942400000,
                            5
                        ],
                        [
                            1602028800000,
                            6
                        ],
                        [
                            1602115200000,
                            5
                        ]
                    ],
                    "type": "line",
                    "zIndex": 10,
                    "lineWidth": 2.5
                },
                {
                    "name": "Distribution",
                    "color": "grey",
                    "visible": false,
                    "zIndex": 3,
                    "data": [
                        [
                            1596499200000,
                            2
                        ],
                        [
                            1596499200000,
                            2
                        ],
                        [
                            1596585600000,
                            8
                        ],
                        [
                            1596585600000,
                            3
                        ],
                        [
                            1596672000000,
                            3
                        ],
                        [
                            1596672000000,
                            4
                        ],
                        [
                            1596758400000,
                            7
                        ],
                        [
                            1596758400000,
                            5
                        ],
                        [
                            1596844800000,
                            5
                        ],
                        [
                            1596844800000,
                            5
                        ],
                        [
                            1601769600000,
                            3
                        ],
                        [
                            1601856000000,
                            4
                        ],
                        [
                            1601942400000,
                            5
                        ],
                        [
                            1602028800000,
                            6
                        ],
                        [
                            1602115200000,
                            5
                        ]
                    ]
                }]
        }

        return (
            <div className="charts-wrapper" >
                <ReactHighcharts config={chartData} />
            </div>
        );
    }
}

export default Charts;