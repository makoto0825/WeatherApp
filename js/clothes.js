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
  const todayDom = document.getElementById("js-getToday");
  todayDom.innerHTML = getToday();
});
//天気のアイコンを表示する
const WeatherIconObj = {
  0: "Clear",
  1: "Clear",
  2: "Cloudy",
  3: "Cloudy",
  45: "Fog",
  48: "Fog",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  56: "Drizzle",
  57: "Drizzle",
  61: "Rain",
  63: "Rain",
  65: "Rain",
  66: "Rain",
  67: "Rain",
  71: "Snow",
  73: "Snow",
  75: "Snow",
  80: "Snow",
  81: "Rain showers",
  82: "Rain showers",
  85: "Snow shower",
  86: "Snow shower",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};
(async () => {
  const WeatherInfo = await getWeather();
  const todayWeather = WeatherInfo.daily.weather_code[0];
  //todayWeatherの値によって表示する画像を変更する
  const weatherImageName = WeatherIconObj[todayWeather];
  const weatherImageElement = document.getElementById("weatherImage");
  // 画像のパスを設定
  weatherImageElement.src = `../images/weatherIcon/${weatherImageName}.png`;
})();
