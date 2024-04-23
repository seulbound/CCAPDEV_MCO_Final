document.addEventListener('DOMContentLoaded', function () {
    const profilePhoto = document.querySelector('.profile-image-nav');
    const labMenuContainer = document.querySelector('.lab-menu'); 
    const profileDropdown = document.querySelector('.profile-dd-container');
    const labDropdown = document.querySelector('.lab-dd-container');

    profilePhoto.addEventListener('click', function () {
        profileDropdown.classList.toggle("open-profiledd");
        labDropdown.classList.remove("open-labdd");
    });

    labMenuContainer.addEventListener('click', function () { // Updated event listener
        labDropdown.classList.toggle("open-labdd");
        profileDropdown.classList.remove("open-profiledd");
    });
});
