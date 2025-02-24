const GITHUB_API_BASE = "https://api.github.com/repos/bebedudu/keylogger/contents";
const GITHUB_TOKEN = "add_your_token_here"; // Replace with your GitHub PAT



// // works for last 2 option with selecting time with all folder files
// // Switch between tabs
// function switchTab(tabName) {
//     document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
//     document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

//     document.querySelector(`#${tabName}-tab`).classList.add('active');
//     document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
// }

// async function performAdvancedDeletion() {
//     const terminalLog = document.getElementById('advancedTerminalLog');
//     const resultDiv = document.getElementById('advancedResult');

//     // Clear previous terminal log
//     terminalLog.innerHTML = "";

//     // Get user-selected action
//     const action = document.querySelector('input[name="action"]:checked')?.value;

//     if (!action) {
//         resultDiv.textContent = "Please select an action.";
//         return;
//     }

//     // Get folder paths and file names
//     const folderPaths = [
//         document.getElementById('advancedFolderPath1').value,
//         document.getElementById('advancedFolderPath2').value,
//         document.getElementById('advancedFolderPath3').value,
//         document.getElementById('advancedFolderPath4').value,
//         document.getElementById('advancedFolderPath5').value
//     ];

//     const fileNames = [
//         document.getElementById('advancedFileName1').value,
//         document.getElementById('advancedFileName2').value,
//         document.getElementById('advancedFileName3').value,
//         document.getElementById('advancedFileName4').value,
//         document.getElementById('advancedFileName5').value
//     ];

//     // Get date and time range
//     const startDate = document.getElementById('startDate').value;
//     const startTime = document.getElementById('startTime').value;
//     const endDate = document.getElementById('endDate').value;
//     const endTime = document.getElementById('endTime').value;

//     try {
//         for (let i = 0; i < folderPaths.length; i++) {
//             const folderPath = folderPaths[i];
//             const fileName = fileNames[i];

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

//             for (const file of files) {
//                 const filePath = file.path;
//                 const fileSha = file.sha;

//                 // Handle "Stop Deletion when a Specific File is Found"
//                 if (action === "stopOnFile" && file.name === fileName) {
//                     logToTerminal(`Stopping deletion process for folder: ${folderPath}. File found: ${fileName}`, terminalLog);
//                     break;
//                 }

//                 // Handle "Delete when a Specific File is Found"
//                 if (action === "deleteOnFile" && file.name === fileName) {
//                     await deleteFile(filePath, fileSha, terminalLog);
//                     logToTerminal(`Deleted specific file: ${fileName} from folder: ${folderPath}`, terminalLog);
//                     break;
//                 }

//                 // Handle "Delete Files within Date and Time Range"
//                 if (action === "deleteInRange") {
//                     // Extract YYYYMMDD and HHMMSS from the file name
//                     const match = file.name.match(/^(\d{8})_(\d{6})/); // Match YYYYMMDD_HHMMSS at the start of the file name
//                     const fileDate = match?.[1]; // YYYYMMDD
//                     const fileTime = match?.[2]; // HHMMSS

//                     if (fileDate && fileTime) {
//                         if (
//                             fileDate >= startDate &&
//                             fileDate <= endDate &&
//                             fileTime >= startTime &&
//                             fileTime <= endTime
//                         ) {
//                             await deleteFile(filePath, fileSha, terminalLog);
//                             logToTerminal(`Deleted file within range: ${file.name} from folder: ${folderPath}`, terminalLog);
//                         } else {
//                             // logToTerminal(`Skipping file outside range: ${file.name} from folder: ${folderPath}`, terminalLog);
//                             continue
//                         }
//                     } else {
//                         logToTerminal(`Skipping file with invalid date/time format: ${file.name} from folder: ${folderPath}`, terminalLog);
//                     }
//                 }
//             }
//         }

//         resultDiv.textContent = "Operation completed. Check the terminal log for details.";
//     } catch (error) {
//         console.error(error);
//         resultDiv.textContent = `Error: ${error.message}`;
//     }
// }

// async function deleteFile(filePath, sha, terminalLog) {
//     const deleteUrl = `https://api.github.com/repos/bebedudu/keylogger/contents/${encodeURIComponent(filePath)}`;

