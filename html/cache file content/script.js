const apiUrl = 'https://api.github.com/repos/bebedudu/keylogger/contents/uploads/cache';
const token = 'add_your_token_here'; // Replace with your actual API key

async function fetchFiles() {
    const response = await fetch(apiUrl, {
        headers: {
            Authorization: `token ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch files');
    }

    const data = await response.json();
    displayFiles(data);
}

function displayFiles(files) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const showContentButton = document.createElement('button');
        showContentButton.textContent = 'Show File Content';
        showContentButton.onclick = () => showFileContent(file.download_url);

        fileItem.appendChild(fileName);
        fileItem.appendChild(showContentButton);

        fileList.appendChild(fileItem);
    });
}

async function showFileContent(url) {
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch file content');
    }

    const content = await response.text();
    const fileContentDiv = document.createElement('div');
    fileContentDiv.className = 'file-content';
    fileContentDiv.textContent = content;

    const openFileButton = document.createElement('button');
    openFileButton.textContent = 'Open File Content';
    openFileButton.onclick = () => window.open(url);

    const viewFullscreenButton = document.createElement('button');
    viewFullscreenButton.textContent = 'View File in Fullscreen';
    viewFullscreenButton.onclick = () => fileContentDiv.requestFullscreen();

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download File';
    downloadButton.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop();
        a.click();
    };

    fileContentDiv.appendChild(openFileButton);
    fileContentDiv.appendChild(viewFullscreenButton);
    fileContentDiv.appendChild(downloadButton);

    const parentFileItem = document.querySelector('.file-item:last-child');
    parentFileItem.appendChild(fileContentDiv);
}

fetchFiles().catch(error => console.error('Error:', error));