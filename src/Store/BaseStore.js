/**
 * Created by ebinhon on 3/3/2016.
 */
export default class BaseStore {

    // Called when store date is received
    onDataReceived(object) {
        if (object.key && object.response) {
            // Object with key namespace
            this.state[object.key] = object.response;
            this.emitChange();
        } else {
            // Regular object
            this.setState(object);
        }
    }

    // Called when store data is not received due to an error
    onDataError(msg) {
        console.error("Failed!", msg);
    }
}
