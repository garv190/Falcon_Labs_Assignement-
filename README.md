# IoT Sensor Backend

A simple Node.js service for handling IoT temperature sensor data. It saves readings to MongoDB and lets you fetch the latest data for any device.

## What it does

- Takes in sensor temperature readings via API
- Stores everything in MongoDB Atlas
- Gives you the most recent reading for any device
- Bonus: Listens to MQTT messages for real-time data

## Getting Started

1. Grab the code: `git clone <repo-url>`
2. Install stuff: `npm install`
3. Set up your `.env` file:
   ```
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/sensor_db?retryWrites=true&w=majority
   MQTT_URI=mqtt://your-mqtt-broker:1883
   ```
4. Run it: `npm run dev` for development

**Note:** Make sure your MongoDB Atlas IP whitelist includes your current IP address, or the database connection will fail.

## API Stuff

### Add a sensor reading
**POST** `/api/sensor/ingest`

Send this JSON:
```json
{
  "deviceId": "sensor-01",
  "temperature": 32.1,
  "timestamp": 1705312440000
}
```

You'll get back something like:
```json
{
  "_id": "some-mongo-id",
  "deviceId": "sensor-01",
  "temperature": 32.1,
  "timestamp": 1705312440000,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

### Get latest reading for a device
**GET** `/api/sensor/:deviceId/latest`

Example: `GET /api/sensor/sensor-01/latest`

Returns the most recent reading for that device.

## MQTT Bonus Feature

If you have an MQTT broker running, this will automatically listen for temperature updates.

- Topic: `iot/sensor/<deviceId>/temperature`
- Message: Just the temperature number as text (like "32.1")
- It saves these directly to the database

## Testing

Try these curl commands (server runs on port 4000):

```bash
# Add a reading
curl -X POST http://localhost:4000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "sensor-01", "temperature": 32.1}'

# Get the latest
curl http://localhost:4000/api/sensor/sensor-01/latest
```

## Database Schema

Just a simple collection with:
- `deviceId` - string, required
- `temperature` - number, required
- `timestamp` - number , auto-generated if missing
- `createdAt` - date when saved to DB

## Tech Stack

- Node.js + Express for the API
- MongoDB Atlas for storage
- Mongoose for database stuff
- MQTT for the bonus real-time feature

