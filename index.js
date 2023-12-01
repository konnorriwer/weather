let latitude = 43.25667;
let longitude = 76.92861;

if (localStorage.getItem('latitude') && localStorage.getItem('longitude')) {
    latitude = localStorage.getItem('latitude');
    longitude = localStorage.getItem('longitude');
    city = localStorage.getItem('city');
}

async function getForecast(latitude, longitude) {
    const json = await getForecastFromAPI(latitude, longitude);
    
    const city = localStorage.getItem('city');

    const hourlyWeather = parseHourlyWeather(json);
    const currentHourlyWeather = getCurrentHourlyWeather(hourlyWeather);
    const dailyWeather = parseDailyWeather(json);
    const currentDailyWeather = getCurrentDailyWeather(dailyWeather);
    const currentWeather = parseCurrentWeather(json);
    
    setContentToPage(city, currentHourlyWeather, currentDailyWeather, hourlyWeather, dailyWeather, currentWeather);
}

async function getForecastFromAPI(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,precipitation,weathercode,surface_pressure,windspeed_10m,winddirection_10m,windgusts_10m&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,visibility,windspeed_10m,winddirection_10m,windgusts_10m,uv_index,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&windspeed_unit=ms&timezone=auto`;
    const result = await fetch(url);
    const json = await result.json();
    return json;
}

async function getCityFromAPI() {
    const city = document.getElementById("input").value;
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru&format=json`;
    const result = await fetch(url);
    const json = await result.json();
    const cityName = json.results[0].name;
    const latitude = json.results[0].latitude;
    const longitude = json.results[0].longitude;
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('city', cityName);
    console.log(json);
    await getForecast(latitude, longitude);
}

function parseHourlyWeather(json) {   
    let result = []; 
    
    for (let i = 0; i < (json.hourly.time).length; i++) {
        result.push({
            localTime: getActualLocalDate(json, json.hourly.time[i]),
            temperature: Math.round(parseFloat(json.hourly.temperature_2m[i])),
            condition: json.hourly.weathercode[i],
            uv: Math.round(parseFloat(json.hourly.uv_index[i])),
            visibility: (Math.round(parseFloat(json.hourly.visibility)) / 1000),
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
            sunrise: getActualLocalDate(json, json.daily.sunrise[i]),
            sunset: getActualLocalDate(json, json.daily.sunset[i]),
            precipitation: json.daily.precipitation_sum[i],
        });
    };

    return result;
}

function parseCurrentWeather(json) {
    let result = {
        localTime: json.current.time,
        temperature: Math.round(parseFloat(json.current.temperature_2m)),
        apparentTemperature: Math.round(parseFloat(json.current.apparent_temperature)),        
        humidity: json.current.relativehumidity_2m,
        pressure: Math.round(json.current.surface_pressure*100/133.3),
        windSpeed: Math.round(json.current.windspeed_10m),
        windDirection: json.current.winddirection_10m,
        windGusts: Math.round(json.current.windgusts_10m),
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
    let currentDaySunrise = currentDailyWeather.sunrise;
    let currentDaySunset = currentDailyWeather.sunset;

    if (currentWeather.isDay === 0 && new Date(currentWeather.localTime).getTime() <= currentDaySunrise.getTime()) {         // Утро, темно
        return ['Восход', currentDailyWeather.sunrise.toTimeString().slice(0, 5), `Заход в: ${currentDailyWeather.sunset.toTimeString().slice(0, 5)}`];      
    } else if (currentWeather.isDay === 1) {                                                                                 //День, светло
        return ['Заход', currentDailyWeather.sunset.toTimeString().slice(0, 5), `Восход в: ${dailyWeather[1].sunrise.toTimeString().slice(0, 5)}`];
    } else if (currentWeather.isDay === 0 && new Date(currentWeather.localTime).getTime() > currentDaySunset.getTime()) {    //Вечер, темно
        return ['Восход', dailyWeather[1].sunrise.toTimeString().slice(0, 5), `Заход в: ${dailyWeather[1].sunset.toTimeString().slice(0, 5)}`];
    }
}

function getWindDirection(currentWeather) {
    let direction = Math.round((parseInt(currentWeather.windDirection) / 22.5));
    console.log(direction);
    return direction;
}

function getTemperatureDifference(currentWeather) {
    if (currentWeather.apparentTemperature > currentWeather.temperature) {
        return 'Ощущается теплее';
    } else if (currentWeather.apparentTemperature < currentWeather.temperature) {
        return 'Ощущается холоднее';
    } else {
        return 'Совпадает с фактической';
    }
}

function getVisibilityTitle(currentHourlyWeather) {
    for (let i = 0; i < visibilityTitles.length; i++) {
        if (currentHourlyWeather.visibility <= visibilityTitles[i].max) {
            return visibilityTitles[i].title;
        }
    }
    return 'Идеальная видимость';
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
    setText('actual-temperature', `Факт.: ${currentWeather.temperature}°`);
    setText('temperature-difference', getTemperatureDifference(currentWeather));

    setText('precipitation-sum', `${Math.round(parseFloat(currentDailyWeather.precipitation))} мм`);
    setText(`precipitation-forecast`, getFalloutDescription(hourlyWeather, dailyWeather));

    setText('visibility-km', `${currentHourlyWeather.visibility} км`);
    setText('visibility-title', getVisibilityTitle(currentHourlyWeather));

    setText('humidity-percentage', `${currentWeather.humidity} %`);

    setText('pressure', `${currentWeather.pressure} мм рт. ст.`);

    const weathercode = currentHourlyWeather.condition;
    let backgroundImage;
    if (currentWeather.isDay) {
        backgroundImage = weatherCodes[weathercode].backgroundDay;
        document.documentElement.className = '';
    } else {
        backgroundImage = weatherCodes[weathercode].backgroundNight;
        document.documentElement.className = 'night';
    }
    document.documentElement.style.backgroundImage = `url('${backgroundImage}')`;
    
    
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
        let options = { weekday: "short" };
        
        setText(`daily-day-${i + 1}`, (new Intl.DateTimeFormat("ru-RU", options).format(dailyWeather[i].localTime)).toUpperCase());
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

function getFalloutDescription(hourlyWeather, dailyWeather) {
    let start = 0;
    let end = 0;
    let fallout;

    for (let i = 0; i < 24; i++) {
        const weathercode = hourlyWeather[i].condition;
        const hourlyFallout = weatherCodes[weathercode].fallout;
        if (hourlyFallout) {
            start = hourlyWeather[i].localTime.getHours();
            fallout = hourlyFallout;
            break;
        }
    };
    for (let j = 23; j >= 0; j--) {
        const weathercode = hourlyWeather[j].condition;
        const hourlyFallout = weatherCodes[weathercode].fallout;
        if (hourlyFallout) {
            end = hourlyWeather[j].localTime.getHours();
            break;
        }
    }

    if (fallout) {
        return `Ожидается ${fallout} с ${start}:00 по ${end}:00`;
    }
    
    let day;
    let options = { weekday: "long" };

    for (let i = 0; i < 7; i++) {
        const weathercode = dailyWeather[i].condition;
        const dailyFallout = weatherCodes[weathercode].fallout;
        if (dailyFallout) {
            fallout = dailyFallout;
            day = new Intl.DateTimeFormat("ru-RU", options).format(dailyWeather[i].localTime);
        }
    }
    if (fallout) {
        return `Ожидается ${fallout} в ${day}`;
    }
    return `В ближайшую неделю осадков не ожидается`;
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

getForecast(latitude, longitude);
