const http = require('http')

function makeRequest(method, path, body) {
  const jsonData = body ? JSON.stringify(body) : ''
  const req = http.request({
    path, method, body,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': jsonData.length
    },
    hostname: 'localhost',
    port: 8080,
  }, res => {
    console.log('Status: ', res.statusCode, 'Message: ', res.statusMessage)
    let responseBody = ''

    res.on("data", (chunk) => {
      responseBody += chunk;
    });

    res.on("end", () => {
      try {
        const jsonBody = JSON.parse(responseBody);
        console.log('Body: ', jsonBody)

      } catch (error) {
        console.error(error.message);
      };
    });

    return res
  })
  req.on('error', error => {
    console.error(error)
  })

  body && req.write(jsonData)

  req.end()
}

module.exports = makeRequest
