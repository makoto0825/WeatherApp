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
      // "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&hourly=weather_code,temperature_2m&forecast_days=1";
      // "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m";
      "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m&forecast_days=1";
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
  //現在の日付と曜日を表示する
  document.addEventListener("DOMContentLoaded", () => {
    const todayDom = document.querySelector(".js-getToday");
    const dayOfWeekDom = document.querySelector(".js-getDayOfWeek");
    
    todayDom.innerHTML = getToday();
    dayOfWeekDom.innerHTML = getDayOfWeek();
  });


  // document.addEventListener("DOMContentLoaded", () => {
  //   const 

  // });

  // TODO 降水確率


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
      const todayWeather = WeatherInfo.daily.weather_code[0];
      const weatherImageName = WeatherIconObj[todayWeather];
      console.log("------------"); // TODO 後で消す
      console.log("本日の天気APIのWeatherIconObj:" + todayWeather); // TODO 後で消す
      // 画像のパスを設定
      weatherImageElement.src = `../images/weatherIcon/${weatherImageName}`;

      //気温を取得
      const todayTemperatureElement = document.getElementsByClassName("js-getTodayTemperature")[0];
      const todayTempMax = WeatherInfo.daily.temperature_2m_max[0];
      const todayTempMin = WeatherInfo.daily.temperature_2m_min[0];
      //TODO改行されない。一旦華氏のみ表示
      const temperatureText = `temperature(icon) ${todayTempMax}°C / ${todayTempMin}°C`;
      // const temperatureText = `temperature(icon) ${todayTempMax}°C / ${todayTempMin}°C\n ${((todayTempMax * 9/5) + 32).toFixed(1)}°F / ${((todayTempMin * 9/5) + 32).toFixed(1)}°F`;
      
      todayTemperatureElement.textContent = temperatureText;

      console.log("ーー最高・最低気温ーー");
      console.log(todayTempMax)
      console.log(todayTempMin)
    })();
  });
