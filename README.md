# Clean Twitter

Clean Twitter was built for the University of Cambridge Hackathon 2021 (https://hackcambridge.com/). During the 36 hours of hacking, we developed a Chrome Extension which removes negativity from Twitter profiles using machine learning.

## Authors
- [Ollie Gardner](https://github.com/olliegardner)
- [Fraser Dale](https://github.com/fraserdale)

## The challenge

> The theme of this hackathon is to use data to create a hack for social good. This past year has seen increasing scrutiny of big technology, data privacy, social media and the impact that the digital world can have on the fabric of our society. Yet technology continues to revolutionise lives, drive societal improvements and provide hope for the future for many.
>
> The challenge is to create some positivity for the future by using data to optimise your hack for a societal benefit.

## Our solution

The volume of negativity on social media these days poses a day to day danger to a person's mental health. Twitter currently offers no solution to filter tweets to a user's desire(s). Clean Twitter removes any tweet that hits a threshold in any of the following classifications:

- identity attack
- insult
- obscene
- severely toxicity
- sexual explicit
- threat
- toxicity

## Final product

### Screenshots

| ![Header](https://github.com/olliegardner/clean-twitter/blob/master/media/header.PNG?raw=true) | ![Censored tweet](https://github.com/olliegardner/clean-twitter/blob/master/media/before.PNG?raw=true) | ![Revealed tweet](https://github.com/olliegardner/clean-twitter/blob/master/media/after.PNG?raw=true) |
| :--------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------- |
|                                        Profile summary                                         |                                             Censored tweet                                             | Revealed tweet                                                                                        |

### GIFs

| ![Scrolling through Twitter](https://github.com/olliegardner/clean-twitter/blob/master/media/scrolling.gif?raw=true) | ![Revealing a tweet](https://github.com/olliegardner/clean-twitter/blob/master/media/pressing.gif?raw=true) |
| :------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|                                              Scrolling through Twitter                                               |                                              Revealing a tweet                                              |

## How we built it

#### Client

[Chrome Extension](https://developer.chrome.com/docs/extensions/mv2/getstarted/)

#### Data Storage

[Google Cloud Function](https://console.cloud.google.com/functions)

#### Serverless Functions

[Google Cloud Firestore](https://console.cloud.google.com/firestore)

#### Machine Learning

[TensorFlow JS](https://www.npmjs.com/package/@tensorflow/tfjs)

#### Machine Learning Model

[Toxicity](https://www.npmjs.com/package/@tensorflow-models/toxicity)

## Devpost

Check out Clean Twitter on [Devpost](https://devpost.com/software/clean-twitter)!

---
