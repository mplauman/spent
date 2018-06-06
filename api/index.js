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

router.get('/sprints', (req, res) => {
  res.send(sprints);
});
router.get('/sprints/current', (req, res) => {
  res.send(currentSprint);
});
router.get('/sprints/:sprintId', (req, res) => {
  res.send(req.params.sprintId);
});

export default router;
