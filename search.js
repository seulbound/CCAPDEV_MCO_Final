document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const userList = document.getElementById("user-result");
    const searchDropdownContainer = document.querySelector(".search-dd-container");

    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.trim().toLowerCase();

        if (searchText.length > 0) {
            fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchInput: searchText })
            })
            .then(response => response.json())
            .then(users => {
                renderUserList(users);
                searchDropdownContainer.style.display = "block"; 
            })
            .catch(error => console.error("Error fetching users:", error));
        } else {
            searchDropdownContainer.style.display = "none"; 
        }
    });

    function renderUserList(users) {
        userList.innerHTML = "";
        users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = user.firstName + " " + user.lastName;
            
            listItem.addEventListener("click", function () {
                const queryString = `?firstName=${user.firstName}&lastName=${user.lastName}`;
                const profileURL = '/profile' + queryString;
    
                window.location.href = profileURL;
            });
            userList.appendChild(listItem);
        });
    }
    
});
