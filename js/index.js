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
  //天気の情報を取得する関数
  async function getWeather() {
    const URL =
      "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&daily=weather_code,temperature_2m_max,temperature_2m_min";
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data"); //APIの情報を取得できなかった場合はエラーメッセージを表示する
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error); //何かしらのエラーが発生した場合はエラーメッセージを表示する
    }
  }
  //現在の日付を表示する
  document.addEventListener("DOMContentLoaded", () => {
    const todayDom = document.querySelector(".js-getToday");
    todayDom.innerHTML = getToday();
    console.log(todayDom);
  });
  // 天気のアイコンを表示する
  const WeatherIconObj = {
    0: "Clear.png",  //"Clear"
    1: "Clear.png",  //"Clear"
    2: "Cloudy.png", //"Cloudy"
    3: "Cloudy.png", //"Cloudy"
    45: "fog.png",  // "Fog"
    48: "fog.png",  // "Fog"
    51: "cloudy-sometimes-rain.png",  //"Drizzle" TODO 後でアイコン変更
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
    80: "snow.png",  // "Snow"
    81: "Rain showers",  //"Rain showers"
    82: "Rain showers",  //"Rain showers"
    85: "snow.png",  //"Snow shower" TODO 後でアイコン変更
    86: "snow.png",  //"Snow shower" TODO 後でアイコン変更
    95: "Thunderstorm.png", // "Thunderstorm"
    96: "Thunderstorm-hail.png",  // "Thunderstorm with hail"
    99: "Thunderstorm-hail.png",  // "Thunderstorm with hail"
  };
  document.addEventListener("DOMContentLoaded", () => {
    (async () => {
      const WeatherInfo = await getWeather();
      const weatherImageElement = document.getElementsByClassName("js-weatherImage")[0];
      const todayWeather = WeatherInfo.daily.weather_code[0];
      //todayWeatherの値によって表示する画像を変更する
      const weatherImageName = WeatherIconObj[todayWeather];
      console.log(todayWeather);
      // 画像のパスを設定
      weatherImageElement.src = `../images/weatherIcon/${weatherImageName}`;
    })();
  });
