import { getWeatherImage } from "./weatherImage.js";

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
    "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&current=temperature_2m,weather_code&hourly=precipitation_probability,temperature_2m,weather_code&forecast_days=7&daily=weather_code,temperature_2m_max,precipitation_probability_max,precipitation_hours&timezone=Asia%2FTokyo";
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

//======================================================program start================================================

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
        for (let i = 0; i < 6; i++) {
          //append chil
          hourlyItems[i].innerHTML = `<p><img src="${getWeatherImage(
            dayInfo.weatherCode[i]
          )}" /></p><p>${dayInfo.temperature[i]}°C</p><p>${
            dayInfo.eachTime[i]
          }</p>`;
        }
      });
    });

    // Set today's weather image
    const todayWeather = WeatherInfo.current.weather_code;
    weatherImageElement.src = getWeatherImage(todayWeather);

    // Set images for the next 7 days
    const weatherCodes = WeatherInfo.daily.weather_code;
    weatherCodes.forEach((weatherCode, index) => {
      sevendayWeatherImages[index].src = getWeatherImage(weatherCode);
    });

    // Now -> Current Temperature
    const hourlyTemperature = WeatherInfo.current.temperature_2m;
    hourlyTemperatureElement.textContent = `${hourlyTemperature}°C`;

    //Hourly Forecast
    const currentTime = new Date();
    const NextTime = currentTime.getHours() + 1;
    const hourlyEachTemperature = WeatherInfo.hourly.temperature_2m;
    const hourlyWeatherCodes = WeatherInfo.hourly.weather_code;
    const hourlyTemperatureData = [];
    const hourlyWeatherCodesValues = [];
    const leftTimeValues = [];

    for (let i = 0; i < 5; i++) {
      leftTimeValues.push(NextTime + i);
      // //TODO 調整必要かも
      hourlyWeatherCodesValues.push(hourlyWeatherCodes[NextTime + i]);
      const hourlyTemperatureValue = hourlyEachTemperature[NextTime + i];
      hourlyTemperatureData.push(hourlyTemperatureValue);
    }

    hourlyWeatherCodesValues.forEach((weatherCode, index) => {
      timeWeatherImageElements[index].src = getWeatherImage(weatherCode);
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
