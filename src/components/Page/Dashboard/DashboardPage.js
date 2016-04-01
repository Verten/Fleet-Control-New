/**
 * Created by ebinhon on 3/22/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import FaSpinner from "react-icons/fa/spinner";
import { GoogleMapLoader,GoogleMap, Marker, DirectionsRenderer,Polyline } from "react-google-maps";
import ScriptjsLoader from "react-google-maps/lib/async/ScriptjsLoader";
import Page from '../Page';
import TripInfoStore from '../../../Store/TripInfoStore';
import AppInfoStore from '../../../Store/AppInfoStore';
import SensorInfoStore from '../../../Store/SensorInfoStore';
import SensorInfoAction from '../../../Action/SensorInfoAction';
import EventInfoStore from '../../../Store/EventInfoStore';
import EventInfoAction from '../../../Action/EventInfoAction';
import connectToStores from 'alt-utils/lib/connectToStores';
import Table from '../../Table/Table';
import Panel from '../../Panel/Panel';
import './Dashboard.scss';
import moment from 'moment';

@connectToStores
export default class DashboardPage extends React.Component {
    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        tripId: React.PropTypes.string.isRequired,
        markers: React.PropTypes.arrayOf(React.PropTypes.object)
    }

    static defaultProps = {
        tripId: "",
        markers: [
            {
                position: {
                    lat: 23.1312183,
                    lng: 113.27067570000001
                },
                key: `Start`,
                defaultAnimation: 2
            },
            {
                position: {
                    lat: 23.1312983,
                    lng: 113.23067570006001
                },
                key: `End`,
                defaultAnimation: 2
            }
        ],
        origin: new google.maps.LatLng(23.1312183, 113.27067570000001),
        destination: new google.maps.LatLng(23.1312983, 113.23067570006001)
    }
    static version = Math.ceil(Math.random() * 22);

    constructor() {
        super();
        this.state = {
            directions: null,
            sensor_temperature_current:"14.5",
            sensor_temperature_max:"",
            sensor_temperature_set:"",
            sensor_temperature_min:"",
            sensor_humidity_current:"20",
            sensor_humidity_max:"",
            sensor_humidity_set:"",
            sensor_humidity_min:""
        }
    }

    static getStores() {
        // this will handle the listening/unlistening for you
        return [AppInfoStore, TripInfoStore, EventInfoStore, SensorInfoStore];
    }

    static getPropsFromStores(props) {
        // this is the data that gets passed down as props
        // each key in the object returned by this function is added to the `this.props`
        let app_info = AppInfoStore.getState().body;
        let trip_info = TripInfoStore.getState().body;
        let trip = TripInfoStore.findTripById(props.params.tripId);
        let sensor = SensorInfoStore.getState().body;

        //default locate GuangZhou
        let startPoint_latitude = 23.1312183;
        let startPoint_longitude = 113.27067570000001;
        let destination_latitude = 23.1312983;
        let destination_longitude = 113.23067570006001;

        if (trip) {
            startPoint_latitude = parseFloat(trip.startPointLatitude);
            startPoint_longitude = parseFloat(trip.startPointLongitude);
            destination_latitude = parseFloat(trip.destinationLatitude);
            destination_longitude = parseFloat(trip.destinationLongitude);
        }

        return {
            app_info: app_info,
            trip_info: trip_info,
            trip: TripInfoStore.findTripById(props.params.tripId),
            origin: new google.maps.LatLng(parseFloat(startPoint_latitude), parseFloat(startPoint_longitude)),
            destination: new google.maps.LatLng(parseFloat(destination_latitude), parseFloat(destination_longitude)),
            events: EventInfoStore.getState().body,
            sensor: sensor
        }
    }

    componentDidMount() {
        //TODO
        //get events
        //EventInfoAction.loadData("http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/hwapGetTripEvents?tripId=" + this.props.params.tripId).then((response) => {
        //    console.log("get trip event successfully");
        //    let events = this.props.events;
        //    let eventResult = [];
        //    for(let index in events){
        //        let tmpEvent = {
        //            "createDate": moment(events[index].created),
        //            "type": events[index].type,
        //            "message": events[index].message
        //        }
        //        eventResult.push(
        //            tmpEvent
        //        );
        //    }
        //    this.setState({
        //        events: eventResult
        //    });
        //}).catch((error) => {
        //    console.log(error);
        //});
        if (this.props.trip) {
            //TODO
            //get sensor
            SensorInfoAction.loadData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/getVehicleById/'
                + this.props.trip.vehicle.id + "?tripId=" + this.props.params.tripId).then((response) => {
                console.log("get vehicle by id successfully");
                let sensors = this.props.sensor.sensors;//list
                for(let index in sensors){
                    if(sensors[index].sensorType.sensorType == "temperature"){
                        this.setState({
                            sensor_temperature_max : sensors[index].maxThreshold,
                            sensor_temperature_set : sensors[index].standardValue,
                            sensor_temperature_min : sensors[index].minThreshold
                        });
                    }else if(sensors[index].sensorType.sensorType == "humidity"){
                        this.setState({
                            sensor_humidity_max : sensors[index].maxThreshold,
                            sensor_humidity_set : sensors[index].standardValue,
                            sensor_humidity_min : sensors[index].minThreshold
                        });
                    }
                }
            }).catch((error) => {
                console.log(error);
            });

            //get exists route
            const DirectionsService = new google.maps.DirectionsService();
            DirectionsService.route({
                origin: this.props.origin,
                destination: this.props.destination,
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

    componentWillMount() {

    }

    expandJSONObject(jsonObject) {
        let keys = [];
        for (let key in jsonObject) {
            keys.push(
                key
            );
        }
        return keys;
    }

    initVehiclePanel() {
        let items = [];
        //registration, brand, model
        console.log("init vehicle panel");
        if (this.props.trip && this.props.trip.vehicle) {
            items.push({
                "label": "Registration",
                "value": this.props.trip.vehicle.registration,
                "editable":false
            });
            items.push({
                "label":"Brand",
                "value": this.props.trip.vehicle.brand,
                "editable":false
            });
            items.push({
                "label":"Model",
                "value": this.props.trip.vehicle.model,
                "editable":false
            });
        } else {
            items.push({
                "label": "Registration",
                "value": "",
                "editable":false
            });
            items.push({
                "label":"Brand",
                "value": "",
                "editable":false
            });
            items.push({
                "label":"Model",
                "value": "",
                "editable":false
            });
        }
        return items;
    }

    initDriverPanel() {
        let items = [];
        //registration, brand, model
        console.log("init driver panel");
        if (this.props.trip && this.props.trip.vehicle && this.props.trip.vehicle.driver) {
            let driver_id = this.expandJSONObject(this.props.trip.vehicle.driver)[0];
            items.push({
                "label":"Name",
                "value": this.props.trip.vehicle.driver[driver_id].firstName + " " + this.props.trip.vehicle.driver[driver_id].lastName,
                "editable":false
            });
            items.push({
                "label":"Phone",
                "value": this.props.trip.vehicle.driver[driver_id].phoneNumber,
                "editable":false
            });
        } else {
            items.push({
                "label":"Name",
                "value": "",
                "editable":false
            });
            items.push({
                "label":"Phone",
                "value": "",
                "editable":false
            });
        }
        return items;
    }

    initPickUpPanel() {
        let items = [];
        console.log("init Pick-up panel");
        if (this.props.trip) {
            items.push({
                "label": "Customer",
                "value": "",
                "type": "customer",
                "editable": false
            });
            items.push({
                "label": "Cargo",
                "value": this.props.trip.cargoName,
                "type": "cargo_name",
                "editable": false
            });
            items.push({
                "label": "Qty",
                "value": this.props.trip.quantity + " " + this.props.trip.uoM,
                "type": "quantity",
                "editable": false
            });
            //items.push({
            //    "label": "Uom",
            //    "value": this.props.trip.cargo.uom,
            //    "type": "uom",
            //    "editable": false
            //});
            //items.push({
            //    "label": "Type",
            //    "value": "",
            //    "type": "vehicletype",
            //    "editable": false
            //});
        } else {
            items.push({
                "label": "Customer",
                "value": "",
                "type": "customer",
                "editable": false
            });
            items.push({
                "label": "Cargo",
                "value": "",
                "type": "cargo_name",
                "editable": false
            });
            items.push({
                "label": "Qty",
                "value": "",
                "type": "quantity",
                "editable": false
            });
            //items.push({
            //    "label": "uom",
            //    "value": "",
            //    "type": "uom",
            //    "editable": false
            //});
            //items.push({
            //    "label": "Type",
            //    "value": "",
            //    "type": "vehicletype",
            //    "editable": false
            //});
        }
        return items;
    }

    initDropOffPanel() {
        let items = [];
        console.log("init drop-off panel");
        if (this.props.trip) {
            items.push({
                "label": "Pick up at",
                "value": moment(this.props.trip.startTime).format("YYYY-MM-DD HH:mm"),
                "type": "plannedStartTime",
                "editable": false
            });
            items.push({
                "label": "Drop off at",
                "value": moment(this.props.trip.arriveTime).format("YYYY-MM-DD HH:mm"),
                "type": "plannedArriveTime",
                "editable": false
            });
        } else {
            let items = [];
            console.log("init Drop-off panel");
            items.push({
                "label": "Pick up at",
                "value": "",
                "type": "plannedStartTime",
                "editable": false
            });
            items.push({
                "label": "Drop off at",
                "value": "",
                "type": "plannedArriveTime",
                "editable": false
            });
            return items;
        }
        return items;
    }

    initAdditionPanel() {
        let items = [];
        if (this.props.trip) {
            items.push({
                "label": "Location",
                "value": this.props.trip.startPointAddress,
                "type": "startPoint_address",
                "editable": false
            });
            items.push({
                "label": "Location",
                "value": this.props.trip.destinationAddress,
                "type": "destination_address",
                "editable": false
            });
        }else {
            items.push({
                "label": "Location",
                "value": "",
                "type": "startPoint_address",
                "editable": false
            });
            items.push({
                "label": "Location",
                "value": "",
                "type": "destination_address",
                "editable": false
            });
        }
        return items;
    }

    initTemperaturePanel(){
        let items = [];


        items.push(
            <div key="temperature" className="sensor_temperature_panel">
                <div className="current_temperature">{this.state.sensor_temperature_current}&deg;</div>
                <div className="sensor_temperature">
                    <div className="sensor_min">{this.state.sensor_temperature_min}</div>
                    <div className="sensor_set">{this.state.sensor_temperature_set}</div>
                    <div className="sensor_max">{this.state.sensor_temperature_max}</div>
                </div>
            </div>
        );

        return items;
    }
    initHumidityPanel(){
        let items = [];

        items.push(
            <div key="humidity" className="sensor_humidity_panel">
                <div className="current_humidity">{this.state.sensor_humidity_current}%</div>
                <div className="sensor_humidity">
                    <div className="sensor_min">{this.state.sensor_humidity_min}</div>
                    <div className="sensor_set">{this.state.sensor_humidity_set}</div>
                    <div className="sensor_max">{this.state.sensor_humidity_max}</div>
                </div>
            </div>
        );
        return items;
    }

    clickEvent(value){
        console.log(value);
    }

    render() {
        let vehicle_panel_content = this.initVehiclePanel();
        let driver_panel_content = this.initDriverPanel();
        let pickup_panel_content = this.initPickUpPanel();
        let dropoff_panel_content = this.initDropOffPanel();
        let addition_panel = this.initAdditionPanel();
        let temperature_panel = this.initTemperaturePanel();
        let humidity_panel = this.initHumidityPanel();
        let events_Data = [];
        if(this.props.trip){
            events_Data = [{"event":this.props.trip.events}];
        }
        let empty = [];
        const directions = this.state.directions;
        return (
            <Page>
                <div className="vehicle_driver">
                    <div className="vehicle_panel">
                        <Panel title="Vehicle" data={vehicle_panel_content}/>
                    </div>
                    <div className="driver_panel">
                        <Panel title="Driver" data={driver_panel_content}/>
                    </div>
                </div>
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
                        <div className="map_panel"></div>
                    }
                    googleMapElement={
                        <GoogleMap
                          defaultZoom={13}
                          defaultCenter={this.props.origin}
                        >
                        {directions ? <DirectionsRenderer directions={directions} /> : null}
                        </GoogleMap>
                    }
                />
                <div className="detail_panel">
                    <Panel title="Assignment Detail" data={empty}>
                        <div className="trip_detail_panel">
                            <div className="pickup_panel">
                                <Panel title="" data={pickup_panel_content} />
                            </div>
                            <div className="dropdown_panel">
                                <Panel title="" data={dropoff_panel_content}/>
                            </div>
                            <div className="addition_panel">
                                <Panel title="" data={addition_panel} />
                            </div>
                        </div>
                    </Panel>
                </div>
                <div className="sensor_panel">
                    <Panel key="temperature" title="Temperature (Celsius)" data={[]}>
                        {temperature_panel}
                    </Panel>
                    <Panel key="humidity" title="Humidity (Relative)" data={[]}>
                        {humidity_panel}
                    </Panel>
                </div>
                <div className="event_panel">
                    <Table clickFunction={this.clickEvent.bind(this)} header={["Time","Event","Message"]} data={events_Data}/>
                </div>
            </Page>
        );
    }
}