async function getForecast() {
    const result = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=43.2567&longitude=76.9286&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto");
    const json = await result.json();
    
    console.log(json);
}
getForecast();