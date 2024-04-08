//Scroll to the top of the page when a specific day of the week element is clicked
document.addEventListener('DOMContentLoaded', () =>{
    const rows = document.querySelectorAll('.js-scrollTop');
  
    rows.forEach(row => {
      row.addEventListener('click', () =>{
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
  });


  //今日の日付を取得する関数:フォーマット例「January 1」
function getToday() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthStr = monthName[month - 1];
  const todayDate = `${monthStr} ${date}`;
  return todayDate;
}

//Get Day of the week
function getDayOfWeek(offset) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(daysOfWeek[(dayOfWeek + i) % 7]);
  }
  return days;
}

//天気の情報を取得する関数
async function getWeather() {
  const URL =
    "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&current=temperature_2m,weather_code&hourly=precipitation_probability,temperature_2m,weather_code&forecast_days=7&daily=weather_code,temperature_2m_max,precipitation_probability_max,precipitation_hours";
    try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data"); //APIの情報を取得できなかった場合はエラーメッセージを表示する
    }
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error); //何かしらのエラーが発生した場合はエラーメッセージを表示する
  }
  
}

//Display 7 days from the current day of the week
document.addEventListener("DOMContentLoaded", () => {
  const dayOfWeekDom = document.querySelectorAll(".js-sevendayForecast");
  //Day of the week
  dayOfWeekDom.forEach((element, index) => {
    const days = getDayOfWeek(index);
    element.innerHTML = days[index];
  });
});

// 天気のアイコンを表示する
const WeatherIconObj = {
  0: "Clear.png",  //"Clear"
  1: "Clear.png",  //"Clear"
  2: "Cloudy.png", //"Cloudy"
  3: "Cloudy.png", //"Cloudy"
  45: "fog.png",  // "Fog"
  48: "fog.png",  // "Fog"
  51: "cloudy-sometimes-rain.png",  //TODO 後でアイコン変更 "Drizzle" 
  53: "cloudy-sometimes-rain.png",  //"Drizzle" TODO 後でアイコン変更
  55: "cloudy-sometimes-rain.png",  //"Drizzle" TODO 後でアイコン変更
  56: "cloudy-sometimes-rain.png",  //"Drizzle" TODO 後でアイコン変更
  57: "cloudy-sometimes-rain.png",  //"Drizzle" TODO 後でアイコン変更
  61: "rain.png",  // "Rain"
  63: "rain.png",  // "Rain"
  65: "rain.png",  // "Rain"
  66: "rain.png",  // "Rain"
  67: "rain.png",  // "Rain"
  71: "snow.png",  // "Snow"
  73: "snow.png",  // "Snow"
  75: "snow.png",  // "Snow"
  80: "rain.png",  //"Rain showers"
  81: "rain.png",  //"Rain showers"
  82: "rain.png",  //"Rain showers"
  85: "snow.png",  //"Snow shower" TODO 後でアイコン変更
  86: "snow.png",  //"Snow shower" TODO 後でアイコン変更
  95: "Thunderstorm.png", // "Thunderstorm"
  96: "Thunderstorm.png", // "Thunderstorm"
  99: "Thunderstorm.png", // "Thunderstorm"
};

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const WeatherInfo = await getWeather();
    const setWeatherImage = (weatherCode) => {
      return `../images/weatherIcon/${WeatherIconObj[weatherCode]}`;
    };
    
    // Set today's weather image
    const todayWeather = WeatherInfo.current.weather_code;
    const weatherImageElement = document.getElementsByClassName("js-weatherImage")[0];

    weatherImageElement.src = setWeatherImage(todayWeather);;

    // Set images for the next 7 days
    const weatherCodes = WeatherInfo.daily.weather_code;
    const sevendayWeatherImages = document.querySelectorAll(".js-sevendayWeatherImage");
    
    weatherCodes.forEach((weatherCode, index) => {
      sevendayWeatherImages[index].src = setWeatherImage(weatherCode);
    });

    // Now -> Current Temperature
    const hourlyTemperature = WeatherInfo.current.temperature_2m;
    const hourlyTemperatureElement = document.getElementsByClassName("js-getHourlyTemperature")[0];
    hourlyTemperatureElement.textContent = `${hourlyTemperature}°C`;

    
    //Hourly Forecast
    const currentTime = new Date();
    const hourlyEachTemperature = WeatherInfo.hourly.temperature_2m;
    const hourlyWeatherCodes = WeatherInfo.hourly.weather_code;
    const hourlyTemperatureData = []; 
    const hourlyWeatherCodesValues = [];
    const leftTimeValues = [];

    for (let i = 0; i < 4; i++) {
      const futureTime = new Date(currentTime.getTime() + i * 60 * 60 * 1000); // i時間後
      const hourIndex = Math.floor((futureTime.getHours() - currentTime.getHours()) / 1); // 現在の時刻からの経過時間に基づいてindexを計算
      //TODO 調整後実際は＋１時間  時差13時間を加算（Nowは含まないため時差＋１時間追加）
      futureTime.setHours(futureTime.getHours() + 14); 
      const formattedTime = futureTime.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit'});
      const timeValues = formattedTime.split(':');  // コロンで時刻を分割。"◯時"のみを取得。□分削除
      const leftTimeValue = timeValues[0];
      leftTimeValues.push(leftTimeValue);
      //TODO 調整必要かも
      hourlyWeatherCodesValues.push(hourlyWeatherCodes[hourIndex+2]);
      const hourlyTemperatureValue = hourlyEachTemperature[hourIndex+2];
      hourlyTemperatureData.push(hourlyTemperatureValue);
    }

    //Hourly Forecast (Today)・Display Image(Now以降)
    const timeWeatherImageElements = document.querySelectorAll(".js-timeWeatherImage");
    hourlyWeatherCodesValues.forEach((weatherCode, index) => {
      timeWeatherImageElements[index].src = setWeatherImage(weatherCode);
    });

    //Hourly Forecast (Today)・Display Time(Now以降)
    const hourlyTimeforcastElements = document.querySelectorAll(".js-hourlyTimeForecast");
    hourlyTimeforcastElements.forEach((hourlyTime, index) => {
      hourlyTime.textContent = `${leftTimeValues[index]}:00 `;
    }); 

    // Hourly Forecast (Today)・Display Temperature(Now以降)
    const hourlyTempCelsiusElements = document.querySelectorAll(".js-hourlyTempCelsius");
    hourlyTempCelsiusElements.forEach((hourlyTemperature, index) => {
      hourlyTemperature.textContent = `${hourlyTemperatureData[index]}°C`;
    }); 

    //temperature(Celsius)
    const temperatureInfo = WeatherInfo.daily.temperature_2m_max;
    const tempCelsiusElements = document.querySelectorAll(".js-sevendayCelsius");

    temperatureInfo.forEach((temperature, index) => {
      const roundedTemperature = temperature.toFixed(1); // 気温を小数点以下1桁に丸める
      tempCelsiusElements[index].textContent = `${roundedTemperature}°C`;
    });

    //precipitation_probability_max
    const precipitationProbability = WeatherInfo.daily.precipitation_probability_max
    const sevendayPrecipitationElements = document.querySelectorAll(".js-sevendayPrecipitation");
    
    precipitationProbability.forEach((precipitation, index) => {
      sevendayPrecipitationElements[index].textContent = `${precipitation} %`
    });

  })();
});
