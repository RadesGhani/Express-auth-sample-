const express = require ("express")
const app = express ()

// Datasources
const mongoose = require ("mongoose")
mongoose.connect ("mongodb://localhost/expressAuth3rd", {useNewUrlParser: true, useUnifiedTopology: true})

// Middleware
const bodyParser = require ("body-parser")
const morgan = require ("morgan")

app.use(bodyParser.json())
app.use(morgan("dev"))

// Routes
app.use("/users", require ("./routers/users"))

// App init
app.listen (8080, () => {
    console.log("App listening on port 8080")
})