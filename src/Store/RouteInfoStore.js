/**
 * Created by ebinhon on 3/30/2016.
 */
import alt from '../alt';
import BaseStore from './BaseStore';
import RouteInfoAction from '../Action/RouteInfoAction';

class RouteInfoStore extends BaseStore {
    constructor() {
        super();
        this.state = {};
        // Binds the RouteInfoStore methods to their 'on' equivalents
        this.bindActions(RouteInfoAction);
    }
}

export default alt.createStore(RouteInfoStore, 'RouteInfoStore');