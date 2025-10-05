// Global variables
let currentStep = 1;
let tripType = 'oneway';
let selectedFrom = null;
let selectedTo = null;
let selectedFlight = null;
let passengerData = [];
let bookingData = {};
let currentAirportSelector = '';
let currentLanguage = 'ar'; // Default to Arabic

// Language translations - will be loaded from JSON file
let translations = {};

// Load translations from JSON file
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
        console.log('Translations loaded successfully');
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to default Arabic if loading fails
        translations = {
            ar: {},
            en: {}
        };
    }
}

// Airport data with bilingual support
const airports = [
    {code: 'CAI', name_ar: 'القاهرة - مطار القاهرة الدولي', name_en: 'Cairo - Cairo International Airport', city_ar: 'القاهرة', city_en: 'Cairo', country_ar: 'مصر', country_en: 'Egypt'},
    {code: 'RUH', name_ar: 'الرياض - مطار الملك خالد الدولي', name_en: 'Riyadh - King Khalid International Airport', city_ar: 'الرياض', city_en: 'Riyadh', country_ar: 'السعودية', country_en: 'Saudi Arabia'},
    {code: 'JED', name_ar: 'جدة - مطار الملك عبدالعزيز الدولي', name_en: 'Jeddah - King Abdulaziz International Airport', city_ar: 'جدة', city_en: 'Jeddah', country_ar: 'السعودية', country_en: 'Saudi Arabia'},
    {code: 'DXB', name_ar: 'دبي - مطار دبي الدولي', name_en: 'Dubai - Dubai International Airport', city_ar: 'دبي', city_en: 'Dubai', country_ar: 'الإمارات', country_en: 'UAE'},
    {code: 'AUH', name_ar: 'أبوظبي - مطار أبوظبي الدولي', name_en: 'Abu Dhabi - Abu Dhabi International Airport', city_ar: 'أبوظبي', city_en: 'Abu Dhabi', country_ar: 'الإمارات', country_en: 'UAE'},
    {code: 'DOH', name_ar: 'الدوحة - مطار حمد الدولي', name_en: 'Doha - Hamad International Airport', city_ar: 'الدوحة', city_en: 'Doha', country_ar: 'قطر', country_en: 'Qatar'},
    {code: 'KWI', name_ar: 'الكويت - مطار الكويت الدولي', name_en: 'Kuwait - Kuwait International Airport', city_ar: 'الكويت', city_en: 'Kuwait City', country_ar: 'الكويت', country_en: 'Kuwait'},
    {code: 'BAH', name_ar: 'المنامة - مطار البحرين الدولي', name_en: 'Manama - Bahrain International Airport', city_ar: 'المنامة', city_en: 'Manama', country_ar: 'البحرين', country_en: 'Bahrain'},
    {code: 'MCT', name_ar: 'مسقط - مطار مسقط الدولي', name_en: 'Muscat - Muscat International Airport', city_ar: 'مسقط', city_en: 'Muscat', country_ar: 'عمان', country_en: 'Oman'},
    {code: 'AMM', name_ar: 'عمان - مطار الملكة علياء الدولي', name_en: 'Amman - Queen Alia International Airport', city_ar: 'عمان', city_en: 'Amman', country_ar: 'الأردن', country_en: 'Jordan'},
    {code: 'BEY', name_ar: 'بيروت - مطار رفيق الحريري الدولي', name_en: 'Beirut - Rafic Hariri International Airport', city_ar: 'بيروت', city_en: 'Beirut', country_ar: 'لبنان', country_en: 'Lebanon'},
    {code: 'LHR', name_ar: 'لندن - مطار هيثرو', name_en: 'London - Heathrow Airport', city_ar: 'لندن', city_en: 'London', country_ar: 'بريطانيا', country_en: 'United Kingdom'},
    {code: 'CDG', name_ar: 'باريس - مطار شارل ديغول', name_en: 'Paris - Charles de Gaulle Airport', city_ar: 'باريس', city_en: 'Paris', country_ar: 'فرنسا', country_en: 'France'},
    {code: 'FCO', name_ar: 'روما - مطار فيوميتشينو', name_en: 'Rome - Fiumicino Airport', city_ar: 'روما', city_en: 'Rome', country_ar: 'إيطاليا', country_en: 'Italy'},
    {code: 'FRA', name_ar: 'فرانكفورت - مطار فرانكفورت', name_en: 'Frankfurt - Frankfurt Airport', city_ar: 'فرانكفورت', city_en: 'Frankfurt', country_ar: 'ألمانيا', country_en: 'Germany'},
    {code: 'IST', name_ar: 'إسطنبول - مطار إسطنبول الجديد', name_en: 'Istanbul - Istanbul Airport', city_ar: 'إسطنبول', city_en: 'Istanbul', country_ar: 'تركيا', country_en: 'Turkey'}
];

