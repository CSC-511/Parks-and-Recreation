/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from '@ember/object';
import { getGoogleMap } from '../helpers/get-google-map';
// import { A } from '@ember/array';

export default class BaseComponentComponent extends Component {

    //was having issues, so these are temps I used for the Lodgings component
    //was thinking of separating the search query into different params
    @tracked location = "Staten Island"
    @tracked state = "NY"

    //just test values
    @tracked latitude = null;
    @tracked longitude = null;
    @tracked address = "";
    @tracked currentRoute = "/"
    @tracked showLayout = false;
    @tracked google = null
    @tracked stateCode = "";

    homeRoute = "/";
    parksRoute = "/parks";
    lodgesRoute = "/lodges";

    constructor() {
        super(...arguments);
        
        const storedLocation = JSON.parse(localStorage.getItem('location'));

        if (storedLocation) {
            this.latitude = storedLocation.lat;
            this.longitude = storedLocation.long;
            this.showLayout = true;
        }

        let googleMapsPromise = getGoogleMap();
        Promise.all([googleMapsPromise]).then(values => {
            this.google = values[0];
        })
    }

    @action
    onSubmitAddress() {
        localStorage.setItem(
            'location',
            JSON.stringify({
                lat: this.latitude,
                long: this.longitude,
            })
        );
        this.showLayout = true;
    }

    @action
    placeChanged(args) {
        // this.latitude = 40.631010;
        // this.longitude = -74.149410;
        // console.log(args);
        let isInUnitedStates = false;
        for(let i = args.address_components.length - 1; i >= 0; i--){
            const component = args.address_components[i];
            // only keep checking for country if we're not sure if it's in the US
            if(!isInUnitedStates) isInUnitedStates = component.types[0] === "country" && component.short_name === "US";
            // if this location is in the United States then its "administrative_area_level_1" is a state
            if(isInUnitedStates  && component.types[0] === "administrative_area_level_1" ){
                this.stateCode = component.short_name;
                break;
            } 
        }
        console.log(this.stateCode);

        this.latitude = args.geometry.location.lat();
        this.longitude = args.geometry.location.lng();
    }

    @action
    goBack() {
        this.currentRoute = this.homeRoute
    }
    
    @action
    setShowParks() {
        this.currentRoute = this.parksRoute
    }

    @action
    setShowLodge() {
        this.currentRoute = this.lodgesRoute
    }
}