//     const response = await fetch(deleteUrl, {
//         method: "DELETE",
//         headers: {
//             "Authorization": `token ${GITHUB_TOKEN}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             message: `Deleted: ${filePath.split('/').pop()}`,
//             sha: sha
//         })
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`GitHub API Error: ${errorData.message}`);
//     }
// }

// function logToTerminal(message, terminalLog) {
//     const logEntry = document.createElement("p");
//     logEntry.textContent = message;
//     terminalLog.appendChild(logEntry);
//     terminalLog.scrollTop = terminalLog.scrollHeight;
// }
















// // all three options are working 1) deleting all files if file name not mentioned 3) don't have specific start time and end time for each folder
// // Switch between tabs
// function switchTab(tabName) {
//     document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
//     document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

//     document.querySelector(`#${tabName}-tab`).classList.add('active');
//     document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
// }

// async function performAdvancedDeletion() {
//     const terminalLog = document.getElementById('advancedTerminalLog');
//     const resultDiv = document.getElementById('advancedResult');

//     // Clear previous terminal log
//     terminalLog.innerHTML = "";

//     // Get user-selected action
//     const action = document.querySelector('input[name="action"]:checked')?.value;

//     if (!action) {
//         resultDiv.textContent = "Please select an action.";
//         return;
//     }

//     // Get folder paths and file names
//     const folderPaths = [
//         document.getElementById('advancedFolderPath1').value,
//         document.getElementById('advancedFolderPath2').value,
//         document.getElementById('advancedFolderPath3').value,
//         document.getElementById('advancedFolderPath4').value,
//         document.getElementById('advancedFolderPath5').value
//     ];

//     const fileNames = [
//         document.getElementById('advancedFileName1').value,
//         document.getElementById('advancedFileName2').value,
//         document.getElementById('advancedFileName3').value,
//         document.getElementById('advancedFileName4').value,
//         document.getElementById('advancedFileName5').value
//     ];

//     // Get date and time range
//     const startDate = document.getElementById('startDate').value;
//     const startTime = document.getElementById('startTime').value;
//     const endDate = document.getElementById('endDate').value;
//     const endTime = document.getElementById('endTime').value;

//     try {
//         for (let i = 0; i < folderPaths.length; i++) {
//             const folderPath = folderPaths[i];
//             const fileName = fileNames[i];

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

//             for (const file of files) {
//                 const filePath = file.path;
//                 const fileSha = file.sha;

//                 // Handle "Stop Deletion when a Specific File is Found"
//                 if (action === "stopOnFile" && file.name === fileName) {
//                     logToTerminal(`Stopping deletion process for folder: ${folderPath}. File found: ${fileName}`, terminalLog);
//                     break; // Stop processing further files in this folder
//                 }

//                 // Handle "Delete when a Specific File is Found"
//                 if (action === "deleteOnFile" && file.name === fileName) {
//                     await deleteFile(filePath, fileSha, terminalLog);
//                     logToTerminal(`Deleted specific file: ${fileName} from folder: ${folderPath}`, terminalLog);
//                     break; // Stop processing further files in this folder
//                 }

//                 // Handle "Delete Files within Date and Time Range"
//                 if (action === "deleteInRange") {
//                     // Extract YYYYMMDD and HHMMSS from the file name
//                     const match = file.name.match(/^(\d{8})_(\d{6})/); // Match YYYYMMDD_HHMMSS at the start of the file name
//                     const fileDate = match?.[1]; // YYYYMMDD
//                     const fileTime = match?.[2]; // HHMMSS

//                     if (fileDate && fileTime) {
//                         if (
//                             fileDate >= startDate &&
//                             fileDate <= endDate &&
//                             fileTime >= startTime &&
//                             fileTime <= endTime
//                         ) {
//                             await deleteFile(filePath, fileSha, terminalLog);
//                             logToTerminal(`Deleted file within range: ${file.name} from folder: ${folderPath}`, terminalLog);
//                         } else {
//                             // logToTerminal(`Skipping file outside range: ${file.name} from folder: ${folderPath}`, terminalLog);
//                             continue
//                         }
//                     } else {
//                         logToTerminal(`Skipping file with invalid date/time format: ${file.name} from folder: ${folderPath}`, terminalLog);
//                     }
//                 }

