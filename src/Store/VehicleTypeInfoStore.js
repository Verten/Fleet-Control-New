/**
 * Created by ebinhon on 3/29/2016.
 */
import alt from '../alt';
import BaseStore from './BaseStore';
import VehicleTypeInfoAction from '../Action/VehicleTypeInfoAction';

class VehicleTypeInfoStore extends BaseStore {
    constructor() {
        super();
        this.state = {
            body:null
        };
        // Binds the VehicleTypeInfoStore methods to their 'on' equivalents
        this.bindActions(VehicleTypeInfoAction);
    }


    static getVehicleTypeByID(typeId){
        let vehicleTypes = this.state.body;
        for(let index in vehicleTypes){
            if(vehicleTypes[index].id == typeId){
                return vehicleTypes[index];
            }
        }
        return null;
    }

}

export default alt.createStore(VehicleTypeInfoStore, 'VehicleTypeInfoStore');