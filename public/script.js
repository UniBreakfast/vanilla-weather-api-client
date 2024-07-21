document.getElementById('weather-form').addEventListener('submit', function(e) {
  e.preventDefault()
  const city = document.getElementById('city').value
  fetch(`/api/weather?city=${city}`)
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
