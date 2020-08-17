import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

class Statistics extends Component {
    state = {}
    render() {
        const { selfSection, classSection } = this.props.data.statistics;
        console.log('selfSection, classSection', selfSection, classSection)

        if (!selfSection && !classSection)
            return <div>Sorry, no data available!</div>;

        return (
            <div className="statistics-wrapper">

                <div className="table-container col-sm-12 row">
                    <div className="col-sm-4 electricity-table">
                        <Card className="my-3">
                            <Card.Header>Your Electricity</Card.Header>
                            <Card.Body>
                                <Table bordered hover>
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
                                <Table bordered hover>
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

                    </div>
                    <div className="col-sm-4 gas-table">
                        <Card className="my-3">
                            <Card.Header>Your Natural Gas</Card.Header>
                            <Card.Body>
                                <Table bordered hover>
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
                                <Table bordered hover>
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

                    </div>
                    <div className="col-sm-4 carbon-table">
                        <Card className="my-3">
                            <Card.Header>Your Carbon Emission</Card.Header>
                            <Card.Body>
                                <Table bordered hover>
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
                                <Table bordered hover>
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

                    </div>
                </div>
            </div>
        );
    }
}

export default Statistics;