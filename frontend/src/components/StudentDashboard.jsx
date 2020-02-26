import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../Constants'
import axios from 'axios';

class StudentDashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            welcomeMessage: 'Hey You Are Authorized',
            machine: [],
        }
        this.ChangeStatus = this.ChangeStatus.bind(this);
    }

    componentDidMount() {
     //this.loadMachine();
    }

    loadMachine(){
        let edgeStationId = sessionStorage.edgeStation;
        axios.get(API_URL + '/machine/edgeStationId', { params: { edgeStationId } })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    machine: response.data
                });
            });
    }
    ProgressButton = (machine) => {
        sessionStorage.setItem('machine', machine.machineId);
        sessionStorage.setItem('machineowner', machine.email);
        this.props.history.push(`/sensor`)
    }
    ChangeStatus = (machine, p2) => e => {
        console.log("hittt")
        e.preventDefault();
        if (p2 == 0)
        {
            p2 = 1
        }
        else
        {
            p2 = 0
        }
        console.log(p2)
        const data = {
            machineId: machine,
            machineStatus: p2
        }
        console.log("passing", data)
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.patch(API_URL + '/machine/update', data)
            .then((response) => {
                if (response.status === 200) {

                    console.log(response.data);
                    this.setState({

                        signup_status: response.data.message,
                        showSuccessMessage: true
                    })
                    
                    this.loadMachine();
                } else {
                    console.log(response.data.error);
                    this.setState({
                        
                        signup_status: response.data.error,
                        hasFailed: true
                    })
                }
            });
    
    }

    
       

    Sensor = (machine) => {
        sessionStorage.setItem('machine', machine.machineId);

        this.props.history.push(`/sensordata`)
    }

    
    Service = (machine) => {
        sessionStorage.setItem('machine', machine.machineId);

        this.props.history.push(`/servicerequest`)
    }

    render() {
       
      
        if (sessionStorage.role === 'student') {
            return (
                <div class="container">
                    

                    <div class="body-div">
                        <br />
                        <h2>Student's Dashboard </h2><br />
                        <h5>Welcome, {sessionStorage.name}</h5>
                        <p>Student ID: {sessionStorage.authenticatedUser}</p>
                        <div class="card-columns">
                            {
                                this.state.machine.map(machine => {

                                    return (

                                       
                                            <div>

                                                <div class="card bg-info text-white">
                                                    <div class="card-header">
                                                        {machine.name}
                                                    </div>
                                                    <div class="card-body ">
                                                        <p class="card-text">
                                                        <img src={machine.image}/>
                                                        <div class="table-responsive">
                                                            <table class="table">
                                                          
                                                                <tr>
                                                                    <th>machine ID</th><td>{machine.machineId}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Machine Type</th>
                                                                    <td>{machine.machineType}</td>
                                                                </tr>


                                                                <tr>
                                                                    <th>Description</th><td>{machine.desc}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>provider</th> <td>{machine.provider}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th> Status</th> <td>{machine.machineStatus == 0 ? "Idle" :  "Active" } 
                                                                    &nbsp;
                                                                    {sessionStorage.role === 'Farmer' && (<button class="btn btn-default" type="button" onClick={this.ChangeStatus(machine.machineId, machine.machineStatus)} >Change Status</button> )}
                                                                      </td>
                                                                </tr>
                                                                                                                             

                                                            </table>
                                                            </div>

                                                        </p>
                                                    </div>
                                                    <div class="card-footer">
                                                    <button onClick={() => this.ProgressButton(machine)} class="btn btn-primary">Sensor Dashboard</button><br/> 
                                                    <br/> <button onClick={() => this.Sensor(machine)} class="btn btn-danger">Display Machine's Sensor Data</button> <br/> 
                                                    <br/>  <button onClick={() => this.Service(machine)} class="btn btn-primary">Service Dashboard</button><br/> <br/> 

                                                    
                                                    </div>
                                               

                                                </div>
                                            </div>
                                        

                                    )
                                })
                            }


                        </div>
                    </div>

                    {sessionStorage.role === 'Farmer' && (<Link to="/machineadd"><button class="btn btn-success">Create new Machine</button></Link>)}
                </div>
            )
        }
        else {
            return (
                <div class="container">
                    <div class="body-div">
                        <h3>Looks like you are not authorized to view this page.</h3>
                    </div>
                </div>
            )
        }
    }



}


export default StudentDashboard