const express = require('express')
const Redis = require('ioredis')
const app = express()
app.use(express.json())

// Create Redis client
const redis = new Redis()

// Simulate database (in-memory)
let items = [
  { id: 1, name: "Phone" },
  { id: 2, name: "Laptop" }
]

// GET /items — Cached
app.get('/items', async (req, res) => {
  try {
    const cacheKey = 'items:all'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      console.log('✅ Cache hit')
      return res.json(JSON.parse(cachedData))
    }

    console.log('❌ Cache miss — fetching from DB')
    await redis.set(cacheKey, JSON.stringify(items), 'EX', 60)
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /items — Add new item + Invalidate cache
app.post('/items', async (req, res) => {
  try {
    const newItem = req.body
    newItem.id = items.length + 1
    items.push(newItem)

    await redis.del('items:all')
    console.log('🗑️ Cache invalidated after POST')

    res.status(201).json(newItem)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /items/:id — Update + Invalidate cache
app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updatedItem = req.body

    const index = items.findIndex(i => i.id === parseInt(id))
    if (index === -1) return res.status(404).json({ message: 'Item not found' })

    items[index] = { ...items[index], ...updatedItem }

    await redis.del('items:all')
    console.log('🗑️ Cache invalidated after PUT')

    res.json(items[index])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /items/:id — Delete + Invalidate cache
app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params
    const index = items.findIndex(i => i.id === parseInt(id))
    if (index === -1) return res.status(404).json({ message: 'Item not found' })

    const deleted = items.splice(index, 1)

    await redis.del('items:all')
    console.log('🗑️ Cache invalidated after DELETE')

    res.json(deleted[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Server
app.listen(3000, () => console.log('Server running on port 3000'))
