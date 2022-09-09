import { helper } from '@ember/component/helper';

export var formatDate = (param) => {
  
  let date = param;

  let newDate = date.toString()
  newDate = newDate.slice(0,11)
  
  let year = newDate.slice(0,4)
  let month = newDate.slice(5,7)
  let day = newDate.slice(8,10)

  let formatted = `${month}-${day}-${year}`;

  return formatted;
}



export default helper(formatDate);
