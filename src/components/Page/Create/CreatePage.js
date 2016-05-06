/**
 * Created by ebinhon on 3/21/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    default as canUseDOM,
} from "can-use-dom";
import ReactSlider from 'react-slider';
import { GoogleMapLoader,GoogleMap, Marker, DirectionsRenderer,InfoWindow,Circle  } from "react-google-maps";
import ScriptjsLoader from "react-google-maps/lib/async/ScriptjsLoader";
import Table from '../../Table/Table';
import AppInfoStore from '../../../Store/AppInfoStore';
import AppInfoAction from '../../../Action/AppInfoAction';
import FleetDataInfoAction from '../../../Action/FleetDataInfoAction';
import FleetDataInfoStore from '../../../Store/FleetDataInfoStore';
import GeoLocationInfoAction from '../../../Action/GeoLocationInfoAction';
import GeoLocationInfoStore from '../../../Store/GeoLocationInfoStore';
import SensorInfoAction from '../../../Action/SensorInfoAction';
import TripInfoAction from '../../../Action/TripInfoAction';
import TripInfoStore from '../../../Store/TripInfoStore';
import SensorInfoStore from '../../../Store/SensorInfoStore';
import RouteInfoAction from '../../../Action/RouteInfoAction';
import RouteInfoStore from '../../../Store/RouteInfoStore';

import Page from '../Page';
import Panel from '../../Panel/Panel';
import moment from 'moment';
import './CreatePage.scss';

import connectToStores from 'alt-utils/lib/connectToStores';

const geolocation = (
    canUseDOM && navigator.geolocation || {
        getCurrentPosition: (success, failure) => {
            failure(`Your browser doesn't support geolocation.`);
        },
    }
);

@connectToStores
export default class CreatePage extends React.Component {

    static getStores() {
        // this will handle the listening/unlistening for you
        return [AppInfoStore, GeoLocationInfoStore, FleetDataInfoStore, SensorInfoStore,TripInfoStore];
    }

    static getPropsFromStores() {
        // this is the data that gets passed down as props
        // each key in the object returned by this function is added to the `this.props`
        let app_info = AppInfoStore.getState().body;
        let fleet_data = FleetDataInfoStore.getState().body;//list,and we need currentInformation
        let geoLocationStatus = GeoLocationInfoStore.getState().status;
        let geoLocationResult = GeoLocationInfoStore.getState().results;
        let sensor = SensorInfoStore.getState().body;
        let trip_info = TripInfoStore.getState().body;

        return {
            app_info: app_info,
            geoLocationStatus: geoLocationStatus,
            geoLocationResult: geoLocationResult,
            fleet_data: fleet_data,
            sensor: sensor,
            trip_info: trip_info
        }
    }

    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        origin: React.PropTypes.object,
        destination: React.PropTypes.object
    }

    static defaultProps = {
        marker_image:'../../images/truck_icon.png',

        origin: new google.maps.LatLng(39.9860987, 116.4698704),
        destination: new google.maps.LatLng(23.1312983, 113.23067570006001)
    }

    constructor() {
        super();
        this.state = {
            circle: [],
            markers: [],//position: {
            //    lat: 25.0112183,
            //    lng: 121.52067570000001,
            //},
            //    key: `Taiwan`
            vehicleID: "",
            draw: false,
            customer: "",
            origin: null,
            destination: null,
            directions: null,
            plannedStartTime: null,
            plannedArriveTime: null,
            cargo: "Apple",
            quantity: null,
            driver:null,
            vehicletype: {},
            vehicletypeId: null,
            uom: "KG",
            routeId: null,
            startPoint_address: null,
            startPoint_address_lat: null,
            startPoint_address_lng: null,
            destination_address: null,
            destination_address_lat: null,
            destination_address_lng: null,
            sensor_temperature_id: null,//also mapping to Pressure
            sensor_temperature_min: 0,
            sensor_temperature_set: 12,
            sensor_temperature_max: 30,
            sensor_temperature_uom: '°',
            sensor_temperature_title: 'Temperature',
            sensor_humidity_id: null, // also mapping to Electrostatic
            sensor_humidity_min: 50,
            sensor_humidity_set: 70,
            sensor_humidity_max: 100,
            sensor_humidity_uom: '%',
            sensor_humidity_title: 'Humidity'
        }
    }


    componentDidMount() {
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


        console.log('Created "create page"');
        FleetDataInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapGetFleetDataService')
            .then((response) => {
                console.log("load hwapGetFleetDataService successfully");
                let fleetData = this.props.fleet_data;
                let markers = [];
                for (let index in fleetData) {
                    if (fleetData[index].currentInformation.lat && fleetData[index].currentInformation.long) {
                        let marker = {
                            position: {
                                "lat": fleetData[index].currentInformation.lat,
                                "lng": fleetData[index].currentInformation.long
                            },
                            icon: this.props.marker_image,
                            vehicleid: fleetData[index].vehicle.id,
                            vehicleregistration: fleetData[index].vehicle.registration,
                            vehiclevin: fleetData[index].vehicle.vin,
                            defaultAnimation: 2,
                            showvehicleInfo: true
                        }
                        markers.push(
                            marker
                        );
                    }
                }
                this.setState({
                    markers: markers
                });
                console.log("done set up vehicle");
            }).catch((error) => {
            console.log(error);
        });
    }

    showTips(){
        let items = [];
        if(!this.state.draw){
            items.push(
                <div key="tips" className="show_tips">
                    <h3>Select a truck by clicking position indicator on the map</h3>
                </div>
            );
        }
        return items;
    }

    initVehiclePanel(vehicle) {
        let items = [];
        let page;
        console.log("init vehicle panel");
        if (this.state.driver && this.state.draw) {
            let fleetData = this.props.fleet_data;
            for (let index in fleetData) {
                if (fleetData[index].vehicle.id == vehicle) {
                    items.push({
                        "label": "Registration",
                        "value": fleetData[index].vehicle.registration,
                        "type": "registration",
                        "editable": false
                    });
                    items.push({
                        "label": "Brand",
                        "value": fleetData[index].vehicle.brand,
                        "type": "brand",
                        "editable": false
                    });
                    items.push({
                        "label": "Model",
                        "value": fleetData[index].vehicle.model,
                        "type": "model",
                        "editable": false
                    });
                }
            }
            page = <Panel title="Vehicle" data={items}/>
        }
        return page;
    }

    initDriverPanel(driver) {
        let items = [];
        let page;
        console.log("init driver panel");
        if (this.state.driver && this.state.draw) {
            let fleetData = this.props.fleet_data;
            for (let index in fleetData) {
                if (fleetData[index].vehicle.id == driver) {
                    items.push({
                        "label": "Name",
                        "value": fleetData[index].vehicle.driver.firstName + " " + fleetData[index].vehicle.driver.lastName,
                        "type": "drivername",
                        "editable": false
                    });
                    items.push({
                        "label": "Phone",
                        "value": fleetData[index].vehicle.driver.phoneNumber,
                        "type": "driverphone",
                        "editable": false
                    });
                }
            }
            page = <Panel title="Driver" data={items}/>;
        }
        return page;
    }

    initPickUpPanel() {
        let items = [];
        console.log("init Pick-up panel");
        items.push({
            "label": "Customer",
            "value": "",
            "type": "customer",
            "editable": true
        });
        items.push({
            "label": "Cargo",
            "value": "",
            "type": "cargo_name",
            "editable": true
        });
        items.push({
            "label": "Qty",
            "value": "",
            "type": "quantity",
            "editable": true
        });
        return items;
    }

    initDropOffPanel() {
        let items = [];
        console.log("init Drop-off panel");
        items.push({
            "label": "Pick up at",
            "value": "",
            "type": "plannedStartTime",
            "editable": true
        });
        items.push({
            "label": "Drop off at",
            "value": "",
            "type": "plannedArriveTime",
            "editable": true
        });
        return items;
    }

    initAdditionPanel() {
        let items = [];
        items.push({
            "label": "Location",
            "value": "",
            "type": "startPoint_address",
            "editable": true
        });
        items.push({
            "label": "Location",
            "value": "",
            "type": "destination_address",
            "editable": true
        });
        return items;
    }

    initTemperaturePanel() {
        let item = [];
        if (this.state.sensor_temperature_id && this.state.draw) {
            item.push(
                <Panel key="key" title={this.state.sensor_temperature_title + " (Celsius)"} data={[]}>
                    <ReactSlider onChange={this.onTemperatureChange.bind(this)} step={0.5} min={0} max={30} defaultValue={[0, 12, 30]}
                                 value={[this.state.sensor_temperature_min,this.state.sensor_temperature_set,this.state.sensor_temperature_max]}
                                 withBars>
                        <div className="my-handle1">{this.state.sensor_temperature_min + this.state.sensor_temperature_uom}</div>
                        <div className="my-handle1">{this.state.sensor_temperature_set + this.state.sensor_temperature_uom}</div>
                        <div className="my-handle1">{this.state.sensor_temperature_max + this.state.sensor_temperature_uom}</div>
                    </ReactSlider>
                </Panel>
            );
        }
        return item;
    }

    initHumidityPanel() {
        let item = [];
        if (this.state.sensor_humidity_id && this.state.draw) {
            item.push(
                <Panel key="key" title={this.state.sensor_humidity_title + " (Relative)"} data={[]}>
                    <ReactSlider onChange={this.onHumidityChange.bind(this)} min={50} max={100} defaultValue={[50, 70, 100]}
                                 value={[this.state.sensor_humidity_min,this.state.sensor_humidity_set,this.state.sensor_humidity_max]}
                                 withBars>
                        <div className="my-handle2">{this.state.sensor_humidity_min + this.state.sensor_humidity_uom}</div>
                        <div className="my-handle2">{this.state.sensor_humidity_set + this.state.sensor_humidity_uom}</div>
                        <div className="my-handle2">{this.state.sensor_humidity_max + this.state.sensor_humidity_uom}</div>
                    </ReactSlider>
                </Panel>
            );
        }
        return item;
    }

    initSubmitPanel(){
        let item = [];
        if (this.state.customer && this.state.quantity && this.state.plannedStartTime && this.state.plannedArriveTime
            && this.state.startPoint_address && this.state.destination_address) {
            item.push(
                <button key="submit" className="button_create" onClick={this.summaryPostJSON.bind(this)}>Create</button>
            );
        }else{
            item.push(
                <button key="submit" disabled="disabled" className="button_create button_disabled" onClick={this.summaryPostJSON.bind(this)}>Create</button>
            );
        }
        return item;
    }

    blurFunction(value, type) {
        console.log(type + " : " + value);
        if ((type == "startPoint_address" || type == "destination_address") && (value != "")) {
            GeoLocationInfoAction.loadData("https://maps.googleapis.com/maps/api/geocode/json?address=" + value + "&key=" + AppInfoStore.getGoogleMapAPIKey()).then(
                (response) => {
                    if (this.props.geoLocationStatus == "OK") {
                        console.log("get geolocation successfully");
                        //get geo location
                        let geoLocation = this.props.geoLocationResult[0].geometry.location;
                        if (type == "startPoint_address") {
                            this.setState({
                                origin: new google.maps.LatLng(geoLocation.lat, geoLocation.lng),
                                startPoint_address: value,
                                startPoint_address_lat: geoLocation.lat,
                                startPoint_address_lng: geoLocation.lng
                            });
                        } else if (type == "destination_address") {
                            this.setState({
                                destination: new google.maps.LatLng(geoLocation.lat, geoLocation.lng),
                                destination_address: value,
                                destination_address_lat: geoLocation.lat,
                                destination_address_lng: geoLocation.lng
                            });
                        }
                    } else {
                        console.log("get geolocation failed " + this.props.geoLocationStatus);
                    }
                    if (this.state.origin && this.state.destination) {
                        console.log("draw directions");
                        const DirectionsService = new google.maps.DirectionsService();
                        DirectionsService.route({
                            origin: this.state.origin,
                            destination: this.state.destination,
                            travelMode: google.maps.TravelMode.DRIVING,
                        }, (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                this.setState({
                                    directions: result
                                });
                            } else {
                                console.error(`error fetching directions ${ result }`);
                            }
                        });
                    }
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        } else {
            if (type == "customer") {
                this.setState({
                    customer: value
                });
            }
            if (type == "quantity") {
                this.setState({
                    quantity: value
                });
            }
        }
    }

    handleDate = (type, newDate) => {//newDate is a moment object
        console.log("newDate ", newDate);
        let date = newDate.format("YYYY-MM-DD HH:mm:ss ZZ");
        console.log("type " + type + " " + date);
        if (type == "plannedStartTime") {
            this.setState({
                plannedStartTime: date
            });
        }
        if (type == "plannedArriveTime") {
            this.setState({
                plannedArriveTime: date
            });
        }
    }

    onTemperatureChange(value) {
        this.setState({
            sensor_temperature_min: value[0],
            sensor_temperature_set: value[1],
            sensor_temperature_max: value[2],
        });
    }

    onHumidityChange(value) {
        this.setState({
            sensor_humidity_min: value[0],
            sensor_humidity_set: value[1],
            sensor_humidity_max: value[2],
        });
    }

    onChangeSelect(event,object) {
        //event.target.id
        console.log(event.target.value);//done
        if ("cargo" == event.target.id) {
            let uom = "L";
            if(event.target.value == "Apple" || event.target.value == "Banana"){
                uom = "KG";
            }
            this.setState({
                cargo: event.target.value,
                uom: uom
            });
        }else if("uom" == event.target.id){
            this.setState({
                uom: event.target.value
            });
        }
    }

    handleMarkerClick(marker) {
        console.log(marker.vehicleid);
        marker.showvehicleInfo = true;
        //TODO
        // for remote http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/getVehicleById/
        SensorInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/getVehicleById/' + marker.vehicleid).then((response) => {
            console.log("get vehicle by id successfully");
            if(this.props.sensor){
                let sensors = this.props.sensor.category.sensorType;//list
                console.log(sensors);
                for(let index in sensors){
                    if(sensors[index].sensorType == "Temperature" || sensors[index].sensorType == "Pressure"){
                        if(sensors[index].sensorType == "Pressure"){
                            this.setState({
                                sensor_temperature_id : sensors[index].id,
                                sensor_temperature_title: "Pressure",
                                sensor_temperature_uom: "Pa"
                            });
                        }else{
                            this.setState({
                                sensor_temperature_id : sensors[index].id
                            });
                        }
                    }else if(sensors[index].sensorType == "Humidity" || sensors[index].sensorType == "Electrostatic"){
                        if(sensors[index].sensorType == "Electrostatic"){
                            this.setState({
                                sensor_humidity_id : sensors[index].id,
                                sensor_humidity_title: "Electrostatic",
                                sensor_humidity_uom: "Kv"
                            });
                        }else{
                            this.setState({
                                sensor_humidity_id : sensors[index].id
                            });
                        }
                    }
                }
                let vehicleDriver = this.props.sensor.driver;
                this.setState({
                    driver:vehicleDriver
                });
            }
        }).catch((error) => {
            console.log(error);
        });
        this.setState({
            vehicleID: marker.vehicleid,
            vehicleVin: marker.vehiclevin,
            draw: true
        });
    }

    handleCloseclick(marker) {
        marker.showvehicleInfo = false;
        this.setState(this.state);
    }

    renderInfoWindow(ref, marker) {
        return (
            <InfoWindow key={`${ref}_info_window`}
                        onCloseclick={this.handleCloseclick.bind(this, marker)}>
                <div>
                    <strong>{marker.vehicleregistration}</strong>
                    <br />
                </div>
            </InfoWindow>
        );
    }

    initMapCircle(){
        let circle = [];
        if(this.state.startPoint_address_lat && this.state.startPoint_address_lng){
            circle.push(
                <Circle key="circle_start" center={{
                lat: this.state.startPoint_address_lat,
                lng: this.state.startPoint_address_lng
                }} radius={500} options={{
                      fillColor: `red`,
                      fillOpacity: 0,
                      strokeColor: `red`,
                      strokeOpacity: 1,
                      strokeWeight: 1,
                    }}
                />
            );
        }
        if(this.state.destination_address_lat && this.state.destination_address_lng){
            circle.push(
                <Circle key="circle_end" center={{
                lat: this.state.destination_address_lat,
                lng: this.state.destination_address_lng
                }} radius={500} options={{
                      fillColor: `red`,
                      fillOpacity: 0,
                      strokeColor: `red`,
                      strokeOpacity: 1,
                      strokeWeight: 1,
                    }}
                />
            );
        }
        return circle;
    }

    getDistance(p1, p2) {
        var lngDist = ((p1.lng() - p2.lng()) / 0.01) * 1108;
        var latDist = ((p1.lat() - p2.lat()) / 0.01) * 1108;
        return Math.sqrt(Math.pow(lngDist, 2) + Math.pow(latDist, 2));
    }


    summaryPostJSON() {
        let create_trip;
        let routePath = this.state.directions.routes[0].overview_path;
        let resultRoute = [];
        for(let index in routePath){
            let dist = 0;
            if (index != 0) {
                dist = this.getDistance(routePath[index - 1], routePath[index]);
            }
            let tempValue = {};

            tempValue["longitude"] = routePath[index].lng();
            tempValue["latitude"] = routePath[index].lat();
            tempValue["distance"] = dist;
            resultRoute.push(tempValue);
        }
        let postJSON = {
            "routeName" :this.state.startPoint_address + "-" + this.state.destination_address,
            "description" : this.state.startPoint_address + "-" + this.state.destination_address,
            "pointInfo" : resultRoute,
            "estimatedStartTime":this.state.plannedStartTime,
            "estimatedArriveTime":this.state.plannedArriveTime
        }

        //TODO
        //for remote http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/simulator/telematics/{vin}/route
        RouteInfoAction.postData("http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/simulator/telematics/" + this.state.vehicleVin + "/route", JSON.stringify(postJSON))
        .then((response) => {
            console.log("create route successfully");
            this.setState({
                routeId: RouteInfoStore.getState().routeid
            });
            //fleetId enterpriseId,userRole
            create_trip = {
                "userId": this.props.app_info.userId,
                "fleetId": this.props.app_info.fleetId,
                "enterpriseId": this.props.app_info.enterpriseId,
                "role": this.props.app_info.userRole,
                "customer": this.state.customer,
                "vehicleId": this.state.vehicleID,
                "route": {
                    "startPointAddress": this.state.startPoint_address,
                    "startPointLatitude": this.state.startPoint_address_lat,
                    "startPointLongitude": this.state.startPoint_address_lng,
                    "destinationAddress": this.state.destination_address,
                    "destinationLatitude": this.state.destination_address_lat,
                    "destinationLongitude": this.state.destination_address_lng
                },
                "cargoType": this.props.sensor.category.id,
                "cargoName": this.state.cargo,
                "quantity": this.state.quantity,
                "uom": this.state.uom,
                "plannedStartTime": this.state.plannedStartTime,
                "plannedArriveTime": this.state.plannedArriveTime,
                "routeId": this.state.routeId,
                "sensors" : [
                    {
                        "sensorTypeId" : this.state.sensor_temperature_id,
                        "minThreshold" : this.state.sensor_temperature_min,
                        "maxThreshold" : this.state.sensor_temperature_max,
                        "standardValue" : this.state.sensor_temperature_set

                    },
                    {
                        "sensorTypeId" : this.state.sensor_humidity_id,
                        "minThreshold" : this.state.sensor_humidity_min,
                        "maxThreshold" : this.state.sensor_humidity_max,
                        "standardValue" : this.state.sensor_humidity_set
                    }
                ]

            };
            console.log(create_trip);
            TripInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapCreateTripPlanning?body=' + encodeURIComponent(JSON.stringify(create_trip))).then((response) => {
                console.log("create trip succrssfully!");
                //AppInfoAction.replaceRoute(null, "/");
                console.log("update route information");
                let new_trip = this.props.trip_info;
                let trip_id = new_trip.id;
                let update_JSON = {
                    "routeId": this.state.routeId,
                    "tripplanid": trip_id
                }
                RouteInfoAction.postData("http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/simulator/telematics/" + this.state.vehicleVin + "/updateRoute?routeid="+ this.state.routeId +"&tripplanid=" + trip_id, null)
                .then((response) => {
                    console.log("update route information successfully!");
                    window.location.href="./fleetcontrol";
                }).catch((error) => {
                    console.error(error);
                    alert(error);
                });
            }).catch((error) => {
                alert(error);
            });
        }).catch((error) => {
            alert(error);
        });
    }

    render() {
        console.log(this.state);
        let empty = [];
        let show_tips = this.showTips();
        let vehicle_panel_content = this.initVehiclePanel(this.state.vehicleID);
        let driver_panel_content = this.initDriverPanel(this.state.vehicleID);
        let pickup_panel_content = this.initPickUpPanel();
        let drop_off_content = this.initDropOffPanel();
        let addition_panel = this.initAdditionPanel();
        let temperature_content = this.initTemperaturePanel();
        let humidity_content = this.initHumidityPanel();
        let submit_panel_content = this.initSubmitPanel();
        let directions = this.state.directions;
        let circle_marker = this.initMapCircle();
        return (
            <Page>
                <Panel title="Create Assignment" data={empty}>
                    <div className="trip_detail_panel">
                        <div className="pickup_panel">
                            <Panel title="" data={pickup_panel_content} cargo={this.state.cargo}
                                   handleDate={this.handleDate.bind(this)}
                                   blurFunction={this.blurFunction.bind(this)}
                                   onChangeSelect={this.onChangeSelect.bind(this)}>
                            </Panel>
                        </div>
                        <div className="dropdown_panel">
                            <Panel title="" data={drop_off_content} handleDate={this.handleDate.bind(this)}
                                   blurFunction={this.blurFunction.bind(this)}/>
                        </div>
                        <div className="addition_panel">
                            <Panel title="" data={addition_panel} handleDate={this.handleDate.bind(this)}
                                   blurFunction={this.blurFunction.bind(this)}/>
                        </div>
                    </div>
                </Panel>
                <GoogleMapLoader
                    containerElement={
                        <div className="map_panel" style={{ margin: `15px auto`}}></div>
                    }
                    googleMapElement={
                        <GoogleMap
                          defaultZoom={13}
                          defaultCenter={this.state.origin? this.state.origin : this.props.origin}
                          center={this.state.origin? this.state.origin : this.props.origin}
                        >
                        {circle_marker}
                        {directions ? <DirectionsRenderer directions={directions} /> : null}
                        {this.state.markers.map((marker, index) => {
                          const ref = `marker_${index}`;
                          return (
                            <Marker
                              {...marker}
                              onClick={this.handleMarkerClick.bind(this, marker)}
                            >
                            {marker.showvehicleInfo ? this.renderInfoWindow(ref, marker) : null}
                            </Marker>
                          );
                        })}
                        </GoogleMap>
                    }
                />
                <div className="detail_panel">
                    {show_tips}
                    <div className="vehicle_driver">
                        <div className="vehicle_panel">
                            {vehicle_panel_content}
                        </div>
                        <div className="driver_panel">
                            {driver_panel_content}
                        </div>
                    </div>
                    <div className="sensors_detail_panel">
                        {temperature_content}
                        {humidity_content}
                    </div>
                </div>
                <div className="submit_panel">
                    {submit_panel_content}
                </div>
            </Page>
        );
    }
}