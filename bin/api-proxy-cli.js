const apiProxyServer = require('./api-proxy')

apiProxyServer.start(() => console.log('Talkback started!'))
function closeServer() {
  apiProxyServer.close()
  console.log('Server closed, exiting process')
  process.exit(0)
}
process.on('SIGTERM', () => {
  console.log('Received SIGTERM')
  closeServer()
})
