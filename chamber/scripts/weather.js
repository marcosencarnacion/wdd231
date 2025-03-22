document.addEventListener("DOMContentLoaded", function () {

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
    const forecastContainer = document.querySelector(".forecast");

    // Create Required Variables for the URL
    const myKey = "eaed5f9e7ddcb1179fc9d3e94534fd58";
    const myLat = "4.631736380558901"
    const myLong = "-74.13294775376075"

    //Construct a Full Path Using Template Literals
    const myURL = `//api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`

    // 5-day /3 hour Forecast URL
    const forecastURL = `https:api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`

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

    // Fetch and Display 3-Day Forecast
    async function fetchForecast() {
        try {
            const response = await fetch(forecastURL);
            if (response.ok) {
                const data = await response.json();
                displayForecast(data);
            } else {
                throw new Error("Failed to fetch forecast data");
            }
        } catch (error) {
            console.error("Error fetching forecast:", error);
        }
    }

    // Function to Display 3-Day Forecast Dynamically
    function displayForecast(data) {
        const forecastDays = {};
        const today = new Date();

        // Extract the next 3 days from the API
        data.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

            if (date > today && !forecastDays[dayName]) {
                forecastDays[dayName] = {
                    tempMax: item.main.temp_max,
                    icon: item.weather[0].icon,  // Store the icon code
                };
            } else if (forecastDays[dayName]) {
                forecastDays[dayName].tempMax = Math.max(forecastDays[dayName].tempMax, item.main.temp_max);
            }
        });

        // Create and append 3 forecast divs dynamically
        Object.keys(forecastDays).slice(0, 3).forEach((day) => {
            const dayData = forecastDays[day];

            const dayDiv = document.createElement("div");
            dayDiv.classList.add("forecast-day");

            // Create the icon URL
            const iconSrc = `https://openweathermap.org/img/wn/${dayData.icon}.png`;

            // Display day, temperature, and icon
            dayDiv.innerHTML = `
                <p><strong>${day}:</strong> <img src="${iconSrc}" alt="Weather icon"> ${dayData.tempMax.toFixed(1)}°C</p>
            `;

            forecastContainer.appendChild(dayDiv);
        });
    }

    // Run both functions
    apiFetch();
    fetchForecast();


});


