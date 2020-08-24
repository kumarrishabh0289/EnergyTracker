import React, { Component, Fragment } from 'react';
import Charts from './Charts';
import "../styles/Usage.css";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

class CarbonEmission extends Component {
    state = {
        labelData: ["Date", "Electricity (kWh)", "Gas (therms)", "Carbon Emissions (lbs)"],
        showNames: false
    }

    render() {
        const { selfData, usageData } = this.props.data;

        const dateDifference = selfData.length && (new Date(selfData[0].project.ConservationStartDate) - new Date(selfData[0].project.StartDate)) / (1000 * 3600 * 24);

        const totalDays = selfData.length && ((new Date(selfData[0].project.EndDate) - new Date(selfData[0].project.StartDate)) / (1000 * 3600 * 24));
        const remainingDays = totalDays - dateDifference;
        return (
            <div className="carbon-wrapper">
                <Charts data={this.props.data} param="carbon" />


                <div className="table-container">
                    {
                        sessionStorage.getItem("role") == "student" ? "" : <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Show Student Names" onChange={e => {

                                this.setState({ showNames: !this.state.showNames })
                            }} />
                        </Form.Group>
                    }

                    <div className="table-container mb-4">
                        <Alert className="m-0" variant="success">Your Usage </Alert>
                        <table className="usage-table table table-bordered">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th colSpan={dateDifference ? dateDifference : 1}>Baseline Period</th>

                                    <th colSpan={remainingDays ? remainingDays + 1 : 1}>Conservation Period</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ["date", "electricity", "gas", "carbon"].map((data, index) => {

                                        return <tr key={data}>
                                            <th>{this.state.labelData[index]}</th>
                                            {
                                                selfData && selfData.map((usage, index2) => {
                                                    let text;

                                                    if (index == 0) {
                                                        let date = new Date(usage["date"]);
                                                        text = date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
                                                    } else {
                                                        // text = <input type="number" value={usage[data]} onChange={e => this.onChange(e, data, index2)} />;
                                                        text = <div>{usage[data]}</div>;
                                                    }

                                                    return <td className={index == 0 && (index2 < dateDifference ? "row-yellow" : "row-green") || ""} key={usage._id}>{text}</td>
                                                })
                                            }
                                        </tr>;
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="table-container mb-4">
                        <Alert className="m-0" variant="success">Class Usage Details</Alert>

                        {
                            !usageData.length ?
                                <h5>No data available</h5> :
                                <table className="usage-table table table-bordered">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th colSpan={dateDifference}>Baseline Period</th>

                                            <th colSpan={remainingDays + 1}>Conservation Period</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ["date"].map((data, index) => {

                                                return <tr key={data}>
                                                    <th>{this.state.labelData[index]}</th>
                                                    {
                                                        this.getHeaderData(index, data, dateDifference)

                                                        // this.getData(index, data, dateDifference)
                                                    }
                                                </tr>;
                                            })
                                        }

                                        {
                                            Object.keys(usageData).map((data, index) => {

                                                if (data == sessionStorage.getItem("authenticatedUser")) return "";
                                                else return (
                                                    <Fragment>
                                                        <div className="bordered-name mt-4"><div>{this.state.hideNames ? data : `Student ${index + 1}`}</div></div>
                                                        <tr>
                                                            <th>{this.state.labelData[1]}</th>
                                                            {
                                                                usageData[data] && usageData[data].map((currUsage, index2) => {
                                                                    let text;
                                                                    text = <div>{currUsage["electricity"]}</div>;


                                                                    return <td key={currUsage._id}>{text}</td>

                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <th>{this.state.labelData[2]}</th>
                                                            {
                                                                usageData[data] && usageData[data].map((currUsage, index2) => {
                                                                    let text;
                                                                    text = <div>{currUsage["gas"]}</div>;


                                                                    return <td key={currUsage._id}>{text}</td>

                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <th>{this.state.labelData[3]}</th>
                                                            {
                                                                usageData[data] && usageData[data].map((currUsage, index2) => {
                                                                    let text;
                                                                    text = <div>{currUsage["carbon"]}</div>;


                                                                    return <td key={currUsage._id}>{text}</td>

                                                                })
                                                            }
                                                        </tr>
                                                    </Fragment>
                                                );
                                            })
                                            // this.getData()
                                        }
                                    </tbody>
                                </table>


                        }

                    </div>


                </div>
            </div>
        );
    }

    getHeaderData = (index, data, dateDifference) => {
        const { selfData } = this.props.data;

        return selfData && selfData.map((currUsage, index2) => {
            let text;

            if (index == 0) {
                let date = new Date(currUsage["date"]);
                text = date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
            }

            return <td className={index == 0 && (index2 < dateDifference ? "row-yellow" : "row-green") || ""} key={currUsage._id}>{text}</td>

        });

    }
}

export default CarbonEmission;