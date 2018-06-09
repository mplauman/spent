import express from 'express';

const router = express.Router();

const currentSprint = {
  startDate: '2018-06-05',
  endDate: '2018-06-21',
  openingBalance: 1.0,
  closingBalance: 100,
  revisedClosing: 200,
  expenses: [
    {
      name: 'hydro',
      value: -100.00,
      date: '2018-06-06'
    },
    {
      name: 'payday',
      value: 5000.00,
      date: '2018-06-05'
    }
  ]
};

const sprints = [
  currentSprint
];

const projections = [
  {
    startDate: '2018-06-19',
    endDate: '2018-07-03',
    openingBalance: 1.0,
    closingBalance: 100,
    revisedClosing: 200,
    expenses: [
      {
        name: 'hydro',
        value: -100,
        date: '2018-06-20'
      },
      {
        name: 'payday',
        value: 5000.00,
        date: '2018-06-19'
      },
      {
        name: 'daycare',
        value: -1000.00,
        date: '2018-06-21'
      }
    ]
  },
  {
    startDate: '2018-07-03',
    endDate: '2018-07-17',
    openingBalance: 1.0,
    closingBalance: 100,
    revisedClosing: 200,
    expenses: [
      {
        name: 'hydro',
        value: -100,
        date: '2018-07-04'
      },
      {
        name: 'payday',
        value: 5000,
        date: '2018-07-03'
      }
    ]
  }
];

const expensePrototypes = [

];

router.get('/sprints', (req, res) => {
  res.send(sprints);
});
router.get('/sprints/current', (req, res) => {
  res.send(currentSprint);
});
router.post('/sprints/current', (req, res) => {
  let prototype = req.body;

  res.send({
    startDate: prototype.startDate,
    endDate: prototype.endDate,

    openingBalance: prototype.openingBalance,
    closingBalance: prototype.openingBalance,
    revisedClosing: prototype.openingBalance,

    expenses: []
  });
});
router.post('/expenses', (req, res) => {
  console.info(req.body);

  res.send(expensePrototypes);
});
router.get('/sprints/projections', (req, res) => {
  res.send(projections);
});
router.get('/sprints/:sprintId', (req, res) => {
  res.send(req.params.sprintId);
});

export default router;
