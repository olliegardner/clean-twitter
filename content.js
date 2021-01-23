$(() => {
  setTimeout(() => {
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
      // use the `model` object to label sentences.
      model.classify(tweetTexts).then((predictions) => {
        console.log(predictions);
        predictions.forEach((label) => {
          for (x in label.results) {
            var revealButton = $(
              "<button type='button' class='btn btn-outline-primary revealTweet'>Reveal Tweet</button>"
            ).click((e) => revealTweet(e));

            var parent = tweets[x].parentElement;

            if (parent.classList.contains("blur")) {
              continue;
            }

            if (label.results[x].match) {
              addBlur(parent, revealButton);
            } else if (label.results[x].match == null) {
              addBlur(parent, revealButton);
            }
          }
        });
      });
    });
  }, 3000);

  revealTweet = (e) => {
    e.target.previousElementSibling.classList.remove("blur");
    e.target.classList.add("hidden");
  };

  addBlur = (parent, revealButton) => {
    parent.classList.add("blur");
    revealButton.appendTo(parent.parentElement);
  };
});
