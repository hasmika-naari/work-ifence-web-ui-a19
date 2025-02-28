const PROXY_CONF =
{
    context: ['/api/**'],
    target: "http://Workifence.com:8090",
    secure: false,
    logLevel: "info",
    changeOrigin: true
}




module.exports = PROXY_CONF;