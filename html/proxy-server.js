const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

app.use('/api', createProxyMiddleware({
    target: 'https://api.github.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    }
}));

app.use('/raw', createProxyMiddleware({
    target: 'https://raw.githubusercontent.com',
    changeOrigin: true,
    pathRewrite: {
        '^/raw': ''
    }
}));

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});