// Airlines data
const airlines = [
    {code: 'BS', name_ar: 'بلوسكاي إيرويز', name_en: 'BlueSky Airways', color: '#1a2a6c'},
    {code: 'EG', name_ar: 'مصر للطيران', name_en: 'EgyptAir', color: '#c41e3a'},
    {code: 'SV', name_ar: 'الخطوط السعودية', name_en: 'Saudi Arabian Airlines', color: '#006c35'},
    {code: 'EK', name_ar: 'طيران الإمارات', name_en: 'Emirates', color: '#ff6900'},
    {code: 'QR', name_ar: 'الخطوط القطرية', name_en: 'Qatar Airways', color: '#5d1a3b'},
    {code: 'KU', name_ar: 'الخطوط الكويتية', name_en: 'Kuwait Airways', color: '#0085c8'},
    {code: 'GF', name_ar: 'طيران الخليج', name_en: 'Gulf Air', color: '#c8102e'},
    {code: 'WY', name_ar: 'الطيران العماني', name_en: 'Oman Air', color: '#e31837'}
];

// Helper function to get text based on current language
function getText(key) {
    return translations[currentLanguage][key] || key;
}

function getAirportName(airport) {
    return currentLanguage === 'ar' ? airport.name_ar : airport.name_en;
}

function getAirportCity(airport) {
    return currentLanguage === 'ar' ? airport.city_ar : airport.city_en;
}

function getAirlineName(airline) {
    return currentLanguage === 'ar' ? airline.name_ar : airline.name_en;
}

// Authentication check - MUST be called before any booking operation
function checkAuthentication() {
    const user = AuthService.currentUser();
    if (!user) {
        showAuthRequiredModal();
        return false;
    }
    // Update booking data with user info
    bookingData.userEmail = user.email;
    bookingData.userName = user.name;
    bookingData.userPhone = user.phone;
    return true;
}

function showAuthRequiredModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal fade" id="authRequiredModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle-fill"></i> 
                            ${getText('loginRequired') || 'تسجيل الدخول مطلوب'}
                        </h5>
                    </div>
                    <div class="modal-body text-center py-4">
                        <i class="bi bi-person-lock display-1 text-warning mb-3"></i>
                        <p class="fs-5">${getText('loginRequiredMessage') || 'يجب تسجيل الدخول أولاً للمتابعة في حجز الرحلة'}</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-primary btn-lg px-5" onclick="window.location.href='login.html'">
                            <i class="bi bi-box-arrow-in-right"></i>
                            ${getText('loginNow') || 'تسجيل الدخول الآن'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal.firstElementChild);
    const authModal = new bootstrap.Modal(document.getElementById('authRequiredModal'));
    authModal.show();
    
    // Prevent closing the modal
    document.getElementById('authRequiredModal').addEventListener('hide.bs.modal', function (e) {
        e.preventDefault();
    });
}

// Language switching
function switchLanguage(lang) {
    currentLanguage = lang;
    updatePageTexts();
    populateAirports();
    
    // Update language selector appearance
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update page direction for RTL/LTR
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
}

function updatePageTexts() {
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' && element.type !== 'button' && element.type !== 'submit') {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
    
    // Update step indicators
    updateStepIndicators();
}

function updateStepIndicators() {
    const stepTexts = [getText('search'), getText('selectFlight'), getText('passengerData'), getText('payment'), getText('confirmation')];
    document.querySelectorAll('.step div:last-child').forEach((step, index) => {
        if (stepTexts[index]) {
            step.textContent = stepTexts[index];
        }
    });
}

