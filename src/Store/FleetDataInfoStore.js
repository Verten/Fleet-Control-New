/**
 * Created by ebinhon on 3/29/2016.
 */
import alt from '../alt';
import BaseStore from './BaseStore';
import FleetDataInfoAction from '../Action/FleetDataInfoAction';

class FleetDataInfoStore extends BaseStore {
    constructor() {
        super();
        this.state = {
            body:null
        };
        // Binds the FleetDataInfoStore methods to their 'on' equivalents
        this.bindActions(FleetDataInfoAction);
    }
}

export default alt.createStore(FleetDataInfoStore, 'FleetDataInfoStore');