/**
 * Created by ebinhon on 3/3/2016.
 */
import alt from '../alt';
import CommentAction from '../Action/CommentAction';
import BaseStore from './BaseStore';

class CommentStore extends BaseStore {
    constructor() {
        super();
        this.state = {};
        // Binds the CommentStore methods to their 'on' equivalents
        this.bindActions(CommentAction);
    }
}

export default alt.createStore(CommentStore, 'CommentStore');