/**
 * Created by ebinhon on 3/24/2016.
 */
import alt from '../alt';
import BaseStore from './BaseStore';
import GeoLocationInfoAction from '../Action/GeoLocationInfoAction';

class GeoLocationInfoStore extends BaseStore {
    constructor() {
        super();
        this.state = {};
        // Binds the GeoLocationInfoStore methods to their 'on' equivalents
        this.bindActions(GeoLocationInfoAction);
    }
}

export default alt.createStore(GeoLocationInfoStore, 'GeoLocationInfoStore');