// Initialize the page

window.onload = async function() {
    // Load translations first
    await loadTranslations();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departureDate').min = today;
    document.getElementById('returnDate').min = today;
    document.getElementById('departureDate').value = today;
    
    // Set default language
    currentLanguage = 'ar';
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    // Add language selector to the page
    addLanguageSelector();
    
    // Update page texts
    updatePageTexts();
    
    // Populate airports modal
    populateAirports();
    
    // Check authentication and fill user data if logged in
    const user = AuthService.currentUser();
    if (user) {
        fillUserData();
    }
};

function addLanguageSelector() {
    const header = document.querySelector('.header');
    if (header) {
        const langSelector = document.createElement('div');
        langSelector.className = 'language-selector mb-3';
        langSelector.innerHTML = `
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm language-btn active" data-lang="ar" onclick="switchLanguage('ar')">
                    العربية
                </button>
                <button type="button" class="btn btn-outline-primary btn-sm language-btn" data-lang="en" onclick="switchLanguage('en')">
                    English
                </button>
            </div>
        `;
        header.appendChild(langSelector);
    }
}

function fillUserData() {
    const user = AuthService.currentUser();
    if (!user) return;
    
    bookingData.userEmail = user.email;
    bookingData.userName = user.name;
    bookingData.userPhone = user.phone;
}

function populateAirports() {
    const airportsList = document.getElementById('airportsList');
    if (!airportsList) return;
    
    airportsList.innerHTML = '';
    
    airports.forEach(airport => {
        const airportDiv = document.createElement('div');
        airportDiv.className = 'airport-option';
        airportDiv.innerHTML = `
            <div><strong>${airport.code}</strong> - ${getAirportCity(airport)}</div>
            <small class="text-muted">${getAirportName(airport)}</small>
        `;
        airportDiv.onclick = () => selectAirport(airport);
        airportsList.appendChild(airportDiv);
    });
}

function filterAirports(searchText) {
    const airportsList = document.getElementById('airportsList');
    if (!airportsList) return;
    
    const filtered = airports.filter(airport => 
        getAirportName(airport).toLowerCase().includes(searchText.toLowerCase()) ||
        getAirportCity(airport).toLowerCase().includes(searchText.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchText.toLowerCase())
    );
    
    airportsList.innerHTML = '';
    filtered.forEach(airport => {
        const airportDiv = document.createElement('div');
        airportDiv.className = 'airport-option';
        airportDiv.innerHTML = `
            <div><strong>${airport.code}</strong> - ${getAirportCity(airport)}</div>
            <small class="text-muted">${getAirportName(airport)}</small>
        `;
        airportDiv.onclick = () => selectAirport(airport);
        airportsList.appendChild(airportDiv);
    });
}

function setTripType(type) {
    tripType = type;
    const returnContainer = document.getElementById('returnDateContainer');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => link.classList.remove('active'));
    
    if (type === 'roundtrip') {
        returnContainer.style.display = 'block';
        document.querySelector('button[onclick="setTripType(\'roundtrip\')"]').classList.add('active');
        document.getElementById('returnDate').required = true;
    } else {
        returnContainer.style.display = 'none';
        document.querySelector('button[onclick="setTripType(\'oneway\')"]').classList.add('active');
        document.getElementById('returnDate').required = false;
    }
}

function showAirportSelector(type) {
    currentAirportSelector = type;
    const modal = new bootstrap.Modal(document.getElementById('airportModal'));
    modal.show();
}

function selectAirport(airport) {
    if (currentAirportSelector === 'from') {
        selectedFrom = airport;
        document.getElementById('fromInput').value = `${airport.code} - ${getAirportCity(airport)}`;
    } else {
        selectedTo = airport;
        document.getElementById('toInput').value = `${airport.code} - ${getAirportCity(airport)}`;
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('airportModal'));
    modal.hide();
}

