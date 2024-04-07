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
function getDayOfWeek() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const dayOfWeek = daysOfWeek[today.getDay()];
  return dayOfWeek;
}
//天気の情報を取得する関数
async function getWeather() {
  const URL =
    "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&current=temperature_2m,weather_code&hourly=precipitation_probability,temperature_2m,weather_code&forecast_days=1";
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
    const weatherImageElement = document.getElementsByClassName("js-weatherImage")[0];
    const setWeatherImage = (weatherCode) => {
      return `../images/weatherIcon/${WeatherIconObj[weatherCode]}`;
    };
    //Now のHourlyForecast
    const todayWeather = WeatherInfo.current.weather_code;
    const todayWeatherImage = setWeatherImage(todayWeather);

    // 画像のパスを設定
    weatherImageElement.src = todayWeatherImage;
    // weatherImageElement.src = hourlyWeatherImage;
    //TODO 後で消す
    console.log("--現在の時刻--");
    console.log(WeatherInfo.current.time);
    
    // 現在の気温
    const hourlyTemperature = WeatherInfo.current.temperature_2m;
    const hourlyTemperatureElement = document.getElementsByClassName("js-getHourlyTemperature")[0];
    hourlyTemperatureElement.textContent = `${hourlyTemperature}°C`;

    //Now から１時間おきのデータを取得
    const currentTime = new Date();
    
    //WeatherCodeから画像取得
    const hourlyWeatherCodes = WeatherInfo.hourly.weather_code;

    const hourlyWeatherCodesValues = [];
    const leftTimeValues = [];
    const hourlyEachTemperature = WeatherInfo.hourly.temperature_2m;
    const hourlyTemperatureData = []; 
    for (let i = 0; i < 4; i++) {
      const futureTime = new Date(currentTime.getTime() + i * 60 * 60 * 1000); // i時間後
      const hourIndex = Math.floor((futureTime.getHours() - currentTime.getHours()) / 1); // 現在の時刻からの経過時間に基づいてindexを計算
      futureTime.setHours(futureTime.getHours() + 14); // // 取得した時刻に14時間を加算（12時間ではなく14時間。Nowは含まないため時差＋１時間追加）
      const formattedTime = futureTime.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit'});
      const timeValues = formattedTime.split(':');  // コロンで時刻を分割。"◯時"のみを取得。□分削除
      const leftTimeValue = timeValues[0];
      leftTimeValues.push(leftTimeValue);
      hourlyWeatherCodesValues.push(hourlyWeatherCodes[hourIndex+2]);

      const hourlyTemperatureValue = hourlyEachTemperature[hourIndex+2];
      hourlyTemperatureData.push(hourlyTemperatureValue);
    }
    
    //Hourly Forecast (Today)・画像の表示(Now以降)
    const timeWeatherImageElements = document.querySelectorAll(".js-timeWeatherImage");
    hourlyWeatherCodesValues.forEach((weatherCode, index) => {
      timeWeatherImageElements[index].src = setWeatherImage(weatherCode);
    });

    //Hourly Forecast (Today)・時間の表示(Now以降)
    const hourlyTimeforcastElements = document.querySelectorAll(".js-hourlyTimeForecast");
    hourlyTimeforcastElements.forEach((hourlyTime, index) => {
      hourlyTime.textContent = `${leftTimeValues[index]}:00 `;
    }); 

    // Hourly Forecast (Today)・気温の表示(Now以降)
    const hourlyTempCelsiusElements = document.querySelectorAll(".js-hourlyTempCelsius");
    hourlyTempCelsiusElements.forEach((hourlyTemperature, index) => {
      hourlyTemperature.textContent = `${hourlyTemperatureData[index]}°C`;
    }); 

  })();
});