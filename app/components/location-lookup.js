import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LocationLookupComponent extends Component {
  @tracked lat;
  @tracked long;
  @tracked showLayout = false;

  @action
  done() {
    localStorage.setItem(
      'location',
      JSON.stringify({
        lat: this.lat,
        long: this.long,
      })
    );

    this.showLayout = true;
  }

  @action
  placeChanged(args) {
    console.log(args);
    this.lat = args.geometry.viewport.La.g;
    this.long = args.geometry.viewport.Ua.g;
  }

  constructor() {
    super(...arguments);

    const storedLocation = JSON.parse(localStorage.getItem('location'));

    if (storedLocation) {
      this.lat = storedLocation.lat;
      this.long = storedLocation.long;
      this.showLayout = true;
    }
  }
}
