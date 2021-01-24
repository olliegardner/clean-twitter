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
        var colours = {
            identity_attack: "#9C27B0",
            insult: "#3959AB",
            threat: "#00BCD4",
            obscene: "#FF8F00",
            severe_toxicity: "#4CAF50",
            sexual_explicit: "#E91E63",
            toxicity: "#827717",
        };

        toxicity.load(threshold, labelsToInclude).then((model) => {
            // use the `model` object to label sentences.
            model.classify(tweetTexts).then((predictions) => {
                console.log(predictions);
                predictions.forEach((label) => {
                    for (x in label.results) {
                        var pillDiv = $("<div class='pillDiv'></div>");
                        var revealButton = $(
                            "<button type='button' class='btn btn-outline-primary revealTweet'>Reveal Tweet</button>"
                        ).click((e) => revealTweet(e));

                        var pill = $(
                            `<span class="badge rounded-pill pill" style='background-color:${colours[label.label]}'">${
                label.label.replace('_',' ')
              }: ${parseInt(label.results[x].probabilities[1] * 100)}%</span>`
                        );

                        var parent = tweets[x].parentElement;

                        if (label.results[x].match || label.results[x].match == null) {
                            if (!parent.classList.contains("blur")) {
                                pill.appendTo(pillDiv);
                                addBlur(parent, revealButton);
                                pillDiv.appendTo(parent.parentElement);
                            } else {
                                pill.appendTo(tweets[x].parentElement.nextSibling.nextSibling);
                            }
                        }
                    }
                });
            });
        });
    }, 3000);

    revealTweet = (e) => {
        e.target.previousElementSibling.classList.remove("blur");
        e.target.classList.add("hidden");
        e.target.nextSibling.classList.add("hidden");
    };

    addBlur = (parent, revealButton) => {
        parent.classList.add("blur");
        revealButton.appendTo(parent.parentElement);
    };
});