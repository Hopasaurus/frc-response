

Started with creating an OpenApi spec in https://editor.swagger.io/

then integrated the swagger ui, then implemented the routes, controller and repository.

could have generated code from the api spec but this was small enough that figuring out how for a one off thing would probably have taken longer then hand rolling the routes and controllers. Usually I only do code gen for clients.  Also in this case I had a few minor issues with the spec and fixed those up along the way as I was filling the routes and controllers.


notes on DELETE http response:
Some say that if the resource to be deleted is not found the response should be 404
This can break idempotence in that if a delete request succeeds but the connection is interrupted then the request might be retried. If deleting an item usually returns a 200 or 204 but the second request returns a 404 then there can be confusion on if the item was successfully deleted.
In this api I have used 204 for both the found and deleted and not found and deleted case. From the user perspective the result is the there is not a resource with the given id when the request is over.

Error messages returned as headers:
The error messages are returned as headers. 5.1.5 of the rest disertation is about uniform interface. Returning a custom error object is a common practice however it breaks the expectation that an Employee resource should be returned from an employee endpoint. Putting the error message in a header allows communicating the nature of the error out of band from the resource communication path.


