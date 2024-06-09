import fs from 'fs'
import http2 from 'http2'

// http2 requiere si o si una 'key' y un 'certificado'
const server = http2.createSecureServer(
  {
    key: fs.readFileSync('keys/server.key', 'utf-8'),
    cert: fs.readFileSync('keys/server.crt', 'utf-8'),
  },
  (req, res) => {
    console.log(req.url)

    if (req.url === '/') {
      const htmlFile = fs.readFileSync('./public/index.html', 'utf-8')
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(htmlFile)

      return
    }

    if (req.url?.endsWith('.js')) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' })
    } else if (req.url?.endsWith('.css')) {
      res.writeHead(200, { 'Content-Type': 'text/css' })
    }

    try {
      const responseContent = fs.readFileSync(`./public/${req.url}`, 'utf-8')
      res.end(responseContent)
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('<h1>404 Not Found</h1>')
    }
  }
)

server.listen(8080, () => {
  console.log('server is running on port 8080')
})
