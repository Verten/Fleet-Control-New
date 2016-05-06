/**
 * Created by ebinhon on 2/29/2016.
 */
import React from 'react';
import { Link } from 'react-router';
import AppInfoStore from '../../Store/AppInfoStore';
import AppInfoAction from '../../Action/AppInfoAction';
import TripInfoAction from '../../Action/TripInfoAction';
import TripInfoStore from '../../Store/TripInfoStore';
import EventInfoAction from '../../Action/EventInfoAction';
import EventInfoStore from '../../Store/EventInfoStore';
import Navigation from '../Navigation/Navigation';
import FleetDataInfoAction from '../../Action/FleetDataInfoAction';
import FleetDataInfoStore from '../../Store/FleetDataInfoStore';
import connectToStores from 'alt-utils/lib/connectToStores';
import moment from 'moment';

@connectToStores
export default class App extends React.Component{
    constructor(){
        super();
        this.state = {
            loadFlag:false,
            loadError:false,
            fleetId:""
        };
    }

    static getStores() {
        // this will handle the listening/unlistening for you
        return [AppInfoStore,TripInfoStore,EventInfoStore, FleetDataInfoStore];
    }

    static getPropsFromStores() {
        // this is the data that gets passed down as props
        // each key in the object returned by this function is added to the `this.props`
        let app_info = AppInfoStore.getState().body;
        let trip_info = TripInfoStore.getState().body;
        let fleet_data = FleetDataInfoStore.getState().body;//list,and we need currentInformation
        return {
            app_info: app_info,
            trip_info: trip_info,
            fleet_data: fleet_data,
            events: EventInfoStore.getState().body
        }
    }


    componentDidMount() {
        const users_Endpoint = AppInfoStore.getClientEndpoint("users");
        AppInfoAction.loadData("http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com" + users_Endpoint + "setupClientContext").then((response) =>{
            console.log("get setupClientContext successfully")
            console.log(this.props.app_info);
            this.setState({
                loadFlag:true,
                fleetId:this.props.app_info.fleetId
            });
            let postJSON = {
                    userId: this.props.app_info.userId,
                    fleetId: this.props.app_info.fleetId,
                    enterpriseId: this.props.app_info.enterpriseId,
                    role: this.props.app_info.userRole
            }
            TripInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapGetTripPlanning?body=' + encodeURI(JSON.stringify(postJSON))).then((response) => {
                console.log('load Trip Info Successfully');
                let trips = this.props.trip_info;
                for(let index in trips) {
                    let tripid = trips[index].id;
                    //TODO
                    //getEvent
                    EventInfoAction.loadData("http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapGetTripEvents?tripId=" + tripid).then((response) => {
                        console.log("get trip event successfully");
                        let events = this.props.events;
                        let eventResult = [];
                        if(events.length != 0) {
                            for (let i in events) {
                                let tmpEvent = {
                                    "createDate": moment(events[i].created),
                                    "type": events[i].type,
                                    "message": events[i].message
                                }
                                eventResult.push(
                                    tmpEvent
                                );
                            }
                        }else{
                            let tmpEvent = {
                                "type": "",
                                "message": "-"
                            }
                            eventResult.push(
                                tmpEvent
                            );
                        }
                        TripInfoStore.setTripEvents(tripid,eventResult);
                        console.log(this.props.trip_info);
                    }).catch((error) => {
                        console.log(error);
                        TripInfoStore.setTripEvents(tripid,[]);
                    });
                }
            }).catch((error) => {
                console.log(error);
            })
        }).catch((error) =>{
            console.log("Loading setupClientContext API Error!");
            console.log(error);
            this.setState({
                loadError:true
            });
        });
        FleetDataInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapGetFleetDataService')
            .then((response) => {
                console.log("load hwapGetFleetDataService successfully");
            }).catch((error) => {
            console.log(error);
        });
    }

    componentWillMount(){
    }

    changeLink(){
        console.log("change link flag")
        AppInfoStore.setChangeLinkFlag();
    }

    render(){
        let links = [
            {
                name: "Assignment",
                path:"/create/",
                param: this.state.fleetId ? this.state.fleetId : "no fleet Id"
            },
            {
                name: "Cancel",
                path:"/",
                param: ""
            }
        ];
        return (
            <div className="main_page" >
                <Navigation clickFunction={this.changeLink.bind(this)} ref="navigation" links={links} />
                {this.props.children}
            </div>
        );
    }
}