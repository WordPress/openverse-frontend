const axios = require('axios')

const UserAgent =
  'Openverse/0.1 (https://wordpress.org/openverse; openverse@wordpress.org)'

const NetworkService = (userAgent = UserAgent) =>
  axios.create({
    headers: { 'User-Agent': userAgent },
  })

module.exports = { NetworkService }
