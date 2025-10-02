// Flight Search API Configuration
const AMADEUS_API_KEY = 'YOUR_API_KEY_HERE';
const AMADEUS_API_SECRET = 'YOUR_API_SECRET_HERE';

// Set default date to tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById('departDate').valueAsDate = tomorrow;

// Flight Search Form Handler
document.getElementById('flightSearchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departDate = document.getElementById('departDate').value;
    const passengers = document.getElementById('passengers').value;

    const searchBtn = e.target.querySelector('.search-btn');
    const originalText = searchBtn.textContent;
    searchBtn.innerHTML = '<div class="spinner"></div>';
    searchBtn.disabled = true;

    try {
        const tokenResponse = await getAmadeusToken();
        
        if (tokenResponse) {
            const flights = await searchFlights(
                tokenResponse.access_token,
                origin,
                destination,
                departDate,
                passengers
            );
            
            if (flights && flights.data) {
                displayFlightResults(flights.data);
            } else {
                alert('No flights found. Please try different search criteria.');
            }
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('Error searching flights. Please check API configuration.');
        showDemoResults();
    } finally {
        searchBtn.textContent = originalText;
        searchBtn.disabled = false;
    }
});

async function getAmadeusToken() {
    if (AMADEUS_API_KEY === 'YOUR_API_KEY_HERE') {
        console.log(`
            🔑 API Setup Required:
            
            1. Sign up at https://developers.amadeus.com
            2. Create a new app to get your API Key and Secret
            3. Replace AMADEUS_API_KEY and AMADEUS_API_SECRET in js/main.js
            4. Free tier includes 2,000 API calls per month
        `);
        return null;
    }

    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`
    });

    return await response.json();
}

async function searchFlights(token, origin, destination, date, adults) {
    const response = await fetch(
        `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&max=10`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return await response.json();
}

function displayFlightResults(flights) {
    console.log('Flight results:', flights);
    alert(`Found ${flights.length} flights! Check console for details.`);
}

function showDemoResults() {
    console.log('Showing demo flight results...');
}