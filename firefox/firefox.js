var self = require('sdk/self');
var Request = require("sdk/request").Request;
var notifications = require("sdk/notifications");
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var preferences = require("sdk/simple-prefs").prefs;

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "PlayIt On Kodi",
  icon: {
    "16": "resource://@playitonkodi/icons/k16.png",
    "32": "resource://@playitonkodi/icons/k32.png",
    "64": "resource://@playitonkodi/icons/k64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
	url =  tabs.activeTab.url
  sendLink(url);
}

// adding context menu:
var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
  label: "Send to KODI",
  context: contextMenu.SelectorContext("a[href]"),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  self.postMessage(node.href);' +
                 '});',
  onMessage: function (myurl) {
    sendLink(myurl);
  }
});

function sendLink(url){
  console.log(url);
  console.log('http://'+preferences['kodi_ip']+':'+preferences['kodi_port']+'/jsonrpc');
  Request({
    contentType: "application/json",
    url: 'http://'+preferences['kodi_ip']+':'+preferences['kodi_port']+'/jsonrpc',
    content: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "Addons.ExecuteAddon",
      params:{
        addonid: "plugin.video.playdat",
        params: {
          url: url
        }
      }
    }),
    onComplete: function (response) {
      if(response.status === 200){ // HTTP OK
        if(response.json.result === "OK"){ // rpc result ok
          notificationText = 'Sending ' + url;
        }
        else{
          notificationText = "Error in jsonrpc. Check your input.";
        }
      }
      else{ // connection error
        notificationText = 'Something went wrong, you should check the settings.';
      }
      notifications.notify({
          text: notificationText,
          iconURL : "resource://@playitonkodi/icons/k32.png"
      });
    }
  }).post();
}