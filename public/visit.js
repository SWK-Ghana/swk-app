// SWK's own visit counter, shown in the staff dashboard. It sets no cookies and
// sends nothing about the person: only the page, and for the first page of a
// visit, the site they came from. Pages that aren't part of the React app load
// this with data-auto so they count themselves.
(function () {
  var live = location.hostname === 'swkghana.org' || location.hostname === 'www.swkghana.org'
  var script = document.currentScript

  function send(data) {
    if (!live) return
    var body = JSON.stringify(data)
    if (navigator.sendBeacon && navigator.sendBeacon('/api/visit', body)) return
    if (window.fetch) fetch('/api/visit', { method: 'POST', body: body, keepalive: true }).catch(function () {})
  }

  function firstInVisit() {
    try {
      if (sessionStorage.getItem('swk-visit')) return false
      sessionStorage.setItem('swk-visit', '1')
      return true
    } catch (e) {
      return false
    }
  }

  function cameFrom() {
    try {
      var host = new URL(document.referrer).hostname
      return host === location.hostname ? '' : host
    } catch (e) {
      return ''
    }
  }

  window.swkVisit = function (path) {
    var first = firstInVisit()
    send(first ? { path: path, first: true, from: cameFrom() } : { path: path })
  }

  window.swkEvent = function (name) {
    send({ event: name })
  }

  if (script && script.hasAttribute('data-auto')) window.swkVisit(location.pathname)
})()
