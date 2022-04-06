// Load aws sdk
var aws = require('aws-sdk');

// Load https request
var https = require('https');

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
    
    if (event.action === "START") {

        // Set ec2 instance with aws account region
        var ec2 = new aws.EC2({ region: event.instanceRegion });

        // Set instance ID
        var params = {
          InstanceIds: [event.instanceId],
        };
        
        // Call EC2 to start the selected instances
        ec2.startInstances(params, function(error, data) {
            if (error) {
                callback(response(false, error));
            } else {
                callback(null,response(true, data));
            }
         });
        
    } else if (event.action === "STOP") {
        
        // Set ec2 instance with aws account region
        var ec2 = new aws.EC2({ region: event.instanceRegion });

        // Set instance ID
        var params = {
          InstanceIds: [event.instanceId],
        };
        
        // Call EC2 to stop the selected instances
        ec2.stopInstances(params, function(error, data) {
            if (error) {
                callback(response(false, error));
            } else {
                callback(null,response(true, data));
            }
        });
        
    } else if (event.action === "SLACK") {
        
        var payload = JSON.stringify({
            text: `Message sent by aws lambda function\n If you learn something today, *Please Subscribe, Like and leave comment*`,
        });

        // Create https request option
        var options = {
            hostname: "hooks.slack.com",
            method: "POST",
            path: "<slack-webhook-path>",
        };

        //create the request object with the callback result
        var req = https.request(options, (res) => {
            
            console.log('statusCode:', res.statusCode);
            
            res.on("data", (body) => {
                if (res.statusCode==200)
                    callback(null, response(true,"Slack message was sent successfully!"));
                else
                    callback(response(false,"Error sending slack message: "+body)); 
            });
        });

        // handle the possible errors
        req.on("error", (error) => {
            console.error(error.message);
            callback(response(false,error.message));
        });

        //Invoke the request
        req.write(payload);

        //finish the request
        req.end();
        
    } else {
        // Not allowed ACTION
        callback(response(false, 'Action ['+event.action+'] not found! Please use START, STOP or SLACK as action'));
    }
}
