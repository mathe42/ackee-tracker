import platform from 'platform'

/**
 * Returns the Ackee script element.
 * @returns {HTMLElement} elem
 */
const getScriptElem = function() {

	return document.querySelector('script[data-ackee]')

}

/**
 * Returns the URL of the Ackee server.
 * @returns {string} url - URL to the server. Never ends with a slash.
 */
const getServerURL = function() {

	let url = getScriptElem().getAttribute('data-ackee')

	if (url.substr(-1)==='/') url = url.substr(0, url.length - 1)

	return url

}

/**
 * Returns the id of the user.
 * @returns {string} userId
 */
const getUserId = function() {

	return getScriptElem().getAttribute('data-userId')

}

/**
 * Returns the id of the domain.
 * @returns {string} domainId
 */
const getDomainId = function() {

	return getScriptElem().getAttribute('data-domainId')

}

/**
 * Gathers all platform-, screen- and user-related information. May include empty strings and undefined values.
 * @returns {object} data
 */
const getData = function() {

	return {
		siteLocation       : window.location.href,
		siteReferrer       : document.referrer,
		siteTitle          : document.title,
		siteLanguage       : navigator.language.substr(0, 2),
		screenWidth        : screen.width,
		screenHeight       : screen.height,
		screenColorDepth   : screen.colorDepth,
		devicedeviceName   : platform.product,
		deviceManufacturer : platform.manufacturer,
		osName             : platform.os.family,
		osVersion          : platform.os.version,
		browserName        : platform.name,
		browserVersion     : platform.version,
		browserWidth       : document.documentElement.clientWidth || window.outerWidth,
		browserHeight      : document.documentElement.clientHeight || window.outerHeight
	}

}

const send = function(method, url, userId, domainId, data, next) {

	const xhr = new XMLHttpRequest()

	xhr.open(method, `${ url }/users/${ userId }/domains/${ domainId }/records`)

	xhr.onload = () => {

		if (xhr.status===200) {

			let json = null

			try { json = JSON.parse(xhr.responseText) }
			catch(e) { return next(new Error('Failed to parse response from server')) }

			next(null, json)

		} else {

			next(new Error('Server returned with an unhandled status'))

		}

	}

	xhr.onerror   = next(new Error('An error occurred while transferring data to the server'))
	xhr.onabort   = next(new Error('Transfer to server has been canceled'))
	xhr.ontimeout = next(new Error('Transfer to server timed out'))

	xhr.send(JSON.stringify(data))

}

send('POST', getServerURL(), getUserId(), getDomainId(), getData(), (err, json) => {

	if (err!=null) {
		throw err
	}

	console.log(json)

})