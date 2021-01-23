$(function () {
  setTimeout(function () {
    var tweets = document.querySelectorAll("[data-testid='tweet']");

    tweets.forEach((tweet) => {
      var text = tweet.children[1].children[1].children[0].children[0];
      var tweetText = "";

      if (text !== undefined) {
        for (let span of text.children) {
          if (span.firstChild.tagName != "DIV") {
            tweetText += span.firstChild.textContent;
          }
        }
      }
      console.log(tweetText);
    });
  }, 3000);
});
