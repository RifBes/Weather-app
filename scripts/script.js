const form = document.getElementById('form');
const input = document.querySelector('.form__input');

/*
Через navigator.geolocation. Но из-за того, что иногда он неправильно находит моё местоположение, выбрала другой способ
if (navigator.geolocation) {
    //получаем местоположение пользователя. Иногда промахивается...
    let test = navigator.geolocation.getCurrentPosition(showPosition);
}

async function showPosition(position) {
    console.log(position);
    getInfo(position.coords.latitude, position.coords.longitude);
}
*/

getUserGeo();

async function getUserGeo() {
    const url = `https://ipinfo.io/json?token=ef2e5108e54ac7`;
    let response = await fetch(url);
    let json = await response.json();
    let local = json.loc.split(',');
    getInfo(local[0], local[1]);
}

form.onsubmit = Weather;

async function Weather(e) {
    //остановили обновление страницы
    e.preventDefault();

    //проверили, что что-то ввели
    if (!input.value.trim()) {
        alert('Введите город!');
        return;
    }

    //забрали имя города
    const cityName = input.value.trim();
    //очистили ввод
    input.value = '';

    //берём основную информацию о городе
    const cityInfo = await getCity(cityName);
    //проверяем, что город найден
    if (cityInfo.length === 0) {
        alert('Такого города не существует или его нет в базе данных!');
        return;
    }

    //получаем информацию
    getInfo(cityInfo[0]['lat'], cityInfo[0]['lon']);
}

async function getInfo(lat, lon) {
    //получаем полную информацию о погоде
    const weatherInfo = await getWeather(lat, lon);

    //выбираем нужные параметры
    const weatherData = {
        name: weatherInfo.name,
        temp: weatherInfo.main.temp,
        temp_max: weatherInfo.main.temp_max,
        temp_min: weatherInfo.main.temp_min,
        humidity: weatherInfo.main.humidity,
        clouds: weatherInfo.clouds.all,
        wind: weatherInfo.wind.speed,
        description: weatherInfo.weather[0].description,
        type: weatherInfo.weather[0].main,
    };

    //меняем значения на странице
    changeData(weatherData);
}

async function getCity(name) {
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;
    let response = await fetch(URL);

    if (response.ok) {
        let json = await response.json();
        return json;
    } else {
        alert('Ошибка! ' + response.status);
    }
}

async function getWeather(lat, lon) {
    const URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&lang=ru&appid=${API_KEY}`;
    let response = await fetch(URL);

    if (response.ok) {
        let json = await response.json();
        console.log(json);
        return json;
    } else {
        alert('Ошибка! ' + response.status);
    }
}

function changeData(data) {
    const background = document.querySelector('.body');
    const title = document.querySelector('.details__info-title');
    const name = document.querySelector('.weather-city');
    const temp = document.querySelector('.weather-temp');
    const max_temp = document.querySelector('.details__info-tempmax');
    const min_temp = document.querySelector('.details__info-tempmin');
    const humidity = document.querySelector('.details__info-humadity');
    const clouds = document.querySelector('.details__info-clouds');
    const wind = document.querySelector('.details__info-wind');

    title.textContent = data.description;
    name.textContent = data.name;
    temp.textContent = Math.round(data.temp) + '°';
    max_temp.textContent = Math.round(data.temp_max) + '°';
    min_temp.textContent = Math.round(data.temp_min) + '°';
    humidity.textContent = data.humidity + '%';
    clouds.textContent = data.clouds + '%';
    wind.textContent = data.wind + 'км/ч';

    const weatherNames = {
        Clouds: 'url(./imgs/type/clouds.jpg)',
        Clear: 'url(./imgs/type/clear.jpg)',
        Rain: 'url(./imgs/type/rain.jpg)',
        Snow: 'url(./imgs/type/snow.jpg)',
        Thunderstorm: 'url(./imgs/thinder.jpg)',
        Drizzle: 'url(./imgs/drizzle.jpg)',
    };

    if (weatherNames[data.type]) {
        background.style.backgroundImage = weatherNames[data.type];
    }
}
