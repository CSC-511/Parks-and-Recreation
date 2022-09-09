import { helper } from '@ember/component/helper';

//lat1 and long1 are the destination coords and lat2 and long2 
//are for the user's current location, the fifth argument is what unit should be used
function coordsToDistance([lat1, long1, lat2, long2, unit]) {
  
  //a degree of latitude = 364000ft  (110.947 km)
  //a degree of longitude = 288200ft  (87.8433 km)
  //lat1 and lat2 are the current coords
  //lat2 and long2 are the destination's coords
  let lat_to_mi = 69;
  let long_to_mi = 54.6;
  let lat_to_km = 110.947;
  let long_to_km = 87.8433;

  //let distance variable with abs value  
  if(unit == "mi") {
    console.log("lat1: ", lat1, " lat2: ", lat2)
    let a = ((lat1 - lat2) * lat_to_mi) ** 2
    console.log("long1: ", long1, " long2: ", long2)
    let b = ((long1 - long2) * long_to_mi) ** 2
    let dist = Math.sqrt(a + b)

    var miFormat = new Intl.NumberFormat('en-US', {
      style: "unit",
      unit: "mile",
    })
    return miFormat.format(dist);
  }
  else if (unit == "km") {
    let a = ((lat1 - lat2) * lat_to_km) ** 2
    let b = ((long1 - long2) * long_to_km) ** 2
    let dist = Math.sqrt(a + b)
    var kmFormat = new Intl.NumberFormat('en-US', {
      style: "unit",
      unit: "kilometer",
    })
    return kmFormat.format(dist);
  }
  else {
    //this should be proper error handling, but I'll leave it like this for now
    return "Could not convert coords to distance!"
  }
}

export default helper(coordsToDistance);