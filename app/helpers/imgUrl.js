import { helper } from '@ember/component/helper';

// used for things-to-do component
export function imgUrl([thingObj]){
  const imgInfo = thingObj.images[0];
  return imgInfo.url;
}

export default helper(imgUrl);
