const express = require('express')
const connectToMongo = require('./db')
const app = express()
const port = 5000

connectToMongo()

app.use(express.json())

// Router 

app.use("/api/notes" , require('./routes/notes'))
app.use("/api/auth" , require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})