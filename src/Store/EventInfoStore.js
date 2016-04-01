/**
 * Created by ebinhon on 3/23/2016.
 */
import alt from '../alt';
import BaseStore from './BaseStore';
import EventInfoAction from '../Action/EventInfoAction';

class EventInfoStore extends BaseStore {
    constructor() {
        super();
        this.state = {};
        // Binds the EventInfoStore methods to their 'on' equivalents
        this.bindActions(EventInfoAction);
    }
}

export default alt.createStore(EventInfoStore, 'EventInfoStore');