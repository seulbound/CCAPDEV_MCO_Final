//const { query } = require("express");

document.addEventListener("DOMContentLoaded", function () {
    const seatGrid = document.querySelector(".seat-grid");
    const confirmButton = document.querySelector(".confirm-button");
    const confirmationPanel = document.getElementById("confirmation-panel");
    const overlay = document.getElementById("overlay");
    const selectedSeatsContainer = document.getElementById("selected-seats");
    const anonymousCheckbox = document.getElementById("anonymous-checkbox");
    const confirmReservationButton = document.getElementById("confirm-reservation");
    const cancelReservationButton = document.getElementById("cancel-reservation");
    const dateInput = document.getElementById("dateInput");
    const timeInput = document.getElementById("timeSlotInput");
    const labInput = document.getElementById("labInput");

    const selectedSeats = [];

    const username = document.getElementById("username").value;
    console.log(username);

    const urlObject = new URL(window.location.href);
    const lab = urlObject.searchParams.get('labNum');
    console.log(lab);

    // Function to generate seat elements
    function generateSeats(seats) {
        // Clear existing seat grid content
        seatGrid.innerHTML = '';

        
        // Loop through each seat object and create corresponding HTML elements
        seats.forEach(seat => {
            const seatElement = document.createElement("div");
            seatElement.classList.add("seat");
            seatElement.dataset.status = seat.status; // Set seat status attribute
            seatElement.innerText = seat.seatNumber; // Set seat number text
            seatGrid.appendChild(seatElement); // Append seat element to seat grid

            // Event listener for seat selection
            seatElement.addEventListener("click", function () {
                toggleSeatSelection(seatElement);
                updateSelectedSeats();
            });
        });
    }

    // Function to toggle seat selection
    function toggleSeatSelection(seatElement) {
        seatElement.classList.toggle("selected");
        const seatNumber = seatElement.innerText;
        if (selectedSeats.includes(seatNumber)) {
            selectedSeats.splice(selectedSeats.indexOf(seatNumber), 1); // Remove seat if already selected
        } else {
            selectedSeats.push(seatNumber); // Add seat to selectedSeats
        }
    }

    // Function to update selected seats
    function updateSelectedSeats() {
        // Enable confirm button if seats are selected
        if (selectedSeats.length > 0) {
            confirmButton.removeAttribute("disabled");
        } else {
            confirmButton.setAttribute("disabled", true);
        }
    }

    confirmButton.addEventListener("click", function () {
        selectedSeatsContainer.innerHTML = selectedSeats.map(seat => seat.textContent).join(', ');
    
        // Show the overlay and confirmation panel
        overlay.style.display = "block";
        confirmationPanel.style.display = "block";
      });

      confirmReservationButton.addEventListener("click", async function () {
        // Get selected date and time slot from the HTML elements
        const selectedDate = document.getElementById("dateInput").value;
        const selectedTimeSlot = document.getElementById("timeSlotInput").value;
        const isAnonymousBooking = anonymousCheckbox.checked;
    
        // Check if date and time are selected
        if (!selectedDate || !selectedTimeSlot) {
            // Display error message on the page
            const errorMessageElement = document.getElementById("errorMessage");
            errorMessageElement.textContent = "Please select both date and time.";
            return; // Stay on the same page if validation fails
        }
    
        // Hide error message if date and time are selected
        document.getElementById("errorMessage").textContent = "";
    
        // Show confirmation panel
        document.getElementById("confirmation-panel").style.display = "block";
    
        // Populate selected seats in the confirmation panel
        const selectedSeatsElement = document.getElementById("selected-seats");
        selectedSeatsElement.textContent = ""; // Clear previous content
        selectedSeats.forEach(seat => {
            const seatElement = document.createElement("div");
            seatElement.textContent = seat;
            selectedSeatsElement.appendChild(seatElement);
        });
    
        // Event listener for confirm reservation button
        document.getElementById("confirm-reservation").addEventListener("click", async function () {
            const currentDate = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let reservationData = {
                reservedUser: username,
                selectedLab: lab,
                selectedDate: selectedDate,
                selectedTimeSlot: selectedTimeSlot,
                selectedSeats: selectedSeats,
                isAnonymous: isAnonymousBooking ? 1 : 0,
                requestDate: currentDate,
                requestTime: currentTime,
                status: "Ongoing"
            };
    
            // Send reservation data to the server
            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reservationData)
                });
    
                if (!response.ok) {
                    throw new Error('Failed to confirm booking');
                }
    
                console.log('Booking confirmed successfully');
                // Show thank you panel
                document.getElementById("thank-you-panel").style.display = "block";
            } catch (error) {
                console.error('Error confirming booking:', error);
                alert('Error confirming booking. Please try again.');
            }
        });
    
        // Event listener for cancel reservation button
        document.getElementById("cancel-reservation").addEventListener("click", function () {
            // Hide confirmation panel if the user cancels the reservation
            document.getElementById("confirmation-panel").style.display = "none";
        });
    });
    
    // Event listener for back to main page button in thank you panel
    document.getElementById("confirm-back-button").addEventListener("click", function () {
        window.location.href = '/loggedin'; // Redirect to main page
    });
    

    cancelReservationButton.addEventListener("click", function () {
        overlay.style.display = "none";
        confirmationPanel.style.display = "none";
    });

    //////////////////////////////////////////////////////

    const seats = [
        { seatNumber: "G1", status: "available" },
        { seatNumber: "G2", status: "available" },
        { seatNumber: "G3", status: "available" },
        { seatNumber: "G4", status: "available" },
        { seatNumber: "G5", status: "available" },
        { seatNumber: "G6", status: "available" },
        { seatNumber: "G7", status: "available" },
        { seatNumber: "G8", status: "available" },
        { seatNumber: "G9", status: "available" },
        { seatNumber: "G10", status: "available" },
        { seatNumber: "G11", status: "available" },
        { seatNumber: "G12", status: "available" },
        { seatNumber: "G13", status: "available" },
        { seatNumber: "G14", status: "available" },
        { seatNumber: "G15", status: "available" },
        { seatNumber: "G16", status: "available" },
        { seatNumber: "G17", status: "available" },
        { seatNumber: "G18", status: "available" },
        { seatNumber: "G19", status: "available" },
        { seatNumber: "G20", status: "available" },
        { seatNumber: "G21", status: "available" },
        { seatNumber: "G22", status: "available" },
        { seatNumber: "G23", status: "available" },
        { seatNumber: "G24", status: "available" },
        { seatNumber: "G25", status: "available" },
        { seatNumber: "G26", status: "available" },
        { seatNumber: "G27", status: "available" },
        { seatNumber: "G28", status: "available" },
        { seatNumber: "G29", status: "available" },
        { seatNumber: "G30", status: "available" }
    ];

  

    function updateSeatStatus(reservations) {
        // Loop through each seat
        seats.forEach(seat => {
            // Check if the seat number exists in reservations
            const isBooked = reservations.some(reservation =>
                reservation.selectedSeats.includes(seat.seatNumber)
            );
            
            // Update the seat status accordingly
            seat.status = isBooked ? "taken" : "available";
        });
    }

    dateInput.addEventListener("input", fetchSeatStatus);
    timeInput.addEventListener("input", fetchSeatStatus);
    labInput.addEventListener("input", fetchSeatStatus);

    function fetchSeatStatus() {
        const dateInput = document.getElementById("dateInput").value;
        const timeInput = document.getElementById("timeSlotInput").value;
        const labName = document.getElementById("labInput").value;

    
        if (dateInput && timeInput && labName) {
            fetch('/seatStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dateInput,
                    timeInput,
                    labName
                })
            })
            .then(response => response.json())
            .then(reservations => {
                console.log(reservations);
                updateSeatStatus(reservations);
                generateSeats(seats);
            })
            .catch(error => console.error("Error fetching seat status:", error));
        }
    }
    
});
