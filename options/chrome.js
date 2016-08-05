$(document).ready(function(){

  chrome.storage.local.get(["kodi_url", "kodi_port"], function(storage){
    $(".kodi-url").val(storage["kodi_url"]);
    $(".kodi-port").val(storage["kodi_port"]);
  });

  timer = null;
  save =

  $(".kodi-url, .kodi-port").on("input", function(){
    $(".status").html("");
    if(timer != null){
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(
      function(){
        chrome.storage.local.set({
            kodi_url: $(".kodi-url").val(),
            kodi_port: $(".kodi-port").val()
          }, function() {
            $(".status").html("Options were saved.");
          }
        );
      }, 1000);
  });

});