function searchFlights() {
    if (!checkAuthentication()) {
        return;
    }
    
    if (!selectedFrom || !selectedTo) {
        alert(getText('pleaseSelectAirports'));
        return;
    }

    const departureDate = document.getElementById('departureDate').value;
    if (!departureDate) {
        alert(getText('pleaseSelectDepartureDate'));
        return;
    }

    bookingData = {
        from: selectedFrom,
        to: selectedTo,
        departureDate: departureDate,
        returnDate: document.getElementById('returnDate').value,
        passengers: parseInt(document.getElementById('passengers').value),
        class: document.getElementById('class').value,
        tripType: tripType,
        userEmail: bookingData.userEmail,
        userName: bookingData.userName,
        userPhone: bookingData.userPhone 
    };

    generateFlightResults();
    
    document.getElementById('bookingForm').classList.add('hidden');
    document.getElementById('flightResults').classList.remove('hidden');
    
    const arrow = currentLanguage === 'ar' ? '←' : '→';
    document.getElementById('searchSummary').textContent = 
        `${getAirportCity(selectedFrom)} ${arrow} ${getAirportCity(selectedTo)} • ${formatDate(departureDate)} • ${bookingData.passengers} ${getText('passengers')}`;
}

function generateFlightResults() {
    const flightsList = document.getElementById('flightsList');
    flightsList.innerHTML = '';

    const numFlights = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numFlights; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const departureTime = generateRandomTime();
        const arrivalTime = generateRandomTime(departureTime);
        const duration = calculateDuration(departureTime, arrivalTime);
        const price = generatePrice();
        const stops = Math.random() > 0.6 ? 1 : 0;
        
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        const arrow = currentLanguage === 'ar' ? '←' : '→';
        flightCard.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-1">
                    <div class="airline-logo" style="background: ${airline.color}">
                        ${airline.code}
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-4 text-center">
                            <h5>${departureTime}</h5>
                            <p class="mb-0 text-muted">${selectedFrom.code}</p>
                        </div>
                        <div class="col-4 text-center">
                            <small class="text-muted">${duration}</small>
                            <div class="position-relative">
                                <hr class="my-2">
                                <i class="bi bi-airplane position-absolute top-50 start-50 translate-middle bg-white px-2"></i>
                            </div>
                            <small class="text-muted">${stops === 0 ? getText('direct') : stops + ' ' + getText('stops')}</small>
                        </div>
                        <div class="col-4 text-center">
                            <h5>${arrivalTime}</h5>
                            <p class="mb-0 text-muted">${selectedTo.code}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div>
                        <small class="text-muted">${getAirlineName(airline)}</small>
                        <br>
                        <small class="text-muted">${getText('flightNumber')} ${airline.code}${Math.floor(Math.random() * 9000) + 1000}</small>
                    </div>
                </div>
                <div class="col-md-2 text-center">
                    <div class="price-tag mb-2">${price} ${getText('currency')}</div>
                    <button class="btn btn-outline-primary btn-sm" onclick="selectFlight(${i}, '${airline.code}', '${getAirlineName(airline)}', '${departureTime}', '${arrivalTime}', '${duration}', ${price}, ${stops})">
                        ${getText('select')}
                    </button>
                </div>
            </div>
        `;
        
        flightsList.appendChild(flightCard);
    }
}

function selectFlight(index, airlineCode, airlineName, departure, arrival, duration, price, stops) {
    selectedFlight = {
        index,
        airline: {code: airlineCode, name: airlineName},
        departure,
        arrival,
        duration,
        price,
        stops,
        flightNumber: airlineCode + (Math.floor(Math.random() * 9000) + 1000)
    };

    showPassengerDetails();
}

function showPassengerDetails() {
    document.getElementById('flightResults').classList.add('hidden');
    document.getElementById('passengerDetails').classList.remove('hidden');
    
    const summary = document.getElementById('selectedFlightSummary');
    const arrow = currentLanguage === 'ar' ? '←' : '→';
    summary.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h6><i class="bi bi-airplane"></i> ${selectedFlight.airline.name} - ${selectedFlight.flightNumber}</h6>
                <p class="mb-0">${getAirportCity(bookingData.from)} ${arrow} ${getAirportCity(bookingData.to)} • ${formatDate(bookingData.departureDate)} • ${selectedFlight.departure} - ${selectedFlight.arrival}</p>
            </div>
            <div class="col-md-4 text-end">
                <h5>${selectedFlight.price * bookingData.passengers} ${getText('currency')}</h5>
                <small class="text-muted">${bookingData.passengers} ${getText('passengers')} × ${selectedFlight.price} ${getText('currency')}</small>
            </div>
        </div>
    `;
    
    generatePassengerForms();
}

