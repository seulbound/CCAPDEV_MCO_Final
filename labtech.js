document.addEventListener('DOMContentLoaded', function() {
    const cancelButton = document.querySelector('.cancel-button');
    const popupContainer = document.querySelector('.popup-container');
    const popup = document.querySelector('.popup');

    const sPopupContainer = document.querySelector('.status-popup-container');
    const sPopup = document.querySelector('.status-popup');
    const closeButton = document.querySelector('.popup-close-button');

    const popupCancelButton = document.querySelector('.popup-cancel-button');
    const popupProceedButton = document.querySelector('.popup-proceed-button');

    function updateCancelButtonState() {
        const checkedCheckboxes = document.querySelectorAll('input[name="reservationIds[]"]:checked');
        cancelButton.disabled = checkedCheckboxes.length === 0;
    }

    cancelButton.addEventListener('click', function() {
        popupContainer.style.display = 'flex';
        popup.style.display = 'flex';
    });

    popupCancelButton.addEventListener('click', function() {
        popupContainer.style.display = 'none';
        popup.style.display = 'none';
    });

    popupProceedButton.addEventListener('click', async function() {
        const checkboxes = document.querySelectorAll('input[name="reservationIds[]"]:checked');
        const bookingIds = Array.from(checkboxes).map(checkbox => checkbox.value);

        let requestBody = {
            reservationIds: bookingIds
        };

        try {
            const response = await fetch('/cancelBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                popupContainer.style.display = 'none';
                popup.style.display = 'none';

                sPopupContainer.style.display = 'flex';
                sPopup.style.display = 'flex';
                document.getElementById('status-message').textContent = 'Successful';
                location.reload(); // Reload the page after successful cancellation
            } else {
                console.error('Error cancelling bookings:', response.statusText);
            }
        } catch (error) {
            console.error('Error cancelling bookings:', error);
        }
    });

    closeButton.addEventListener('click', function() {
        sPopupContainer.style.display = 'none';
        sPopup.style.display = 'none';
    });
});
