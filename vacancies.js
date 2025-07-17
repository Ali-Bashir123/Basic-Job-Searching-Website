document.addEventListener('DOMContentLoaded', function() {
    /* Extract job title from pay calc results */
    const urlParams = new URLSearchParams(window.location.search);
    const jobTitle = urlParams.get('jobTitle');
    if (jobTitle) {
        document.getElementById('jobTitle').textContent = jobTitle;
        searchVacancies(jobTitle); // Call function to search vacancies based on job title from pay calculator
    }

    /* Add event listener to vacancy search form */
    const vacancySearchForm = document.getElementById("vacancySearchForm");
    vacancySearchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const searchTerm = document.getElementById("jobTitle").value;
        searchVacancies(searchTerm); // function to search vacancies based on user input from pay calc
    });
});

/* Function to search for vacancies based on job title */
function searchVacancies(searchTerm) {
    let vacanciesUrl = `http://api.lmiforall.org.uk/api/v1/vacancies/search?keywords=${encodeURIComponent(searchTerm)}`;

    fetch(vacanciesUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            displayVacancies(data); // Call function to display search results
        })
        .catch(error => {
            console.error('Error fetching vacancies:', error);
        });
}

/* Function to load top vacancies */
function loadTopVacancies() {
    let vacanciesUrl = 'http://api.lmiforall.org.uk/api/v1/vacancies/search';

    fetch(vacanciesUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Sort vacancies by date to get the most recent ones
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            // Display top 10 vacancies
            displayVacancies(data.slice(0, 10));
        })
        .catch(error => {
            console.error('Error fetching vacancies:', error);
        });
}

/* Function to display vacancies */
function displayVacancies(data) {
    let vacanciesDiv = document.getElementById("vacancies");
    vacanciesDiv.innerHTML = ""; 

    let topVacancies = data.slice(0, 10); // Display top 10 vacancies
    topVacancies.forEach(vacancy => {
        let vacancyElement = document.createElement('div');
        vacancyElement.classList.add('vacancy');

        let jobTitle = vacancy.title;

        vacancyElement.innerHTML = `
            <h4 class="vacancy-title">${vacancy.title}</h4>
            <div class="vacancy-details">
                <p>${vacancy.summary}</p>
                <p>Company: ${vacancy.company}</p>
                <p>Location: ${vacancy.location.location}</p>
                <p><a href="${vacancy.link}" target="_blank">View Job Posting</a></p>
            </div>
            <div class="job-information"></div>
        `;

        vacanciesDiv.appendChild(vacancyElement);

        fetchJobInformation(vacancy.title, vacancyElement); // Call function to fetch additional job information from second api
    });

    /* Function to fetch job information from API */
    function fetchJobInformation(title, vacancyElement) {
        let jobInfoUrl = `http://api.lmiforall.org.uk/api/v1/soc/search?q=${encodeURIComponent(title)}`;

        fetch(jobInfoUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                displayJobInformation(data, vacancyElement); 
            })
            .catch(error => {
                console.error('Error fetching job information:', error);
            });
    }

    /* Function to display job information */
    function displayJobInformation(data, vacancyElement) {
        let jobInformationDiv = vacancyElement.querySelector('.job-information');
        jobInformationDiv.innerHTML = ""; 
        if (data.length > 0) {
            let jobInfo = data[0]; 
            jobInformationDiv.innerHTML = `
                <h4>General Information:</h4>
                <p>Description: ${jobInfo.description}</p>
                <p>Tasks: ${jobInfo.tasks}</p>
            `;
        }
    }

    // Add event listener to each vacancy title to show/hide details
    let vacancyTitles = document.querySelectorAll('.vacancy-title');
    vacancyTitles.forEach(title => {
        title.addEventListener('click', toggleDetails);
    });
}

/* Function to toggle visibility of vacancy details */
function toggleDetails(event) {
    let details = event.target.nextElementSibling;
    details.classList.toggle('visible');
}
