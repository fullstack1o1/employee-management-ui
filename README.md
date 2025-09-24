job {
min;
max;
id;
}

department {
id;
name
}

employee {

}

{
"employeeId": 0,
"firstName": "string",
"lastName": "string",
"email": "string", // validate correct email using regex (sdfsd@gmail.com)
"phoneNumber": "string",
"hireDate": "2025-07-09",

"salary": 0, // first select job and allow salary only between job range
"jobId": 0, // link to job (getAllJObs)

managerId:0 // link to employee (getAllEmployees) (optional)

"departmentId": 0, // links to department

"employeeHistory": [
{
"startDate": "2025-07-09",
"endDate": "2025-07-09",
"jobId": 0,
"departmentId": 0
}
],
"employeeDocuments": [
{
"documentName": "string",
"documentContent": "string"
}
]
}

Pendings

- some validations
- upload functionality
- show/delete employee documents
- employee history
