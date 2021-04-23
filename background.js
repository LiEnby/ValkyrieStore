function beforeRequest(details) {
  console.log('[Valkyrie] STORE Request made to: '+details.url);
  var region = details.url.split("/")[3];
  if(region == undefined)
	  return {};
  console.log('[Valkyrie] Region: '+region);
  if(details.url == "https://store.playstation.com/"+region+"/home/games")
  {
	
	var date = 20200919;
	console.log('[Valkyrie] replacing response ...');
	for(var i = 0; i < 20; i++)
	{
		var getNewUrl = "https://web.archive.org/web/"+(date+i).toString()+"id_/https://store.playstation.com/"+region+"/home/games";
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET", getNewUrl, false);
		xhr.send();

		// make sure date fetched is acturally after the date i specified..
		// (why do i even have to do this?)
		var newDate = Number(xhr.responseURL.split("/")[4].split("id_")[0].substring(0,8));
		console.log("[Valkyrie] newDate: "+newDate.toString());
		if(newDate < date)
		{
			console.log("[Valkyrie] Nope, retrying w a later date");
			continue;
		}
		else
		{
			break;
		}
	}
	var response = xhr.responseText;	
	var filter = browser.webRequest.filterResponseData(details.requestId);
	var encoder = new TextEncoder();


	filter.onstop = event => {
		filter.write(encoder.encode(response));
		filter.close();
	}

  }

  return {};
}

function beforeHeaders(e) {
  console.log('[Valkyrie] HEADERS recieved for: '+e.url);

  var region = e.url.split("/")[3];
  if(region == undefined)
	  return {};
  if(e.url == "https://store.playstation.com/"+region+"/home/games")
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

