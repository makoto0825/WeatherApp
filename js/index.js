import { getWeatherImage } from "./weatherImage.js";

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
      "https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=precipitation_probability,temperature_2m,weather_code&forecast_days=1";
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

  document.addEventListener("DOMContentLoaded", () => {
    (async () => {
      const WeatherInfo = await getWeather();
      const weatherImageElement = document.getElementsByClassName("js-weatherImage")[0];
      
      const todayWeatherCode = WeatherInfo.daily.weather_code[0];
      // 画像のパスを設定
      weatherImageElement.src = getWeatherImage(todayWeatherCode);
      
      //Today's precipitation probability
      const todayPrecipitationElement = document.getElementsByClassName("js-getTodayPrecipitation")[0];
      const todayPrecipitation = WeatherInfo.daily.precipitation_probability_max[0];
      todayPrecipitationElement.innerHTML = `Rainy Percent&nbsp;  ${todayPrecipitation}%`;
      
      // Today's high and low temperatures
      const todayTemperatureElement = document.getElementsByClassName("js-getTodayTemperature")[0];
      const todayTempMax = WeatherInfo.daily.temperature_2m_max[0];
      const todayTempMin = WeatherInfo.daily.temperature_2m_min[0];
      const temperatureText = `${todayTempMax}°C / ${todayTempMin}°C<br> ${((todayTempMax * 9/5) + 32).toFixed(1)}°F / ${((todayTempMin * 9/5) + 32).toFixed(1)}°F`;
      todayTemperatureElement.innerHTML = temperatureText;
      
      //Get value of Morning 6AM, Afternoon 12PM, Evening 18PM, Overnight 24PM
      const hourlyTemperatures = WeatherInfo.hourly.temperature_2m;
      const hourlyWeatherCodes = WeatherInfo.hourly.weather_code;
      const hourlyPrecipitation = WeatherInfo.hourly.precipitation_probability;
      
      const hourlyWeatherCodesValues = [hourlyWeatherCodes[5], hourlyWeatherCodes[11], hourlyWeatherCodes[17], hourlyWeatherCodes[23]];
      const hourlyPrecipitationValues = [hourlyPrecipitation[5], hourlyPrecipitation[11], hourlyPrecipitation[17], hourlyPrecipitation[23]];
      const temperatureValues = [hourlyTemperatures[5], hourlyTemperatures[11], hourlyTemperatures[17], hourlyTemperatures[23]];
      const timesOfDay = ["Morning", "Afternoon", "Evening", "Overnight"];
      const timeOfDayElements = document.querySelectorAll(".js-timeOfDay");
      const tempCelsiusElements = document.querySelectorAll(".js-tempCelsius");
      const tempFahrenheitElements = document.querySelectorAll(".js-tempFahrenheit");
      const timeWeatherImageElements = document.querySelectorAll(".js-timeWeatherImage");
      const timePrecipitationElements = document.querySelectorAll(".js-timePrecipitation");
      
      const convertToFahrenheit = (celsius) => {
        return (celsius * 9/5) + 32;
      };

      timesOfDay.forEach((time, index) => {
        timeOfDayElements[index].textContent = time;
      });
      
      tempCelsiusElements.forEach((element, index) => {
        element.textContent = `${temperatureValues[index]}°C`;
      });

      tempFahrenheitElements.forEach((element, index) => {
        const fahrenheitValue = convertToFahrenheit(temperatureValues[index]);
        element.textContent = `${fahrenheitValue.toFixed(1)}°F`;
      })

      hourlyWeatherCodesValues.forEach((weatherCode, index) => {
        timeWeatherImageElements[index].src = getWeatherImage(weatherCode);;
      });

      hourlyPrecipitationValues.forEach((precipitation, index) => {
        timePrecipitationElements[index].textContent = `${precipitation} %`
      });

    })();
  });
