function reload(){
	
	if(localStorage["force-valkrie"] == undefined)
		localStorage["force-valkrie"] = false;
	if(localStorage["use-wayback"] == undefined) 
		localStorage["use-wayback"] = false;
	
	
	
	if(localStorage["use-wayback"] == "true")
		document.getElementById("use-wayback").classList = ["enabled"];
	else
		document.getElementById("use-wayback").classList = ["choice"];
	
	if(localStorage["force-valkrie"] == "true")
		document.getElementById("force-valkrie").classList = ["enabled"];
	else
		document.getElementById("force-valkrie").classList = ["choice"];

}


document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("choice") && !e.target.classList.contains("enabled")) {
    return;
  }
  
  if(e.target.id == "open-valkrie")
  {
	  browser.tabs.create({url:"https://store.playstation.com/?smcid=psapp"});
  }
  
  if(e.target.id == "open-valkrie-list")
  {
	  browser.tabs.create({url:"https://store.playstation.com/download/list?smcid=psapp"});
  }
  
  if(e.target.id == "force-valkrie")
  {
	  if(localStorage["force-valkrie"] == "true") 
		  localStorage["force-valkrie"] = false;
	  else 
		  localStorage["force-valkrie"] = true;
  }
  
  if(e.target.id == "use-wayback")
  {
	  if(localStorage["use-wayback"] == "true") 
		  localStorage["use-wayback"] = false;
	  else 
		  localStorage["use-wayback"] = true;
  }
  
  reload();
});

reload();