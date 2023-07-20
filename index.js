async function getForecast() {

    const json = await getForecastFromAPI();
    let currentLocalDateZeroMinutes = getDateWithHoursOnly();
    let city = getCityName(json);
    let localDateWeatherAndTemp = [[], (json.hourly.temperature_2m), [], []]; //Дата, темпа, час, погода
    let targetLocalDate = getTargetLocalDate(json);

    // Ставим даты, темпу, часы и погоду в массив
    for (let i = 0; i < (json.hourly.time).length; i++) {
        localDateWeatherAndTemp[0][i] = targetLocalDate;
        targetLocalDate = structuredClone(targetLocalDate);
        localDateWeatherAndTemp[2][i] = targetLocalDate.getHours();
        localDateWeatherAndTemp[3][i] = json.hourly.weathercode[i];
        targetLocalDate.setHours(targetLocalDate.getHours() + 1);    
    };

    let currentTemperature = '';
    let currentWeatherCondition = '';
    for (let j = 0; j < (localDateWeatherAndTemp[0]).length; j++) {
        if (currentLocalDateZeroMinutes.getTime() === localDateWeatherAndTemp[0][j].getTime()) {
            currentTemperature = localDateWeatherAndTemp[1][j];
            currentWeatherCondition = json.hourly.weathercode[j];
            for (let l = 0; l < 6; l++) {
                // let weatherName = weatherCodes[json.hourly.weathercode[j + l]];
                document.getElementById(`hour${l + 2}`).innerText = `${localDateWeatherAndTemp[2][j + l + 1]}`;
            }
        }
    }

    let maxMinTempArray = [[], json.daily.temperature_2m_max, json.daily.temperature_2m_min];
    let dailyMaxTemp = '';
    let dailyMinTemp = '';
    for (let k = 0; k < (json.daily.time).length; k++) {
        let dailyDate = new Date(json.daily.time[k]);
        maxMinTempArray[0][k] = dailyDate.getDate();
        if (maxMinTempArray[0][k] === currentLocalDateZeroMinutes.getDate()) {
            dailyMaxTemp = maxMinTempArray[1][k];
            dailyMinTemp = maxMinTempArray[2][k];
        }
    }

    setContentToPage();

}

async function getForecastFromAPI() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto";
    const result = await fetch(url);
    const json = await result.json();
    return json;
}

function getDateWithHoursOnly() {
    let date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function getCityName(json) {
    const timezone = (json.timezone).split('/');
    const city = timezone[1];
    return city;
}

function getTargetLocalDate(json) {
    const targetDate = new Date(json.hourly.time[0]);
    const utcOffsetHours = parseInt(json.timezone_abbreviation);
    const targetUTCDate = new Date(targetDate.setHours(targetDate.getHours() - utcOffsetHours));
    const localTimezoneOffset = new Date().getTimezoneOffset();
    return new Date (targetUTCDate.setMinutes(targetUTCDate.getMinutes() - localTimezoneOffset));
}

function setContentToPage() {
    document.getElementById('city').innerText = `${city}`;
    document.getElementById('current_temp').innerText = `${Math.floor(parseFloat(dailyMaxTemp))}°`;
    document.getElementById('current_condition').innerText = `${weatherCodes[currentWeatherCondition]}`;
    document.getElementById('max').innerText = `Макс.: ${Math.round(parseFloat(currentTemperature))}°, `;
    document.getElementById('min').innerText = `Мин.: ${Math.round(parseFloat(dailyMinTemp))}°`;
}

getForecast();

const weatherCodes = {
    0: "Ясно",
    1: "Преимущественно ясно",
    2: "Частично облачно",
    3: "Пасмурно",
    45: "Туман",
    48: "Туман с изморосью",
    51: "Слабая изморось",
    53: "Умеренная изморось",
    55: "Сильная изморось"
}

const weatherCodesImg = {
    0: '/img/clear.png',
    1: '/img/partly-cloudy.png',
    2: '/img/partly-cloudy.png',
    3: '/img/cloudy.png',
    45: '/img/fog.png',
    48: '/img/fog.png',
    51: '/img/snow.png',
    53: '/img/snow.png',
    55: '/img/snow.png'
}
