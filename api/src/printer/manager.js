const CronJob = require("cron").CronJob;
const { exec } = require("child_process");
const Axios = require("axios");
const fs = require("fs");
const path = require("path");
const async = require("async");

// const PaperangPrinter = require("./printer/paperang.ts");

const jobs = {};
// const printer = new PaperangPrinter();

jobs.main = new CronJob(
  //   "0 */10 * * * *", // Every 10 mins?
  "0 * * * * *",
  function () {
    getDevices();
  },
  null,
  true,
  "Europe/London"
);

jobs.main.start();

apiKey = "Px6H4k4ZmsCekDTe0khbrQ";

getFilePaths = (files, device, im = false) => {
  const paths = files.map((file) => {
    console.log("making path for ", file);
    return `../bridge/api/${device.mac_address}/${im ? "IM/" : ""}${file.name}`;
  });
  console.log("Returning paths: ", paths.join(" "));
  return paths.join(" ");
};

printInstantMessagesForDevice = (device) => {
  console.log("Printing instant messages");

  const imDir = path.join(__dirname, "../../", device.mac_address, "IM");

  fs.readdir(imDir, { withFileTypes: true }, (err, files) => {
    if (files && files.length) {
      console.log("Found a message to print");
      // Kill me now
      //      exec('pwd',
      exec(
        `cd sirius-client && ./bin/cli.sh print image ${getFilePaths(
          files,
          device,
          true
        )} -p printer_paperang_p2s_usb`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);

          files.forEach((file) => {
            fs.unlink(path.join(imDir, file.name), (err) => {
              if (err) console.log(err);
              console.log("deleted IM");
            });
          });
        }
      );
    }
  });
};

printImagesForDevice = (device) => {
  console.log("Printing images...");
  // Get all images for device
  console.log(device);

  const deviceDir = path.join(__dirname, "../../", device.mac_address);
  console.log("Device Dir: ", deviceDir);
  fs.readdir(deviceDir, { withFileTypes: true }, (err, files) => {
    console.log(err);
    console.log(`Found ${files.length} items`);
    files = files.filter((file) => !file.isDirectory());

    console.log(`Found ${files.length} files`);

    if (files && files.length) {
      // Kill me now
      const command = `cd sirius-client && ./bin/cli.sh print image ${getFilePaths(
        files,
        device
      )} -p printer_paperang_p2s_usb`;

      console.log(command);
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        files.forEach((file) => {
          fs.unlink(path.join(deviceDir, file.name));
        });
      });
    }
  });
};

createScheduleForDevices = (devices) => {
  console.log("Creating schedule");
  devices.forEach((device) => {
    if (device.print_time) {
      if (!jobs[device._id]) jobs[device._id] = {};

      createPrintJobForDevice(device);
      downloadImages(device);
      printInstantMessagesForDevice(device);
    }
  });
};

downloadImages = (device) => {
  console.log("Downloading images");

  const deviceDir = path.join(__dirname, "../../", device.mac_address);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir);
    fs.mkdirSync(path.join(deviceDir, "IM"));
  }

  Axios.get(
    `https://happy-printer.co.uk/api/devices/${device._id}?apikey=${apiKey}`
  ).then(({ data }) => {
    async.eachSeries(
      data.images,
      (image, cb) => {
        // Download to directory

        console.log("Converting image...");
        let isIM = false;
        if (image.filename.indexOf("IM-") === 0) isIM = true;
        var base64Data = image.data.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(
          path.join(deviceDir, isIM ? "IM" : "", `${image.filename}.png`),
          base64Data,
          "base64",
          (err) => {
            if (err) return cb(err);
            cb();
          }
        );

        Axios.delete(
          `https://happy-printer.co.uk/api/devices/${device._id}/images/${image._id}?apikey=${apiKey}`
        );
      },
      (err) => {
        // Delete from server
        if (err) {
          console.log("ERROR!", err);
        }
      }
    );
  });
};

createPrintJobForDevice = (device) => {
  console.log("Creating print job");
  const hour = parseInt(device.print_time.split(":")[0]);

  console.log(`0 0 ${hour} * * *`);

  if (
    jobs[device._id].print &&
    `0 0 ${hour} * * *` === jobs[device._id].print.cronTime.source
  ) {
    console.log("No change to cron job, returning");
    return;
  }

  console.log("Change to cronjob detected, creating new job");

  // jobs[device._id].print = new CronJob(`0 * * * * *`, () => {
  jobs[device._id].print = new CronJob(`0 0 ${hour} * * *`, () => {
    // print images
    printImagesForDevice(device);
  });

  jobs[device._id].print.start();
};

getDevices = () => {
  console.log("Getting devices");
  Axios.get(`https://happy-printer.co.uk/api/devices?apikey=${apiKey}`).then(
    ({ data }) => {
      console.log(data);
      createScheduleForDevices(data);
    }
  );
};

getDevices();
