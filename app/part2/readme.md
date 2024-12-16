# Part 2: Objective: Demonstrate the ability to design and build a REST API.
## Scenario:
Your team needs a local API to manage a list of employees for a small application. Build a REST API that supports basic CRUD operations.

## Task:
Create a REST API with the following endpoints: 
* POST /employees: Add a new employee (accepts name, email, and position). 
* GET /employees: Retrieve the list of all employees. 
* GET /employees/{id}: Retrieve details of a single employee by ID. 
* PUT /employees/{id}: Update the details of an employee. 
* DELETE /employees/{id}: Remove an employee by ID. 
* Store employee data in memory (a simple list or dictionary is sufficient).

## Considerations:
Ensure proper HTTP status codes for responses. Add validation for required fields in POST and PUT requests. Document the API with example requests and responses.


## Notes:

### Testing:

* Navigate to the site running locally: http://localhost:3000/part1/weather
* Enter a city name:
  * Examples:
    * Grand Rapids
    * Holland
    * Holland, MI (this one confuses me)
    * Holland, Michigan
    * Holland, USA
    * Holland, US
    * Holland, MI, USA
    * Holland, MI, US
    * Dorr
    * Burnips
    * Washington

### Potential Follow up:

The geocoding api is a little confusing, there could be a little work done on the city parsing to clean this up. Options could be to detect when two comma separated elements are entered and then detect if the second is a state abbreviation, if it then expand it to the full state name and add ",US".  Some testing would have to be done to ensure this is really valid and useful.


### Creating the API:
Started with creating an OpenApi(fka Swagger) spec in https://editor.swagger.io/ once the spec was created it was integrated into the project with Swagger UI to aid in exercising the UI.

Code can be generated from an OpenApi spec. I chose not to do that for this project as the number of endpoints is small it may have taken more time to integrate the generated code than it would take to write it. Using codegen for the client and server is useful for keeping both in sync. An alternative is to generate the spec from the server code base then use the generated spec to generate client code.


### Design decision notes:
#### DELETE response code:
I chose 204 as the response code for delete for all cases (other than internal server error). An alternate success code would be 200, but this implies a response body and none is provided in this service so does not quite fit. 

When the resource never existed an alternate http response is 404. This provides information to the user indicating that the resource that was intended to be deleted did not exist before the invocation of the service. This breaks idempotence. This is important when considering retries. If a client attempts to delete a resource and the service succeeds but there is some interruption and the client does not receive confirmation of deletion then the service may retry. If the server responds 404 on the retry this may result in an incorrect error message to the user. 

The DELETE service with a 204 response is saying that upon successful completion there will not be a resource available to GET with the given resource identifier.

#### Error messages returned as headers:
Some REST services return error messages in the response body. This can be difficult for some clients to consume also it is at odds with the Fielding dissertation section 5.1.5. 

A client may expect that the data being returned from an end point always conform to the same schema and given an error message in a different schema the client may have difficulty parsing this other schema.  

Also this can be seen as a violation of the architectural style proposed in the Fielding paper. Specifically section 5.1.5 which specifies a uniform interface. In the case of resource representation, I interpret this to mean that the request and response bodies for any interaction with a service for a resource should conform to the same interface. 

If an error message is to be put in response and json is being used consider conforming to RFC-9457: https://www.rfc-editor.org/rfc/rfc9457.html


Resources: https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm#sec_5_1


