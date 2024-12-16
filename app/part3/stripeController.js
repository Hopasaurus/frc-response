const https = require("https");

const host = 'api.stripe.com';
const stripeKey = process.env.STRIPE_KEY;
const StripeController = {
  getChargeSummary: async function () {
    const charges = await getCharges([], true);

    const summary = charges.reduce((acc, cur) => {
      acc.totalCharged = acc.totalCharged + cur.amount / 100;
      acc.totalFees = acc.totalFees + cur.transaction.fee / 100;
      acc.totalNet = acc.totalNet + cur.transaction.net / 100;
      return acc;
    }, { transactions: charges.length, totalCharged: 0, totalFees: 0, totalNet: 0});

    return {
      summary,
      charges
    }
  }
}

async function getCharges(maybePreviousCharges, maybeHasMore) {
  const previousCharges = maybePreviousCharges ?? [];
  const hasMore = maybeHasMore ?? true;

  if (!getMoreCharges(previousCharges, hasMore)) {
    console.log('total charge count: ', previousCharges.length);
    return previousCharges.filter(isWithinThirtyDays);
  }

  const rawCharges = await getChargesStartingAfterLast(previousCharges);
  const mappedCharges = await mapCharges(rawCharges);

  return getCharges([...previousCharges, ...mappedCharges], rawCharges.has_more);
}

function getChargesStartingAfterLast(charges) {
  if (charges.length === 0) {
    return wrappedGet(`/v1/charges`);
  }
  const lastCharge = charges[charges.length - 1];

  return wrappedGet(`/v1/charges?starting_after=${lastCharge.id}`);
}

function getMoreCharges(charges, hasMore) {
  if (typeof charges === 'undefined') {
    // this is the first charge. (there is probably a better way to do this)
    return true;
  }
  return isWithinThirtyDays(charges[charges.length - 1]) && hasMore;
}

function isWithinThirtyDays (charge) {
  if (typeof charge === 'undefined') {
    return true;
  }

  // TODO: check that charge is valid (has required fields)
  const age = calculateAge(charge.created);
  return age <= 30;
}

function getBalanceTransactionById(id) {
  return wrappedGet(`/v1/balance_transactions/${id}`);
}

async function mapCharges(charges) {
  const rawTransactions = await Promise.all(
    charges.data.map((charge) => getBalanceTransactionById(charge.balance_transaction)));
  const transactions = rawTransactions.reduce((accumulator, current) => { accumulator[current.id] = mapTransaction(current); return accumulator; }, {});
  return charges.data.map(mapCharge(transactions));
}

function mapTransaction(transaction) {
  return {
    id: transaction.id,
    amount: transaction.amount,
    currency: transaction.currency,
    fee: transaction.fee,
    net: transaction.net,
    status: transaction.status,
  };
}

function mapCharge(transactions) {
  return (charge) => {
    return {
      id: charge.id,
      amount: charge.amount,
      amount_captured: charge.amount_captured,
      amount_refunded: charge.amount_refunded,
      status: charge.status,
      created: charge.created,
      age: calculateAge(charge.created),
      transaction: transactions[charge.balance_transaction],
    }
  }
}

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
function calculateAge(createdTime) {
  const now = Date.now();
  const ageMs = now - createdTime * 1000;

  return ageMs / MILLISECONDS_PER_DAY;
}

// TODO: can this be deduped?, something similar is in part1
async function wrappedGet(path) {
  const requestOptions = {
    host,
    path,
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${stripeKey}`,
    }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, function (res) {
      if (res.statusCode === 401) {
        reject(new Error(res.statusMessage + " - Check the api key."));
      }
      let chunks = [];
      res.setEncoding('utf8');
      res.on('data', (chunk) => { chunks.push(chunk); });
      res.on('end', () => {
        //console.log('end of response')
        const body = chunks.join();
        // console.log(body);

        /*
        TODO: this is a terrible hack, Stripe is sending bad json.
          todo: today: but exception handling around json parsing.
          todo: eventually build a thing that is more able to resiliently parse Stripe's pseudo json.

        the stripe service is sending bad json so manually taking it out. sample:

       "address_line1": null,
        "address_line1_check": null,
        "address_line2": null,,         <-- BAD JSON!!!
        "address_state": null,
        "address_zip": null,
         */
        const patchedBody = body
          .replace("\"address_line2\": null,,", "")
          .replace("\"name\": null,,", "");
        const data = JSON.parse(patchedBody);
        resolve(data);
      });
    });

    req.on('error', (err) => {
      console.log('error', err);
      reject(err);
    });
    req.end();
  });
}

module.exports = { StripeController: StripeController };