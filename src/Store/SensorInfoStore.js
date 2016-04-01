/**
 * Created by ebinhon on 3/23/2016.
 */
import alt from '../alt';
import BaseStore from './BaseStore';
import SensorInfoAction from '../Action/SensorInfoAction';

class SensorInfoStore extends BaseStore {
    constructor() {
        super();
        this.state = {
            body:null
        };
        // Binds the SensorInfoStore methods to their 'on' equivalents
        this.bindActions(SensorInfoAction);
    }
}

export default alt.createStore(SensorInfoStore, 'SensorInfoStore');