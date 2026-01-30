# IoT Sensor Backend

A simple Node.js service for handling IoT temperature sensor data. It saves readings to MongoDB and lets you fetch the latest data for any device.

## What it does

- Takes in sensor temperature readings via API
- Stores everything in MongoDB Atlas
- Gives you the most recent reading for any device
- Bonus: Listens to MQTT messages for real-time data

## Getting Started

You'll need Node.js 18+ and a MongoDB Atlas account (free tier works).

1. **Get the code**
   ```bash
   git clone <your-repo-url>
   cd falcon_lab_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB Atlas**
   - Sign up at mongodb.com/atlas
   - Create a free cluster
   - Make a database user
   - Grab your connection string
   - Add your IP to the whitelist (or allow all IPs for testing)

4. **Create your .env file**
   ```
   MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/sensor_db?retryWrites=true&w=majority
   MQTT_URI=mqtt://localhost:1883
   ```

5. **Run the server**
   ```bash
   npm run dev  # for development
   
   ```

Server starts on port 4000. If MongoDB connection fails, check your IP whitelist - that's usually the issue.

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

## Testing

Server runs on `http://localhost:4000`. Here's how to test it out.

### With curl

Add a reading:
```bash
curl -X POST http://localhost:4000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "sensor-01", "temperature": 32.1}'
```

Get the latest reading:
```bash
curl http://localhost:4000/api/sensor/sensor-01/latest
```

Try with another sensor:
```bash
curl -X POST http://localhost:4000/api/sensor/ingest \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "sensor-02", "temperature": 28.5}'

curl http://localhost:4000/api/sensor/sensor-02/latest
```

### With Postman

1. Set your base URL to `http://localhost:4000`
2. For POST requests:
   - Method: POST
   - URL: `{{base_url}}/api/sensor/ingest`
   - Headers: `Content-Type: application/json`
   - Body: raw JSON like `{"deviceId": "sensor-01", "temperature": 32.1}`
3. For GET requests:
   - Method: GET
   - URL: `{{base_url}}/api/sensor/sensor-01/latest`

### What you'll get back

**Success (POST):**
```json
{
  "_id": "some-id-here",
  "deviceId": "sensor-01",
  "temperature": 32.1,
  "timestamp": 1705312440000,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Success (GET):** Same format as above

**Errors:**
- `400` - Missing deviceId or temperature
- `404` - No readings for that device
- `503` - Database not connected (server still runs for testing)

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

## Quick Troubleshooting

- **"MongoDB connection failed"** - Check your MONGO_URI and make sure your IP is whitelisted in Atlas
- **"Database not connected"** - Server runs without DB for testing, but API returns 503
- **400 errors** - You're missing deviceId or temperature in your request
- **404 errors** - That device doesn't have any readings yet
- **MQTT not working** - Make sure you have an MQTT broker running on localhost:1883

Test if the server is running: `curl http://localhost:4000/`



