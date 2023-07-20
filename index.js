async function getForecast() {
    const json = await getForecastFromAPI();
    const city = getCityName(json);
    const hourlyWeather = parseHourlyWeather(json);
    const currentHourlyWeather = getCurrentHourlyWeather(hourlyWeather);
    const dailyWeather = parseDailyWeather(json);
    const currentDailyWeather = getCurrentDailyWeather(dailyWeather);

    setContentToPage(city, currentHourlyWeather, currentDailyWeather);
}

async function getForecastFromAPI() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto";
    const result = await fetch(url);
    const json = await result.json();
    return json;
}

function getNowWithHoursOnly() {
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

function parseHourlyWeather(json) {   
    let result = []; 
    let localTime = getFirstLocalHourlyDate(json);

    for (let i = 0; i < (json.hourly.time).length; i++) {
        result.push({
            localTime: structuredClone(localTime),
            temperature: json.hourly.temperature_2m[i],
            condition: json.hourly.weathercode[i],
        });

        localTime.setHours(localTime.getHours() + 1);    
    };

    return result;
}

function getFirstLocalHourlyDate(json) {
    const targetDate = new Date(json.hourly.time[0]);
    const utcOffsetHours = parseInt(json.timezone_abbreviation);
    const targetUTCDate = new Date(targetDate.setHours(targetDate.getHours() - utcOffsetHours));
    const localTimezoneOffset = new Date().getTimezoneOffset();
    return new Date (targetUTCDate.setMinutes(targetUTCDate.getMinutes() - localTimezoneOffset));
}

function getCurrentHourlyWeather(hourlyWeather) {
    const index = getCurrentHourIndex(hourlyWeather);

    return hourlyWeather[index];
}

function getCurrentHourIndex(hourlyWeather) {
    let now = getNowWithHoursOnly();

    for (let i = 0; i < hourlyWeather.length; i++) {
        if (now.getTime() === hourlyWeather[i].localTime.getTime()) {
            return i;
        }
    }
}

function parseDailyWeather(json) {
    let result = [];

    for (let i = 0; i < (json.daily.time).length; i++) {
        result.push({
            localTime: new Date(json.daily.time[i]),
            condition: json.daily.weathercode[i],
            maxTemp: json.daily.temperature_2m_max[i],
            minTemp: json.daily.temperature_2m_min[i],
        });
    };

    return result;
}

function getCurrentDailyWeather(dailyWeather) {
    return dailyWeather[0];
}

function setContentToPage(city, currentHourlyWeather, currentDailyWeather) {
    setText('city', city);
    setText('current_temp', `${Math.round(parseFloat(currentHourlyWeather.temperature))}°`);
    setText('current_condition', `${weatherCodes[currentHourlyWeather.condition]}`);
    setText('max', `Макс.: ${Math.round(parseFloat(currentDailyWeather.maxTemp))}°, `);
    setText('min', `Мин.: ${Math.round(parseFloat(currentDailyWeather.minTemp))}°`);
}

function setText(id, text) {
    document.getElementById(id).innerText = text;
}

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

getForecast();
