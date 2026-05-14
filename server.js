const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');

// app.get('/', (req, res) => {
//     res.send('Hello World2!');
// })

app.use(express.json());


connectDB();
app.use('/users', userRoute);

app.listen(port, () => {
    console.log("http://localhost:3000");
});