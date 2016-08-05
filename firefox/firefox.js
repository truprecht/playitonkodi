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
	kodi_url = 'http://'+preferences['kodi_ip']+':'+preferences['kodi_port']+'/PlayIt';
	data =  {
					"version":"1.1",
                    "method": "playHostedVideo",
                    "id"    : "1",
                    "params": {"videoLink" : url}
            }
	dataJSON = JSON.stringify(data);
	var post_rq = Request({
	  url: kodi_url,
	  content: dataJSON,
	  onComplete: function (response) {
		notifications.notify({
			text: 'Sending: '+url+' to: '+kodi_url,
			iconURL : "resource://@playitonkodi/icons/k32.png"
		});
	  }
	}).post();
}


// adding context menu:

var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
  label: "Send to KODI",
  context: contextMenu.SelectorContext("a[href]"),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  console.log("Item clicked!: " + node.href);' +
                 '  self.postMessage(node.href);' +
                 '});',
  onMessage: function (myurl) {
    mySendToKodiContextMenu(myurl);
  }
});

function mySendToKodiContextMenu(myurl) {
    url =  myurl
    kodi_url = 'http://'+preferences['kodi_ip']+':'+preferences['kodi_port']+'/PlayIt';
    data =  {
                    "version":"1.1",
                    "method": "playHostedVideo",
                    "id"    : "1",
                    "params": {"videoLink" : url}
            }
    dataJSON = JSON.stringify(data);
    var post_rq = Request({
      url: kodi_url,
      content: dataJSON,
      onComplete: function (response) {
        if(response.status === 200){ // HTTP OK
          if(response.json.result.status === "sucess"){ // url accepted by PlayIt
            notificationText = 'Sending: '+url+' to: '+kodi_url;
          }
          else{ // PlayIt error
            notificationText = response.json.result.message;
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
};