function generatePassengerForms() {
    const container = document.getElementById('passengersContainer');
    container.innerHTML = '';
    
    const user = AuthService.currentUser();
    
    for (let i = 0; i < bookingData.passengers; i++) {
        const passengerForm = document.createElement('div');
        passengerForm.className = 'passenger-form';
        
        const isFirstPassenger = i === 0;
        let firstName = '';
        let lastName = '';
        let email = '';
        
        if (isFirstPassenger && user && bookingData.userName) {
            const nameParts = bookingData.userName.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
            email = bookingData.userEmail || '';
            phone = bookingData.userPhone || ''; 
        }
        
        passengerForm.innerHTML = `
            <h6 data-translate="passenger">${getText('passenger')} ${i + 1}</h6>
            <div class="row">
                <div class="col-md-2 mb-3">
                    <label class="form-label" data-translate="title">${getText('title')}</label>
                    <select class="form-select" name="title_${i}">
                        <option value="Mr" data-translate="mr">${getText('mr')}</option>
                        <option value="Mrs" data-translate="mrs">${getText('mrs')}</option>
                        <option value="Ms" data-translate="ms">${getText('ms')}</option>
                    </select>
                </div>
                <div class="col-md-5 mb-3">
                    <label class="form-label" data-translate="firstName">${getText('firstName')}</label>
                    <input type="text" class="form-control" name="firstName_${i}" value="${firstName}" required>
                </div>
                <div class="col-md-5 mb-3">
                    <label class="form-label" data-translate="lastName">${getText('lastName')}</label>
                    <input type="text" class="form-control" name="lastName_${i}" value="${lastName}" required>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label" data-translate="birthDate">${getText('birthDate')}</label>
                    <input type="date" class="form-control" name="birthDate_${i}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label" data-translate="nationality">${getText('nationality')}</label>
                    <select class="form-control" name="nationality_${i}">
                        <option value="EG" data-translate="egyptian">${getText('egyptian')}</option>
                        <option value="SA" data-translate="saudi">${getText('saudi')}</option>
                        <option value="AE" data-translate="emirati">${getText('emirati')}</option>
                        <option value="QA" data-translate="qatari">${getText('qatari')}</option>
                        <option value="KW" data-translate="kuwaiti">${getText('kuwaiti')}</option>
                        <option value="BH" data-translate="bahraini">${getText('bahraini')}</option>
                        <option value="OM" data-translate="omani">${getText('omani')}</option>
                        <option value="JO" data-translate="jordanian">${getText('jordanian')}</option>
                        <option value="LB" data-translate="lebanese">${getText('lebanese')}</option>
                        <option value="SY" data-translate="syrian">${getText('syrian')}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label" data-translate="passport">${getText('passport')}</label>
                    <input type="text" class="form-control" name="passport_${i}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label" data-translate="passportExpiry">${getText('passportExpiry')}</label>
                    <input type="date" class="form-control" name="passportExpiry_${i}" required>
                </div>
            </div>
            ${i === 0 ? `
            <h6 class="mt-4" data-translate="contactInfo">${getText('contactInfo')}</h6>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label" data-translate="email">${getText('email')}</label>
                    <input type="email" class="form-control" name="email" value="${email}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label" data-translate="phone">${getText('phone')}</label>
                   <input type="tel" class="form-control" name="phone" value="${phone}" required>

                </div>
            </div>
            ` : ''}
        `;
        
        container.appendChild(passengerForm);
    }
}

