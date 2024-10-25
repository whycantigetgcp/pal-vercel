// api/proxy.js
const https = require('http');
const url = require('url');

module.exports = async (req, res) => {
  const targetUrl = process.env.PROXY_HOST + req.url;
  
  const parsedUrl = url.parse(targetUrl);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (error) => {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  });
};
