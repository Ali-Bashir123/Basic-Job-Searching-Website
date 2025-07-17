document.addEventListener('DOMContentLoaded', function() {
    /* Define variables  */
    const payinput = document.getElementById('pay');
    const paytimeframeInput = document.getElementById('pay-timeframe');
    const hoursperweekInput = document.getElementById('hours-per-week');
    const jobtitleInput = document.getElementById('job-title');

    const perhourNumE1 = document.getElementById('hourlyAmount');
    const perweekNumE1 = document.getElementById('weeklyAmount');
    const permonthNumE1 = document.getElementById('monthlyAmount');
    const peryearNumE1 = document.getElementById('yearlyAmount');

    
    const paymentForm = document.getElementById('payment-form');

    /* Add event listener to payment form */
    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        if (validateInputs()) {
            calculateSalary();
        }
    });

    /* Function to validate input fields to stop wrong inputs*/
    function validateInputs() {
        let valid = true;

        /* Define variables for warning messages */
        const payWarning = document.getElementById('pay-warning');
        const hoursWarning = document.getElementById('hours-warning');
        const jobTitleWarning = document.getElementById('job-title-warning');

        /* Validate job title input */
        if (!jobtitleInput.value) {
            jobTitleWarning.textContent = 'Please enter a job title';
            valid = false;
        } else {
            jobTitleWarning.textContent = '';
        }

        /* Validate pay input */
        if (!payinput.value || isNaN(parseFloat(payinput.value))) {
            payWarning.textContent = 'Please enter a valid numeric value for pay';
            valid = false;
        } else {
            payWarning.textContent = '';
        }

        /* Validate hours per week input */
        if (!hoursperweekInput.value || isNaN(parseFloat(hoursperweekInput.value))) {
            hoursWarning.textContent = 'Please enter a valid numeric value for hours per week';
            valid = false;
        } else {
            hoursWarning.textContent = '';
        }

        return valid;
    }

    /* Function to calculate salary from  input values */
    function calculateSalary() {
        const pay = parseFloat(payinput.value);
        const paytimeframe = paytimeframeInput.value;
        const hoursperweek = parseFloat(hoursperweekInput.value);
        const jobTitle = jobtitleInput.value;

        
        document.getElementById('jobTitle').textContent = jobTitle;

        /* Display working details based on pay timeframe */
        const workingDetails = document.getElementById('workingDetails');
        switch(paytimeframe) {
            case 'per-hour':
                workingDetails.textContent = `Working ${hoursperweek} hours a week for £${pay} per hour breaks down into:`;
                break;
            case 'per-Week':
                workingDetails.textContent = `Working ${hoursperweek} hours a week for £${pay} per week breaks down into:`;
                break;
            case 'per-Month':
                workingDetails.textContent = `Working ${hoursperweek} hours a week for £${pay} per month breaks down into:`;
                break;
            case 'per-Year':
                workingDetails.textContent = `Working ${hoursperweek} hours a week for £${pay} per year breaks down into:`;
                break;
            default:
                workingDetails.textContent = ""; // Clear the text if timeframe is not recognized
                break;
        }

        /* Calculate salary based on pay timeframe */
        let perHour, perWeek, perMonth, perYear;
        switch(paytimeframe) {
            case 'per-hour':
                perHour = pay;
                perWeek = pay * hoursperweek;
                perMonth = perWeek * 4;
                perYear = perMonth * 12;
                break;
            case 'per-Week':
                perHour = pay / hoursperweek;
                perWeek = pay;
                perMonth = perWeek * 4;
                perYear = perMonth * 12;
                break;
            case 'per-Month':
                perHour = pay / (hoursperweek * 4);
                perWeek = perHour * hoursperweek;
                perMonth = pay;
                perYear = perMonth * 12;
                break;
            case 'per-Year':
                perHour = pay / (hoursperweek * 52); 
                perWeek = perHour * hoursperweek;
                perMonth = perWeek * 4; 
                perYear = pay;
                break;
            default:
                break;
        }

        /* Display salary details to 2 decimal point*/
        perhourNumE1.textContent = `£${perHour.toFixed(2)}`;
        perweekNumE1.textContent = `£${perWeek.toFixed(2)}`;
        permonthNumE1.textContent = `£${perMonth.toFixed(2)}`;
        peryearNumE1.textContent = `£${perYear.toFixed(2)}`;

        /* Display results section */
        const resultsSection = document.querySelector('.results');
        if (resultsSection) {
            resultsSection.style.display = 'block';
        } else {
            console.error('Results section not found');
        }

        /* Open vacancies page with job title from results section */
        const jobTitleLink = document.getElementById('jobTitle');
        jobTitleLink.addEventListener('click', function() {
            const url = `vacancies.html?jobTitle=${encodeURIComponent(jobTitle)}`;
            window.open(url, '_blank');
        });
    }

    /* Function to display warning message */
    function displayWarning(inputElement, message) {

        const warningElement = document.createElement('p');
        warningElement.className = 'warning';
        warningElement.textContent = message;

        /* Insert warning after input element */
        inputElement.parentNode.insertBefore(warningElement, inputElement.nextSibling);

        /* after delay remove warning*/
        setTimeout(function() {
            warningElement.remove();
        }, 3000); 
    }
});
