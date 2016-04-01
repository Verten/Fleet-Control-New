/**
 * Created by ebinhon on 3/22/2016.
 */
import alt from '../alt';
import xhr from '../Util/xhr';

class TripInfoAction {

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

    postData(path,json){
        let promise = xhr.postData(path,json).then((response) => {
            this.dataReceived(JSON.parse(response));
        }).catch((error) => {
            this.dataError(error);
            throw error;
        });
        return promise;
    }

}

export default alt.createActions(TripInfoAction);