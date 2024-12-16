
# Part 3 - Connect to Stripe API and present charges with in 30 days with summary.

## Task:
Use the Stripe API to retrieve a list of all charges from the last 30 days. 

Summarize the charges by: 
- Total number of transactions. 
- Total amount charged (in the account’s default currency). 
- A list of charges, each with:
  - amount, 
  - currency, 
  - description, 
  - and status. 
- Return the summarized data as a JSON response.

## Questions on this:

- "Total number of transactions" there are Stripe transactions, is this the
  thing being asked for or is transactions being used as another word for 
  charge.
- It looks like a "connected account" (stripe term) has a default_currency.
  Should the service filter by `on_behalf_of` and then check the currency
  for each charge and then convert it to the default currency?

For the initial iteration I took the simpler route of summarizing using the data available in the charge and transaction Stripe apis. This provides a good base to work from, the next step would be to discuss this with the client to see if this is the intention and as clarifying questions.

## Pagination

Pagination is implemented as described here: https://docs.stripe.com/api/pagination there was some testing around this but more robust testing should be performed.



## Helpful resources:
* This showed enough information to get started checking some endpoints: https://docs.stripe.com/testing
* Stripe charges api:
  * list charges: https://docs.stripe.com/api/charges/list
  * add a new charge (deprecated):
    * stripe wants you to use the "intents" api to add charges but this works
    * https://docs.stripe.com/api/charges/create
  * get account for determining default currency:
    * This requires "connected accounts"
    * https://docs.stripe.com/api/accounts/retrieve
    * This looks helpful for figuring out connected accounts:
      *  https://docs.stripe.com/connect/separate-charges-and-transfers#settlement-merchant
  * transactions:
    * https://docs.stripe.com/api/balance_transactions
    * Get transaction for each charge.
    * GET /v1/balance_transactions/:id

## Next steps:
This is the first iteration, it will need a little more work to build on.
Consult with user/client to find out if my interpretation is correct, as about the "connected account" and see if that is involved to get the default currency, I suspect it is.

Figure out what is expected around currency.

Get a better handle on charge created vs when refunds happen,  a charge create 31 days ago and refunded 29 days ago, should it be listed?

Need to add some schema checking to make sure the responses are good.

Logic for limiting to 30 days is untested and pagination has not been rigorously tested.

Stripe seems to have a tendency to emit invalid json.  Make sure this really is the case by manually pulling the json and checking it. Then either make a more robust way to parse the bad json or fix the reason the json is getting corrupted locally.
