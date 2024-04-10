//Scroll to the top of the page when a specific day of the week element is clicked

//今日の日付を取得する関数:フォーマット例「January 1」
// function getToday() {
//   const today = new Date();
//   const month = today.getMonth() + 1;
//   const date = today.getDate();
//   const monthName = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const monthStr = monthName[month - 1];
//   const todayDate = `${month} ${date}`;
//   return todayDate;
// }
//======================================================function================================================
function formatDate(dateString) {
  // 日付文字列を分割して年、月、日に分ける
  const [year, month, day] = dateString.split("-");

  // 月の数字から月の名前に変換
  const months = [
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
  const monthName = months[parseInt(month, 10) - 1]; // 月のインデックスは0から始まるため、1を引く

  // 日付を組み立てて返す
  return `${monthName} ${day}`;
}

//Get Day of the week
function getDayOfWeek(week) {
  for (let i = 0; i < week.length; i++) {
    week[i] = formatDate(week[i]);
  }
  return week;
}

//天気の情報を取得する関数
async function getWeather(lat, long) {
  // const URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code&hourly=precipitation_probability,temperature_2m,weather_code&forecast_days=7&daily=weather_code,temperature_2m_max,precipitation_probability_max,precipitation_hours`;
  const URL =
    "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&current=temperature_2m,weather_code&hourly=precipitation_probability,temperature_2m,weather_code&forecast_days=7&daily=weather_code,temperature_2m_max,precipitation_probability_max,precipitation_hours&timezone=America%2FNew_York";
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

// 天気情報から1週間の天気データリストを生成する関数
function generateWeatherData(wholeHourlyData) {
  const weatherData = [];
  const dataIndex = [6, 9, 12, 15, 18, 21];

  for (let i = 0; i < 7; i++) {
    const indexes = dataIndex.map((value) => Number(value) + i * 24);
    const data = {
      weatherCode: [],
      temperature: [],
      // precipitation_probability: [],
      eachTime: ["6:00", "9:00", "12:00", "15:00", "18:00", "21:00"],
    };

    indexes.forEach((i) => {
      data.temperature.push(wholeHourlyData.temperature_2m[i]);
      data.weatherCode.push(wholeHourlyData.weather_code[i]);
      // data.precipitation_probability.push(
      //   wholeHourlyData.precipitation_probability[i]
      // );
    }, {});
    weatherData.push(data);
  }

  return weatherData;
}

// 天気コードからアイコンのパスを取得する関数
const setWeatherImage = (weatherCode) => {
  return `../images/weatherIcon/${WeatherIconObj[weatherCode]}`;
};

//======================================================program start================================================
// 天気のアイコンを表示するオブジェクト
const WeatherIconObj = {
  0: "Clear.png", //"Clear"
  1: "Clear.png", //"Clear"
  2: "Cloudy.png", //"Cloudy"
  3: "Cloudy.png", //"Cloudy"
  45: "fog.png", // "Fog"
  48: "fog.png", // "Fog"
  51: "cloudy-sometimes-rain.png", //TODO 後でアイコン変更 "Drizzle"
  53: "cloudy-sometimes-rain.png", //"Drizzle" TODO 後でアイコン変更
  55: "cloudy-sometimes-rain.png", //"Drizzle" TODO 後でアイコン変更
  56: "cloudy-sometimes-rain.png", //"Drizzle" TODO 後でアイコン変更
  57: "cloudy-sometimes-rain.png", //"Drizzle" TODO 後でアイコン変更
  61: "rain.png", // "Rain"
  63: "rain.png", // "Rain"
  65: "rain.png", // "Rain"
  66: "rain.png", // "Rain"
  67: "rain.png", // "Rain"
  71: "snow.png", // "Snow"
  73: "snow.png", // "Snow"
  75: "snow.png", // "Snow"
  80: "rain.png", //"Rain showers"
  81: "rain.png", //"Rain showers"
  82: "rain.png", //"Rain showers"
  85: "snow.png", //"Snow shower" TODO 後でアイコン変更
  86: "snow.png", //"Snow shower" TODO 後でアイコン変更
  95: "Thunderstorm.png", // "Thunderstorm"
  96: "Thunderstorm.png", // "Thunderstorm"
  99: "Thunderstorm.png", // "Thunderstorm"
};

// 画面が読み込まれたら実行
document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    //APIから天気情報を取得する
    const lat = localStorage.getItem("latitude");
    const long = localStorage.getItem("longitude");
    const WeatherInfo = await getWeather(lat, long);

    //HTMLの要素を取得する
    const hourlyTimeforcastElements = document.querySelectorAll(
      ".js-hourlyTimeForecast"
    );
    const dayOfWeekDom = document.querySelectorAll(".js-sevendayForecast");
    const timeWeatherImageElements = document.querySelectorAll(
      ".js-timeWeatherImage"
    );
    const sevendayWeatherImages = document.querySelectorAll(
      ".js-sevendayWeatherImage"
    );
    const hourlyTemperatureElement = document.getElementsByClassName(
      "js-getHourlyTemperature"
    )[0];
    const hourlyTempCelsiusElements = document.querySelectorAll(
      ".js-hourlyTempCelsius"
    );
    const sevendayPrecipitationElements = document.querySelectorAll(
      ".js-sevendayPrecipitation"
    );
    const tempCelsiusElements = document.querySelectorAll(
      ".js-sevendayCelsius"
    );
    const weatherImageElement =
      document.getElementsByClassName("js-weatherImage")[0];

    //一週間の日付を表示する
    //Display 7 days from the current day of the week
    const week = WeatherInfo.daily.time; //APIの日付データ
    const days = getDayOfWeek(week); //日付データをフォーマットする
    dayOfWeekDom.forEach((element, index) => {
      element.innerHTML = days[index];
    });

    //クリックしたらスクロールされ詳細天気情報を表示する
    const listDayInfo = generateWeatherData(WeatherInfo.hourly);
    const rows = document.querySelectorAll(".js-scrollTop");
    const hourlyItems = document.querySelectorAll(".detailed-weather-item");
    //クリックしたときの処理
    rows.forEach((row, index) => {
      row.addEventListener("click", () => {
        //初期化
        hourlyItems.forEach((item) => {
          item.innerHTML = "";
        });
        //スクロール
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        //天気のアイコンを表示する
        const dayInfo = listDayInfo[index];
        for (i = 0; i < 6; i++) {
          //append chil
          hourlyItems[i].innerHTML = `<p><img src="${setWeatherImage(
            dayInfo.weatherCode[i]
          )}" /></p><p>${dayInfo.temperature[i]}°C</p><p>${
            dayInfo.eachTime[i]
          }</p>`;
        }
      });
    });

    // Set today's weather image
    const todayWeather = WeatherInfo.current.weather_code;
    weatherImageElement.src = setWeatherImage(todayWeather);

    // Set images for the next 7 days
    const weatherCodes = WeatherInfo.daily.weather_code;
    weatherCodes.forEach((weatherCode, index) => {
      sevendayWeatherImages[index].src = setWeatherImage(weatherCode);
    });

    // Now -> Current Temperature
    const hourlyTemperature = WeatherInfo.current.temperature_2m;
    hourlyTemperatureElement.textContent = `${hourlyTemperature}°C`;

    //Hourly Forecast
    const currentTime = new Date();
    const hourlyEachTemperature = WeatherInfo.hourly.temperature_2m;
    const hourlyWeatherCodes = WeatherInfo.hourly.weather_code;
    const hourlyTemperatureData = [];
    const hourlyWeatherCodesValues = [];
    const leftTimeValues = [];

    for (let i = 0; i < 5; i++) {
      const futureTime = new Date(currentTime.getTime() + i * 60 * 60 * 1000); // i時間後
      const hourIndex = Math.floor(
        (futureTime.getHours() - currentTime.getHours()) / 1
      ); // 現在の時刻からの経過時間に基づいてindexを計算
      //TODO 調整後実際は＋１時間  時差13時間を加算（Nowは含まないため時差＋１時間追加）
      futureTime.setHours(futureTime.getHours() + 14);
      const formattedTime = futureTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      const timeValues = formattedTime.split(":"); // コロンで時刻を分割。"◯時"のみを取得。□分削除
      const leftTimeValue = timeValues[0];
      leftTimeValues.push(leftTimeValue);
      //TODO 調整必要かも
      hourlyWeatherCodesValues.push(hourlyWeatherCodes[hourIndex + 2]);
      const hourlyTemperatureValue = hourlyEachTemperature[hourIndex + 2];
      hourlyTemperatureData.push(hourlyTemperatureValue);
    }

    hourlyWeatherCodesValues.forEach((weatherCode, index) => {
      timeWeatherImageElements[index].src = setWeatherImage(weatherCode);
    });

    //Hourly Forecast (Today)・Display Time(Now以降)
    hourlyTimeforcastElements.forEach((hourlyTime, index) => {
      hourlyTime.textContent = `${leftTimeValues[index]}:00 `;
    });

    // Hourly Forecast (Today)・Display Temperature(Now以降)
    hourlyTempCelsiusElements.forEach((hourlyTemperature, index) => {
      hourlyTemperature.textContent = `${hourlyTemperatureData[index]}°C`;
    });

    //temperature(Celsius)
    const temperatureInfo = WeatherInfo.daily.temperature_2m_max;
    temperatureInfo.forEach((temperature, index) => {
      const roundedTemperature = temperature.toFixed(1); // 気温を小数点以下1桁に丸める
      tempCelsiusElements[index].textContent = `${roundedTemperature}°C`;
    });

    //precipitation_probability_max
    const precipitationProbability =
      WeatherInfo.daily.precipitation_probability_max;
    precipitationProbability.forEach((precipitation, index) => {
      sevendayPrecipitationElements[index].textContent = `${precipitation} %`;
    });
  })();
});
