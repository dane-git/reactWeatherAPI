import React from 'react';
import logo from './logo.svg';
import './App.css';



const geoCoords = new Promise((resolve, reject) => {

  function getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showcoordinates);
    } else {
      console.log("The browser doesn't support Geolocation.");
    }
  }

  function showcoordinates(myposition) {
    let long = myposition.coords.longitude;
    let lat = myposition.coords.latitude

    let coords = {
      long: long,
      lat: lat
    }
    resolve(coords)
  }
  getCoordinates()
});

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
          let minTemp = Math.round((weather.consolidated_weather[0].min_temp) * 100) / 100;
          let maxTemp = Math.round((weather.consolidated_weather[0].max_temp) * 100) / 100;
          let nowTemp = Math.round((weather.consolidated_weather[0].the_temp) * 100) / 100;
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
            tempf: nowTempf,
            temp: nowTemp,
            wind: wind,
          }
          console.log(weatherReport)
          resolve(weatherReport)
        })
      )
  }
  )
}


function Welcome(props) {
  return (
    <h1>Hello , {props.name}</h1>
  )
}


//make weather comoponenet 
class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      geo: {
        lat: 1,
        long: 1,
      },
      weather: {},
      closestWeather: [],
    }
  }

  componentDidMount() {
    geoCoords
      .then(result => {
        this.setState({
          geo: result
        });
        return result
      })
      .then(coords => {
        console.log(coords)
        let arr = geoFetch(coords)
        return arr
      })
      .then(arr => {
        this.setState({
          closestWeather: arr,
        })
        console.log(this.state.closestWeather)
        return this.state.closestWeather
      })
      .then((closest) => {
        console.log(closest)
        return weatherByWOEID(closest[0].woeid)
      })
      .then(weatherReport => {
        console.log(weatherReport)
        this.setState({
          weather: weatherReport
        })
      })
      .catch(error => console.log(error))

  }

  render() {
    return (
      <div className="weatherWrap">
        <div className="geo">{this.state.geo.lat} {this.state.geo.long}</div>
        <h3>{this.state.weather.date} {this.state.weather.location}</h3>
        <h4>Today you can expect: {this.state.weather.summation}</h4>
        <div className="flexWrap">
          <table>
            <tbody>
              <tr>
                <th colSpan="2">TEMPS</th>
              </tr>
              <tr>
                <th>Low</th>
                <td>{this.state.weather.lowf}</td>
              </tr>
              <tr>
                <th>high</th>
                <td>{this.state.weather.highf}</td>
              </tr>
              <tr>
                <th>NOW</th>
                <td>{this.state.weather.tempf}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th colSpan="2">SUN</th>
              </tr>
              <tr>
                <th>Sunrise</th>
                <td>{this.state.weather.rise}</td>
              </tr>
              <tr>
                <th>Sunset</th>
                <td>{this.state.weather.set}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    )
  }
}

//make a clock
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    // after component mounts set timer for clock update
    this.timerID = setInterval(() =>
      this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div className="clock">
        <h2>Time: {this.state.date.toLocaleTimeString()}</h2>
      </div>
    )
  }
}
function App() {
  return (
    <div>
      <Clock />
      <Weather />
      <Welcome name="james" />
      <Welcome name="john" />
    </div>
  );
}

export default App;


