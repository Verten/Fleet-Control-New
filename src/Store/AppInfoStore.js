/**
 * Created by ebinhon on 3/18/2016.
 */
import alt from '../alt';
import React from 'react';
import BaseStore from './BaseStore';
import AppInfoAction from '../Action/AppInfoAction';

class AppInfoStore extends BaseStore {
    static propTypes = {
        //React.PropTypes.string.isRequired,
        //React.PropTypes.bool,
        //React.PropTypes.object,
        //React.PropTypes.oneOf(['value1', 'value2'])
        //reference to official URL: https://facebook.github.io/react/docs/reusable-components.html
        APP_INFO:React.PropTypes.object
    }

    static defaultProps = {
        APP_INFO : {
            "result":"SUCCESS",
            "message":null,
            "status":200,
            "body": {
                "users": "/primary-rest/hwapUserService/",
                "enterprises": "/primary-rest/hwapEnterpriseService/",
                "dashboard": "/primary-rest/hwapDashboardService/",
                "trips": "/primary-rest/hwapTripService/",
                "fleets": "/primary-rest/hwapFleetService/",
                "order": "/primary-rest/hwapOrderService/",
                "vehicles": "/primary-rest/hwapVehicleService/",
                "vehicleGroups": "/primary-rest/hwapVehicleGroupService/",
                "notifications": "/primary-rest/hwapNotificationService/",
                "report": "/primary-rest/hwapReportService/"
            }
        }
    }


    constructor() {
        super();
        this.state = {
            header:[],
            body:null,
            linkChanged:false,
            postJSON:{
                fleetId: "fleetId",
                enterpriseId: "enterpriseId",
                role: "userRole"
            }
        };
        // Binds the AppInfoStore methods to their 'on' equivalents
        this.bindActions(AppInfoAction);
    }

    static getGoogleMapAPIKey(){
        return "AIzaSyAwugV4YJYXKdb_GevrOtdocWe0uc-atXc";
    }

    static setChangeLinkFlag(){
        let linkChanged = this.state.linkChanged;
        if(linkChanged){
            this.state.linkChanged = false;
        }else{
            this.state.linkChanged = true;
        }
    }

    static setPostJSON(json){
        if(json){
            this.state.postJSON = json
        }
    }

    static getPostJSON(){
        return this.state.postJSON
    }

    static getClientEndpoint(categoryId){
        const APP_INFO = this.defaultProps.APP_INFO;
        if("users" === categoryId){
            return APP_INFO.body.users;
        }else if("enterprises" === categoryId){
            return APP_INFO.body.enterprises;
        }else if("dashboard" === categoryId){
            return APP_INFO.body.dashboard;
        }else if("trips" === categoryId){
            return APP_INFO.body.trips;
        }else if("fleets" === categoryId){
            return APP_INFO.body.fleets;
        }else if("order" === categoryId){
            return APP_INFO.body.order;
        }else if("vehicles" === categoryId){
            return APP_INFO.body.vehicles;
        }else if("vehicleGroups" === categoryId){
            return APP_INFO.body.vehicleGroups;
        }else if("notifications" === categoryId){
            return APP_INFO.body.notifications;
        }else if("report" === categoryId){
            return APP_INFO.body.report;
        }
    }
}

export default alt.createStore(AppInfoStore, 'AppInfoStore');