function proceedToPayment() {
    const forms = document.querySelectorAll('#passengersContainer input[required], #passengersContainer select[required]');
    let valid = true;
    
    forms.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!valid) {
        alert(getText('pleaseFillAllData'));
        return;
    }
    
    passengerData = [];
    for (let i = 0; i < bookingData.passengers; i++) {
        passengerData.push({
            title: document.querySelector(`[name="title_${i}"]`).value,
            firstName: document.querySelector(`[name="firstName_${i}"]`).value,
            lastName: document.querySelector(`[name="lastName_${i}"]`).value,
            birthDate: document.querySelector(`[name="birthDate_${i}"]`).value,
            nationality: document.querySelector(`[name="nationality_${i}"]`).value,
            passport: document.querySelector(`[name="passport_${i}"]`).value,
            passportExpiry: document.querySelector(`[name="passportExpiry_${i}"]`).value
        });
    }
    
    if (bookingData.passengers > 0) {
        bookingData.email = document.querySelector('[name="email"]').value;
        bookingData.phone = document.querySelector('[name="phone"]').value;
    }
    
    showPayment();
}

function showPayment() {
    document.getElementById('passengerDetails').classList.add('hidden');
    document.getElementById('paymentSection').classList.remove('hidden');
    
    generateBookingSummary();
}

function generateBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    const basePrice = selectedFlight.price * bookingData.passengers;
    const taxes = Math.round(basePrice * 0.15);
    const fees = 50;
    const total = basePrice + taxes + fees;
    
    summary.innerHTML = `
        <div class="d-flex justify-content-between mb-2">
            <span data-translate="ticketPrice">${getText('ticketPrice')}</span>
            <span>${basePrice} ${getText('currency')}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span data-translate="taxesFees">${getText('taxesFees')}</span>
            <span>${taxes} ${getText('currency')}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span data-translate="serviceFees">${getText('serviceFees')}</span>
            <span>${fees} ${getText('currency')}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between">
            <strong data-translate="total">${getText('total')}</strong>
            <strong>${total} ${getText('currency')}</strong>
        </div>
        <hr>
        <div class="mt-3">
            <h6 data-translate="flightDetails">${getText('flightDetails')}</h6>
            <small class="text-muted">
                ${getAirportCity(bookingData.from)} → ${getAirportCity(bookingData.to)}<br>
                ${formatDate(bookingData.departureDate)}<br>
                ${selectedFlight.flightNumber} - ${selectedFlight.departure}<br>
                ${bookingData.passengers} ${getText('passengers')} - ${getClassText(bookingData.class)}
            </small>
        </div>
    `;
    
    bookingData.total = total;
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(pm => pm.classList.remove('selected'));
    event.target.closest('.payment-method').classList.add('selected');
    
    const creditCardForm = document.getElementById('creditCardForm');
    const payButton = document.getElementById('payButton');
    
    if (method === 'visa') {
        creditCardForm.classList.remove('hidden');
        payButton.disabled = true;
        
        const cardInputs = creditCardForm.querySelectorAll('input');
        cardInputs.forEach(input => {
            input.addEventListener('input', validateCardForm);
        });
    } else {
        creditCardForm.classList.add('hidden');
        payButton.disabled = false;
    }
    
    bookingData.paymentMethod = method;
}

function validateCardForm() {
    const cardNumber = document.querySelector('#creditCardForm input[placeholder*="1234"]').value;
    const expiry = document.querySelector('#creditCardForm input[placeholder="MM/YY"]').value;
    const cvv = document.querySelector('#creditCardForm input[placeholder="123"]').value;
    const name = document.querySelector('#creditCardForm input[placeholder*="' + getText('cardHolderNamePlaceholder') + '"]').value;
    
    const payButton = document.getElementById('payButton');
    payButton.disabled = !(cardNumber.length >= 16 && expiry.length >= 5 && cvv.length >= 3 && name.trim());
}

function processPayment() {
    const payButton = document.getElementById('payButton');
    payButton.innerHTML = `<i class="bi bi-hourglass-split"></i> ${getText('processing')}`;
    payButton.disabled = true;
    
    setTimeout(() => {
        bookingData.reference = 'BS' + Math.random().toString(36).substr(2, 6).toUpperCase();
        showConfirmation();
    }, 2000);
}

function showConfirmation() {
    document.getElementById('paymentSection').classList.add('hidden');
    document.getElementById('confirmationSection').classList.remove('hidden');
    
    document.getElementById('bookingReference').textContent = bookingData.reference;
    generateTicketDetails();
}

