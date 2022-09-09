import { helper } from '@ember/component/helper';

export var roundingNumber = (param) => {
  
  let roundedNumber = Math.round(param)

  return roundedNumber;
}


export default helper(roundingNumber);