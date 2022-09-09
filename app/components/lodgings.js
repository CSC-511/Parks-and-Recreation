/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from '@ember/object';
import { A } from '@ember/array';
import axios from 'axios'
import { scheduleOnce } from '@ember/runloop'

export default class LodgingsComponent extends Component {

    @tracked images = []
    @tracked camp_lodges = A([]);  //used to store the results of the search
    @tracked hotel_lodges = A([]);
    
    @tracked showHotels = true
    @tracked showCampsites = true

    @tracked selected_place = "";  //utilized for the currently selected result in this component
    @tracked selected_index = 0;  //utilized for the carousel/slides for the results
    @tracked selected_icon;  //google icon of what the location is
    @tracked selected_latitude;  //used for calculating the current distance0
    @tracked selected_longitude;  //used for calculating the current distance
    @tracked selected_vicinity = " ";  //address of selected location
    @tracked selected_rating;  //rating score of selected location
    @tracked selected_user_ratings;  //number of ratings of the selection

    constructor() {
        super(...arguments)
        
        scheduleOnce("afterRender", this, this.populate);
    }

    populate() {
        let lat = this.args.latitude;
        let long = this.args.longitude;
        let location = this.args.location;
        let state = this.args.state;
        if (!lat || !long) return;

        let google = this.args.google
        this.google = google
            this.markers = []
            var statenIsland = new google.maps.LatLng(lat, long);
            this.infowindow = new google.maps.InfoWindow({
                maxWidth: 400
            });
            this.map = new google.maps.Map(document.getElementById('map_two'), {
                center: statenIsland,
                zoom: 15
            });
            //Hide other markers from showing on the map
            this.map.setOptions({
                styles: [{
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]
                }]
            });

            var service = new google.maps.places.PlacesService(this.map);
            let nps_url = "https://developer.nps.gov/api/v1/campgrounds?"

            var options = {
                method: 'GET',
                url: nps_url,
                params: {stateCode: state, api_key: "zcph3oNDuo4SWhrEGGd1yqLUFoexjb082t95VTZE"},
            };
            
            var options_two= {
                method: 'GET',
                url: 'https://hotels4.p.rapidapi.com/locations/search',
                params: {query: location, locale: 'en_US'},
                headers: {
                  'x-rapidapi-key': '4fd6e89ad1msh9348b92815a5afcp110ef0jsn7c20f9b2e131',
                  'x-rapidapi-host': 'hotels4.p.rapidapi.com'
                }
            };

