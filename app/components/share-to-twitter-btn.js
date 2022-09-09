import Component from '@glimmer/component';

export default class ShareToTwitterBtnComponent extends Component {
  get twitterLink() {
    const res = ["https://twitter.com/intent/tweet?text="];
    for(const char of this.args.twitterContent){
      if(char === " "){
        res.push("%20");
        continue;
      }
      res.push(char);
    }
    return res.join("");
  }
}
