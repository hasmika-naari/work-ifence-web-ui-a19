const PROXY_CONF =
{
    context: ['/api/**'],
    target: "http://132.148.79.209:8090",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
}




module.exports = PROXY_CONF;