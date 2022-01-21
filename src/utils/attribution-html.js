function attributionHtml(image, licenseUrl, fullLicenseName) {
  if (!image) {
    return ''
  }
  const baseAssetsPath = 'https://search.creativecommons.org/static/img'
  const imgLink = `<a href="${image.foreign_landing_url}">"${image.title}"</a>`
  let creator = ''
  let imageTag = ''
  if (image.url && image.title) {
    imageTag = `<img style="display: block;" src="${image.url}" alt="${image.title}">`
  }
  if (image.creator && image.creator_url) {
    creator = `<span> by <a href="${image.creator_url}">${image.creator}</a></span>`
  } else if (image.creator && !image.creator_url) {
    creator = `<span> by <span>${image.creator}</span></span>`
  }
  const licenseLink = ` is licensed under <a href="${licenseUrl}" style="margin-right: 5px;">${fullLicenseName.toUpperCase()}</a>`

  let licenseIcons = `<img style="height: inherit;margin-right: 3px;display: inline-block;" src="${baseAssetsPath}/cc_icon.svg?image_id=${image.id}" />`
  if (image.license) {
    licenseIcons += image.license
      .split('-')
      .map(
        (license) =>
          `<img style="height: inherit;margin-right: 3px;display: inline-block;" src="${baseAssetsPath}/cc-${license.toLowerCase()}_icon.svg" />`
      )
      .join('')
  }

  const licenseImgLink = `<a href="${licenseUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;margin-top: 2px;margin-left: 3px;height: 22px !important;">${licenseIcons}</a>`
  return `<p style="font-size: 0.9rem;font-style: italic;">${imageTag}${imgLink}${creator}${licenseLink}${licenseImgLink}</p>`
}

/**
 * Get the HTML markup for attributing the given media item.
 *
 * @param mediaItem - the media item, image or audio from the API, to attribute
 * @returns {string} the HTML markup of the attribution
 */
export const getAttributionHtml = (mediaItem) => {
  if (!mediaItem) return ''

  let title = `"${mediaItem.title}"`
  if (mediaItem.foreign_landing_url) {
    title = `<a href="${mediaItem.foreign_landing_url}">${title}</a>`
  }

  let creator = mediaItem.creator
  if (mediaItem.creator_url) {
    creator = `<a href="${mediaItem.creator_url}">${creator}</a>`
  }

  let license = `${mediaItem.license} ${mediaItem.license_version}`
  license = `<a href="${mediaItem.license_url}">${license.toUpperCase()}</a>`

  return `${title} by ${creator} is licensed under ${license}.`
}

export default attributionHtml
