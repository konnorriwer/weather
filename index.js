async function getForecast() {
    const json = await getForecastFromAPI();
    const city = getCityName(json);
    const hourlyWeather = parseHourlyWeather(json);
    const currentHourlyWeather = getCurrentHourlyWeather(hourlyWeather);
    const dailyWeather = parseDailyWeather(json);
    const currentDailyWeather = getCurrentDailyWeather(dailyWeather);

    setContentToPage(city, currentHourlyWeather, currentDailyWeather, hourlyWeather);
}

async function getForecastFromAPI() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&hourly=temperature_2m,weathercode,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto";
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
            temperature: Math.round(parseFloat(json.hourly.temperature_2m[i])),
            condition: json.hourly.weathercode[i],
            uwu: Math.round(parseFloat(json.hourly.uv_index[i]))
        });

        localTime.setHours(localTime.getHours() + 1);    
    };

    return result;
}

function getFirstLocalHourlyDate(json) {
    const targetDate = new Date(json.hourly.time[0]);
    const utcOffsetSeconds = parseInt(json.utc_offset_seconds);
    const targetUTCDate = new Date(targetDate.setSeconds(targetDate.getSeconds() - utcOffsetSeconds));
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
            maxTemp: Math.round(parseFloat(json.daily.temperature_2m_max[i])),
            minTemp: Math.round(parseFloat(json.daily.temperature_2m_min[i]))
        });
    };

    return result;
}

function getCurrentDailyWeather(dailyWeather) {
    return dailyWeather[0];
}


function setContentToPage(city, currentHourlyWeather, currentDailyWeather, hourlyWeather) {
    setText('city', city);
    setText('current_temp', `${currentHourlyWeather.temperature}°`);
    setText('current_condition', `${weatherCodes[currentHourlyWeather.condition]}`);
    setText('max', `Макс.: ${currentDailyWeather.maxTemp}°, `);
    setText('min', `Мин.: ${currentDailyWeather.minTemp}°`);
    setHourlyContent(hourlyWeather);
    setText(`hourly-hour-1`, "Сейчас");
    setText(`uv-number`, (currentHourlyWeather.uwu));
    setText(`uv-title`, getUwuTitle(currentHourlyWeather.uwu));
    setText(`uv-description`, getUwuPeriod(hourlyWeather));
}

function setHourlyContent(hourlyWeather) {
    const currentHourIndex = getCurrentHourIndex(hourlyWeather);
    for (let i = 0; i < 24; i++) {
        
        setText(`hourly-hour-${i + 1}`, hourlyWeather[currentHourIndex + i].localTime.getHours());
        setImg(`hourly-icon-${i + 1}`, weatherCodesImg[hourlyWeather[currentHourIndex + i].condition]);
        setText(`hourly-temp-${i + 1}`, hourlyWeather[currentHourIndex + i].temperature);
    }
}

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
