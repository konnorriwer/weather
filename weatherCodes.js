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
        fallout: "дождь",
    },
    53: {
        ru: "Умеренная морось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
    },
    55: {
        ru: "Cильная морось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
    },
    56: {
        ru: "Слабая изморось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
    },
    57: {
        ru: "Сильная изморось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
    },
    61: {
        ru: "Слабый дождь",
        iconDay: "./img/rain.png",
        iconNight: "./img/rain.png",
        fallout: "дождь",
    },
    63: {
    ru: "Умеренный дождь",
        iconDay: "./img/rain.png",
        iconNight: "./img/rain.png",
        fallout: "дождь",
    },
    65: {
        ru: "Сильный дождь",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
        fallout: "дождь",
    },
    66: {
        ru: "Слабый мокрый снег",
        iconDay: "./img/snow-rain.png",
        iconNight: "./img/snow-rain.png",
        fallout: "снег",
    },
    67: {
        ru: "Сильный мокрый снег",
        iconDay: "./img/snow-rain.png",
        iconNight: "./img/snow-rain.png",
        fallout: "снег",
    },
    71: {
        ru: "Слабый снегопад",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
        fallout: "снег",
    },
    73: {
        ru: "Умеренный снегопад",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
        fallout: "снег",
    },
    75: {
        ru: "Сильный снегопад",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
        fallout: "снег",
    },
    77: {
        ru: "Снег",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
        fallout: "снег",
    },
    80: {
        ru: "Ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png", 
        fallout: "дождь",
    },
    81: {
        ru: "Ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
        fallout: "дождь",
    },
    82: {
        ru: "Cильный ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
        fallout: "дождь",
    },
    85: {
        ru: "Метель",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
        fallout: "снег",
    },
    86: {
        ru: "Cильный метель",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
        fallout: "снег",
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
        fallout: "град",
    },
    99: {
        ru: "Гроза с сильным градом",
        iconDay: "./img/thunder.png",
        iconNight: "./img/thunder.png",
        fallout: "град",
    },
}