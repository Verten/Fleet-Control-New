/**
 * Created by ebinhon on 3/2/2016.
 */
import React from 'react';
import {
    default as canUseDOM,
} from "can-use-dom";
import Page from '../Page';
import FaSpinner from "react-icons/fa/spinner";
import { GoogleMapLoader,GoogleMap, Marker, DirectionsRenderer,Circle } from "react-google-maps";
import ScriptjsLoader from "react-google-maps/lib/async/ScriptjsLoader";
import Table from '../../Table/Table';
import AppInfoStore from '../../../Store/AppInfoStore';
import AppInfoAction from '../../../Action/AppInfoAction';
import TripInfoStore from '../../../Store/TripInfoStore';
import TripInfoAction from '../../../Action/TripInfoAction';
import EventInfoStore from '../../../Store/EventInfoStore';
import EventInfoAction from '../../../Action/EventInfoAction';
import FleetDataInfoStore from '../../../Store/FleetDataInfoStore';
import FleetDataInfoAction from '../../../Action/FleetDataInfoAction';
import connectToStores from 'alt-utils/lib/connectToStores';
import moment from 'moment';

const geolocation = (
    canUseDOM && navigator.geolocation || {
        getCurrentPosition: (success, failure) => {
            failure(`Your browser doesn't support geolocation.`);
        },
    }
);

@connectToStores
export default class IndexPage extends React.Component {
    static getStores() {
        // this will handle the listening/unlistening for you
        return [AppInfoStore,TripInfoStore,EventInfoStore,FleetDataInfoStore];
    }

