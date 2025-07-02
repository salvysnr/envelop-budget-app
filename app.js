const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res, next) => {
  res.status(200).send('Hello World');
})


app.listen(PORT, () => {
  console.log(`App is now listen on the ${PORT} port.`);
})