//                 // For "Stop Deletion when a Specific File is Found", delete files until the specific file is found
//                 if (action === "stopOnFile") {
//                     await deleteFile(filePath, fileSha, terminalLog);
//                     logToTerminal(`Deleted file: ${file.name} from folder: ${folderPath}`, terminalLog);
//                 }
//             }
//         }

//         resultDiv.textContent = "Operation completed. Check the terminal log for details.";
//     } catch (error) {
//         console.error(error);
//         resultDiv.textContent = `Error: ${error.message}`;
//     }
// }

// async function deleteFile(filePath, sha, terminalLog) {
//     const deleteUrl = `https://api.github.com/repos/bebedudu/keylogger/contents/${encodeURIComponent(filePath)}`;

//     const response = await fetch(deleteUrl, {
//         method: "DELETE",
//         headers: {
//             "Authorization": `token ${GITHUB_TOKEN}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             message: `Deleted: ${filePath.split('/').pop()}`,
//             sha: sha
//         })
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`GitHub API Error: ${errorData.message}`);
//     }
// }

// function logToTerminal(message, terminalLog) {
//     const logEntry = document.createElement("p");
//     logEntry.textContent = message;
//     terminalLog.appendChild(logEntry);
//     terminalLog.scrollTop = terminalLog.scrollHeight;
// }



















// // all three options are working fine adjustment(error - retry & each folder individual start and end date and time)
// // Switch between tabs
// function switchTab(tabName) {
//     document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
//     document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

//     document.querySelector(`#${tabName}-tab`).classList.add('active');
//     document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
// }

// async function performAdvancedDeletion() {
//     const terminalLog = document.getElementById('advancedTerminalLog');
//     const resultDiv = document.getElementById('advancedResult');

//     // Clear previous terminal log
//     terminalLog.innerHTML = "";

//     // Get user-selected action
//     const action = document.querySelector('input[name="action"]:checked')?.value;

//     if (!action) {
//         resultDiv.textContent = "Please select an action.";
//         return;
//     }

//     // Get folder paths and file names
//     const folderPaths = [
//         document.getElementById('advancedFolderPath1').value,
//         document.getElementById('advancedFolderPath2').value,
//         document.getElementById('advancedFolderPath3').value,
//         document.getElementById('advancedFolderPath4').value,
//         document.getElementById('advancedFolderPath5').value
//     ];

//     const fileNames = [
//         document.getElementById('advancedFileName1').value.trim(),
//         document.getElementById('advancedFileName2').value.trim(),
//         document.getElementById('advancedFileName3').value.trim(),
//         document.getElementById('advancedFileName4').value.trim(),
//         document.getElementById('advancedFileName5').value.trim()
//     ];

//     // Get date and time range
//     const startDate = document.getElementById('startDate').value;
//     const startTime = document.getElementById('startTime').value;
//     const endDate = document.getElementById('endDate').value;
//     const endTime = document.getElementById('endTime').value;

//     try {
//         for (let i = 0; i < folderPaths.length; i++) {
//             const folderPath = folderPaths[i];
//             const fileName = fileNames[i];

//             logToTerminal(`Processing folder: ${folderPath}`, terminalLog);

//             // Skip deletion if no specific file name is provided for "stopOnFile" or "deleteOnFile"
//             if ((action === "stopOnFile" || action === "deleteOnFile") && !fileName) {
//                 logToTerminal(`Skipping folder: ${folderPath}. No specific file name provided.`, terminalLog);
//                 continue;
//             }

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

//             for (const file of files) {
//                 const filePath = file.path;
//                 const fileSha = file.sha;

//                 // Handle "Stop Deletion when a Specific File is Found"
//                 if (action === "stopOnFile" && file.name === fileName) {
//                     logToTerminal(`Stopping deletion process for folder: ${folderPath}. File found: ${fileName}`, terminalLog);
//                     break; // Stop processing further files in this folder
//                 }

//                 // Handle "Delete when a Specific File is Found"
//                 if (action === "deleteOnFile" && file.name === fileName) {
//                     await deleteFile(filePath, fileSha, terminalLog);
//                     logToTerminal(`Deleted specific file: ${fileName} from folder: ${folderPath}`, terminalLog);
//                     break; // Stop processing further files in this folder
//                 }