function generateTicketDetails() {
    const ticketDetails = document.getElementById('ticketDetails');
    
    ticketDetails.innerHTML = `
        <div class="row mb-3">
            <div class="col-6">
                <strong data-translate="flightNumber">${getText('flightNumber')}</strong> ${selectedFlight.flightNumber}<br>
                <strong data-translate="airline">${getText('airline')}</strong> ${selectedFlight.airline.name}<br>
                <strong data-translate="date">${getText('date')}</strong> ${formatDate(bookingData.departureDate)}<br>
                <strong data-translate="departure">${getText('departure')}</strong> ${selectedFlight.departure} ${getText('from')} ${getAirportCity(bookingData.from)}<br>
                <strong data-translate="arrival">${getText('arrival')}</strong> ${selectedFlight.arrival} ${getText('to')} ${getAirportCity(bookingData.to)}
            </div>
            <div class="col-6">
                <strong data-translate="passengers_label">${getText('passengers_label')}</strong><br>
                ${passengerData.map(p => `${p.title} ${p.firstName} ${p.lastName}`).join('<br>')}<br>
                <strong data-translate="class_label">${getText('class_label')}</strong> ${getClassText(bookingData.class)}<br>
                <strong data-translate="seats">${getText('seats')}</strong> ${getText('seatsWillBeAssigned')}<br>
                <strong data-translate="totalPaid">${getText('totalPaid')}</strong> ${bookingData.total} ${getText('currency')}
            </div>
        </div>
    `;
}

function downloadTicket() {
    alert(getText('downloadTicket'));
}

function emailTicket() {
    alert(getText('emailTicket'));
}

function showBookingForm() {
    currentStep = 1;
    tripType = 'oneway';
    selectedFrom = null;
    selectedTo = null;
    selectedFlight = null;
    passengerData = [];
    bookingData = {};
    currentAirportSelector = '';
    
    document.getElementById('bookingForm').classList.remove('hidden');
    document.getElementById('flightResults').classList.add('hidden');
    document.getElementById('passengerDetails').classList.add('hidden');
    document.getElementById('paymentSection').classList.add('hidden');
    document.getElementById('confirmationSection').classList.add('hidden');
    document.getElementById('fromInput').value = '';
    document.getElementById('toInput').value = '';
    document.getElementById('departureDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('returnDate').value = '';
    document.getElementById('passengers').value = '1';
    document.getElementById('class').value = 'economy';
    setTripType('oneway');
    
    fillUserData();
}
function showFlightResults() {
    document.getElementById('passengerDetails').classList.add('hidden');
    document.getElementById('flightResults').classList.remove('hidden');
}
function backToPassengers() {
    document.getElementById('paymentSection').classList.add('hidden');
    document.getElementById('passengerDetails').classList.remove('hidden');
}

function backToFlights() {
    document.getElementById('passengerDetails').classList.add('hidden');
    document.getElementById('flightResults').classList.remove('hidden');
}


function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const locale = currentLanguage === 'ar' ? 'ar-EG' : 'en-US';
    return new Date(dateStr).toLocaleDateString(locale, options);
}

function generateRandomTime(startTime) {
    let hour, minute;
    if (startTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        hour = (startHour + Math.floor(Math.random() * 5) + 1) % 24;
        minute = Math.floor(Math.random() * 60);
    } else {
        hour = Math.floor(Math.random() * 24);
        minute = Math.floor(Math.random() * 60);
    }
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function calculateDuration(departure, arrival) {
    const [depHour, depMinute] = departure.split(':').map(Number);
    const [arrHour, arrMinute] = arrival.split(':').map(Number);
    let durationHour = arrHour - depHour;
    let durationMinute = arrMinute - depMinute;
    if (durationMinute < 0) {
        durationMinute += 60;
        durationHour--;
    }
    if (durationHour < 0) {
        durationHour += 24;
    }
    const hourText = currentLanguage === 'ar' ? 'س' : 'h';
    const minuteText = currentLanguage === 'ar' ? 'د' : 'm';
    return `${durationHour}${hourText} ${durationMinute}${minuteText}`;
}

function generatePrice() {
    return Math.floor(Math.random() * 2000) + 500;
}

function getClassText(cls) {
    const classTexts = {
        economy: getText('economy'),
        premium: getText('premium'),
        business: getText('business'),
        first: getText('first')
    };
    return classTexts[cls] || cls;
}