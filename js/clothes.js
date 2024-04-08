//===================Function==============================================
function updateClotheText(todayMaxTemp, gender) {
  const clothImageElement = document.getElementById("js-clothesImg");
  const textElement = document.getElementById("js-text");
  if (todayMaxTemp >= 25) {
    //暑い場合
    clothImageElement.src = `../images/clothes/hot_${gender}.png`;
    textElement.textContent = clothesDescriptions.hot; //テキストを表示する
  } else if (todayMaxTemp >= 15) {
    //適温の場合
    clothImageElement.src = `../images/clothes/warm_${gender}.png`;
    textElement.textContent = clothesDescriptions.warm; //テキストを表示する
  } else if (todayMaxTemp >= 10) {
    //涼しい場合
    clothImageElement.src = `../images/clothes/cool_${gender}.png`;
    textElement.textContent = clothesDescriptions.cool; //テキストを表示する
  } else {
    //寒い場合
    clothImageElement.src = `../images/clothes/cold_${gender}.png`;
    textElement.textContent = clothesDescriptions.cold; //テキストを表示する
  }
}
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
//APIで取得した気温をグローバル変数に設定する関数
const updateTemp = (newTemp) => {
  temperature = newTemp;
};

//===================Program start==============================================
//性別の情報を取得する関数
let gender = "M"; // 初期の性別を設定


// genderの切り替え
document.addEventListener("DOMContentLoaded", () => {
  let temperature; // 気温
  const genderSwitch = document.getElementById("js-genderSwitch");
  genderSwitch.addEventListener("change", () => {
    if (genderSwitch.checked) {
      gender = "F"; // 女性
    } else {
      gender = "M"; // 男性
    }
    updateClotheText(temperature, gender); //
  });
  console.log(updateClotheText(temperature, gender));
});

//現在の日付を表示する
document.addEventListener("DOMContentLoaded", () => {
  const todayDom = document.getElementById("js-getToday");
  todayDom.innerHTML = getToday();
});

//天気のアイコンのオブジェクト
const WeatherIconObj = {
  0: "Clear.png", //"Clear"
  1: "Clear.png", //"Clear"
  2: "Cloudy.png", //"Cloudy"
  3: "Cloudy.png", //"Cloudy"
  45: "fog.png", // "Fog"
  48: "fog.png", // "Fog"
  51: "cloudy-sometimes-rain.png", //"Drizzle"
  53: "cloudy-sometimes-rain.png", //"Drizzle"
  55: "cloudy-sometimes-rain.png", //"Drizzle"
  56: "cloudy-sometimes-rain.png", //"Drizzle"
  57: "cloudy-sometimes-rain.png", //"Drizzle"
  61: "rain.png", // "Rain"
  63: "rain.png", // "Rain"
  65: "rain.png", // "Rain"
  66: "rain.png", // "Rain"
  67: "rain.png", // "Rain"
  71: "snow.png", // "Snow"
  73: "snow.png", // "Snow"
  75: "snow.png", // "Snow"
  80: "Rain showers", //"Rain showers"
  81: "Rain showers", //"Rain showers"
  82: "Rain showers", //"Rain showers"
  85: "snow.png", //"Snow shower" TODO 後でアイコン変更
  86: "snow.png", //"Snow shower" TODO 後でアイコン変更
  95: "Thunderstorm.png", // "Thunderstorm"
  96: "Thunderstorm.png", // "Thunderstorm"
  99: "Thunderstorm.png", // "Thunderstorm"
};

// 温度別の服装の文章のオブジェクト
const clothesDescriptions = {
  hot: "Today's temperature is expected to make you sweat during the day. Therefore, we recommend light and breathable clothing. Items such as moisture-wicking short-sleeve T-shirts, sleeveless dresses, and cool-feeling cotton shorts are recommended.",
  warm: "Today's weather is neither hot nor cold, but rather cool and pleasant. We suggest wearing lightweight long-sleeve shirts, lightweight jackets, denim pants, or chino pants. ",
  cool: "Today's weather will be chilly. On such days, layering with sweaters, jackets, or cardigans is recommended to achieve both warmth and ease of movement.",
  cold: "Today will be a cold day where a thick jacket is necessary. On days like this, you'll need heavy coats, down jackets, thick sweaters, or fleece. It's also good to have scarves and gloves.",
};

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const WeatherInfo = await getWeather();
    const todayWeather = WeatherInfo.daily.weather_code[0];
    const todayMaxTemp = WeatherInfo.daily.temperature_2m_max[0];
    // 外部変数を更新する
    updateTemp(todayMaxTemp);

    //天気のアイコン画像を表示する
    const weatherImageName = WeatherIconObj[todayWeather];
    const weatherImageElement = document.getElementById("js-weatherImage");
    weatherImageElement.src = `../images/weatherIcon/${weatherImageName}.png`;
    updateClotheText(todayMaxTemp, gender); // 服の画像を更新
  })();
});