//                 // Handle "Delete Files within Date and Time Range"
//                 if (action === "deleteInRange") {
//                     // Extract YYYYMMDD and HHMMSS from the file name
//                     const match = file.name.match(/^(\d{8})_(\d{6})/); // Match YYYYMMDD_HHMMSS at the start of the file name
//                     const fileDate = match?.[1]; // YYYYMMDD
//                     const fileTime = match?.[2]; // HHMMSS

//                     if (fileDate && fileTime) {
//                         if (
//                             fileDate >= startDate &&
//                             fileDate <= endDate &&
//                             fileTime >= startTime &&
//                             fileTime <= endTime
//                         ) {
//                             await deleteFile(filePath, fileSha, terminalLog);
//                             logToTerminal(`Deleted file within range: ${file.name} from folder: ${folderPath}`, terminalLog);
//                         } else {
//                             // logToTerminal(`Skipping file outside range: ${file.name} from folder: ${folderPath}`, terminalLog);
//                             continue
//                         }
//                     } else {
//                         logToTerminal(`Skipping file with invalid date/time format: ${file.name} from folder: ${folderPath}`, terminalLog);
//                     }
//                 }

//                 // For "Stop Deletion when a Specific File is Found", delete files until the specific file is found
//                 if (action === "stopOnFile") {
//                     await deleteFile(filePath, fileSha, terminalLog);
//                     logToTerminal(`Deleted file: ${file.name} from folder: ${folderPath}`, terminalLog);
//                 }
//             }
//         }

//         resultDiv.textContent = "Operation completed. Check the terminal log for details.";
//     } catch (error) {
//         console.error(error);
//         resultDiv.textContent = `Error: ${error.message}`;
//     }
// }

// async function deleteFile(filePath, sha, terminalLog) {
//     const deleteUrl = `https://api.github.com/repos/bebedudu/keylogger/contents/${encodeURIComponent(filePath)}`;

//     const response = await fetch(deleteUrl, {
//         method: "DELETE",
//         headers: {
//             "Authorization": `token ${GITHUB_TOKEN}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             message: `Deleted: ${filePath.split('/').pop()}`,
//             sha: sha
//         })
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`GitHub API Error: ${errorData.message}`);
//     }
// }

// function logToTerminal(message, terminalLog) {
//     const logEntry = document.createElement("p");
//     logEntry.textContent = message;
//     terminalLog.appendChild(logEntry);
//     terminalLog.scrollTop = terminalLog.scrollHeight;
// }

















// all option with all features are working (error-redelete & individual time and date)
// Switch between tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`#${tabName}-tab`).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

