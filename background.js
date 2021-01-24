chrome.webRequest.onBeforeRequest.addListener(
  () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { execute: true }, (response) => {
        console.log(response);
      });
    });
  },
  {
    urls: ["https://twitter.com/i/api/2/timeline/profile/*"],
  }
);
