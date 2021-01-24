chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.predictions != null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let username = tabs[0].url.split("/")[3];
      var req = new XMLHttpRequest();

      req.open("POST", request.config.googleCloudURL);
      req.setRequestHeader("Content-Type", "application/json");

      let body = JSON.stringify({
        username: username,
        content: request.predictions,
      });

      req.send(body);

      sendResponse({ username: username });
    });
  } else if (request.predictions == null && request.config != null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let username = tabs[0].url.split("/")[3];
      var req = new XMLHttpRequest();

      var url = request.config.googleCloudURL + "?username=" + username;

      req.open("GET", url, true);
      req.setRequestHeader("Content-Type", "application/json");
      req.send();

      req.onload = () => {
        sendResponse(req.response);
      };
    });
  }
  return true;
});
