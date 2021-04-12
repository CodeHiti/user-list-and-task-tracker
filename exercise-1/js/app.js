var userDataApiUrl = 'https://5dc588200bbd050014fb8ae1.mockapi.io/assessment';

fetch(userDataApiUrl).then((response) => {
    return response.json();
}).then((userData) => {
    getUsers(userData);
});

var source = $("#template").html();
var template = Handlebars.compile(source);

function getUsers(users) {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var userDetails = {
            id: user["id"],
            createdAt: String(user["createdAt"]).split('.')[0].split('T')[0] + ' ' + String(user["createdAt"]).split('.')[0].split('T')[1],
            name: user["name"],
            avatar: user["avatar"]
        }
        var userTemplate = template(userDetails)
        $('.user-page').append(userTemplate);
    }
}

revealDetails = (userId) => {
    var userSpotted = document.getElementById(`item-id-${userId}`);
    var detailsButton = document.getElementById(`button-${userId}`);
    var nameFocussed = document.getElementById(`name-${userId}`);
    userSpotted.style.display = userSpotted.style.display === 'none' ? '' : 'none';
    detailsButton.style.display = detailsButton.style.display === '' ? 'none' : '';
    nameFocussed.style.textDecoration = nameFocussed.style.display === 'underline' ? '' : 'underline';
}