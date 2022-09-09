import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'
import { A as emberArray } from '@ember/array';

export default class WeatherInfoComponent extends Component {
    API_KEY = "8502264047828387cbb541a940397ad5"
    
    @tracked weather = null
    @tracked tempMin = null
    @tracked tempMax = null
    @tracked feelsLike = null
    @tracked temperature = null

    @tracked dateArray = emberArray([])
    @tracked firstDate = null
    @tracked firstDayAvg = null
    @tracked firstDayCond = null

    @tracked secondDate = null
    @tracked secondDayAvg = null
    @tracked secondDayCond = null

    @tracked thirdDate = null
    @tracked thirdDayAvg = null
    @tracked thirdDayCond = null

    @tracked fourthDate = null
    @tracked fourthDayAvg = null
    @tracked fourthDayCond = null

    @tracked fifthDate = null
    @tracked fifthDayAvg = null
    @tracked fifthDayCond = null

    @tracked name = null

    get updateWeather(){
       fetch (`http://api.openweathermap.org/data/2.5/weather?lat=`+this.args.weatherlatitude+`&lon=`+this.args.weatherlongitude+`&units=imperial&appid=`+this.API_KEY+``)
        .then(response => response.json())
        .then(data => {                
            console.log(data)
            this.name = data.name
            this.temperature = data.main.temp
            this.feelsLike = data.main.feels_like
            this.tempMax = data.main.temp_max
            this.tempMin = data.main.temp_min
            this.weather = data.weather[0].main
        })

        fetch (`http://api.openweathermap.org/data/2.5/forecast?lat=`+this.args.weatherlatitude+`&lon=`+this.args.weatherlongitude+`&units=imperial&appid=`+this.API_KEY+``)
        .then(res => res.json())
        .then(forecastData => {
            console.log(forecastData)

            if(this.dateArray.length !== 0){
                this.dateArray = []
            }
            if(this.dateArray.length == 0){
                for(let i = 0; i < forecastData.list.length; i++){
                    this.dateArray.addObject(forecastData.list[i])
                }
            }
            
            //I wrote the variables like this instead of using arrays for formatting reasons
            //I found it easier to format in hbs with seperate variables
            //The API returned the forecast in 3 hour increments which is why it is spread of 5,13,21
            //There was an api call for an actual 5 day forecast but that required $$
            console.log(this.dateArray)
            this.firstDate = this.dateArray[5].dt_txt
            this.firstDayAvg = this.dateArray[5].main.temp
            this.firstDayCond = this.dateArray[5].weather[0].main

            this.secondDate = this.dateArray[13].dt_txt
            this.secondDayAvg = this.dateArray[13].main.temp
            this.secondDayCond = this.dateArray[13].weather[0].main

            this.thirdDate = this.dateArray[21].dt_txt
            this.thirdDayAvg = this.dateArray[21].main.temp
            this.thirdDayCond = this.dateArray[21].weather[0].main

            this.fourthDate = this.dateArray[29].dt_txt
            this.fourthDayAvg = this.dateArray[29].main.temp
            this.fourthDayCond = this.dateArray[29].weather[0].main

            this.fifthDate = this.dateArray[37].dt_txt
            this.fifthDayAvg = this.dateArray[37].main.temp
            this.fifthDayCond = this.dateArray[37].weather[0].main

        })
    }
}
