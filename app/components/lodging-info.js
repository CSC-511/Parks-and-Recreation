import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
// import { action } from '@ember/object';

export default class LodgingInfoComponent extends Component {

    @tracked total = parseInt(this.args.lodging.campsites.totalSites)
    @tracked electricity = parseInt(this.args.lodging.campsites.electricalHookups)
    @tracked horse = parseInt(this.args.lodging.campsites.horse)
    @tracked rvOnly = parseInt(this.args.lodging.campsites.rvOnly)
    @tracked tentOnly = parseInt(this.args.lodging.campsites.tentOnly)
    @tracked boats = parseInt(this.args.lodging.campsites.walkBoatTo)

    constructor() {
        super(...arguments)
    }
}
