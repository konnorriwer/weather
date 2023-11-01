async function getForecast() {
    const json = await getForecastFromAPI();
    const city = getCityName(json);
    const hourlyWeather = parseHourlyWeather(json);
    const currentWeather = getCurrentWeather(hourlyWeather);
    const dailyWeather = parseDailyWeather(json);
    const currentDailyWeather = getCurrentDailyWeather(dailyWeather);
    
    setContentToPage(city, currentWeather, currentDailyWeather, hourlyWeather, dailyWeather);
}
async function getForecastFromAPI() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&hourly=temperature_2m,weathercode,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto";
    const result = await fetch(url);
    const json = await result.json();
    return json;
}

function getCityName(json) {
    const timezone = (json.timezone).split('/');
    const city = timezone[1];
    return city;
}

function parseHourlyWeather(json) {   
    let result = []; 
    
    for (let i = 0; i < (json.hourly.time).length; i++) {
        result.push({
            localTime: getActualLocalDate(json, json.hourly.time[i]),
            temperature: Math.round(parseFloat(json.hourly.temperature_2m[i])),
            condition: json.hourly.weathercode[i],
            uwu: Math.round(parseFloat(json.hourly.uv_index[i]))
        });
    };

    return result;
}

function parseDailyWeather(json) {
    let result = [];

    for (let i = 0; i < (json.daily.time).length; i++) {
        result.push({
            localTime: new Date(json.daily.time[i]),
            condition: json.daily.weathercode[i],
            maxTemp: Math.round(parseFloat(json.daily.temperature_2m_max[i])),
            minTemp: Math.round(parseFloat(json.daily.temperature_2m_min[i]))
        });
    };

    return result;
}

function getActualLocalDate(json, time) {
    const targetPlaceDate = new Date(time);
    const utcTargetPlaceOffsetSeconds = parseInt(json.utc_offset_seconds);
    const UTCDate = new Date(targetPlaceDate.setSeconds(targetPlaceDate.getSeconds() - utcTargetPlaceOffsetSeconds));
    const localUtcOffsetMinutes = new Date().getTimezoneOffset();
    return new Date (UTCDate.setMinutes(UTCDate.getMinutes() - localUtcOffsetMinutes));
}

function getCurrentWeather(hourlyWeather) {
    const index = getCurrentHourIndex(hourlyWeather);

    return hourlyWeather[index];
}

function getCurrentHourIndex(hourlyWeather) {
    let now = new Date().getHours();

    for (let i = 0; i < hourlyWeather.length; i++) {
        if (now === hourlyWeather[i].localTime.getHours()) {
            return i;
        }
    }
}



function getCurrentDailyWeather(dailyWeather) { 
    return dailyWeather[0];
}

// Мозно показать на неделю

function setContentToPage(city, currentHourlyWeather, currentDailyWeather, hourlyWeather, dailyWeather) {
    setText('city', city);
    setText('current_temp', `${currentHourlyWeather.temperature}°`);
    setText('current_condition', `${weatherCodes[currentHourlyWeather.condition]}`);
    setText('max', `Макс.: ${currentDailyWeather.maxTemp}°, `);
    setText('min', `Мин.: ${currentDailyWeather.minTemp}°`);
    setHourlyContent(hourlyWeather);
    setText(`hourly-hour-1`, "Сейчас");
    setDailyContent(dailyWeather);
    setText(`daily-day-1`, "Сегодня");
    setText(`uv-number`, (currentHourlyWeather.uwu));
    setText(`uv-title`, getUwuTitle(currentHourlyWeather.uwu));
    setText(`uv-description`, getUwuPeriod(hourlyWeather));
}

function setHourlyContent(hourlyWeather) {
    const currentHourIndex = getCurrentHourIndex(hourlyWeather);
    for (let i = 0; i < 24; i++) {
        
        setText(`hourly-hour-${i + 1}`, hourlyWeather[currentHourIndex + i].localTime.getHours());
        setImg(`hourly-icon-${i + 1}`, weatherCodesImg[hourlyWeather[currentHourIndex + i].condition]);
        setText(`hourly-temp-${i + 1}`, `${hourlyWeather[currentHourIndex + i].temperature}°`);
    }
}

function setDailyContent(dailyWeather) {
    for (let i = 0; i < 7; i++) {
        setText(`daily-day-${i + 1}`, (dailyWeather[i].localTime.getDay()) + 1);
    }
    for (let i = 0; i < 7; i++) {
        setImg(`daily-icon-${i + 1}`, weatherCodesImg[dailyWeather[i].condition]);
    }
    for (let i = 0; i < 7; i++) {
        setText(`daily-min-temp-${i + 1}`, `${dailyWeather[i].minTemp}°`);
    }
    for (let i = 0; i < 7; i++) {
        setText(`daily-max-temp-${i + 1}`, `${dailyWeather[i].maxTemp}°`);
    }
}

// setImg(`hourly-icon-${i + 1}`, weatherCodesImg[hourlyWeather[currentHourIndex + i].condition]);
// setText(`hourly-temp-${i + 1}`, `${hourlyWeather[currentHourIndex + i].temperature}°`);

function setText(id, text) {
    document.getElementById(id).innerText = text;
}

function setImg(id, img) {
    document.getElementById(id).setAttribute('src', img);
}

function getUwuTitle(uwu) {
    if (uwu < 3) {
        return "Низкий";
    } else if (uwu < 6) {
        return "Умеренный";
    } else if (uwu < 8) {
        return "Высокий";
    } else if (uwu < 11) {
        return "Очень высокий";
    }

    return "Крайне высокий";
}

function getUwuPeriod(hourlyWeather) {
    let uwuStart = 0;
    let uwuEnd = 0;
 
    for (let i = 0; i < 24; i++) {
        if (hourlyWeather[i].uwu >= 3) {
            uwuStart = hourlyWeather[i].localTime.getHours();
            break;
        }
    };
    for (let j = 23; j >= 0; j--) {
        if (hourlyWeather[j].uwu >= 3) {
            uwuEnd = hourlyWeather[j].localTime.getHours();
            break;
        }
    }
    if (new Date().getHours() > uwuEnd) {
        return `Останется низким до конца дня`;
    }
    
    return `Защищайтесь от солнца с ${uwuStart}:00 до ${uwuEnd}:00`;
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
    55: "Сильная изморось",
    80: "Небольшой ливень"
}

const weatherCodesImg = {
    0: './img/clear.png',
    1: './img/partly-cloudy.png',
    2: './img/partly-cloudy.png',
    3: './img/cloudy.png',
    45: './img/fog.png',
    48: './img/fog.png',
    51: './img/snow.png',
    53: './img/snow.png',
    55: './img/snow.png',
    80: './img/heavy-rain.png'
}

getForecast();

//Защита УВ, если время защиты прошло, не писать текст про защиту
// Мозно показать на неделю прогноз