const weatherCodes = {
    0: {
        ru: "Ясно",
        iconDay: "./img/clear.png",
        iconNight: "./img/clear-night.png",
        backgroundDay: "./backgroundImg/dayClear.jpg",
        backgroundNight: "./backgroundImg/nightClear.jpg"
    },
    1: {
        ru: "Преимущественно ясно", 
        iconDay: "./img/partly-cloudy.png",
        iconNight: "./img/partly-cloudy-night.png",
        backgroundDay: "./backgroundImg/dayClear.jpg",
        backgroundNight: "./backgroundImg/nightClear.jpg"
    },
    2: {
        ru: "Частично облачно", 
        iconDay: "./img/partly-cloudy.png",
        iconNight: "./img/partly-cloudy-night.png",
        backgroundDay: "./backgroundImg/dayCloudy.jpg",
        backgroundNight: "./backgroundImg/nightCloudy.jpg"
    },
    3: {
        ru: "Пасмурно", 
        iconDay: "./img/partly-cloudy.png",
        iconNight: "./img/partly-cloudy-night.png",
        backgroundDay: "./backgroundImg/dayCloudy.jpg",
        backgroundNight: "./backgroundImg/nightCloudy.jpg"
    },
    45: {
        ru: "Туман",
        iconDay: "./img/fog.png",
        iconNight: "./img/fog.png",
        backgroundDay: "./backgroundImg/dayFog.jpg",
        backgroundNight: "./backgroundImg/nightFog.jpg"
    },
    48: {
        ru: "Туман c изморосью",
        iconDay: "./img/fog.png",
        iconNight: "./img/fog.png",
        backgroundDay: "./backgroundImg/dayFog.jpg",
        backgroundNight: "./backgroundImg/nightFog.jpg"
    },
    51: {
        ru: "Слабая морось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    53: {
        ru: "Умеренная морось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    55: {
        ru: "Cильная морось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    56: {
        ru: "Слабая изморось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayFrost.jpg",
        backgroundNight: "./backgroundImg/nightFrost.jpg"
    },
    57: {
        ru: "Сильная изморось",
        iconDay: "./img/drizzle.png",
        iconNight: "./img/drizzle-night.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayFrost.jpg",
        backgroundNight: "./backgroundImg/nightFrost.jpg"
    },
    61: {
        ru: "Слабый дождь",
        iconDay: "./img/rain.png",
        iconNight: "./img/rain.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    63: {
    ru: "Умеренный дождь",
        iconDay: "./img/rain.png",
        iconNight: "./img/rain.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    65: {
        ru: "Сильный дождь",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    66: {
        ru: "Слабый мокрый снег",
        iconDay: "./img/snow-rain.png",
        iconNight: "./img/snow-rain.png",
        fallout: "снег",
        backgroundDay: "./backgroundImg/daySnow.jpg",
        backgroundNight: "./backgroundImg/nightSnow.jpg"
    },
    67: {
        ru: "Сильный мокрый снег",
        iconDay: "./img/snow-rain.png",
        iconNight: "./img/snow-rain.png",
        fallout: "снег",
        backgroundDay: "./backgroundImg/daySnow.jpg",
        backgroundNight: "./backgroundImg/nightSnow.jpg"
    },
    71: {
        ru: "Слабый снегопад",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
        fallout: "снег",
        backgroundDay: "./backgroundImg/daySnow.jpg",
        backgroundNight: "./backgroundImg/nightSnow.jpg"
    },
    73: {
        ru: "Умеренный снегопад",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
        fallout: "снег",
        backgroundDay: "./backgroundImg/daySnow.jpg",
        backgroundNight: "./backgroundImg/nightSnow.jpg"
    },
    75: {
        ru: "Сильный снегопад",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
        fallout: "снег",
        backgroundDay: "./backgroundImg/daySnow.jpg",
        backgroundNight: "./backgroundImg/nightSnow.jpg"
    },
    77: {
        ru: "Снег",
        iconDay: "./img/snow.png",
        iconNight: "./img/snow.png",
        fallout: "снег",
        backgroundDay: "./backgroundImg/daySnow.jpg",
        backgroundNight: "./backgroundImg/nightSnow.jpg"
    },
    80: {
        ru: "Ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png", 
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    81: {
        ru: "Ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    82: {
        ru: "Cильный ливень",
        iconDay: "./img/heavy-rain.png",
        iconNight: "./img/heavy-rain.png",
        fallout: "дождь",
        backgroundDay: "./backgroundImg/dayRain.jpg",
        backgroundNight: "./backgroundImg/nightRain.jpg"
    },
    85: {
        ru: "Метель",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
        fallout: "снег",
        backgroundDay: "./backgroundImg/daySnow.jpg",
        backgroundNight: "./backgroundImg/nightSnow.jpg"
    },
    86: {
        ru: "Cильная метель",
        iconDay: "./img/heavy-snow.png",
        iconNight: "./img/heavy-snow.png",
        fallout: "снег",
        backgroundDay: "./backgroundImg/daySnow.jpg",
        backgroundNight: "./backgroundImg/nightSnow.jpg"
    },
    95: {
        ru: "Гроза",
        iconDay: "./img/thunder.png",
        iconNight: "./img/thunder.png",
        backgroundDay: "./backgroundImg/dayThunder.jpg",
        backgroundNight: "./backgroundImg/тшпреThunder.jpg"
    },
    96: {
        ru: "Гроза с градом",
        iconDay: "./img/thunder.png",
        iconNight: "./img/thunder.png",
        fallout: "град",
        backgroundDay: "./backgroundImg/dayThunder.jpg",
        backgroundNight: "./backgroundImg/тшпреThunder.jpg"
    },
    99: {
        ru: "Гроза с сильным градом",
        iconDay: "./img/thunder.png",
        iconNight: "./img/thunder.png",
        fallout: "град",
        backgroundDay: "./backgroundImg/dayThunder.jpg",
        backgroundNight: "./backgroundImg/тшпреThunder.jpg"
    },
}