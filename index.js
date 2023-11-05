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
        localTime: json.current.time,
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

function getSunriseSunset(currentWeather, currentDailyWeather, dailyWeather) {
    let currentDaySunrise = new Date(currentDailyWeather.sunrise);
    let currentDaySunset = new Date(currentDailyWeather.sunset);

    if (currentWeather.isDay === 0 && new Date(currentWeather.localTime).getTime() <= currentDaySunrise.getTime()) {         // Утро, темно
        return ['Восход солнца', currentDailyWeather.sunrise.slice(-5), `Заход солнца в: ${currentDailyWeather.sunset.slice(-5)}`];      
    } else if (currentWeather.isDay === 1) {                                                                                 //День, светло
        return ['Заход солнца', currentDailyWeather.sunset.slice(-5), `Восход солнца в: ${dailyWeather[1].sunrise.slice(-5)}`];
    } else if (currentWeather.isDay === 0 && new Date(currentWeather.localTime).getTime() > currentDaySunset.getTime()) {    //Вечер, темно
        return ['Восход солнца', dailyWeather[1].sunrise.slice(-5), `Заход солнца в: ${dailyWeather[1].sunset.slice(-5)}`];
    }
}

function getWindDirection(currentWeather) {
    let direction = Math.round((parseInt(currentWeather.windDirection) / 22.5));

    return direction;
}

function setContentToPage(city, currentHourlyWeather, currentDailyWeather, hourlyWeather, dailyWeather, currentWeather) {
    setText('city', city);
    setText('current_temperature', `${currentWeather.temperature}°`);
    setText('current_condition', `${weatherCodes[currentHourlyWeather.condition].ru}`);
    setText('max', `Макс.: ${currentDailyWeather.maxTemp}°, `);
    setText('min', `Мин.: ${currentDailyWeather.minTemp}°`);

    setHourlyContent(hourlyWeather);
    setText(`hourly-hour-1`, "Сейчас");
    setDailyContent(dailyWeather);
    setText(`daily-day-1`, "Сегодня");

    setText(`uv-number`, (currentHourlyWeather.uv));
    setText(`uv-title`, getUVTitle(currentHourlyWeather.uv));
    setText(`uv-description`, getUVPeriod(hourlyWeather));

    setText('sunset-or-sunrise', getSunriseSunset(currentWeather, currentDailyWeather, dailyWeather)[0])
    setText('first-sun-change', getSunriseSunset(currentWeather, currentDailyWeather, dailyWeather)[1]);
    setText('second-sun-change', getSunriseSunset(currentWeather, currentDailyWeather, dailyWeather)[2]);
    
    setText('wind-speed', `${currentWeather.windSpeed} м/с`);
    setText('wind-direction', `Направление: ${windDirectionCodes[getWindDirection(currentWeather)]}`);
    setText('wind-gusts', `Порывы до: ${currentWeather.windGusts} м/с`);

    setText('apparent-temperature', `${currentWeather.apparentTemperature}°`);
}

function setHourlyContent(hourlyWeather) {
    const currentHourIndex = getCurrentHourIndex(hourlyWeather);
    for (let i = 0; i < 24; i++) {
        
        setText(`hourly-hour-${i + 1}`, hourlyWeather[currentHourIndex + i].localTime.getHours());
        setImg(`hourly-icon-${i + 1}`, weatherCodes[hourlyWeather[currentHourIndex + i].condition].iconDay);
        setText(`hourly-temp-${i + 1}`, `${hourlyWeather[currentHourIndex + i].temperature}°`);
    }
}

function setDailyContent(dailyWeather) {
    for (let i = 0; i < 7; i++) {
        setText(`daily-day-${i + 1}`, dayCodes[dailyWeather[i].localTime.getDay()]);
    }
    for (let i = 0; i < 7; i++) {
        setImg(`daily-icon-${i + 1}`, weatherCodes[dailyWeather[i].condition].iconDay);
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
    0: {
        ru: "Ясно",
        iconDay: "./img/clear.png",
        iconNight: "./img/clear-night.png",
    },
    1: {
        ru: "Преимущественно ясно", 
        iconDay: "./img/partly-cloudy.png",
        iconNight: "./img/partly-cloudy-night.png,"
    },
    2: {
        ru: "Частично облачно", 
        iconDay: "./img/partly-cloudy.png",
        iconNight: "./img/partly-cloudy-night.png,"
    },
    3: {
        ru: "Пасмурно", 
        iconDay: "./img/partly-cloudy.png",
        iconNight: "./img/partly-cloudy-night.png,"
    },
    45: {
        ru: "Туман",
        iconDay: "./img/fog.png",
        iconNight: "./img/fog.png",
    },
    48: {
        ru: "Туман c изморосью",
        iconDay: "./img/fog.png",
        iconNight: "./img/fog.png",
    },
    51: {
        ru: "Слабая морось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
    },
    53: {
        ru: "Умеренная морось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
    },
    55: {
        ru: "Cильная морось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
    },
    56: {
        ru: "Слабая изморось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
    },
    57: {
        ru: "Сильная изморось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
    },
    61: {
        ru: "Слабый дождь",
        iconDay: "./img/rain.png",
        iconNight: "./img/rain.png",
    },
    63: {
    ru: "Умеренный дождь",
        iconDay: "./img/rain.png",
        iconNight: "./img/rain.png",
    },
    65: {
        ru: "Сильный дождь",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
    },
    66: {
        ru: "Слабый мокрый снег",
        iconDay: "./img/snow-rain.png",
        iconNight: "./img/snow-rain.png",
    },
    67: {
        ru: "Сильный мокрый снег",
        iconDay: "./img/snow-rain.png",
        iconNight: "./img/snow-rain.png",
    },
    71: {
        ru: "Слабый снегопад",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
    },
    73: {
        ru: "Умеренный снегопад",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
    },
    75: {
        ru: "Сильный снегопад",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
    },
    77: {
        ru: "Снег",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
    },
    80: {
        ru: "Ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png", 
    },
    81: {
        ru: "Ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
    },
    82: {
        ru: "Cильный ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
    },
    85: {
        ru: "Метель",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
    },
    86: {
        ru: "Cильный метель",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
    },
    95: {
        ru: "Гроза",
        iconDay: "./img/thunder.png",
        iconNight: "./img/thunder.png",
    },
    96: {
        ru: "Гроза с градом",
        iconDay: "./img/thunder.png",
        iconNight: "./img/thunder.png",
    },
    99: {
        ru: "Гроза с сильным градом",
        iconDay: "./img/thunder.png",
        iconNight: "./img/thunder.png",
    },
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