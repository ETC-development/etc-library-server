# ETC-Library website's backend

<hr>

## Geting started

### Installation:

```shell
git clone https://github.com/ETC-development/etc-library-server
cd etc-library-server
yarn #or npm install
```

### Setup:

1- Follow the instructions in
the [Google Drive API's documentations](https://developers.google.com/workspace/guides/create-credentials#oauth-client-id)
on how to create you oAuth2 credentials (`Client_ID`, `Client_Secret`) and how to use them to generate
your `Refresh_Token`.

2- Create a Mongodb database and get its URL (example host: [Mongodb Atlas](https://www.mongodb.com/atlas/database))

3- After that, create your .env file where you'll put the secrets and credentials:
`cp .env.example .env`

4- Fill the .env file with all the required keys

## How it works?

### Endpoints:

| Endpoint | Method | Description                                                                                                       | Request                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|:---------|:------:|:------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /        |  GET   | A simple endpoint that just returns a hardcoded text to indicate that the API is working                          | /                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | "works"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| /search  |  GET   | Receives query parameters that provide the search query filters, validates them, and then sends paginated results | Query parameters: <br/><br/> **name**: names of files or part of them (the API will return the files that have this as a substring of their names)<br/><br/>**type**: type of the file (exams, tests, worksheets, resources, courses)<br/><br/>**year**: the grade level of the file (1, 2, 3, 4 or 5)<br/><br/> **semester**: the semester (1 or 2) that the file belongs to, requires to provide the "year" param<br/><br/>**module**: name of the module that the files belong to (analysis 1, ...)<br/><br/><hr>**limit**: number of file objects to return (for pagination purpose)<br/>**page**: the page of the file objects to return according to the specified limit<br/> | Returns a json object that has these properties:<br/> **files**: array of [File](https://github.com/ETC-development/etc-library-server/blob/master/src/interfaces/index.interfaces.ts#L13) objects<br/> **totalFileCounts**: the total number of files that match the request query<br/> **totalPages**: the amount of pages that are made by splitting the results of the query with the provided limit<br/>**currentPage**: returns the same page given by the query<br/> **error**: an error message in case if something is wrong |




### What it does:
- When the server starts, it runs a [recursive function](https://github.com/ETC-development/etc-library-server/blob/master/src/utils/recursiveTraverse.ts) that traverses all the folders in the given Google Drive API.
- Whenever the recursive function finds files (`mimeType != folder`), it passes them to a [callback function](https://github.com/ETC-development/etc-library-server/blob/master/src/utils/recursionCallback.ts) which parses the path of the file into a [File](https://github.com/ETC-development/etc-library-server/blob/master/src/interfaces/index.interfaces.ts#L13) object and pushes it to an `indexedFiles` array.
- When all the folders are traversed, the `files` collection will get dropped, in order to avoid cases when our database would have info of files that have been deleted from the Drive.
- Finally, the `indexedFiles` array will be inserted into the `files` collection and the server Express will start listening to API calls.

<hr>

License Information: [AGPL3](https://github.com/ETC-development/etc-library-server/blob/master/LICENSE)
