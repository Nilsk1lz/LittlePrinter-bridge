const path = require("path");
var wifi = require("node-wifi");
const fs = require("fs");

wifi.init();

module.exports = (app) => {
  // Wifi stuff

  app.get("/api/online", (req, res) => {
    wifi.getCurrentConnections((error, currentConnections) => {
      if (error) {
        res.status(500).send(err);
      } else {
        res.status(200).send(currentConnections.length ? true : false);
      }
    });
  });

  app.get("/api/networks", (req, res) => {
    wifi
      .scan()
      .then((networks) => {
        console.log(networks);
        res.status(200).send(
          networks.map((network) => {
            return {
              ssid: network.ssid,
            };
          })
        );
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  /////////////////////////////////////////
  // Private API
  /////////////////////////////////////////

  app.post("/api/register", (req, res) => {
    console.log(req.body);
    fs.writeFile("./token.json", JSON.stringify(req.body), "utf-8", () => {
      res.status(200).send();
    });
  });

  // Route to server assets

  app.get("/assets/*", (req, res) => {
    console.log("APPROOT: ", appRoot);
    res.sendFile(path.join(appRoot, req.originalUrl));
  });

  // Route to React App

  app.get("/*", (req, res) => {
    if ("development" === process.env.NODE_ENV) {
      res.sendFile(
        path.join(__dirname, `../../../my-app/build/dev/index.html`)
      );
    } else {
      res.sendFile(
        path.join(__dirname, "../../../my-app/build/prod/index.html")
      );
    }
  });
};
