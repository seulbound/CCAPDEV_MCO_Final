document.addEventListener('DOMContentLoaded', function () {
    const labMenu = document.querySelector('.lab-menu');
    const labDropdown = document.querySelector('.lab-dd-container');

    labMenu.addEventListener('click', function () {
        labDropdown.classList.toggle("open-labdd");
    });
});
