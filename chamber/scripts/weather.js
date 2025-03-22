// Select HTML Elements in The Document
const myCity = document.querySelector("#city");
const myDescription = document.querySelector("#description");
const myGraphic = document.querySelector("#graphic");
const myTemperature = document.querySelector("#temperature");
const myHighTemperature = document.querySelector("#high-temp");
const myLowTemperature = document.querySelector("#low-temp");
const myHumidity = document.querySelector("#humidity");
const mySunrise = document.querySelector("#sunrise");
const mySunset = document.querySelector("#sunset");

// Create Required Variables for the URL
const myKey = "eaed5f9e7ddcb1179fc9d3e94534fd58";
const myLat = "4.631736380558901"
const myLong = "-74.13294775376075"

//Construct a Full Path Using Template Literals
const myURL = `//api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`

// Try to Grab the Current Weather Data
async function apiFetch() {
    try {
        const response = await fetch(myURL);
        if (response.ok) {
            const data = await response.json();
            displayResults(data); // uncomment when ready
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

// Display the JSON Data Onto My Web Page
function displayResults(data) {
    myCity.innerHTML = data.name
    myDescription.innerHTML = data.weather[0].description
    myTemperature.innerHTML = data.main.temp

    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    myGraphic.setAttribute('SRC', iconsrc)
    myGraphic.setAttribute('alt', data.weather[0].description)

    myHighTemperature.innerHTML = data.main.temp_max
    myLowTemperature.innerHTML = data.main.temp_min
    myHumidity.innerHTML = data.main.humidity

    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    mySunrise.innerHTML = sunriseTime
    mySunset.innerHTML = sunsetTime

    myGraphic.style.width = "45px"; 
    myGraphic.style.height = "auto"; 
}

apiFetch();