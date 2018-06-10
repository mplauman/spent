import express from 'express';
import Formatters from '../src/Formatters';
import assert from 'assert';

let currentSprint = null;
let oldSprints = [];
let invoicePrototypes = [];

/**
 * Advance a sprint prototype forward until it occurs on or after
 * the provided date.
 */
const rollForward = (prototype, firstDate) => {
  console.info('rolling ', prototype, ' to ', firstDate);
  const startDate = Formatters.dateFromString(prototype.startDate);

  // Compare dates using only their year/month/day. Otherwise their individual
  // times will come into the equation and result in some false rollovers.
  const isLess = (lhs, rhs) => {

    const lhsYear = lhs.getFullYear();
    const rhsYear = rhs.getFullYear();
    if (lhsYear < rhsYear) {
      console.info(lhsYear, '<', rhsYear);
      return true;
    }
    console.info(lhsYear, '>=', rhsYear);

    const lhsMonth = lhs.getMonth();
    const rhsMonth = rhs.getMonth();
    if (lhs.getMonth() < rhs.getMonth()) {
      console.info(lhsMonth, '<', rhsMonth);
      return true;
    }
    console.info(lhsMonth, '>=', rhsMonth);

    const lhsDate = lhs.getDate();
    const rhsDate = rhs.getDate();
    if (lhsDate < rhsDate) {
      console.info(lhsDate, '<', rhsDate);
      return true;
    }
    console.info(lhsDate, '>=', rhsDate);

    return false;
  };

  while (startDate < firstDate /*isLess(startDate, firstDate)*/) {
    console.info(startDate, 'is less than', firstDate, 'and will be advanced');

    switch (prototype.frequency) {
    case 'once':
      console.info(prototype, 'has already occurred, dropping');
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

  const rc = {
    name: prototype.name,
    startDate: Formatters.dateToString(startDate),
    value: prototype.value,
    count: prototype.count,
    frequency: prototype.frequency
  };

  console.info('rolled', rc);
  return rc;
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

  console.info('instantiating ' + invoicePrototypes.length + ' invoice prototypes');
  for (let i = 0; invoicePrototypes != null && i < invoicePrototypes.length; ++i) {
    const sourcePrototype = invoicePrototypes[i];
    console.info('source', sourcePrototype);

    // Roll this invoice prototype forward until it occurs after the beginning
    // of this sprint.
    let invoicePrototype = rollForward(sourcePrototype, start);
    while (invoicePrototype != null && invoicePrototype.startDate <= endDate) {
      console.info('instance', invoicePrototype);

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
      console.info('next date', nextInstanceDate);

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
  assert(req.body.startDate != null);
  assert(req.body.endDate != null);
  assert(req.body.openingBalance != null);

  const sprintPrototype = req.body;
  console.info('createing a new current sprint', sprintPrototype);
  console.info('current invoice prototypes', invoicePrototypes);

  const {newInvoices, revisedPrototypes} = instantiateInvoices(sprintPrototype.startDate, sprintPrototype.endDate, invoicePrototypes);
  console.info('new invoices', newInvoices);
  console.info('updated invoice prototypes', revisedPrototypes);

  const closingBalance = newInvoices.reduce(accumulateInvoice, sprintPrototype.openingBalance);

  const newSprint = {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    openingBalance: req.body.openingBalance,
    expenses: newInvoices,
    closingBalance: closingBalance,
    revisedClosing: closingBalance
  };
  console.info('new sprint', newSprint);

  if (currentSprint != null) {
    console.info('saving previous sprint');
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
  req.body.forEach(invoice => {
    assert(invoice.name != null);
    assert(invoice.value != null);
    assert(invoice.startDate != null);
    assert(invoice.count != null);
    assert(invoice.frequency != null);
  });

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
