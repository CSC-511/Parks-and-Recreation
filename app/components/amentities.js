import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import axios from 'axios';

export default class AmentitiesComponent extends Component {
  @tracked data = [];
  constructor() {
    super(...arguments);
    const parkName = this.args.name.split(' ').join('%20');

    const results = axios
      .get(
        `https://developer.nps.gov/api/v1/amenities?api_key=zcph3oNDuo4SWhrEGGd1yqLUFoexjb082t95VTZE&q=${parkName}`
      )
      .then((res) => {
        for (let index = 0; index < 5; index++) {
          console.log(res.data.data[index].name);
          this.data.pushObject(res.data.data[index].name);
        }
      });
  }
}
