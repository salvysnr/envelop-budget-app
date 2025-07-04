const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const getRouter = express.Router();

// invoke a JSON parser
app.use(express.json());

// use getRouter
app.use('/envelop', getRouter);

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
};

// findIndex helper function
const indexFinder = (category) => {
  return envelopes.findIndex(envelop => envelop.category === category);
};

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// create a param vaidator for 'category' parameter
getRouter.param('category', (req, res, next, category) => {
  try {
    // check for category existence
    const index = indexFinder(category);
    if (index === -1) {
      return res.status(404).send('Category does not exist.')
    }

    const envelop = envelopes[index];
    req.envelop = envelop;
    req.index = index;
    next();
  } catch(err) {
    next(err);
  }
});

// create middleware function to handle body validation for transfer of funds
const transferValidation = (req, res, next) => {
  try {
    if(!req.body.source && !req.body.destination) {
      return res.status(400).send('Insufficient data provided.');
    }

    const sourceCategory = req.body.source.category;
    const destinationCategory = req.body.destination.category;
    const sourceIndex = indexFinder(sourceCategory);
    let destinationIndex = indexFinder(destinationCategory);
    const amount = req.body.amount;

    // check if source index exists
    if (sourceIndex === -1) {
      return res.status(400).send('Source envelop does not exist.');
    }

    // validate if there's sufficient balance in the source envelop
    let sourceBalance = envelopes[sourceIndex].budget;
    if (sourceBalance < amount) {
      return res.status(400).send('Insufficient balance');
    }

    if (destinationIndex !== -1) {
      let destinationBalance = envelopes[destinationIndex].budget;

      sourceBalance -= amount;
      destinationBalance += amount;

      envelopes[sourceIndex].budget = sourceBalance;
      envelopes[destinationIndex].budget = destinationBalance;
      
      req.sourceIndex = sourceIndex;
      req.destinationIndex = destinationIndex;

      next();

    } else {
      sourceBalance -= amount;

      let destinationBalance = amount;

      const newCategory = {
        category: destinationCategory,
        budget: destinationBalance
      };

      envelopes.push(newCategory);

      destinationIndex = indexFinder(destinationCategory);

      req.sourceIndex = sourceIndex;
      req.destinationIndex = destinationIndex;

      next();
    }
  } catch(err) {
    next(err);
  }
}

// create a new envelop
getRouter.post('/create', postValidator, (req, res, next) => {
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

// middleware to get all envelopes
getRouter.get('/retrieve', (req, res, next) => {
  res.status(200).send(envelopes);
});

// middleware to get a specific envelop
getRouter.get('/retrieve/:category', (req, res, next) => {
  if (!req.envelop) {
    return res.status(404).send('Envelop not found');
  }
  res.status(200).send(req.envelop);
});

// spend money from an envelop
getRouter.put('/withdraw/:category', (req, res, next) => {
  try {
    const expense = req.body.expense;
    const budget = req.envelop.budget;
    const index = req.index;
    if (budget < expense) {
      return res.status(400).send('Insufficient funds');
    }
    const updatedBudget = budget - expense;
    envelopes[index].budget = updatedBudget;
    res.status(200).json({
      message: `You've successfully withdrawn ${expense} from your ${req.envelop.category} envelop.`,
      data: envelopes[index]
    });
  } catch(err) {
    next(err);
  }
});

// Create PUT middleware to help users transfer funds from one envelop to another
getRouter.put('/transfer', transferValidation, (req, res, next) => {
  const sourceEnvelop = envelopes[req.sourceIndex];
  const destinationEnvelop = envelopes[req.destinationIndex];
  res.status(200).json({
    message: `You have successfully transferred ${req.body.amount} from ${sourceEnvelop.category} to ${destinationEnvelop.category}.`,
    data: [
      sourceEnvelop,
      destinationEnvelop
    ]
  });
});

// create middleware to handle delete requests

getRouter.delete('/remove/:category', (req, res, next) => {
  const param = req.params.category;
  envelopes.splice(req.index, 1);
  res.status(200).send(`You've successfully deleted the ${param} envelop.`);
});

// error middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Technical error!');
});

app.listen(PORT, () => {
  console.log(`App is now listening on Port ${PORT}.`);
});

// {
//     "source": { "category": "vacation" },
//     "destination": { "category": "rent" },
//     "amount": 50
// }