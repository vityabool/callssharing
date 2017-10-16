var express = require('express');
var azure = require('azure-storage');
require('dotenv-extended').load();
var router = express.Router();

//
// Parameters
//
// # of items on the page
var itemsPerPage = 10;
// time SAS lease will leave
var numSASmin = 10;
// Container name
var containerName = 'calls';
///

/* GET home page. */
router.get('/', function(req, res, next) {
    // Craete blob object
    var blobSvc = azure.createBlobService();

    // Set defaut value for search prefix
    if (req.query.search) 
        var searchPrefix = req.query.search;
    else 
        var searchPrefix = "";    

    // Check is need to display the next page
    if (req.query.next) 
        var next = JSON.parse(req.query.next);
    else 
        var next = null;

    // Query blob
    blobSvc.listBlobsSegmentedWithPrefix(containerName, searchPrefix, next, {delimiter: "", maxResults : itemsPerPage},  
    function(error, result, response) {
    
        if (error) {
            console.log('Error: ' + error);
        } else {
            var filesList = [];
            
            //var blobs = result.entries.reverse();

            // Prepare SAS
            var startDate = new Date();
            var expiryDate = new Date(startDate);
            expiryDate.setMinutes(startDate.getMinutes() + numSASmin);
            startDate.setMinutes(startDate.getMinutes() - numSASmin);
            
            var sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                Start: startDate,
                Expiry: expiryDate
            }
            };
            //
            // Generate data to display
            for (var i = 0, blob; blob = result.entries[i]; i++) {
                
                // Genearte SAS
                var token = blobSvc.generateSharedAccessSignature(containerName, result.entries[i].name, sharedAccessPolicy);
                var sasUrl = blobSvc.getUrl(containerName, result.entries[i].name, token);
                        
                filesList.push({
                    text: result.entries[i].name,
                    url: "javascript:changeURL('" + encodeURI(sasUrl) + "')"
                });
            } 
            // Render page
            res.render('calls', {
                filesList: filesList,
                nextToken: '?next=' + JSON.stringify(result.continuationToken) + '&search=' + searchPrefix,
                searchPrefix: searchPrefix
            });

        }
  }); // end query blob
  
});

module.exports = router;