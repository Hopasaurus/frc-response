
task:
Use the Stripe API to retrieve a list of all charges from the last 30 days. 
Summarize the charges by: 
  Total number of transactions. 
  Total amount charged (in the account’s default currency). 
  A list of charges, each with:
    amount, 
    currency, 
    description, 
    and status. 
  Return the summarized data as a JSON response.

Questions on this:
"Total number of transactions" there are Stripe transactions, is this the
  thing being asked for or is transactions being used as another word for 
  charge.
It looks like a "connected account" (stripe term) has a default_currency.
  Should the service filter by `on_behalf_of` and then check the currency
  for each charge and then convert it to the default currency?


For a quick win that can be iterated on, do the simple thing, just use the 

Will have to use the pagination bits:
https://docs.stripe.com/api/pagination
then check the dates on the transactions for the 30 day limit
if the date is before 30 days and has more is true then set `starting_after` to true and get more.  use `limit` to control page size, default is 10, may want to bump up.



first need to sign up for a stripe account
then make an account within stripe that is in test mode
then get the test mode key


This showed enough information to get started checking some endpoints:
https://docs.stripe.com/testing



stripe charges api:
list charges:
https://docs.stripe.com/api/charges/list

add a new charge (deprecated):
stripe wants you to used the "intents" api to add charges but this works
https://docs.stripe.com/api/charges/create

get account for determining default currency:
https://docs.stripe.com/api/accounts/retrieve

details to report:
data[].amount_captured
data[].amount_refunded
data[].amount
data[].billing_details.name <- for determining client (maybe not, don't know how to set it)
data[].customer ??? maybe
data[].paid


https://docs.stripe.com/api/balance_transactions
Get transaction for each charge.
GET
/v1/balance_transactions/:id


Implement this, notes are somewhere above:
https://docs.stripe.com/api/pagination

made a couple shell scripts to create and list charges.


This looks helpful:
https://docs.stripe.com/connect/separate-charges-and-transfers#settlement-merchant



Next steps:
this is the first iteration, it may need a little more work to build on.
enter more test data to test pagination
- data past 30 days to test limiting to 30 days
- data past first page
Consult with user/client to find out if my interpretation is correct, as about the "connected account" and see if that is involved to get the default currency, I suspect it is.
Figure out how to work with currency.

get a better handle on charge created vs when refunds happen,  a charge create 31 days ago and refunded 29 days ago, should it be listed?

need to add some schema checking to make sure the responses are good.

logic for limiting to 30 days is untested.  Also pagination is untested and almost certainly broken.
