import express from 'express';
import axios from 'axios';
import shajs from 'sha.js';

import config from '../config';
import Formatters from '../src/Formatters';

let users = {};

const getUser = (userId) => {
  let user = users[userId];

  if (user == null) {
    user = {
      currentSprint: null,
      oldSprints: [],
      invoicePrototypes: []
    };

    users[userId] = user;
  }

  return user;
};

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
  let revisedPrototypes = [];

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
 * Install a piece of middleware to perform user authentication on every API
 * request.
 *
 * This assumes that every request includes an Authorization header of the
 * form <provider id> <magic token>.
 *
 * The token will be sent to a provider-specific endpoint to be translated
 * into the user's information, namely the user's identifier on that platform.
 * That identifier is then used to create a pair of values:
 * - A spent-specific identifier. This is done by computing a sha256 signature
 *   of the provider-specific identifier plus some (constant) random garbage.
 * - A spent-specific encrption key. This is again a sha256 signature based on
 *   the provider-specific identifier and (constant, different) random garbage.
 *
 * The identifier here gets used to uniquely identify each of Spent's users,
 * without the application ever really knowing the source user. This is
 * important for privacy: the authors would like to user their friends as guinea
 * pigs without knowing their financial details. The hashing function basically
 * anonymizes them.
 *
 * A similar concept applies with the encryption key. The use of different
 * garbage means that it'll be different than the user id, which gets stored
 * in the database. This encryption key is used to encrypt/decrypt the financial
 * information.
 *
 * Combined, this means the following:
 * - The sprint server doesn't know the source identities of its users.
 * - Sprint developers with access to the database are unable to read the
 *   financial details of its users.
 *
 * Again, this is important for the ability to invite friends and family as
 * test subjects. It is important that Spent developers will be unable to
 * view their financial details, even accidentally.
 */
router.use((req, resp, next) => {
  const authHeader = req.get('Authorization');
  if (authHeader == null) {
    resp.status(401).send('missing Authorization header');
    return;
  }

  const [provider, token] = [...authHeader.split(' ')];

  let getId = null;
  switch (provider) {
  case 'google':
    getId = axios
      .get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token)
      .then((resp) => {
        console.info('google success');
        return resp.data.sub;
      });
    break;

  case 'linkedin':
    getId = axios
      .get('https://api.linkedin.com/v1/people/~?format=json', {
        headers: {
          oauth_token: token
        }
      })
      .then((resp) => {
        console.info('linkedin success');
        return resp.data.id;
      });
    break;

  default:
    resp.status(401).send('not authenticated');
    return;
  }

  getId
    .then((id) => {
      const hash = shajs('sha256');

      req.userDetails = {
        id: hash.update(provider + ':' + config.userIdHashFudge + ':' + id).digest('hex'),
        key: hash.update(provider + ':' + config.userKeyHashFudge + ':' + id).digest('hex')
      };
      console.info(req.userDetails);
      next();
    })
    .catch((err) => {
      console.error(err);
      resp.status(401).send('auth request failed');
    });
});

/**
 * Returns a list of all the sprints. This includes
 * bold previous sprints as well as the current one.
 */
router.get('/sprints', (req, res) => {
  const user = getUser(req.userDetails.id);

  const allSprints = [...user.oldSprints];
  if (user.currentSprint != null) {
    allSprints.push(user.currentSprint);
  }

  res.send(allSprints);
});

router.get('/sprints/current', (req, res) => {
  const user = getUser(req.userDetails.id);

  res.send(user.currentSprint);
});

/**
 * Save the current sprint, then replace it with a
 * new version. All the invoices that were included
 * in this sprint will have their startDate attribute
 * updated to occur after this sprint.
 */
router.post('/sprints/current', (req, res) => {
  const user = getUser(req.userDetails.id);

  const sprintPrototype = req.body;
  const {newInvoices, revisedPrototypes} = instantiateInvoices(sprintPrototype.startDate, sprintPrototype.endDate, user.invoicePrototypes);
  const closingBalance = newInvoices.reduce(accumulateInvoice, sprintPrototype.openingBalance);

  const newSprint = {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    openingBalance: req.body.openingBalance,
    invoices: newInvoices,
    closingBalance: closingBalance,
    revisedClosing: closingBalance
  };

  if (user.currentSprint != null) {
    user.oldSprints.push(user.currentSprint);
  }

  user.currentSprint = newSprint;
  user.invoicePrototypes = revisedPrototypes;

  res.send(newSprint);
});

/**
 * Add some more invoice prototypes.
 *
 * If any of the incoming invoice prototypes start in the current sprint
 * they will be instantiated and added to the sprint.
 */
router.post('/invoices', (req, res) => {
  const user = getUser(req.userDetails.id);

  const sprint = user.currentSprint;
  if (sprint != null) {
    const {newInvoices, revisedPrototypes} = instantiateInvoices(sprint.startDate, sprint.endDate, req.body);

    // update the current sprint
    sprint.revisedClosing = newInvoices.reduce(accumulateInvoice, sprint.revisedClosing);
    sprint.invoices = [...sprint.invoices, ...newInvoices];

    user.invoicePrototypes = [...user.invoicePrototypes, ...revisedPrototypes];
  } else {
    user.invoicePrototypes = [...user.invoicePrototypes, ...req.body];
  }

  res.send(user.invoicePrototypes);
});
router.get('/invoices', (req, resp) => {
  const user = getUser(req.userDetails.id);

  resp.send(user.invoicePrototypes);
});

/**
 * Roll forward through the invoices and calculate a few sprints.
 */
router.get('/sprints/projections', (req, res) => {
  const user = getUser(req.userDetails.id);

  const projections = [];

  let prevSprint = user.currentSprint;
  let prevInvoicePrototypes = user.invoicePrototypes;
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
    projected.invoices = newInvoices;
    projected.closingBalance = newInvoices.reduce(accumulateInvoice, projected.openingBalance);
    projected.revisedClosing = projected.closingBalance;

    projections.push(projected);
    prevSprint = projected;
    prevInvoicePrototypes = revisedPrototypes;
  }

  res.send(projections);
});

export default router;
