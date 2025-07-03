// const express = require('express')// common js
// const path = require('path')
// const app = express();// app express
// const cors = require('cors')
// require('dotenv').config();


// const PORT = process.env.PORT || 8000;
// const hostname = process.env.HOST_NAME

// app.use(cors({
//   origin: 'http://localhost:3000', // frontend URL
//   credentials: true
// }));

// //config req.body
// app.use(express.json())//for json
// app.use(express.urlencoded({extended:true})) // from for data

// // route
// const webRoutes = require('./src/routes/web')
// app.use('/',webRoutes)

// app.listen(PORT, () => {
//   console.log(`Backend is running on port ${PORT}`);
// });


// server.js
const app = require('./src/app');
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
