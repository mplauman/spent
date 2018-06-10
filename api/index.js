import express from 'express';
import Formatters from '../src/Formatters';

let currentSprint = null;
let oldSprints = [];
let invoicePrototypes = [];

/**
 * Advance a sprint prototype forward until it occurs on or after
 * the provided date.
 */
const rollForward = (prototype, firstDate) => {
  const startDate = Formatters.dateFromString(prototype.startDate);

  while (startDate < firstDate) {

    switch (prototype.frequency) {
    case 'once':
      return null;

    case 'days':
      startDate.setDate(startDate.getDate() + prototype.count);
      break;

    case 'weeks':
      startDate.setDate(startDate.getDate() + prototype.count * 7);
      break;

    case 'months':
      startDate.setMonth(startDate.getMonth() + prototype.count);
      break;

    case 'years':
      startDate.setFullYear(startDate.getFullYear() + prototype.count);
      break;

    default:
      throw 'unexpected invoice prototype frequency ' + prototype.frequency;
    }
  }

  return {
    name: prototype.name,
    startDate: Formatters.dateToString(startDate),
    value: prototype.value,
    count: prototype.count,
    frequency: prototype.frequency
  };
};

const accumulateInvoice = (sum, invoice) => {
  return sum + invoice.value;
};

/**
 * Inspect the current collecion of invoices. Any invoices that are set to occur
 * in the specified time range will be included in the returned array. Their
 * startDate will be updated to occur after the specified time range.
 *
 * @param {string} startDate The first day of the time range.
 * @param {string} endDate The last day of the time range (inclusive).
 * @param {array} invoicePrototypes
 */
const instantiateInvoices = (startDate, endDate, invoicePrototypes) => {
  let newInvoices = [];
  let revisedPrototypes = []; //invoicePrototypes;

  const start = Formatters.dateFromString(startDate);
  const nextStart = Formatters.dateFromString(endDate);
  nextStart.setDate(nextStart.getDate() + 1);

  for (let i = 0; invoicePrototypes != null && i < invoicePrototypes.length; ++i) {

    // Roll this invoice prototype forward until it occurs after the beginning
    // of this sprint.
    let invoicePrototype = rollForward(invoicePrototypes[i], start);
    while (invoicePrototype != null && invoicePrototype.startDate <= endDate) {

      newInvoices.push({
        name: invoicePrototype.name,
        value: invoicePrototype.value,
        date: invoicePrototype.startDate
      });

      // Invoices might be daily, so keep rolling this one forward and
      // adding it to this sprint until the prototype goes past the end
      // of the sprint.
      const nextInstanceDate = Formatters.dateFromString(invoicePrototype.startDate);
      nextInstanceDate.setDate(nextInstanceDate.getDate() + 1);

      invoicePrototype = rollForward(invoicePrototype, nextInstanceDate);
    }

    // If there's still a prototype then keep it for next time
    if (invoicePrototype != null) {
      revisedPrototypes.push(invoicePrototype);
    }
  }

  return {
    newInvoices,
    revisedPrototypes
  };
};

const router = express.Router();

/**
 * Returns a list of all the sprints. This includes
 * bold previous sprints as well as the current one.
 */
router.get('/sprints', (req, res) => {
  let allSprints = [...oldSprints];

  if (currentSprint != null) {
    allSprints.push(currentSprint);
  }

  res.send(allSprints);
});

router.get('/sprints/current', (req, res) => {
  res.send(currentSprint);
});

/**
 * Save the current sprint, then replace it with a
 * new version. All the invoices that were included
 * in this sprint will have their startDate attribute
 * updated to occur after this sprint.
 */
router.post('/sprints/current', (req, res) => {
  const sprintPrototype = req.body;
  const {newInvoices, revisedPrototypes} = instantiateInvoices(sprintPrototype.startDate, sprintPrototype.endDate, invoicePrototypes);
  const closingBalance = newInvoices.reduce(accumulateInvoice, sprintPrototype.openingBalance);

  const newSprint = {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    openingBalance: req.body.openingBalance,
    expenses: newInvoices,
    closingBalance: closingBalance,
    revisedClosing: closingBalance
  };

  if (currentSprint != null) {
    oldSprints.push(currentSprint);
  }

  currentSprint = newSprint;
  invoicePrototypes = revisedPrototypes;

  res.send(newSprint);
});

/**
 * Add some more invoice prototypes.
 *
 * If any of the incoming invoice prototypes start in the current sprint
 * they will be instantiated and added to the sprint.
 */
router.post('/expenses', (req, res) => {
  const sprint = currentSprint;
  if (sprint != null) {
    const {newInvoices, revisedPrototypes} = instantiateInvoices(sprint.startDate, sprint.endDate, req.body);

    // update the current sprint
    sprint.revisedClosing = newInvoices.reduce(accumulateInvoice, sprint.revisedClosing);
    sprint.expenses = [...sprint.expenses, ...newInvoices];

    invoicePrototypes = [...invoicePrototypes, ...revisedPrototypes];
  } else {
    invoicePrototypes = [...invoicePrototypes, ...req.body];
  }

  res.send(invoicePrototypes);
});
router.get('/expenses', (req, resp) => {
  resp.send(invoicePrototypes);
});

/**
 * Roll forward through the expenses and calculate a few sprints.
 */
router.get('/sprints/projections', (req, res) => {
  const projections = [];

  let prevSprint = currentSprint;
  let prevInvoicePrototypes = invoicePrototypes;
  for (let i = 0; i < 6 && prevSprint != null; ++i) {

    const startDate = Formatters.dateFromString(prevSprint.endDate);
    startDate.setDate(startDate.getDate() + 1);

    const endDate = Formatters.dateFromString(prevSprint.endDate);
    endDate.setDate(endDate.getDate() + 14);

    const projected = {
      startDate: Formatters.dateToString(startDate),
      endDate: Formatters.dateToString(endDate),
      openingBalance: prevSprint.revisedClosing
    };

    const {newInvoices, revisedPrototypes} = instantiateInvoices(projected.startDate, projected.endDate, prevInvoicePrototypes);
    projected.expenses = newInvoices;
    projected.closingBalance = newInvoices.reduce(accumulateInvoice, projected.openingBalance);
    projected.revisedClosing = projected.closingBalance;

    projections.push(projected);
    prevSprint = projected;
    prevInvoicePrototypes = revisedPrototypes;
  }

  res.send(projections);
});

export default router;
