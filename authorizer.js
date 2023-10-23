const { CognitoJwtVerifier } = require("aws-jwt-verify")


const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: "id",
    clientId: process.env.COGNITO_WEB_CLIENT_ID
})

module.exports.handler = async (event, context, callback) => {

    var token = event.authorizationToken;
    console.log(token)
    try {

        const payload = jwtVerifier.verify(token);
        console.log(JSON.stringify(payload));
        callback(null, generatePolicy("user", "Allow", event.methodArn));

    } catch (error) {

        callback("Error invalid Token");
    }
    /*
    switch (token) {
        case "allow":
            console.log("entro aquí")
            console.log(event.methodArn)

            
            break;
        case "deny":
            callback(null, generatePolicy("user", "Deny", event.methodArn));
            break;
        default:
            
    }*/


};

const generatePolicy = (principalId, effect, resource) => {

    var authResponse = {};

    authResponse.principalId = principalId;

    if (effect && resource) {

        let policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Resource: resource,
                    Action: "execute-api:Invoke"
                }
            ]
        }
        authResponse.policyDocument = policyDocument;
    }

    authResponse.context = {
        foo: "bar"
    }
    console.log("entro aquí 2")
    console.log(JSON.stringify(authResponse));

    return authResponse;
}