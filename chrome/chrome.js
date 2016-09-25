sendRequest = function(link){
  chrome.storage.local.get(["kodi_url", "kodi_port"], function(storage){
    kodi_url = "http://" + storage["kodi_url"] + ":" + storage["kodi_port"] + "/jsonrpc";
    $.ajax({
      contentType: "application/json",
      url: kodi_url,
      traditional: true,
      method: "POST",
      data: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "Addons.ExecuteAddon",
        params:{
          addonid: "plugin.video.playdat",
          params: {
            url: link
          }
        }
      }),
      success: function(response){
        if(response.result !== "OK"){
          alert(response);
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
