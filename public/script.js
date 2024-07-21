const API_KEY = '3930104192f956be546d4df057894557'

document.getElementById('weather-form').addEventListener('submit', function(e) {
  e.preventDefault()
  const city = document.getElementById('city').value
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const weatherResult = document.getElementById('weather-result')
      if (data.cod === 200) {
        weatherResult.innerHTML = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <p>${data.weather[0].description}</p>
          <p>Temperature: ${data.main.temp}°C</p>
        `
      } else {
        weatherResult.innerHTML = `<p>${data.message}</p>`
      }
    })
    .catch(error => console.error('Error fetching weather data:', error))
})
