'use strict';
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient,
  PutCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);
/*
const documentClient = new ddbDocClient.DocumentClient({
  region: 'us-east-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 5000
  }
})*/

module.exports.createNote = async (event, context, cb) => {

  context.callbackWaitsForEmptyEventLoop = false;
  let data = JSON.parse(event.body);

  try {

    const params = {
      TableName: "notes",
      Item: {
        notesId: data.id,
        title: data.title,
        description: data.description
      },
      ConditionExpression: "attribute_not_exists(notesId)"
    }

    await ddbDocClient.send(new PutCommand(params));

    cb(null, {
      statusCode: 201,
      body: JSON.stringify(
        {
          message: 'A new note Created',

        },
      ),
    })


  } catch (error) {
    console.log(error);
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: 'Error',

        },
      ),
    })
  }

};

