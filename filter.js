function clearInputs() {
    document.getElementById("labInput").selectedIndex = 0;
    document.getElementById("dateInput").value = "";
    document.getElementById("timeSlotInput").selectedIndex = 0;
    document.getElementById("statusInput").selectedIndex = 0;
    document.getElementById("searchInput").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const labInput = document.getElementById("labInput");
    const dateInput = document.getElementById("dateInput");
    const timeSlotInput = document.getElementById("timeSlotInput");
    const statusInput = document.getElementById("statusInput");
    const bookingTableBody = document.querySelector("#reservation-table-list tbody");

    clearInputs();

    function clearInputsRefresh() {
        document.getElementById("labInput").selectedIndex = 0;
        document.getElementById("dateInput").value = "";
        document.getElementById("timeSlotInput").selectedIndex = 0;
        document.getElementById("statusInput").selectedIndex = 0;
        document.getElementById("searchInput").value = "";
        location.reload();
    }
    // Add event listeners to the filter inputs
    [searchInput, labInput, dateInput, timeSlotInput, statusInput].forEach(input => {
        input.addEventListener("input", handleFilter);
    });

    async function handleFilter() {
        const searchQuery = searchInput.value.trim().toLowerCase();
        const labValue = labInput.value.trim();
        const dateValue = dateInput.value;
        const timeSlotValue = timeSlotInput.value;
        const statusValue = statusInput.value;

        try {
            let response;
            if (searchQuery || labValue || dateValue || timeSlotValue || statusValue) {
                // If any input has a value, apply the filter
                response = await fetch('/filter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ searchQuery, labValue, dateValue, timeSlotValue, statusValue })
                });
            } else {
                // If no input has a value, retrieve all records
                response = await fetch('/viewreservationlabtech');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch filtered results');
            }

            const bookings = await response.json();
            renderBookingTable(bookings);
        } catch (error) {
            console.error('Error fetching filtered results:', error);
        }
    }

    function renderBookingTable(bookings) {
        // Clear existing table rows
        bookingTableBody.innerHTML = "";

        // Render filtered bookings into the table
        bookings.forEach(booking => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${booking.selectedLab}</td>
                <td>${booking.selectedSeats}</td>
                <td>${booking.selectedDate}</td>
                <td>${booking.selectedTimeSlot}</td>
                <td>${booking.status}</td>
                <td>${booking.reservedUser}</td>
            `;
            bookingTableBody.appendChild(row);
        });
    }

    document.getElementById("clear-button").addEventListener("click", clearInputsRefresh);

});
