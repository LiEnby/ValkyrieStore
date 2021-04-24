
function beforeRequest(details) {
  var forceValkyrie = details.url.search("smcid=psapp") != -1;

  if(!forceValkyrie)
	forceValkyrie = (localStorage["force-valkrie"] == "true")

  console.log('[Valkyrie] STORE Request made to: '+details.url);
  var region = details.url.split("/")[3];
  
  if(region == undefined && !forceValkyrie)
	  return {};
  
  if(region != undefined) 
	  if(region.match(/[a-z]{2}-[a-z]{2}$/g) == null) // exclude /assets/ and everything else
		  return {};
		  
  console.log('[Valkyrie] Region: '+region);
  var url = browser.runtime.getURL("oldStore.html");
  
  if(localStorage["use-wayback"] == "true")
	  url = "https://web.archive.org/web/20200919id_/https://store.playstation.com/en-us/home/games";
  
  console.log('[Valkyrie] oldStore HTML Location: '+url);
  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();
  
  if(forceValkyrie || 
  details.url.startsWith("https://store.playstation.com/"+region+"/home") || 
  details.url.startsWith("https://store.playstation.com/"+region+"/download") ||
  details.url.startsWith("https://store.playstation.com/"+region+"/wishlist"))
  {
	
	var filter = browser.webRequest.filterResponseData(details.requestId);
	var encoder = new TextEncoder();


	filter.onstop = event => {
		filter.write(encoder.encode(xhr.responseText));
		filter.close();
	}

  }

  return {};
}

function beforeHeaders(e) {
  var forceValkyrie = e.url.search("smcid=psapp") != -1;
  if(!forceValkyrie)
	forceValkyrie = (localStorage["force-valkrie"] == "true")

  console.log('[Valkyrie] HEADERS recieved for: '+e.url);

  var region = e.url.split("/")[3];
  if(region == undefined  && (region.match(/[a-z]{2}-[a-z]{2}$/g) == null) && !forceValkyrie)
	  return {};
  
  if(region != undefined) 
	  if(region.match(/[a-z]{2}-[a-z]{2}$/g) == null) // exclude /assets/ and everything else
		  return {};
  
  if(forceValkyrie || 
  e.url.startsWith("https://store.playstation.com/"+region+"/home") || 
  e.url.startsWith("https://store.playstation.com/"+region+"/download") ||
  e.url.startsWith("https://store.playstation.com/"+region+"/wishlist"))
  {
	  console.log("[Valkyrie] Faking success.");
	  e.responseHeaders = [
	  {"name":"content-type","value":"text/html; charset=utf-8"},
	  {"name":"x-dns-prefetch-control","value":"off"},
	  {"name":"x-frame-options","value":"SAMEORIGIN"},
	  {"name":"x-download-options","value":"noopen"},
	  {"name":"x-content-type-options","value":"nosniff"},
	  {"name":"x-xss-protection","value":"1; mode=block"},
	  {"name":"cache-control","value":"no-store"},
	  {"name":"etag","value":"W/\"e7d3-FHbuIcO6Jj6pwk0aYAZNc9fqyVY\""},
	  {"name":"x-edgeconnect-midmile-rtt","value":"29"},
	  {"name":"x-edgeconnect-origin-mex-latency","value":"420"},
	  {"name":"content-encoding","value":"gzip"},
	  {"name":"date","value":"Fri, 23 Apr 2021 04:27:04 GMT"},
	  {"name":"content-length","value":"13484"},
	  {"name":"content-security-policy","value":"frame-ancestors 'self';"},
	  {"name":"vary","value":"User-Agent, Accept-Encoding"},
	  {"name":"strict-transport-security","value":"max-age=31536000 ; includeSubDomains ; preload"},
	  {"name":"X-Firefox-Spdy","value":"h2"}]
	  e.statusCode = 200;
  }
  
  return {responseHeaders: e.responseHeaders, 
  statusCode: e.statusCode};
}

browser.webRequest.onHeadersReceived.addListener(
  beforeHeaders,
  {urls: ["https://store.playstation.com/*"], types: ["main_frame"]},
  ["blocking", "responseHeaders"]
);
browser.webRequest.onBeforeRequest.addListener(
  beforeRequest,
  {urls: ["https://store.playstation.com/*"], types: ["main_frame"]},
  ["blocking"]
);

