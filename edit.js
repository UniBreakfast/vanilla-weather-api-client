const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

// Path to the package.json file
const packageJsonPath = path.join(__dirname, 'package.json')

// Read package.json
let packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
let packageJson = JSON.parse(packageJsonContent)

// Add axios dependency if not already present
if (!packageJson.dependencies) {
  packageJson.dependencies = {}
}

if (!packageJson.dependencies.axios) {
  packageJson.dependencies.axios = '^1.4.0'
}

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')

// Install the dependencies
exec('npm install', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing dependencies: ${error}`)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.error(`stderr: ${stderr}`)
})

// Paths to the script.js and server.js files
const scriptPath = path.join(__dirname, 'public', 'script.js')
const serverPath = path.join(__dirname, 'server.js')

// Update script.js
let scriptContent = fs.readFileSync(scriptPath, 'utf8')
scriptContent = scriptContent.replace(
  /fetch\(`https:\/\/api\.openweathermap\.org\/data\/2\.5\/weather\?q=\${city}&appid=YOUR_API_KEY&units=metric`\)/,
  'fetch(`/api/weather?city=${city}`)'
)
fs.writeFileSync(scriptPath, scriptContent, 'utf8')

// Update server.js
let serverContent = fs.readFileSync(serverPath, 'utf8')
const apiRoute = `
app.get('/api/weather', (req, res) => {
  const city = req.query.city
  const url = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric\`

  axios.get(url)
    .then(response => {
      res.json(response.data)
    })
    .catch(error => {
      console.error('Error fetching weather data:', error)
      res.status(500).json({ error: 'Error fetching weather data' })
    })
})
`

if (!serverContent.includes('axios')) {
  const importAxios = "const axios = require('axios')\nconst API_KEY = 'YOUR_API_KEY'\n"
  serverContent = serverContent.replace(/(const express = require\('express'\))/, `$1\n${importAxios}`)
}

serverContent = serverContent.replace(
  /app\.listen\(PORT, \(\) => {[^]*}\)/,
  `$&\n${apiRoute}`
)
fs.writeFileSync(serverPath, serverContent, 'utf8')
