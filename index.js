async function getForecast() {
    const json = await getForecastFromAPI();
    const city = getCityName(json);
    const hourlyWeather = parseHourlyWeather(json);
    const currentHourlyWeather = getCurrentHourlyWeather(hourlyWeather);
    const dailyWeather = parseDailyWeather(json);
    const currentDailyWeather = getCurrentDailyWeather(dailyWeather);
    const currentWeather = parseCurrentWeather(json);
    
    setContentToPage(city, currentHourlyWeather, currentDailyWeather, hourlyWeather, dailyWeather, currentWeather);
}
async function getForecastFromAPI() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,precipitation,weathercode,surface_pressure,windspeed_10m,winddirection_10m,windgusts_10m&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,visibility,windspeed_10m,winddirection_10m,windgusts_10m,uv_index,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&windspeed_unit=ms&timezone=auto";
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
            uv: Math.round(parseFloat(json.hourly.uv_index[i]))
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
            minTemp: Math.round(parseFloat(json.daily.temperature_2m_min[i])),
            sunrise: json.daily.sunrise[i],
            sunset: json.daily.sunset[i],
        });
    };

    return result;
}

function parseCurrentWeather(json) {
    let result = {
        temperature: Math.round(parseFloat(json.current.temperature_2m)),
        apparentTemperature: Math.round(parseFloat(json.current.apparent_temperature)),        
        // humidity: json.current.relativehumidity_2m,
        // pressure: json.current.surface_pressure,
        windSpeed: json.current.windspeed_10m,
        windDirection: json.current.winddirection_10m,
        windGusts: json.current.windgusts_10m,
        isDay: json.current.is_day,
    }

    return result;
}

function getActualLocalDate(json, time) {
    const targetPlaceDate = new Date(time);
    const utcTargetPlaceOffsetSeconds = parseInt(json.utc_offset_seconds);
    const UTCDate = new Date(targetPlaceDate.setSeconds(targetPlaceDate.getSeconds() - utcTargetPlaceOffsetSeconds));
    const localUtcOffsetMinutes = new Date().getTimezoneOffset();
    return new Date (UTCDate.setMinutes(UTCDate.getMinutes() - localUtcOffsetMinutes));
}

function getCurrentHourlyWeather(hourlyWeather) {
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

function getWindDirection(currentWeather) {
    let direction = Math.round((parseInt(currentWeather.windDirection) / 22.5));

    return direction;
}

function setContentToPage(city, currentHourlyWeather, currentDailyWeather, hourlyWeather, dailyWeather, currentWeather) {
    setText('city', city);
    setText('current_temp', `${currentWeather.temperature}°`);
    setText('current_condition', `${weatherCodes[currentHourlyWeather.condition]}`);
    setText('max', `Макс.: ${currentDailyWeather.maxTemp}°, `);
    setText('min', `Мин.: ${currentDailyWeather.minTemp}°`);

    setHourlyContent(hourlyWeather);
    setText(`hourly-hour-1`, "Сейчас");
    setDailyContent(dailyWeather);
    setText(`daily-day-1`, "Сегодня");

    setText(`uv-number`, (currentHourlyWeather.uv));
    setText(`uv-title`, getUVTitle(currentHourlyWeather.uv));
    setText(`uv-description`, getUVPeriod(hourlyWeather));

    setText('sunset', currentDailyWeather.sunrise.slice(-5));
    setText('sunrise', `Восход в ${currentDailyWeather.sunset.slice(-5)}`);
    
    setText('wind-speed', `${currentWeather.windSpeed} м/с`);
    setText('wind-direction', windDirectionCodes[getWindDirection(currentWeather)]);
    setText('wind-gusts', `Порывы до: ${currentWeather.windGusts} м/с`);

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
        setText(`daily-day-${i + 1}`, dayCodes[dailyWeather[i].localTime.getDay()]);
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

function setText(id, text) {
    document.getElementById(id).innerText = text;
}

function setImg(id, img) {
    document.getElementById(id).setAttribute('src', img);
}

function getUVTitle(uv) {
    if (uv < 3) {
        return "Низкий";
    } else if (uv < 6) {
        return "Умеренный";
    } else if (uv < 8) {
        return "Высокий";
    } else if (uv < 11) {
        return "Очень высокий";
    }

    return "Крайне высокий";
}

function getUVPeriod(hourlyWeather) {
    let uvStart = 0;
    let uvEnd = 0;
 
    for (let i = 0; i < 24; i++) {
        if (hourlyWeather[i].uv >= 3) {
            uvStart = hourlyWeather[i].localTime.getHours();
            break;
        }
    };
    for (let j = 23; j >= 0; j--) {
        if (hourlyWeather[j].uv >= 3) {
            uvEnd = hourlyWeather[j].localTime.getHours();
            break;
        }
    }
    if (new Date().getHours() > uvEnd) {
        return `Останется низким до конца дня`;
    }
    
    return `Защищайтесь от солнца с ${uvStart}:00 до ${uvEnd}:00`;
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

const dayCodes = {
    0: 'Вс',
    1: 'Пн',
    2: 'Вт',
    3: 'Ср',
    4: 'Чт',
    5: 'Пт',
    6: 'Сб',
}

const windDirectionCodes = {
    1: 'СВ',
    2: 'СВ',
    3: 'В',
    4: 'В',
    5: 'ЮВ',
    6: 'ЮВ',
    7: 'Ю',
    8: 'Ю',
    9: 'ЮЗ',
    10: 'ЮЗ',
    11: 'З',
    12: 'З',
    13: 'СЗ',
    14: 'СЗ',
    15: 'С',
    16: 'С',
}

getForecast();

//Защита УВ, если время защиты прошло, не писать текст про защиту
// Мозно показать на неделю прогноз