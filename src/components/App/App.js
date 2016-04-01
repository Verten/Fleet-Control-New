/**
 * Created by ebinhon on 2/29/2016.
 */
import React from 'react';
import { Link } from 'react-router';
import AppInfoStore from '../../Store/AppInfoStore';
import AppInfoAction from '../../Action/AppInfoAction';
import TripInfoAction from '../../Action/TripInfoAction';
import Navigation from '../Navigation/Navigation';
import connectToStores from 'alt-utils/lib/connectToStores';


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
        return [AppInfoStore];
    }

    static getPropsFromStores() {
        // this is the data that gets passed down as props
        // each key in the object returned by this function is added to the `this.props`
        let app_info = AppInfoStore.getState().body;
        return {
            app_info: app_info
        }
    }


    componentDidMount() {
        //get users endpoint and get user information, like fleetId and enterpriseId
        const users_Endpoint = AppInfoStore.getClientEndpoint("users");
        //for remote dev: should add "http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/"
        AppInfoAction.loadData("http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com" + users_Endpoint + "setupClientContext").then((response) =>{
            console.log("get setupClientContext successfully")
            console.log(this.props.app_info);
            this.setState({
                loadFlag:true,
                fleetId:this.props.app_info.fleetId
            });
            let postJSON = {
                fleetId: this.props.app_info.fleetId,
                enterpriseId: this.props.app_info.enterpriseId,
                role: this.props.app_info.userRole
            }
            AppInfoStore.setPostJSON(postJSON);
            //TODO
            //for remote: http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary/7a3b8bdd-7350-42fa-89fc-50eb61974d0b/_/fleetcontrol-1
            // fleetId, enterpriseId, userRole
            TripInfoAction.postData('http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary-rest/getTripPlanning',JSON.stringify(postJSON)).then((response) => {
                console.log('load Trip Info Successfully');
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
        //TODO for test
        //for remote: http://ec2-52-58-27-100.eu-central-1.compute.amazonaws.com/primary/7a3b8bdd-7350-42fa-89fc-50eb61974d0b/_/fleetcontrol-1
        // fleetId, enterpriseId, userRole
        //TripInfoAction.postData('./Asset/data/tripinfo.json',JSON.stringify(postJSON)).then((response) => {
        //TripInfoAction.loadData('./Asset/data/tripinfo.json').then((response) => {
        //    console.log('load Trip Info Successfully');
        //}).catch((error) => {
        //    console.log(error);
        //})
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
                name: "Create",
                path:"/create/",
                param: this.state.fleetId ? this.state.fleetId : "no fleet Id"
            },
            {
                name: "Back",
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