const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// list of envelopes
let envelopes = [];

// validate post request body data
const postValidator = (req, res, next) => {
  const budget = Number(req.body.budget);
  const category = req.body.category;

  // validate if budget is a number or not.
  if (isNaN(budget)) {
    return res.status(400).send('Invalid budget.')
  }

  // validate if category already exists or not
  const categoryExists = envelopes.find(envelop => envelop.category === category);
  
  if (categoryExists) {
    return res.status(400).send('Category already exists.');
  }

  req.body.budget = budget;
  next();
}

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// create a new envelop
app.post('/create/', postValidator, (req, res, next) => {
  try {
    const envelop = {
      category: req.body.category,
      budget: req.body.budget
    }
    envelopes.push(envelop);
    res.status(201).json({
      message: 'Envelop created successfully.',
      data: envelop
    })
  } catch(err) {
    next(err);
  }
  
});

// error middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Technical error!');
})

app.listen(PORT, () => {
  console.log(`App is now listening on Port ${PORT}.`);
})