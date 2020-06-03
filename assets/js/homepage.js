var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons")

//=======Grabbing information from API===========//
var getUserRepos = function (user) {
    // ============format the github api url====================//
    var apiUrl = "https://api.github.com/users/" + user + "/repos"

    //========make a request to the url===================//
    fetch(apiUrl)
        .then(function (response) {
            //==========request is successful==============//
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            //=====Notice this '.catch()' getting chained onto the end of the '.then()'
            alert("Unable to connect to GitHub");
        });
};

//===========Using this to capture the information put inside the input field====//
var formSubmitHandler = function (event) {
    event.preventDefault();
    //====get value from input element=====//
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
}

//=========== Allows for search with certain perameters======//
var getFeaturedRepos = function (language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featurted&sort=help-wanted-issues";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data.items, language);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    });
};


//========using this to properly show the information we actually want=====//
var displayRepos = function (repos, searchTerm) {
    //=============== check if api (search) returned any repos or user has none====//
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    //=====this "" is to clear out old content======//
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;


    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        //=======Format repo name=======//
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //=========create a container for each repo on HTML=======//
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center"
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //========= Create a Span element to hold the repository name=======//
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //======== append it to the container ===================//
        repoEl.appendChild(titleEl);

        // ======= creating a status element=================//
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //========= IF statement to show issues in the dom on each item=============//
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        repoEl.appendChild(statusEl);
        //================ append container to the dom ==========//
        repoContainerEl.appendChild(repoEl);
    }
};

var buttonClickHandler = function (event) {
    var language = event.target.getAttribute("data-language")
    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }
}


//==========This event calls and starts formSubmitHandler=======//
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);