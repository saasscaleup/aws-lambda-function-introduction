# aws-lambda-function-introduction

## Start and Stop ec2 instance example
```
// Load aws sdk
var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    
    // Declare response function
    var response = function(success,message){
        if (success){
            return {
                success: success, 
                body: message
            }
        }else{
            return message
        }
    };
    
    // Set ec2 instance with aws account region
    const ec2 = new aws.EC2({ region: event.instanceRegion });
    
    // Set instance ID
    const params = {
      InstanceIds: [event.instanceId],
    };
    
    if (event.action === "START") {

        // Call EC2 to start the selected instances
        ec2.startInstances(params, function(error, data) {
            if (error) {
                callback(response(false, error));
            } else {
                callback(null,response(true, data));
            }
         });
    } else if (event.action === "STOP") {
        
        // Call EC2 to stop the selected instances
        ec2.stopInstances(params, function(error, data) {
            if (error) {
                callback(response(false, error));
            } else {
                callback(null,response(true, data));
            }
        });
    } else {
        // Not allowed ACTION
        callback(response(false, 'Action ['+event.action+'] not found! Please use START or STOP as action'));
    }
}
```
