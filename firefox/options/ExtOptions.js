function addClickEvent(id, func) {
  document.getElementById(id).addEventListener("click", func);
}

function setupButton(id) {
  addClickEvent(id, function (e) {
    localStorage[id] = e.target.checked;
  });

  const savedValue = localStorage[id];
  const checkedValue = typeof savedValue === "undefined" ? false : JSON.parse(savedValue);
  document.getElementById(id).checked = checkedValue;
}

addClickEvent("open-valkrie", function (e) {
  browser.tabs.create({ url: "https://store.playstation.com/?smcid=psapp" });
});

addClickEvent("open-valkrie-list", function (e) {
  browser.tabs.create({ url: "https://store.playstation.com/download/list?smcid=psapp" });
});

setupButton("force-valkrie");
setupButton("use-wayback");
