document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.querySelector('.save-button');
    const profileImage = document.querySelector('.profile-image');
    const profileImageNav = document.querySelector('.profile-image-nav');
    const deleteAccountButton = document.querySelector('.delete-account-button');
    const deleteAccountPopup = document.querySelector('.popup-container');
    const deletePopup = document.querySelector('.popup');
    const cancelDeleteButton = document.querySelector('.popup-cancel-button');

    deleteAccountButton.addEventListener('click', function () {
        console.log("Delete Account clicked");
        deleteAccountPopup.style.display = 'flex';
        deletePopup.style.display = 'flex';
    });

    cancelDeleteButton.addEventListener('click', function () {
        console.log("Cancel Delete clicked");
        deleteAccountPopup.style.display = 'none';
    });
});
