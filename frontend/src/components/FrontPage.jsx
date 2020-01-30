import React, { Component } from 'react'
// eslint-disable-next-line
import { Link } from 'react-router-dom'
// eslint-disable-next-line
import AuthenticationForApiService from './AuthenticationForApiService.js'

class FrontPage extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentWillMount() {

    }

    render() {
        return (
            <div>
                <div class="container-fluid">
                    <br />
                    <br />
                    <div class="row" >
                        <div class="col-sm-1 col-md-1"></div>

                        <div class="col-sm-5 col-md-5" style={{ backgroundColor: "white", opacity: .9, filter: "Alpha(opacity=90)", borderRadius: '10px' }}>
                            <br/>
                            <h3>
                                Green Ninja Energy Tracker
                            </h3>
                            <br/>
                            <form>

                                <div class="row" >

                                    <div class="col-sm-6 col-md-6">

                                        <div class="form-group">
                                            <label for="where"><h5>User Name</h5></label>
                                            <input type="text" class="form-control" id="where" placeholder="User Name" />

                                        </div>

                                    </div>
                                    <div class="col-sm-6 col-md-6">

                                        <div class="form-group">
                                            <label for="where"><h5>Password</h5></label>
                                            <input type="text" class="form-control" id="where" placeholder="Password" />

                                        </div>
                                    </div>

                                </div>

                                <div class="row" >



                                    <div class="col-sm-12 col-md-12">
                                      
                                        <div class="form-group">
                                            <label for="where"><h5>Your Role</h5></label>
                                            <input type="text" class="form-control" id="where" placeholder="Role" />

                                        </div>

                                    </div>


                                </div>


                                <div class="row" >

                                    <div class="col-sm-12 col-md-12">
                                        <div class="form-group">

                                            <br />
                                            <input type="submit" class="form-control btn btn-success" />
                                            <br />
                                            <br />
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>

                    </div>


                </div>
            </div>
        )
    }
}

export default FrontPage