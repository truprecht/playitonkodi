sendRequest = function(link){
  chrome.storage.local.get(["kodi_url", "kodi_port"], function(storage){
    kodi_url = "http://" + storage["kodi_url"] + ":" + storage["kodi_port"] + "/PlayIt";
    datastring = JSON.stringify({
      "version":"1.1",
      "method": "playHostedVideo",
      "id"    : "1",
      "params": {"videoLink" : link}
    });
    $.ajax({
      url: kodi_url,
      traditional: true,
      method: "POST",
      data: datastring,
      success: function(response){
        if(response.result.status !== "success"){
          alert(response.result.message);
        }
      },
      error: function(response){
        alert("Something went wrong, you should check the settings.")
      }
    });
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  sendRequest(tab.url);
});

chrome.contextMenus.create({
    title: "Send link to Kodi",
    contexts: ["page", "link"],
    onclick: function(info){
      sendRequest(info.linkUrl ? info.linkUrl : info.pageUrl);
    }
  },
  function(error){ console.log(error) }
);
