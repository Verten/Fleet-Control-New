/**
 * Created by ebinhon on 3/18/2016.
 */

import alt from '../alt';
import xhr from '../Util/xhr';
import history from 'history';

class AppInfoAction {

    constructor() {
        // This is a shorthand for actions that only dispatch a single value
        this.generateActions(
            'dataReceived', //will execute 'onDataReceived' method in BaseStore
            'dataError' //will execute 'onDataError' method in BaseStore
        );
    }

    loadData(path) {
        let promise = xhr.loadData(path).then((response) => {
            this.dataReceived(JSON.parse(response));
        }).catch((error) => {
            this.dataError(error);
            throw error;
        });
        return promise;
    }

    replaceRoute(route) {
        history.replaceState(null, route);
    }
}

export default alt.createActions(AppInfoAction);