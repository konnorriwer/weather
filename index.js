async function getForecast() {
    const result = await fetch("https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto");
    const json = await result.json();
    
    const utcOffsetHours = parseInt(json.timezone_abbreviation);
    // const currentLocalHours = new Date().getHours();
    // const currentLocalMinutes = new Date().getMinutes();
    // const currentLocalYear = new Date().getFullYear();
    // let currentLocalMonth = new Date().getMonth();
    // let currentLocalDay = new Date().getDate();
    // currentLocalMonth = (currentLocalMonth + 1).toString().padStart(2, '0');
    // currentLocalDay = currentLocalDay.toString().padStart(2, '0');
    // const currentLocalDateZeroMinutes = 
    //     `${currentLocalYear}-${currentLocalMonth}-${currentLocalDay}T${currentLocalHours}:00`;
    let currentLocalDateZeroMinutes = new Date();
    currentLocalDateZeroMinutes.setMinutes(0);
    currentLocalDateZeroMinutes.setSeconds(0);
    currentLocalDateZeroMinutes.setMilliseconds(0);

    let localDateTemp = [[], (json.hourly.temperature_2m)];
    const targetDate = new Date(json.hourly.time[0]);
    const targetUTCDate = new Date(targetDate.setHours(targetDate.getHours() - utcOffsetHours));
    const localTimezoneOffset = new Date().getTimezoneOffset();
    let targetLocalDate = new Date (targetUTCDate.setMinutes(targetUTCDate.getMinutes() - localTimezoneOffset));
    for (let i = 0; i < (json.hourly.time).length; i++) {
        localDateTemp[0][i] = targetLocalDate;
        targetLocalDate = structuredClone(targetLocalDate);
        targetLocalDate.setHours(targetLocalDate.getHours() + 1);    
    };

    let currentTemperature = '';
    for (let j = 0; j < (localDateTemp[0]).length; j++) {
        if (currentLocalDateZeroMinutes.getTime() === localDateTemp[0][j].getTime()) {
            currentTemperature = localDateTemp[1][j];
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
    };
    


    document.getElementById('current_temp').innerText = `${parseInt(dailyMaxTemp)}°`;
    document.getElementById('max').innerText = `Макс.: ${parseInt(currentTemperature)}°`;
    document.getElementById('min').innerText = `Мин.: ${parseInt(dailyMinTemp)}°`;
}
getForecast();