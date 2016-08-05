chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.local.get(["kodi_url", "kodi_port"], function(storage){
    kodi_url = "http://" + storage["kodi_url"] + ":" + storage["kodi_port"] + "/PlayIt";
    console.log(kodi_url);
    datastring = JSON.stringify({
      "version":"1.1",
      "method": "playHostedVideo",
      "id"    : "1",
      "params": {"videoLink" : tab.url}
    });
    $.ajax({
      url: kodi_url,
      traditional: true,
      method: "POST",
      data: datastring,
      success: function(response){
        alert("Sent request to " + kodi_url + ".");
        console.log(response);
      },
      error: function(res){
        console.log(res);
      }
    });
  });
});
