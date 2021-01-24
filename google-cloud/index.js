/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const admin = require("firebase-admin");
admin.initializeApp();
exports.sendTweetData = async (req, res) => {
  console.log(req.method);

  if (req.method === "GET") {
    let userRef = admin.firestore().collection("users").doc(req.query.username);
    let userInfo = await userRef.get();

    if (!userInfo.exists) {
      res.status(404).send(null);
      return null;
    } else {
      console.log(userInfo.data());
      res.status(200).send(userInfo.data());
    }
  }

  if (req.method === "POST" && req.body != undefined) {
    let userRef = admin.firestore().collection("users").doc(req.body.username);
    let userInfo = await userRef.get();

    if (!userInfo.exists) {
      let x = req.body.content.map((el) => {
        let s = el.label;
        let obj = {};
        obj["label"] = el.label;

        let l = el.results.map(function (c) {
          return c.probabilities[1];
        });

        let sum = l.reduce((a, b) => a + b, 0);
        let avg = sum / l.length || 0;
        obj["probability"] = avg;

        return obj;
      });

      await userRef.create({ data: x });
    } else {
      let x = req.body.content.map((el) => {
        let s = el.label;
        let obj = {};
        obj["label"] = el.label;

        let l = el.results.map(function (c) {
          return c.probabilities[1];
        });

        let sum = l.reduce((a, b) => a + b, 0);
        let avg = sum / l.length || 0;
        obj["probability"] = avg;

        return obj;
      });

      let resp = x;

      let oldres = userInfo.data().data;

      let resArr = [];

      resp.forEach((el) => {
        a = oldres.find((cx) => cx.label == el.label);
        let newobj = {
          label: el.label,
          probability: (el.probability + a.probability) / 2,
        };
        resArr.push(newobj);
      });
      await userRef.update({ data: resArr });
    }

    res.status(200).send("done");
  }
};
