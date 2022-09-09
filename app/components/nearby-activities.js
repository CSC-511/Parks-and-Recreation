import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A as emberArray } from '@ember/array';
import axios from 'axios';
import { scheduleOnce } from '@ember/runloop';

export default class NearbyActivitiesComponent extends Component {
  constructor() {
    super(...arguments);

    scheduleOnce('afterRender', this, this.fetchActivities);
  }
  @tracked activities = {};
  @tracked toBeRendered = emberArray([]);
  @action
  fetchActivities() {
    axios
      .get(
        'https://developer.nps.gov/api/v1/thingstodo?parkCode=acad&api_key=q1fM2A9uXdEwI1rTFDO4DeusjXNp6ID7fImQpYws&limit=4'
      )
      .then((response) => {
        console.log(response.data.data, 'Near By Actvities');
        this.activities = response.data;
      })
      .then(() => {
        this.activities.data.forEach((activity) => {
          const act = {
            img: activity.images[0].url,
            name: activity.title,
            link: activity.url,
          };
          console.log(activity);
          this.toBeRendered.pushObject(act);
          // console.log(this.toBeRendered, 'to be rendered');
        });

        // this.activities = emberArray([
        //   {
        //     name: 'Activity #1',
        //     img: this.activities.data[0].images[0].url,
        //     address: '2300 Richmond Ave, Staten Island',
        //   },
        //   {
        //     name: 'Activity #2',
        //     img: this.activities.data[1].images[0].url,
        //     address: '2300 Richmond Ave, Staten Island',
        //   },
        //   {
        //     name: 'Activity #3',
        //     img: this.activities.data[2].images[0].url,
        //     address: '2300 Richmond Ave, Staten Island',
        //   },
        //   {
        //     name: 'Activity #4',
        //     img: this.activities.data[3].images[0].url,
        //     address: '2300 Richmond Ave, Staten Island',
        //   },
        // ]);
      });
  }
}
