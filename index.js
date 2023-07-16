async function getForecast() {
    const result = await fetch("https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto");
    const json = await result.json();
    const currentHours = new Date().getHours();
    // const currentMinutes = new Date().getMinutes();

        // Доделать перенос часов, дня, месяца, года
    // const timeDiff = parseInt(json.timezone_abbreviation);
    // let currentLocalHours = currentUTCHours + timeDiff;
    // let currentLocalYear = new Date().getFullYear();
    // let currentLocalMonth = new Date().getMonth();
    // let currentLocalDay = new Date().getDay();
    // if (currentLocalHours >= 24) {
    //     currentLocalHours -= 24;
    //     currentLocalDay.setDay(currentLocalDay + 1);
    //     if 
    // }

    const currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let currentDay = new Date().getDate();
    currentMonth = (currentMonth + 1).toString().padStart(2, '0');
    currentDay = currentDay.toString().padStart(2, '0');
    const currentDate = 
        `${currentYear}-${currentMonth}-${currentDay}T${currentHours}:00`;    
    
    let currentTemperature = '';
    for (let i = 0; i <= (json.hourly.time).length; i++) {
        if (currentDate === json.hourly.time[i]) {
            currentTemperature = json.hourly.temperature_2m[i];
        }
    }
    
    document.getElementById('current').innerText = `${parseInt(currentTemperature)}°`

// Добавить макс мин


    console.log(currentDate);
    console.log(currentTemperature);
}
getForecast();