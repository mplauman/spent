import express from 'express';

const router = express.Router();

const currentSprint = {
  id: '2018-06-05',
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
    id: '2018-06-19',
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
    id: '2018-07-03',
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

router.get('/sprints', (req, res) => {
  res.send(sprints);
});
router.get('/sprints/current', (req, res) => {
  res.send(currentSprint);
});
router.get('/sprints/projections', (req, res) => {
  res.send(projections);
});
router.get('/sprints/:sprintId', (req, res) => {
  res.send(req.params.sprintId);
});

export default router;
