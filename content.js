$(function () {
  setTimeout(function () {
    var tweets = document.querySelectorAll("[data-testid='tweet']");

    var tweetTexts = [];
    tweets.forEach((tweet) => {
      var textChild =
        tweet.children[1].children[1].children.length == 3 ? 0 : 1;
      var text = tweet.children[1].children[1].children[textChild].children[0];
      var tweetText = "";

      if (text !== undefined) {
        for (let span of text.children) {
          if (span.firstChild.tagName != "DIV") {
            tweetText += span.firstChild.textContent;
          }
        }
      }

      tweetTexts.push(tweetText);
    });

    console.log(tweetTexts);

    const threshold = 0.75;

    // Which toxicity labels to return.
    const labelsToInclude = [
      "identity_attack",
      "insult",
      "threat",
      "obscene",
      "severe_toxicity",
      "sexual_explicit",
      "toxicity",
    ];

    toxicity.load(threshold, labelsToInclude).then((model) => {
      // Now you can use the `model` object to label sentences.
      model.classify(tweetTexts).then((predictions) => {
        console.log(predictions);
        predictions.forEach((label) => {
          for (x in label.results) {
            if (label.results[x].match) {
              tweets[x].parentElement.classList.add("blur");
            } else if (label.results[x].match == null) {
              tweets[x].parentElement.classList.add("blur");
            }
          }
        });
      });
    });
  }, 3000);
});
