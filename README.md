# 🚀 redis-cache-demo

Create a Node.js + Express application that demonstrates how **Redis** can be used as a caching layer for GET requests, and how to invalidate (delete) the cache when the underlying data is modified (added, updated, or deleted).

---

## 🧠 Overview

This project shows how to use **Redis caching** in a Node.js + Express app and handle **cache invalidation** when data changes.

### Key Features
- Uses Redis as a caching layer for GET requests  
- Simulates a database using an in-memory JavaScript array  
- Automatically invalidates cache after **POST**, **PUT**, and **DELETE**  
- Demonstrates cache **TTL (Time-To-Live)** expiration of 1 minute  

---

## ⚙️ Tech Stack
- **Node.js**
- **Express**
- **Redis** (via [ioredis](https://www.npmjs.com/package/ioredis))

---

## 🧩 Folder Structure
redis-cache-demo/
├── server.js
├── package.json
└── README.md


---

## 🧰 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/redis-cache-demo.git
cd redis-cache-demo

2. Install dependencies
npm install

3. Start Redis server

If Redis isn’t already running:

redis-server

4. Run the app
node server.js


You should see:

Server running on port 3000
🧪 API Endpoints
GET /items

Fetch all items.

Returns data from Redis cache if available.

Otherwise fetches from “database”, caches it, and returns.

Example:

curl http://localhost:3000/items


Console:

❌ Cache miss — fetching from DB
✅ Cache hit

POST /items

Add a new item and invalidate cache.

Example:

curl -X POST http://localhost:3000/items \
-H "Content-Type: application/json" \
-d '{"name":"Tablet"}'


Console:

🗑️ Cache invalidated after POST

PUT /items/:id

Update an item by ID and invalidate cache.

Example:

curl -X PUT http://localhost:3000/items/1 \
-H "Content-Type: application/json" \
-d '{"name":"Updated Phone"}'


Console:

🗑️ Cache invalidated after PUT

DELETE /items/:id

Delete an item by ID and invalidate cache.

Example:

curl -X DELETE http://localhost:3000/items/1


Console:

🗑️ Cache invalidated after DELETE

🕒 Caching Behavior
Operation	Action
GET /items (first time)	Cache miss → Fetch from DB → Store in Redis
GET /items (next time)	Cache hit → Return from Redis
POST /items	Add → Delete cache
PUT /items/:id	Update → Delete cache
DELETE /items/:id	Remove → Delete cache
Next GET /items	Cache miss → Re-fetch and store again
🧭 Example Logs
❌ Cache miss — fetching from DB
✅ Cache hit
🗑️ Cache invalidated after POST
❌ Cache miss — fetching from DB
✅ Cache hit

🧹 Cache Expiration (TTL)

The cache automatically expires after 60 seconds:

await redis.set('items:all', JSON.stringify(items), 'EX', 60)
