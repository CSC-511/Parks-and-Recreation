import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from '@ember/object';
import { A } from '@ember/array';


export default class ThingsToDoComponent extends Component {
  apiKey = "zcph3oNDuo4SWhrEGGd1yqLUFoexjb082t95VTZE";
  @tracked thingsToDo = A([]);
  @tracked stateCode = "";
  @tracked currentIdx = -1;
  @tracked total = 0;

  constructor(){
    super(...arguments);
    this.stateCode = this.args.stateCode;
    this.fetchThingsToDo(this.stateCode, 0);
  }

  get renderAThing(){
    return this.currentIdx >= 0;
  }

  get currentThing(){
    return this.thingsToDo[this.currentIdx];
  }

  @action
  async changeIdx(goRight){
    if(goRight){
      if(this.currentIdx + 1 === this.total){
        return;
      } else {
        this.currentIdx += 1;
      }
    } else {
      if(this.currentIdx === 0){
        return;
      } else {
        this.currentIdx -= 1;
      }
    }
  }

  @action
  fetchThingsToDo(stateCode){
    fetch(this.buildNpsApiQuery(stateCode))
    .then(res => res.json())
    .then(payload => {
      console.log(payload)
      this.thingsToDo = A(payload.data);
      if(this.thingsToDo.length > 0){
        this.currentIdx = 0;
        this.total = payload.total;
      }
    })
  }

  buildNpsApiQuery(stateCode){
    const npsApi = `https://developer.nps.gov/api/v1/thingstodo?stateCode=${stateCode}&limit=1000&api_key=${this.apiKey}`;
    return npsApi;
  }
}
