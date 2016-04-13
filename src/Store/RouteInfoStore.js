/**
 * Created by ebinhon on 3/30/2016.
 */
import alt from '../alt';
import BaseStore from './BaseStore';
import RouteInfoAction from '../Action/RouteInfoAction';

class RouteInfoStore extends BaseStore {
    constructor() {
        super();
        this.state = {
            currentRoutes:[]
        };
        // Binds the RouteInfoStore methods to their 'on' equivalents
        this.bindActions(RouteInfoAction);
    }

    static setCurrentRoute(currentRoute){
        let exists_route = this.state.currentRoutes;
        let found = false;
        for(let index in exists_route){
            if(exists_route[index].tripId == currentRoute.tripId){
                found = true;
                exists_route[index].origin = currentRoute.origin;
                exists_route[index].destination = currentRoute.destination;
            }
        }
        if(!found){
            this.state.currentRoutes.push(currentRoute);
        }
    }

    static getCurrentRoute(tripId){
        let exists_route = this.state.currentRoutes;
        for(let index in exists_route) {
            if (exists_route[index].tripId == tripId) {
                return exists_route[index];
            }
        }
    }
}

export default alt.createStore(RouteInfoStore, 'RouteInfoStore');