            //request for getting the park codes
            axios.all([
            axios.request(options).then((response) => { 
                let data = response.data.data
                var campsiteInfo = []
                data.forEach((camp) => {
                    campsiteInfo.pushObject(camp)
                })

                campsiteInfo.forEach((record) => {
                    var coords = new google.maps.LatLng(record.latitude, record.longitude);
                    var request = {
                        query: record.name,
                        locationBias: coords,
                        fields: ['formatted_address', 'name', 'icon', 'photos', 'geometry', 'rating', 'user_ratings_total'],
                    };

                    service.findPlaceFromQuery(request, (result, status) => {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var res = result[0]
                            var property;
                            for (property in record) {
                                if(record.hasOwnProperty(property) && !res[property]) {
                                    res[property] = record[property]
                                }
                            }
                            this.appendResult(res, "Campsite")

                            let image = {
                                url: res.icon,
                                size: new google.maps.Size(71, 71),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(17, 34),
                                scaledSize: new google.maps.Size(50, 50),
                            };
                            let marker = new google.maps.Marker({
                                map: this.map,
                                icon: image,
                                position: res.geometry.location,
                                name: res.name,
                                vicinity: res.formatted_address
                            })
                            let infoBox =
                                '<div class="info_box">' +
                                "<h4>" +
                                res.name +
                                "</h4>" +
                                "<p>" +
                                res.formatted_address +
                                "</p>" +
                                "</div>";
    
                            marker.addListener("click", () => {
                                if (marker.getAnimation() !== null) {
                                    marker.setAnimation(null);
                                } else {
                                    marker.setAnimation(google.maps.Animation.BOUNCE);
                                }
                                setTimeout(() => {
                                    marker.setAnimation(null);
                                }, 1500);
                            });
    
                            this.markers.push(marker)
    
                            this.google.maps.event.addListener(marker, "click", () => {
                                this.infowindow.setContent(infoBox);
                                this.map.setCenter(marker.position);
                                this.infowindow.open(this.map, marker);
                                this.map.panBy(0, -125);
                            });
                        }
                    })
                }) 
            }).catch((error) => {
                console.error(error);
            })],
            [axios.request(options_two).then((response) => { 
                    let results = response.data.suggestions[1].entities
                    results.forEach(record => {
                        var coords = new google.maps.LatLng(record.latitude, record.longitude);
                        var request = {
                            query: record.name,
                            locationBias: coords,
                            fields: ['formatted_address', 'name', 'icon', 'photos', 'geometry', 'rating', 'user_ratings_total'],
                        };

                        service.findPlaceFromQuery(request, (result, status) => {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var res = result[0]
                                this.appendResult(res, "Hotel")
        
                                let image = {
                                    url: res.icon,
                                    size: new google.maps.Size(71, 71),
                                    origin: new google.maps.Point(0, 0),
                                    anchor: new google.maps.Point(17, 34),
                                    scaledSize: new google.maps.Size(50, 50),
                                };
                                let marker = new google.maps.Marker({
                                    map: this.map,
                                    icon: image,
                                    position: res.geometry.location,
                                    name: res.name,
                                    vicinity: res.formatted_address
                                })
                                let infoBox =
                                    '<div class="info_box">' +
                                    "<h4>" +
                                    res.name +
                                    "</h4>" +
                                    "<p>" +
                                    res.formatted_address +
                                    "</p>" +
                                    "</div>";
        
                                marker.addListener("click", () => {
                                    if (marker.getAnimation() !== null) {
                                        marker.setAnimation(null);
                                    } else {
                                        marker.setAnimation(google.maps.Animation.BOUNCE);
                                    }
                                    setTimeout(() => {
                                        marker.setAnimation(null);
                                    }, 1500);
                                });
        
                                this.markers.push(marker)
        
                                this.google.maps.event.addListener(marker, "click", () => {
                                    this.infowindow.setContent(infoBox);
                                    this.map.setCenter(marker.position);
                                    this.infowindow.open(this.map, marker);
                                    this.map.panBy(0, -125);
                                });
                            }
                        })
                    })
                }).catch((error) => {
                    console.error(error);
                })])
    }

    get twitterContent() {
        return `Come visit ${this.selected_place}!! ${this.selected_user_ratings} people has given it an average rating of ${this.selected_rating} on Google.`
    }

    @action
    updateFilters(option) {
        if (option == "Hotel") {
            if(this.showHotels == true) {
                this.showHotels = false
            } else {
                this.showHotels = true
            }
        } else {
            if(this.showCampsites == true) {
                this.showCampsites = false
            } else {
                this.showCampsites = true
            }
        }
    }

    //actions related to the results
    @action
    appendResult(result, lodge_type) {
        if(result.photos == null) {
            if(lodge_type == "Hotel") {
                this.hotel_lodges.pushObject({
                    name: result.name,
                    icon: result.icon,
                    lat: result.geometry.viewport.Ua.g,
                    long: result.geometry.viewport.La.g,
                    vicinity: ((result.vicinity) ? result.vicinity : result.formatted_address),
                    rating: result.rating,
                    user_ratings_total: result.user_ratings_total,
                    lodging_type: lodge_type,
                    campsites: result.campsites
                })
            } else {                
                this.camp_lodges.pushObject({
                    name: result.name,
                    icon: result.icon,
                    lat: result.geometry.viewport.Ua.g,
                    long: result.geometry.viewport.La.g,
                    vicinity: ((result.vicinity) ? result.vicinity : result.formatted_address),
                    rating: result.rating,
                    user_ratings_total: result.user_ratings_total,
                    lodging_type: lodge_type,
                    campsites: result.campsites
                })
            }    
        } else {
            if(lodge_type == "Hotel") {
                this.hotel_lodges.pushObject({ 
                    name: result.name,
                    icon: result.icon,
                    lat: result.geometry.viewport.Ua.g,
                    long: result.geometry.viewport.La.g,
                    vicinity: ((result.vicinity) ? result.vicinity : result.formatted_address),
                    rating: result.rating,
                    user_ratings_total: result.user_ratings_total,
                    image: result.photos[0].getUrl(),
                    lodging_type: lodge_type,
                    campsites: result.campsites
                })
            } else {
                this.camp_lodges.pushObject({ 
                    name: result.name,
                    icon: result.icon,
                    lat: result.geometry.viewport.Ua.g,
                    long: result.geometry.viewport.La.g,
                    vicinity: ((result.vicinity) ? result.vicinity : result.formatted_address),
                    rating: result.rating,
                    user_ratings_total: result.user_ratings_total,
                    image: result.photos[0].getUrl(),
                    lodging_type: lodge_type,
                    campsites: result.campsites
                })
            }
        }
    }

    @action
    updateCampSelection(index) {
        let marker = this.markers[index]
        const infoBox =
            '<div class="info_box">' +
            "<h4>" +
            marker.name +
            "</h4>" +
            "<p>" +
            marker.vicinity +
            "</p>" +
            "</div>";

        this.infowindow.setContent(infoBox);
        this.map.setCenter(marker.position);
        this.infowindow.open(this.map, marker);
        this.map.panTo(marker.position);
        marker.setAnimation(this.google.maps.Animation.BOUNCE);
        setTimeout(() => {
            marker.setAnimation(null);
        }, 1500);
        this.selected_place = this.camp_lodges.objectAt(index).name;
        this.selected_icon = this.camp_lodges.objectAt(index).icon;
        this.selected_latitude = this.camp_lodges.objectAt(index).lat;
        this.selected_longitude = this.camp_lodges.objectAt(index).long;
        this.selected_vicinity = this.camp_lodges.objectAt(index).vicinity;
        this.selected_rating = this.camp_lodges.objectAt(index).rating;
        this.selected_user_ratings = this.camp_lodges.objectAt(index).user_ratings_total;
    }

    @action
    updateHotelSelection(index) {
        let marker = this.markers[this.camp_lodges.length + index]
        const infoBox =
            '<div class="info_box">' +
            "<h4>" +
            marker.name +
            "</h4>" +
            "<p>" +
            marker.vicinity +
            "</p>" +
            "</div>";

        this.infowindow.setContent(infoBox);
        this.map.setCenter(marker.position);
        this.infowindow.open(this.map, marker);
        this.map.panTo(marker.position);
        marker.setAnimation(this.google.maps.Animation.BOUNCE);
        setTimeout(() => {
            marker.setAnimation(null);
        }, 1500);
        this.selected_place = this.hotel_lodges.objectAt(index).name;
        this.selected_icon = this.hotel_lodges.objectAt(index).icon;
        this.selected_latitude = this.hotel_lodges.objectAt(index).lat;
        this.selected_longitude = this.hotel_lodges.objectAt(index).long;
        this.selected_vicinity = this.hotel_lodges.objectAt(index).vicinity;
        this.selected_rating = this.hotel_lodges.objectAt(index).rating;
        this.selected_user_ratings = this.hotel_lodges.objectAt(index).user_ratings_total;
    }
}