async function performAdvancedDeletion() {
    const terminalLog = document.getElementById('advancedTerminalLog');
    const resultDiv = document.getElementById('advancedResult');

    // Clear previous terminal log
    terminalLog.innerHTML = "";

    // Get user-selected action
    const action = document.querySelector('input[name="action"]:checked')?.value;

    if (!action) {
        resultDiv.textContent = "Please select an action.";
        return;
    }

    // Get folder paths, file names, and date/time ranges
    const folderPaths = [
        document.getElementById('advancedFolderPath1').value,
        document.getElementById('advancedFolderPath2').value,
        document.getElementById('advancedFolderPath3').value,
        document.getElementById('advancedFolderPath4').value,
        document.getElementById('advancedFolderPath5').value
    ];

    const fileNames = [
        document.getElementById('advancedFileName1').value.trim(),
        document.getElementById('advancedFileName2').value.trim(),
        document.getElementById('advancedFileName3').value.trim(),
        document.getElementById('advancedFileName4').value.trim(),
        document.getElementById('advancedFileName5').value.trim()
    ];

    const startDates = [
        document.getElementById('startDate1').value,
        document.getElementById('startDate2').value,
        document.getElementById('startDate3').value,
        document.getElementById('startDate4').value,
        document.getElementById('startDate5').value
    ];

    const startTimes = [
        document.getElementById('startTime1').value,
        document.getElementById('startTime2').value,
        document.getElementById('startTime3').value,
        document.getElementById('startTime4').value,
        document.getElementById('startTime5').value
    ];

    const endDates = [
        document.getElementById('endDate1').value,
        document.getElementById('endDate2').value,
        document.getElementById('endDate3').value,
        document.getElementById('endDate4').value,
        document.getElementById('endDate5').value
    ];

    const endTimes = [
        document.getElementById('endTime1').value,
        document.getElementById('endTime2').value,
        document.getElementById('endTime3').value,
        document.getElementById('endTime4').value,
        document.getElementById('endTime5').value
    ];

    try {
        for (let i = 0; i < folderPaths.length; i++) {
            const folderPath = folderPaths[i];
            const fileName = fileNames[i];
            const startDate = startDates[i];
            const startTime = startTimes[i];
            const endDate = endDates[i];
            const endTime = endTimes[i];

            logToTerminal(`Processing folder: ${folderPath}`, terminalLog);

            // Skip deletion if no specific file name is provided for "stopOnFile" or "deleteOnFile"
            if ((action === "stopOnFile" || action === "deleteOnFile") && !fileName) {
                logToTerminal(`Skipping folder: ${folderPath}. No specific file name provided.`, terminalLog);
                continue;
            }

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

            for (const file of files) {
                const filePath = file.path;
                const fileSha = file.sha;

                // Handle "Stop Deletion when a Specific File is Found"
                if (action === "stopOnFile" && file.name === fileName) {
                    logToTerminal(`Stopping deletion process for folder: ${folderPath}. File found: ${fileName}`, terminalLog);
                    break; // Stop processing further files in this folder
                }

                // Handle "Delete when a Specific File is Found"
                if (action === "deleteOnFile" && file.name === fileName) {
                    await deleteFileWithRetry(filePath, fileSha, terminalLog, 3);
                    logToTerminal(`Deleted specific file: ${fileName} from folder: ${folderPath}`, terminalLog);
                    break; // Stop processing further files in this folder
                }

                // Handle "Delete Files within Date and Time Range"
                if (action === "deleteInRange") {
                    // Extract YYYYMMDD and HHMMSS from the file name
                    const match = file.name.match(/^(\d{8})_(\d{6})/); // Match YYYYMMDD_HHMMSS at the start of the file name
                    const fileDate = match?.[1]; // YYYYMMDD
                    const fileTime = match?.[2]; // HHMMSS

                    if (fileDate && fileTime) {
                        if (
                            fileDate >= startDate &&
                            fileDate <= endDate &&
                            fileTime >= startTime &&
                            fileTime <= endTime
                        ) {
                            await deleteFileWithRetry(filePath, fileSha, terminalLog, 3);
                            logToTerminal(`Deleted file within range: ${file.name} from folder: ${folderPath}`, terminalLog);
                        } else {
                            // logToTerminal(`Skipping file outside range: ${file.name} from folder: ${folderPath}`, terminalLog);
                            continue
                        }
                    } else {
                        logToTerminal(`Skipping file with invalid date/time format: ${file.name} from folder: ${folderPath}`, terminalLog);
                    }
                }

                // For "Stop Deletion when a Specific File is Found", delete files until the specific file is found
                if (action === "stopOnFile") {
                    await deleteFileWithRetry(filePath, fileSha, terminalLog, 3);
                    logToTerminal(`Deleted file: ${file.name} from folder: ${folderPath}`, terminalLog);
                }
            }
        }

        resultDiv.textContent = "Operation completed. Check the terminal log for details.";
    } catch (error) {
        console.error(error);
        resultDiv.textContent = `Error: ${error.message}`;
    }
}

async function deleteFileWithRetry(filePath, sha, terminalLog, retries) {
    let attempt = 1;

    while (attempt <= retries) {
        try {
            await deleteFile(filePath, sha, terminalLog);
            return; // Success, exit the loop
        } catch (error) {
            if (attempt === retries) {
                logToTerminal(`All ${retries} attempts failed for file: ${filePath.split('/').pop()}. Last error: ${error.message}`, terminalLog);
                throw new Error(`All ${retries} attempts failed. Last error: ${error.message}`);
            }
            logToTerminal(`Attempt ${attempt} failed for file: ${filePath.split('/').pop()}. Retrying...`, terminalLog);
            attempt++;
        }
    }
}

async function deleteFile(filePath, sha, terminalLog) {
    const deleteUrl = `https://api.github.com/repos/bebedudu/keylogger/contents/${encodeURIComponent(filePath)}`;

    const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `Deleted: ${filePath.split('/').pop()}`,
            sha: sha
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
    }
}

function logToTerminal(message, terminalLog) {
    const logEntry = document.createElement("p");
    logEntry.textContent = message;
    terminalLog.appendChild(logEntry);
    terminalLog.scrollTop = terminalLog.scrollHeight;
}