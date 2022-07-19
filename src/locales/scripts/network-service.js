const axios = require('axios')

const defaultUserAgent =
  'Openverse/0.1 (https://wordpress.org/openverse; openverse@wordpress.org)'

const networkService = (userAgent = defaultUserAgent) =>
  axios.create({
    headers: { 'User-Agent': userAgent },
  })

module.exports = { NetworkService }
