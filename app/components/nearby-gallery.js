import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class NearbyGalleryComponent extends Component {
  @tracked currentIdx= -1;
  carousel = null;

  constructor() {
    super(...arguments);
    if(this.args.parks.length > 0) {
      this.currentIdx = 0;
      this.carousel = setInterval(this.changePark, 4500);
    }
  }

  willDestroyElement() {
    if(this.carousel) clearInterval(this.carousel);
    super.willDestroyElement(...arguments);
  }

  get currentParkName(){
    return this.args.parks[this.currentIdx].name;
  }

  get currentParkImage(){
    return this.args.parks[this.currentIdx].photos[0].getUrl();
  }

  @action 
  changePark() { // changes the carousel park
    if(this.currentIdx >= this.args.parks.length - 1) {
      this.currentIdx = 0;
    } else {
      this.currentIdx += 1;
    }
  }
}
