document.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");
  const wm = document.getElementById("welcomeMsg");

  if (wm) {
    if (name && email) {
      wm.textContent = `Welcome back, ${name}! We wish you a happy journey ✈️`;
    } else {
      wm.textContent = "Welcome guest!";
    }
  }
});





 



 class CalendarWeatherWidget {
            constructor() {
                this.currentDate = new Date();
                this.init();
            }

            init() {
                this.updateCurrentDate();
                this.generateCalendar();
                this.updateWeather();
                this.setupEventListeners();
            }

            updateCurrentDate() {
                const dateElement = document.getElementById('currentDate');
                if (dateElement) {
                    const options = { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    };
                    dateElement.textContent = this.currentDate.toLocaleDateString('en-US', options);
                }
            }

            generateCalendar() {
                const calendar = document.getElementById('miniCalendar');
                if (!calendar) return;

                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());

                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                
                // Clear existing content
                calendar.innerHTML = '';

                // Add day headers
                days.forEach(day => {
                    const dayHeader = document.createElement('div');
                    dayHeader.className = 'calendar-header';
                    dayHeader.textContent = day;
                    calendar.appendChild(dayHeader);
                });

                // Add calendar days
                for (let i = 0; i < 35; i++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day';
                    dayElement.textContent = date.getDate();
                    
                    // Add classes for styling
                    if (date.toDateString() === today.toDateString()) {
                        dayElement.classList.add('today');
                    }
                    
                    if (date.getDay() === 0 || date.getDay() === 6) {
                        dayElement.classList.add('weekend');
                    }
                    
                    if (date.getMonth() !== today.getMonth()) {
                        dayElement.style.opacity = '0.3';
                    }
                    
                    dayElement.addEventListener('click', () => {
                        document.getElementById('quickDate').value = date.toISOString().split('T')[0];
                    });
                    
                    calendar.appendChild(dayElement);
                }
            }

            async updateWeather() {
                try {
                    // Simulate weather data (in a real app, you would fetch from an API)
                    const weatherData = {
                        current: {
                            temp: 24,
                            condition: 'sunny',
                            humidity: 65
                        }
                    };
                    
                    const tempElement = document.getElementById('temperature');
                    const detailsElement = document.getElementById('weatherDetails');
                    const iconElement = document.getElementById('weatherIcon');
                    
                    if (tempElement) tempElement.textContent = `${weatherData.current.temp}°C`;
                    if (detailsElement) {
                        detailsElement.textContent = `${this.capitalizeFirst(weatherData.current.condition)} • ${weatherData.current.humidity}% Humidity`;
                    }
                    if (iconElement) {
                        iconElement.className = `bi ${this.getWeatherIcon(weatherData.current.condition)} weather-icon`;
                    }
                } catch (error) {
                    console.log('Weather data unavailable, using defaults');
                }
            }

            getWeatherIcon(condition) {
                const icons = {
                    'sunny': 'bi-sun',
                    'cloudy': 'bi-clouds',
                    'rainy': 'bi-cloud-rain',
                    'partly-cloudy': 'bi-cloud-sun'
                };
                return icons[condition] || 'bi-sun';
            }

            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            setupEventListeners() {
                // Set default date to today
                const quickDate = document.getElementById('quickDate');
                if (quickDate) {
                    quickDate.value = new Date().toISOString().split('T')[0];
                    quickDate.min = new Date().toISOString().split('T')[0];
                }
            }
        }

        // Flight search functionality
        function handleQuickSearch(e) {
            e.preventDefault();
            
            const from = document.getElementById('quickFrom').value;
            const to = document.getElementById('quickTo').value;
            const date = document.getElementById('quickDate').value;
            const passengers = document.getElementById('quickPassengers').value;
            
            if (!from || !to || !date) {
                alert('Please fill in all search fields');
                return;
            }
            
            // Simulate search results
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Searching for flights from ${from} to ${to} on ${date} for ${passengers} passenger(s)...
                </div>
            `;
            resultsContainer.style.display = 'block';
            
            // Simulate API call delay
            setTimeout(() => {
                resultsContainer.innerHTML = `
                    <div class="alert alert-success">
                        <i class="bi bi-check-circle"></i> Found 5 flights matching your criteria! 
                        <a href="Booking.html" class="alert-link">View all flights</a>
                    </div>
                `;
            }, 1500);
        }

        // Initialize when DOM loads
        document.addEventListener('DOMContentLoaded', () => {
            new CalendarWeatherWidget();
            
            // Event listeners
            document.getElementById('quickSearchForm').addEventListener('submit', handleQuickSearch);
        });