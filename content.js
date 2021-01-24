var loadedTweets = [];

setInterval(async() => {
    await getTweets();
}, 5000);

// $(() => {
//   setTimeout(() => {
//     getTweets();
//   }, 2000);
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.execute) {
//     $(() => {
//       setTimeout(async () => {
//         await getTweets();
//       }, 100);
//     });

//     sendResponse({ result: "Successfully executed" });
//   } else {
//     sendResponse({ result: "error", message: `Invalid 'cmd'` });
//   }
//   return true;
// });

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
    // var tweetTexts = [];

    tweets.forEach((tweet) => {
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

        if (loadedTweets.find((t) => t.content == tweetText)) {
            // var parent = tweet.parentElement;
            // if (!parent.classList.contains("blur")) {
            //   // addBlur(parent, revealButton);
            //   loadedTweets.forEach((t) =>
            //     t.pills.forEach((p) => p.appendTo(pillDiv))
            //   );
            //   // pill.appendTo(pillDiv);
            //   pillDiv.appendTo(parent.parentElement);
            //   return;
            // }
            // // else {
            // //   pill.appendTo(tweet.parentElement.nextSibling.nextSibling);
            // // }
        } else {
            loadedTweets.push({ content: tweetText, pills: [], pillLabels: [] });
        }

        // if (!loadedTweets.find((el) => el.content == tweetText)) {
        //   loadedTweets.push({ content: tweetText, pills: [] });
        // }

        // tweetTexts.push(tweetText);
    });

    // console.log(tweetTexts);

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
                // var revealButton = $(
                //   "<button type='button' class='btn btn-outline-primary revealTweet'>Reveal Tweet</button>"
                // ).click((e) => revealTweet(e));

                var percentage = parseInt(label.results[x].probabilities[1] * 100);

                var pill = $(
                    `<span class="badge rounded-pill pill" style='background-color:${
            colours[label.label]
          }'">${label.label.replace("_", " ")}: ${percentage}%</span>`
                );

                if (label.results[x].match || label.results[x].match == null) {
                    // if not in loaded tweets array

                    // BELOW IS BROKEN ITS PUSHING DUPLICATE PILLS TO THE DICT

                    /* if (!loadedTweets.find((tweet) => tweet.pills.find((p) => p == pill))) {
                                                      loadedTweets
                                                          .find((tweet) => tweet.content == text[x])
                                                          .pills.push(pill);
                                                  } */

                    t = loadedTweets.find((t) => t.content == text[x]);

                    if (!t.pillLabels.includes(label.label)) {
                        loadedTweets
                            .find((tweet) => tweet.content == text[x])
                            .pills.push(pill);
                        loadedTweets
                            .find((tweet) => tweet.content == text[x])
                            .pillLabels.push(label.label);
                    }

                    // var parent = tweet[x].parentElement;

                    // if (!parent.classList.contains("blur")) {
                    //   pill.appendTo(pillDiv);
                    //   addBlur(parent, revealButton);
                    //   pillDiv.appendTo(parent.parentElement);
                    // } else {
                    //   pill.appendTo(tweets[x].parentElement.nextSibling.nextSibling);
                    // }
                }
            }
        });
    });

    tweets.forEach((tweet) => {
        tweetText = getTweetText(tweet);
        c = loadedTweets.find((t) => t.content == tweetText);
        if (c.pills.length == 0) {
            return;
        }

        var revealButton = $(
            "<button type='button' class='btn btn-outline-primary revealTweet'>Reveal Tweet</button>"
        ).click((e) => revealTweet(e));

        var parent = tweet.parentElement;

        var pillDiv = $("<div class='pillDiv'></div>");
        //console.log(parent.nextElementSibling)

        //if (!parent.classList.contains("blur")) {
        if (!parent.nextElementSibling) {
            //pillDiv.appendTo(parent.parentElement);
            pillDiv.appendTo(parent.parentElement);

            t = loadedTweets.find((t) => t.content == tweetText);

            t.pills.forEach((p) => pillDiv.append(p[0]));

            // console.log(pillDiv);

            //pill.appendTo(pillDiv);
            addBlur(parent, revealButton);
            // pillDiv.appendTo(parent.parentElement);
        } else {

            t = loadedTweets.find((t) => t.content == tweetText);
            t.pills.forEach((p) => tweet.parentElement.nextSibling.append(p[0]));

            // pill.appendTo(tweet.parentElement.nextSibling.nextSibling);
        }
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