    static getPropsFromStores() {
        // this is the data that gets passed down as props
        // each key in the object returned by this function is added to the `this.props`
        let headers = AppInfoStore.getState().header;
        let trip_info = TripInfoStore.getState().body;
        let fleet_data = FleetDataInfoStore.getState().body;//list,and we need currentInformation
        let app_info = AppInfoStore.getState().body;
        return {
            headers: headers,
            trip_info: trip_info,
            events: EventInfoStore.getState().body,
            fleet_data: fleet_data,
            app_info: app_info,
        }
    }

    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        markers:React.PropTypes.arrayOf(React.PropTypes.object)
    }

    static defaultProps = {
        markers: [
            {
                position: {
                    lat: 23.1312183,
                    lng: 113.27067570000001
                },
                key: `Start`,
                defaultAnimation: 2
            }
        ],
        marker_image:'../../images/truck_icon.png',
        origin: new google.maps.LatLng(39.9860987, 116.4698704),
        destination: new google.maps.LatLng(23.1312983, 113.23067570006001)
    }

    constructor() {
        super();
        this.state = {
            data:[],
            directions: null,
            markers: [],
            zoomLevel:13,
            circles: []
        }
    }


    timerGetTripData(){
        let postJSON = {
            userId: this.props.app_info.userId,
            fleetId: this.props.app_info.fleetId,
            enterpriseId: this.props.app_info.enterpriseId,
            role: this.props.app_info.userRole
        }
        //TODO
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
                    if (events.length != 0) {
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
                    } else {
                        let tmpEvent = {
                            "type": "",
                            "message": "-"
                        }
                        eventResult.push(
                            tmpEvent
                        );
                    }
                    TripInfoStore.setTripEvents(tripid, eventResult);
                    this.setState(this.state);
                }).catch((error) => {
                    console.log(error);
                    TripInfoStore.setTripEvents(tripid, []);
                });
            }
            FleetDataInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapGetFleetDataService')
                .then((response) => {
                    console.log("load hwapGetFleetDataService successfully");
                }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    componentWillUnmount(){
        clearInterval(this.state.intervalId);
    }

    componentWillMount(){

    }

    componentDidMount(){

        let intervalId = setInterval(this.timerGetTripData.bind(this), 8000);
        this.setState({
            intervalId: intervalId
        });

        geolocation.getCurrentPosition((position) => {
            this.setState({
                origin: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                content: `Location found using HTML5.`
            });
            const tick = () => {
                this.setState({ radius: Math.max(this.state.radius - 20, 0) });
            };
        }, (reason) => {
            this.setState({
                content: `Error: The Geolocation service failed (${ reason }).`
            });
        });

        console.log('Created "index page"');
        //TODO
        //for remote: http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary/7a3b8bdd-7350-42fa-89fc-50eb61974d0b/_/fleetcontrol-1
        AppInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary/7a3b8bdd-7350-42fa-89fc-50eb61974d0b/_/fleetcontrol-1/Asset/data/FleetControlTableHeader.json').then((response) => {
            console.log('load Fleet Control Table Header Successfully');
        }).catch((error) => {
            console.log(error);
        });

        console.log(this.props.headers);
    }

    expandJSONObject(jsonObject){
        let keys = [];
        for(let key in jsonObject){
            keys.push(
                key
            );
        }
        return keys;
    }

    renderData(){
        let trips = this.props.trip_info;
        //
        let id = "";
        let TripIndex = 0;
        let Customer = "";
        let Cargo = "";
        let Route = "";
        let EstimatedTime = "";
        let Vehicle = "";
        let Driver = "";
        let Status = "";
        let LatestEvent = [{
            "type":"",
            "message":"-"
        }];
        //
        let trips_brife = [];
        for(let index in trips) {
            if (trips[index] && trips[index].vehicle) {
                TripIndex += 1;
                id = trips[index].id;
                Vehicle = trips[index].vehicle.registration;
                Customer = trips[index].customer;
                Cargo = trips[index].cargoName;
                Route = trips[index].startPointAddress + " - " + trips[index].destinationAddress;
                EstimatedTime = moment(trips[index].startTime).format("YYYY-MM-DD HH:mm") + " TO " + moment(trips[index].arriveTime).format("YYYY-MM-DD HH:mm");
                if (trips[index].vehicle.driver) {
                    Driver = trips[index].vehicle.driver.firstName + " " + trips[index].vehicle.driver.lastName;
                }
                Status = trips[index].status;
            }
            if(trips[index].events && trips[index].events.length != 0){
                LatestEvent = [trips[index].events[0]];
            }

            let trip_brife_info = {
                "id":id,
                "tripIndex":TripIndex,
                "customer":Customer,
                "cargo": Cargo,
                "Route": Route,
                "estimatedTime": EstimatedTime,
                "vehicle": Vehicle,
                "driver": Driver,
                "status":Status,
                "event": LatestEvent,
                "operation":true
            }
            trips_brife.push(
                trip_brife_info
            );
        }
        return trips_brife;
    }

    changeLink(){
        console.log("change link flag")
        AppInfoStore.setChangeLinkFlag();
    }

    changeMap(tripId){
        console.log(tripId);
        let trip = TripInfoStore.findTripById(tripId);

        let startPoint_latitude = 23.1312183;
        let startPoint_longitude = 113.27067570000001;
        let destination_latitude = 23.1312983;
        let destination_longitude = 113.23067570006001;

        if (trip) {
            startPoint_latitude = parseFloat(trip.startPointLatitude);
            startPoint_longitude = parseFloat(trip.startPointLongitude);
            destination_latitude = parseFloat(trip.destinationLatitude);
            destination_longitude = parseFloat(trip.destinationLongitude);

            if(this.props.fleet_data) {
                let current_fleet = this.props.fleet_data;
                for(let index in current_fleet){
                    if(current_fleet[index].vehicle.id == trip.vehicleId){
                        let current_info = current_fleet[index].currentInformation;
                        let trip_lat = current_info.lat;
                        let trip_lng = current_info.long;
                        let marker = {
                            position: {
                                lat: trip_lat,
                                lng: trip_lng
                            },
                            key: `current`,
                            icon: this.props.marker_image,
                            defaultAnimation: 2
                        };
                        this.setState({
                            markers: [marker]
                        });
                    }
                }
            }
            let origin =  new google.maps.LatLng(parseFloat(startPoint_latitude), parseFloat(startPoint_longitude));
            let destination =  new google.maps.LatLng(parseFloat(destination_latitude), parseFloat(destination_longitude));

            let circle = [];
            circle.push({
                lat: startPoint_latitude,
                lng: startPoint_longitude
            });
            circle.push({
                lat: destination_latitude,
                lng: destination_longitude
            });

            const DirectionsService = new google.maps.DirectionsService();
            DirectionsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result,
                        circles: circle
                    });
                } else {
                    console.error(`error fetching directions`);
                    console.log(result);
                }
            });
        }
    }

    render() {
        let trip_brife_info = this.renderData();
        const directions = this.state.directions;
        return(
            <Page>
                <GoogleMapLoader
                    containerElement={
                        <div className="map_panel"></div>
                    }
                    googleMapElement={
                        <GoogleMap
                          ref="map"
                          zoom={this.state.zoomLevel}
                          defaultCenter={this.state.origin? this.state.origin : this.props.origin}
                        >
                           {this.state.circles.map((circle,index) => {
                            return (
                                <Circle key={"circle" + index} center={circle} radius={500} options={{
                                          fillColor: `red`,
                                          fillOpacity: 0,
                                          strokeColor: `red`,
                                          strokeOpacity: 1,
                                          strokeWeight: 1,
                                        }}
                                    />
                            );
                           })}
                           {directions ? <DirectionsRenderer directions={directions} /> : null}
                           {this.state.markers.map((marker, index) => {
                              return (
                                <Marker
                                  {...marker}
                                />
                              );
                            })}
                        </GoogleMap>
                    }
                />
                <Table clickFunction={this.changeMap.bind(this)} changeLinkFunction={this.changeLink.bind(this)} header={this.props.headers} data={trip_brife_info}/>
            </Page>
        );
    }
}