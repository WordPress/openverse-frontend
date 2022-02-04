import { pluckMeta } from '~/hooks/render:route'

describe('render:route', () => {
  describe('pluckMeta', () => {
    it('should return a raw string of the meta tags present in an HTML document', () => {
      const html = `
<html>
<head>
  <title>UFO Watchtower</title>
  <meta name="description" content="Watch for UFO's in this HOTSPOT">
  <meta name="keywords" content="aliens ufo  landing fun giftshop camping adventure greatsanddunes alamosa skywatching tower obvservation tower lookout tower toys adventure explore COLORADO">
</head>
<body>
  <h1>UFO Campground</h1>
  <p>Welcome to our campground. Here you can see UFOs most nights of the year. Please be safe and enjoy your stay</p>
</body>
`

      const meta = pluckMeta(html)
      expect(meta).toEqual(
        `<meta name="description" content="Watch for UFO's in this HOTSPOT"><meta name="keywords" content="aliens ufo  landing fun giftshop camping adventure greatsanddunes alamosa skywatching tower obvservation tower lookout tower toys adventure explore COLORADO">`
      )
    })
  })
})
