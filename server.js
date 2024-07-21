const express = require('express')
const axios = require('axios')
const API_KEY = '3930104192f956be546d4df057894557'

const path = require('path')
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/api/weather', (req, res) => {
  const city = req.query.city
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

  axios.get(url)
    .then(response => {
      res.json(response.data)
    })
    .catch(error => {
      console.error('Error fetching weather data:', error)
      res.status(500).json({ error: 'Error fetching weather data' })
    })
})
