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
	console.log(url);
	data =  {    
					"version":"1.1",
                    "method": "playHostedVideo",
                    "id"    : '1',
                    "params": {"videoLink" : url}
            }
	dataJSON = JSON.stringify(data);
	var post_rq = Request({
	  url: kodi_url+"?"+dataJSON,
	  onComplete: function (response) {
		notifications.notify({
			text: 'Sending: '+url+' to: '+kodi_url
		});
		console.log(response.text );
		console.log(kodi_url);
	  }
	}).post();
}


