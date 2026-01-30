require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mqtt = require("mqtt");
const sensorRoute = require("./routes/sensor_route.js");
const Devicedata = require("./models/devicedeta.js");
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("/api/sensor", sensorRoute);




app.get("/", (req, res) => {
  res.send("IoT Sensor Backend Service");
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
    console.log("Server will run anyway for testing.");
  });

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});


setTimeout(() => {
  if (mongoose.connection.readyState === 1) {
    const brokerUrl = process.env.MQTT_URI || 'mqtt://localhost:1883';
    const client = mqtt.connect(brokerUrl);

    client.on('connect', function() {
      console.log('MQTT connected');
      client.subscribe('iot/sensor/+/temperature', function(err) {
        if (!err) {
          console.log('Subscribed to sensor topics');
        } else {
          console.error('MQTT subscribe failed:', err);
        }
      });
    });

    client.on('message', async function(topic, message) {
      const parts = topic.split('/');
      const valid = parts.length === 4 &&
                    parts[0] === 'iot' &&
                    parts[1] === 'sensor' &&
                    parts[3] === 'temperature';

      if (valid) {
        const deviceId = parts[2];
        const temp = parseFloat(message.toString());

        if (!isNaN(temp)) {
          try {
            const reading = await Devicedata.create({
              deviceId: deviceId,
              temperature: temp,
              timestamp: Date.now()
            });

            console.log(`Saved: ${deviceId} = ${temp}°C`);
          } catch (dbError) {
            console.error(`DB error for ${deviceId}:`, dbError.message);
          }
        } else {
          console.warn(`Bad temperature value for ${deviceId}: ${message.toString()}`);
        }
      }
    });

    client.on('error', function(error) {
      console.error('MQTT error:', error);
    });
  }
}, 2000); // Wait 2 seconds for DB connection to establish
