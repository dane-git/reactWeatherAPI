'use-strict'

function handleLocationError(err) {
  console.log(err)
}


function wrapper() {
  console.log('wrapper')
  const getGeo = () => {
    console.log('getGeo')
    return new Promise((resolve, reject) => {
      let apos = {}
      console.log('getGeo Promise')
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          apos = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          };
          console.log(apos)
          resolve(apos)
        });
      }
      else {
        // Browser doesn't support Geolocation
        reject(err => { console.log(err) });
      }
    }
    )
  }
  const geoFetch = ((local) => {
    return new Promise((resolve, reject) => {
      console.log('getFecth Promise')
      console.log(local)
      fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=${local.lat},${local.long}`)
        .then(result => result.json()
          .then(final => {
            console.log(final)
            resolve(final)
          }
          )
        )
    })
  })
  const weatherByWOEID = (id) => {
    return new Promise((resolve, reject) => {
      fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${id}/`)
        .then(aWeather => aWeather.json()
          .then(weather => {
            console.log(weather)
            let drise = new Date(weather.sun_rise).toLocaleTimeString();
            let dset = new Date(weather.sun_set).toLocaleTimeString();
            let wdate = new Date(weather.time).toLocaleDateString();
            let minTemp = weather.consolidated_weather[0].min_temp;
            let maxTemp = weather.consolidated_weather[0].max_temp;
            let nowTemp = weather.consolidated_weather[0].the_temp;
            let minTempF = (minTemp * 9 / 5) + 32;
            let maxTempF = (maxTemp * 9 / 5) + 32;
            let nowTempf = (nowTemp * 9 / 5) + 32;
            let wind = {
              speed: weather.consolidated_weather[0].wind_speed,
              direction: weather.consolidated_weather[0].wind_direction,
              compassDirection: weather.consolidated_weather[0].wind_direction_compass
            }
            let summation = weather.consolidated_weather[0].weather_state_name

            console.log(weather.consolidated_weather[0]);

            let weatherReport = {
              date: wdate,
              location: weather.title,
              summation: summation,
              rise: drise,
              set: dset,
              low: minTemp,
              high: maxTemp,
              lowf: minTempF,
              highf: maxTempF,
              nowtemp: nowTempf,
              wind: wind,
            }
            console.log(weatherReport)
            resolve(weatherReport)
          })
        )
    }
    )
  }

  async function getGeoAW() {
    const geo = await getGeo()
    console.log(geo)
    const fetchLocalArr = await geoFetch(geo)
    console.log(fetchLocalArr)
    let WOEID = fetchLocalArr[0].woeid
    const weather = await weatherByWOEID(WOEID)
    console.log(weather)
    return weather
  }
  let report = getGeoAW()
  export const report = report



}
let reportObj = wrapper();


// distance: 197593
// latt_long: "29.953690,-90.077713"
// location_type: "City"
// title: "New Orleans"
// // woeid: 2458833

// Object
// consolidated_weather: Array(6)
// 0:
// air_pressure: 1016
// applicable_date: "2020-07-01"
// created: "2020-07-01T19:24:46.256336Z"
// humidity: 70
// id: 6389715521503232
// max_temp: 34.175
// min_temp: 26.72
// predictability: 75
// the_temp: 31.46
// visibility: 10.126175634295713
// weather_state_abbr: "lr"
// weather_state_name: "Light Rain"
// wind_direction: 254.9287989465205
// wind_direction_compass: "WSW"
// wind_speed: 4.2081193361064715


// consolidated_weather: (6)[{ … }, { … }, { … }, { … }, { … }, { … }]
// latt_long: "29.953690,-90.077713"
// location_type: "City"
// parent: { title: "Louisiana", location_type: "Region / State / Province", woeid: 2347577, latt_long: "30.974199,-91.523819" }
// sources: (6)[{ … }, { … }, { … }, { … }, { … }, { … }]
// sun_rise: "2020-07-02T06:03:34.324135-05:00"
// sun_set: "2020-07-02T20:05:22.593066-05:00"
// time: "2020-07-02T06:41:09.592384-05:00"
// timezone: "America/Chicago"
// timezone_name: "LMT"
// title: "New Orleans"
// woeid: 2458833


// air_pressure: 1015.5
// applicable_date: "2020-07-02"
// created: "2020-07-02T10:24:46.296453Z"
// humidity: 66
// id: 4701951482658816
// max_temp: 34.035
// min_temp: 25.84
// predictability: 71
// the_temp: 32.614999999999995
// visibility: 13.870869124314005
// weather_state_abbr: "hc"
// weather_state_name: "Heavy Cloud"
// wind_direction: 290.85264676893337
// wind_direction_compass: "WNW"
// wind_speed: 5.7843905611840185