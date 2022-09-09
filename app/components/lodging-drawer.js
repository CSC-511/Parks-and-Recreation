import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LodgingDrawerComponent extends Component {

    @action
    showDrawer(event) {
        event.preventDefault()
        console.log("show called")
        let drawer = document.querySelector("#drawer_nav")
        if (drawer) {
            drawer.style.width = "250px"
        }
    }

    @action
    hideDrawer(event) {
        event.preventDefault()
        console.log("hide called")
        let drawer = document.querySelector("#drawer_nav")
        if (drawer) {
            drawer.style.width = "0px";
        }
    }

}
