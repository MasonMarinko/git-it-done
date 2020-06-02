var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?directions=asc";
    fetch(apiUrl).then(function(){
    //======== If request successful ============//
    if (response.ok) {
        response.json().then(function(data) {
            console.log(data);
        });
    } else {
        alert("There was a problem with your request!");
    }
    });
};

getRepoIssues("facebook/react");