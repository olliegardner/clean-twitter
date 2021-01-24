var loadedTweets = [];

$(() => {
    setTimeout(async() => {
        await getTweets();
    }, 2000);
});

setInterval(async() => {
    await getTweets();
}, 2000);

loadModel = async() => {
    return await toxicity.load(0.75, [
        "identity_attack",
        "insult",
        "threat",
        "obscene",
        "severe_toxicity",
        "sexual_explicit",
        "toxicity",
    ]);
};

getTweets = async() => {
    var tweets = document.querySelectorAll("[data-testid='tweet']");

    tweets.forEach((tweet) => {
        var tweetText = getTweetText(tweet);

        if (!loadedTweets.find((t) => t.content == tweetText)) {
            loadedTweets.push({ content: tweetText, pills: [], pillLabels: [] });
        }
    });

    var colours = {
        identity_attack: "#9C27B0",
        insult: "#3959AB",
        threat: "#00BCD4",
        obscene: "#FF8F00",
        severe_toxicity: "#4CAF50",
        sexual_explicit: "#E91E63",
        toxicity: "#827717",
    };

    var model = await loadModel();
    var text = loadedTweets.map((tweet) => tweet.content);

    // use the `model` object to label sentences.
    model.classify(text).then((predictions) => {
        predictions.forEach((label) => {
            for (x in label.results) {
                var percentage = parseInt(label.results[x].probabilities[1] * 100);

                var pill = $(
                    `<span class="badge rounded-pill pill" style='background-color:${
            colours[label.label]
          }'">${label.label.replace("_", " ")}: ${percentage}%</span>`
                );

                if (label.results[x].match || label.results[x].match == null) {
                    // if not in loaded tweets array
                    var t = loadedTweets.find((t) => t.content == text[x]);

                    if (!t.pillLabels.includes(label.label)) {
                        loadedTweets
                            .find((tweet) => tweet.content == text[x])
                            .pills.push(pill);
                        loadedTweets
                            .find((tweet) => tweet.content == text[x])
                            .pillLabels.push(label.label);
                    }
                }
            }
        });
        chrome.runtime.sendMessage({ 'predictions': predictions, 'config': conf }, function(response) {
            console.log(`message from background: ${JSON.stringify(response)}`);
        });
    });

    tweets.forEach((tweet) => {
        var tweetText = getTweetText(tweet);
        var c = loadedTweets.find((t) => t.content == tweetText);

        if (c.pills.length == 0) return;

        var revealButton = $(
            "<button type='button' class='btn btn-outline-primary revealTweet'>Reveal Tweet</button>"
        ).click((e) => revealTweet(e));

        var pillDiv = $("<div class='pillDiv'></div>");

        var parent = tweet.parentElement;

        if (!parent.nextElementSibling) {
            pillDiv.appendTo(parent.parentElement);

            var t = loadedTweets.find((t) => t.content == tweetText);

            t.pills.forEach((p) => pillDiv.append(p[0]));

            addBlur(parent, revealButton);
        } else {
            var t = loadedTweets.find((t) => t.content == tweetText);
            t.pills.forEach((p) => tweet.parentElement.nextSibling.append(p[0]));
        }

        tweet.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
};

getTweetText = (tweet) => {
    var textChild = tweet.children[1].children[1].children.length == 3 ? 0 : 1;
    var text = tweet.children[1].children[1].children[textChild].children[0];
    var tweetText = "";

    if (text !== undefined) {
        for (let span of text.children) {
            if (span.firstChild.tagName != "DIV") {
                tweetText += span.firstChild.textContent;
            }
        }
    }
    return tweetText;
};

revealTweet = (e) => {
    e.target.previousElementSibling.classList.add("hidden");
    e.target.classList.add("hidden");
    e.target.previousElementSibling.previousElementSibling.classList.remove(
        "blur"
    );
};

addBlur = (parent, revealButton) => {
    parent.classList.add("blur");
    revealButton.appendTo(parent.parentElement);
};