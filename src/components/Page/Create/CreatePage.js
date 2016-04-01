/**
 * Created by ebinhon on 3/21/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import FaSpinner from "react-icons/fa/spinner";
import ReactSlider from 'react-slider';
import { GoogleMapLoader,GoogleMap, Marker, DirectionsRenderer,Polyline } from "react-google-maps";
import ScriptjsLoader from "react-google-maps/lib/async/ScriptjsLoader";
import Table from '../../Table/Table';
import AppInfoStore from '../../../Store/AppInfoStore';
import FleetDataInfoAction from '../../../Action/FleetDataInfoAction';
import FleetDataInfoStore from '../../../Store/FleetDataInfoStore';
import GeoLocationInfoAction from '../../../Action/GeoLocationInfoAction';
import GeoLocationInfoStore from '../../../Store/GeoLocationInfoStore';
import SensorInfoAction from '../../../Action/SensorInfoAction';
import SensorInfoStore from '../../../Store/SensorInfoStore';
import RouteInfoAction from '../../../Action/RouteInfoAction';
import RouteInfoStore from '../../../Store/RouteInfoStore';
//import VehicleTypeInfoStore from '../../../Store/VehicleTypeInfoStore';
//import VehicleTypeInfoAction from '../../../Action/VehicleTypeInfoAction';

import Page from '../Page';
import Panel from '../../Panel/Panel';
import moment from 'moment';
import './CreatePage.scss';

import connectToStores from 'alt-utils/lib/connectToStores';

@connectToStores
export default class CreatePage extends React.Component {

    static getStores() {
        // this will handle the listening/unlistening for you
        return [AppInfoStore, GeoLocationInfoStore, FleetDataInfoStore, SensorInfoStore];
    }

    static getPropsFromStores() {
        // this is the data that gets passed down as props
        // each key in the object returned by this function is added to the `this.props`
        let app_info = AppInfoStore.getState().body;
        let fleet_data = FleetDataInfoStore.getState().body;//list,and we need currentInformation
        let geoLocationStatus = GeoLocationInfoStore.getState().status;
        let geoLocationResult = GeoLocationInfoStore.getState().results;
        let sensor = SensorInfoStore.getState().body;
        return {
            app_info: app_info,
            geoLocationStatus: geoLocationStatus,
            geoLocationResult: geoLocationResult,
            fleet_data: fleet_data,
            sensor: sensor
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
        origin: new google.maps.LatLng(23.1312183, 113.27067570000001),
        destination: new google.maps.LatLng(23.1312983, 113.23067570006001)
    }

    constructor() {
        super();
        this.state = {
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
            cargo: "apple",
            quantity: null,
            vehicletype: {},
            vehicletypeId: null,
            uom: null,
            routeId: null,
            startPoint_address: null,
            startPoint_address_lat: null,
            startPoint_address_lng: null,
            destination_address: null,
            destination_address_lat: null,
            destination_address_lng: null,
            sensor_temperature_id: null,
            sensor_temperature_min: 2,
            sensor_temperature_set: 15,
            sensor_temperature_max: 30,
            sensor_humidity_id: null,
            sensor_humidity_min: 5,
            sensor_humidity_set: 20,
            sensor_humidity_max: 50
        }
    }


    componentDidMount() {
        console.log('Created "create page"');
        //get fleet data info
        //TODO
        //for remote http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapGetFleetDataService
        //./Asset/data/FleetDataInfo.json
        FleetDataInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapGetFleetDataService')
            .then((response) => {
                console.log("load hwapGetFleetDataService successfully");
                let fleetData = this.props.fleet_data;
                let markers = [];
                for (let index in fleetData) {
                    if (fleetData[index].currentInformation.lat && fleetData[index].currentInformation.long) {
                        let marker = {
                            "position": {
                                "lat": fleetData[index].currentInformation.lat,
                                "lng": fleetData[index].currentInformation.long
                            },
                            "key": fleetData[index].vehicle.id,
                            "content": fleetData[index].vehicle.vin,
                            defaultAnimation: 1
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

        //for remote http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/getVehicleType
        //VehicleTypeInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/getVehicleType').then((response) => {
        //    console.log("successfully load vehicle type");
        //    let options = [];
        //    for (let index in this.props.vehicleType) {
        //        options.push({
        //            name: this.props.vehicleType[index].category,
        //            value: this.props.vehicleType[index].id
        //        });
        //    }
        //    this.setState({
        //        vehicletype: options
        //    });
        //}).catch((error) => {
        //    console.log(error);
        //});
    }

    initVehiclePanel(vehicle) {
        let items = [];
        let page;
        console.log("init vehicle panel");
        if (vehicle && this.state.draw) {
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
        if (driver && this.state.draw) {
            let fleetData = this.props.fleet_data;
            for (let index in fleetData) {
                if (fleetData[index].vehicle.id == driver) {
                    items.push({
                        "label": "Name",
                        "value": fleetData[index].vehicle.driver.firstName + fleetData[index].vehicle.driver.middleName + fleetData[index].vehicle.driver.lastName,
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
        /*items.push({
            "label": "Type",
            "value": "",
            "type": "vehicletype",
            "editable": true
        });*/
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
        if (this.state.draw) {
            item.push(
                <Panel key="key" title="Temperature (Celsius)" data={[]}>
                    <ReactSlider onChange={this.onTemperatureChange.bind(this)} defaultValue={[0, 50, 100]}
                                 value={[this.state.sensor_temperature_min,this.state.sensor_temperature_set,this.state.sensor_temperature_max]}
                                 withBars>
                        <div className="my-handle1">{this.state.sensor_temperature_min + '°'}</div>
                        <div className="my-handle1">{this.state.sensor_temperature_set + '°'}</div>
                        <div className="my-handle1">{this.state.sensor_temperature_max + '°'}</div>
                    </ReactSlider>
                </Panel>
            );
        }
        return item;
    }

    initHumidityPanel() {
        let item = [];
        if (this.state.draw) {
            item.push(
                <Panel key="key" title="Humidity (Relative)" data={[]}>
                    <ReactSlider onChange={this.onHumidityChange.bind(this)} defaultValue={[0, 50, 100]}
                                 value={[this.state.sensor_humidity_min,this.state.sensor_humidity_set,this.state.sensor_humidity_max]}
                                 withBars>
                        <div className="my-handle2">{this.state.sensor_humidity_min}%</div>
                        <div className="my-handle2">{this.state.sensor_humidity_set}%</div>
                        <div className="my-handle2">{this.state.sensor_humidity_max}%</div>
                    </ReactSlider>
                </Panel>
            );
        }
        return item;
    }

    initSubmitPanel(){
        let item = [];
        if (this.state.draw) {
            item.push(
                <button key="submit" className="button_create" onClick={this.summaryPostJSON.bind(this)}>Create</button>
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
        console.log("type " + type);
        let date = newDate.format("YYYY-MM-DD HH:mm:ss");
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

    onChangeSelect(event) {
        //event.target.id
        console.log(event.target.value);//done
        if ("cargo" == event.target.id) {
            this.setState({
                cargo: event.target.value
            });
        }else if("uom" == event.target.id){
            this.setState({
                uom: event.target.value
            });
        }
    }

    handleMarkerClick(marker) {
        console.log(marker.key);
        //TODO
        // for remote http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/getVehicleById/
        SensorInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/getVehicleById/' + marker.key).then((response) => {
            console.log("get vehicle by id successfully");
            let sensors = this.props.sensor.category.sensorType;//list
            for(let index in sensors){
                if(sensors[index].sensorType == "temperature"){
                    this.setState({
                        sensor_temperature_id : sensors[index].id
                    });
                }else if(sensors[index].sensorType == "humidity"){
                    this.setState({
                        sensor_humidity_id : sensors[index].id
                    });
                }
            }
        }).catch((error) => {
            console.log(error);
        });
        this.setState({
            vehicleID: marker.key,
            vehicleVin: marker.content,
            draw: true
        });
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
            "pointInfo" : resultRoute
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
                "fleetId": this.props.app_info.fleetId,
                "enterpriseId": this.props.app_info.enterpriseId,
                "role": this.props.app_info.userRole,
                "vehicleId": this.state.vehicleID,
                "route": {
                    "startPointAddress": this.state.startPoint_address,
                    "startPointLatitude": this.state.startPoint_address_lat,
                    "startPointLongitude": this.state.startPoint_address_lng,
                    "destinationAddress": this.state.destination_address,
                    "destinationLatitude": this.state.destination_address_lat,
                    "destinationLongitude": this.state.destination_address_lng,
                    "id": this.state.routeId
                },
                "cargoType": this.props.sensor.category.category,
                "cargoName": this.state.cargo,
                "quantity": this.state.quantity,
                "uom": this.state.uom,
                "plannedStartTime": this.state.plannedStartTime,
                "plannedArriveTime": this.state.plannedArriveTime,
                "sensor" : [
                    {
                        "type" : this.state.sensor_temperature_id,
                        "minThreshold" : this.state.sensor_temperature_min,
                        "maxThreshold" : this.state.sensor_temperature_max,
                        "standardValue" : this.state.sensor_temperature_set

                    },
                    {
                        "type" : this.state.sensor_humidity_id,
                        "minThreshold" : this.state.sensor_humidity_min,
                        "maxThreshold" : this.state.sensor_humidity_max,
                        "standardValue" : this.state.sensor_humidity_set
                    }
                ]

            };
            console.log(create_trip);
        }).catch((error) => {

        });
    }

    render() {
        console.log(this.state);
        let empty = [];
        let vehicle_panel_content = this.initVehiclePanel(this.state.vehicleID);
        let driver_panel_content = this.initDriverPanel(this.state.vehicleID);
        let pickup_panel_content = this.initPickUpPanel();
        let drop_off_content = this.initDropOffPanel();
        let addition_panel = this.initAdditionPanel();
        let temperature_content = this.initTemperaturePanel();
        let humidity_content = this.initHumidityPanel();
        let submit_panel_content = this.initSubmitPanel();
        let directions = this.state.directions;
        return (
            <Page>
                <Panel title="Create Assignment" data={empty}>
                    <div className="trip_detail_panel">
                        <div className="pickup_panel">
                            <Panel title="" data={pickup_panel_content}
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
                    loadingElement={
                        <div style={{
                              height: `100%`
                            }}>
                          <FaSpinner  style={{
                                                display: `block`,
                                                width: 100,
                                                height: 100,
                                                margin: `60px auto`,
                                                animation: `fa-spin 2s infinite linear`
                                            }}
                          />
                        </div>
                    }
                    containerElement={
                        <div className="map_panel" style={{ margin: `15px auto`}}></div>
                    }
                    googleMapElement={
                        <GoogleMap
                          defaultZoom={13}
                          defaultCenter={this.state.origin? this.state.origin : this.props.origin}
                          center={this.state.origin? this.state.origin : this.props.origin}
                        >
                        {directions ? <DirectionsRenderer directions={directions} /> : null}
                        {this.state.markers.map((marker, index) => {
                          return (
                            <Marker
                              {...marker}
                              onClick={this.handleMarkerClick.bind(this, marker)}
                            />
                          );
                        })}
                        </GoogleMap>
                    }
                />
                <div className="detail_panel">
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