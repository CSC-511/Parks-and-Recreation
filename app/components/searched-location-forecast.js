import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'
import { A as emberArray } from '@ember/array';

export default class SearchedLocationForecastComponent extends Component {
    API_KEY = "8502264047828387cbb541a940397ad5"
    
    @tracked SearchedWeather = null
    @tracked SearchedTempMin = null
    @tracked SearchedTempMax = null
    @tracked SearchedFeelsLike = null
    @tracked SearchedTemp = null

    @tracked searchedDateArray = emberArray([])
    @tracked searchedfirstDate = null
    @tracked searchedfirstDayAvg = null
    @tracked searchedfirstDayCond = null

    @tracked searchedsecondDate = null
    @tracked searchedsecondDayAvg = null
    @tracked searchedsecondDayCond = null

    @tracked searchedthirdDate = null
    @tracked searchedthirdDayAvg = null
    @tracked searchedthirdDayCond = null

    @tracked searchedfourthDate = null
    @tracked searchedfourthDayAvg = null
    @tracked searchedfourthDayCond = null

    @tracked searchedfifthDate = null
    @tracked searchedfifthDayAvg = null
    @tracked searchedfifthDayCond = null

    @tracked SearchedName = null
    @tracked google = null
    
    get updateWeather(){
        fetch (`http://api.openweathermap.org/data/2.5/weather?lat=`+this.args.searchedLat+`&lon=`+this.args.searchedLon+`&units=imperial&appid=`+this.API_KEY+``)
         .then(response => response.json())
         .then(SearchData => {                
             console.log(SearchData)
             this.SearchedName = SearchData.name
             this.SearchedTemp= SearchData.main.temp
             this.SearchedFeelsLike = SearchData.main.feels_like
             this.SearchedTempMax = SearchData.main.temp_max
             this.SearchedTempMin = SearchData.main.temp_min
             this.SearchedWeather = SearchData.weather[0].main
         })

        fetch (`http://api.openweathermap.org/data/2.5/forecast?lat=`+this.args.searchedLat+`&lon=`+this.args.searchedLon+`&units=imperial&appid=`+this.API_KEY+``)
        .then(res => res.json())
        .then(SearchedforecastData => {
            console.log(SearchedforecastData)

            for(let i = 0; i < SearchedforecastData.list.length; i++){
                this.searchedDateArray.addObject(SearchedforecastData.list[i])
            }
            
            //I wrote the variables like this instead of using arrays for formatting reasons
            //I found it easier to format in hbs with seperate variables
            //The API returned the forecast in 3 hour increments which is why it is spread of 5,13,21
            //There was an api call for an actual 5 day forecast but that required $$
            console.log(this.searchedDateArray)
            this.searchedfirstDate = this.searchedDateArray[5].dt_txt
            this.searchedfirstDayAvg = this.searchedDateArray[5].main.temp
            this.searchedfirstDayCond = this.searchedDateArray[5].weather[0].main

            this.searchedsecondDate = this.searchedDateArray[13].dt_txt
            this.searchedsecondDayAvg = this.searchedDateArray[13].main.temp
            this.searchedsecondDayCond = this.searchedDateArray[13].weather[0].main

            this.searchedthirdDate = this.searchedDateArray[21].dt_txt
            this.searchedthirdDayAvg = this.searchedDateArray[21].main.temp
            this.searchedthirdDayCond = this.searchedDateArray[21].weather[0].main

            this.searchedfourthDate = this.searchedDateArray[29].dt_txt
            this.searchedfourthDayAvg = this.searchedDateArray[29].main.temp
            this.searchedfourthDayCond = this.searchedDateArray[29].weather[0].main

            this.searchedfifthDate = this.searchedDateArray[37].dt_txt
            this.searchedfifthDayAvg = this.searchedDateArray[37].main.temp
            this.searchedfifthDayCond = this.searchedDateArray[37].weather[0].main

        })
    }

}
