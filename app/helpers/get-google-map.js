export const getGoogleMap = () => {
  return new Promise((resolve) => {
    window.resolveGoogleMapsPromise = () => {
      resolve(window.google);
      delete window.resolveGoogleMapsPromise;
    };
    // const script = document.createElement('script');

    // script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC8KJV3tzLJVXAZNlW0Xy1IyWNyWHdS3m8&callback=resolveGoogleMapsPromise`;
    // script.async = true;
    // document.body.appendChild(script);
  });
};
