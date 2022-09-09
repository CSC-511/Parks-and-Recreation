/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from '@ember/object';
import { A } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';


export default class NearbyParksComponent extends Component {
    @tracked images = []
    @tracked parks = A([]);  //used to store the results of the search
    @tracked selected_place = "";  //utilized for the currently selected result in this component
    @tracked selected_index = 0;  //utilized for the carousel/slides for the results
    @tracked selected_icon;  //google icon of what the location is
    @tracked selected_latitude;  //used for calculating the current distance
    @tracked selected_longitude;  //used for calculating the current distance
    @tracked selected_vicinity = " ";  //address of selected location
    @tracked selected_rating;  //rating score of selected location
    @tracked selected_user_ratings;  //number of ratings of the selection

    populate() {
        let lat = this.args.latitude;
        let long = this.args.longitude;
        if (!lat || !long) return;

        let google = this.args.google

        this.google = google
        this.markers = []
        var statenIsland = new google.maps.LatLng(lat, long);
        this.infowindow = new google.maps.InfoWindow({
            maxWidth: 400
        });

        console.log(lat, long)
        this.map = new google.maps.Map(document.getElementById('map'), {
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
        console.log(google)
        var request = {
            location: statenIsland,
            radius: '1000',
            type: ['park'],
        };

        var service = new google.maps.places.PlacesService(this.map);
        service.nearbySearch(request, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(result => {
                    console.log(result)
                    this.appendResult(result)

                    let image = {
                        url: result.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(50, 50),
                    };
                    let marker = new google.maps.Marker({
                        map: this.map,
                        icon: image,
                        position: result.geometry.location,
                        name: result.name,
                        vicinity: result.vicinity
                    })
                    let infoBox =
                        '<div class="info_box">' +
                        "<h4>" +
                        result.name +
                        "</h4>" +
                        "<p>" +
                        result.vicinity +
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
                });

            }
        });
    }
    constructor() {
        super(...arguments);

        scheduleOnce("afterRender", this, this.populate);

    }

    get twitterContent() {
        return `Come visit ${this.selected_place}!! ${this.selected_user_ratings} people has given it an average rating of ${this.selected_rating} on Google.`
    }
   
    //actions related to the results
    @action
    appendResult(result) {
        console.log(result.photos[0].getUrl())
        this.parks.pushObject({ ...result, image: result.photos[0].getUrl() });
        this.images.push(result.photos[0].getUrl())
    }

    @action
    updateAllSelections(index) {
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
        this.selected_place = this.parks.objectAt(index).name
        this.selected_icon = this.parks.objectAt(index).icon
        this.selected_latitude = this.parks.objectAt(index).geometry.viewport.Ua.g
        this.selected_longitude = this.parks.objectAt(index).geometry.viewport.La.g
        this.selected_vicinity = this.parks.objectAt(index).vicinity
        this.selected_rating = this.parks.objectAt(index).rating;
        this.selected_user_ratings = this.parks.objectAt(index).user_ratings_total;

    }
}