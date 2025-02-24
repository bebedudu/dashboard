import streamlit as st
import requests
import time
from datetime import datetime

# GitHub API base URL
GITHUB_API_BASE_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads"

# GitHub repository folders to check
FOLDERS = {
    "screenshots": "screenshots",
    "config": "config",
    "cache": "cache",
    "logs": "logs",
    "keylogerror": "keylogerror"
}





# URL containing the tokens JSON
TOKEN_URL = "https://raw.githubusercontent.com/bebedudu/tokens/refs/heads/main/tokens.json"
# Default token if URL fetch fails
DEFAULT_TOKEN = "asdfg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aefthu"
def get_token():
    try:
        # Fetch the JSON from the URL
        response = requests.get(TOKEN_URL)
        if response.status_code == 200:
            token_data = response.json()

            # Check if the "delete" key exists
            if "delete" in token_data:
                token = token_data["delete"]

                # Remove the first 5 and last 6 characters
                processed_token = token[5:-6]
                # print(f"Token fetched and processed: {processed_token}")
                return processed_token
            else:
                print("Key 'delete' not found in the token data.")
        else:
            print(f"Failed to fetch tokens. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred while fetching the token: {e}")

    # Fallback to the default token
    print("Using default token.")
    return DEFAULT_TOKEN[5:-6]

# Call the function
GITHUB_TOKEN = get_token()
# print(f"Final Token: {GITHUB_TOKEN}")

# Your GitHub API key
API_KEY = GITHUB_TOKEN


    
# Maximum number of retries for file deletion
MAX_RETRIES = 3

# Function to get the list of files in a folder
def get_number_of_files(folder):
    url = f"{GITHUB_API_BASE_URL}/{folder}"
    headers = {
        "Authorization": f"token {API_KEY}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        files = response.json()
        return files  # Return the list of files
    else:
        st.error(f"Failed to fetch data for {folder}: {response.status_code}")
        return []

# Function to delete a file using the GitHub API with retries
def delete_file(folder, file_name, file_sha):
    url = f"{GITHUB_API_BASE_URL}/{folder}/{file_name}"
    headers = {
        "Authorization": f"token {API_KEY}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "message": f"Deleting {file_name}",
        "sha": file_sha
    }
    
    for attempt in range(MAX_RETRIES):
        response = requests.delete(url, headers=headers, json=data)
        
        if response.status_code == 200:
            return True
        else:
            st.warning(f"Attempt {attempt + 1} failed to delete {file_name}: {response.status_code}")
            time.sleep(1)  # Wait for 1 second before retrying
    
    st.error(f"Failed to delete {file_name} after {MAX_RETRIES} attempts")
    return False

# Function to parse date and time from filename
def parse_datetime_from_filename(file_name):
    try:
        # Extract date and time from filename (e.g., "20250129_090616_bibek_...")
        date_str = file_name.split("_")[0]  # "20250129"
        time_str = file_name.split("_")[1]  # "090616"
        return datetime.strptime(f"{date_str} {time_str}", "%Y%m%d %H%M%S")
    except (IndexError, ValueError):
        return None

# Function to delete files with advanced options
def delete_files_advanced(folder, terminal_placeholder, stop_file=None, delete_file_only=None, start_date=None, end_date=None):
    files = get_number_of_files(folder)
    if not files:
        return

    # Initialize or update the session state for logs
    if "deletion_logs" not in st.session_state:
        st.session_state.deletion_logs = "Deletion Log:\n"

    for file in files:
        file_name = file["name"]
        file_sha = file["sha"]
        file_path = f"uploads/{folder}/{file_name}"

        # Parse date and time from filename
        file_datetime = parse_datetime_from_filename(file_name)

        # Skip files that don't match the date and time range
        if start_date and end_date and file_datetime:
            if not (start_date <= file_datetime <= end_date):
                continue  # Skip files outside the date range

        # Check if the file matches the stop file name
        if stop_file and file_name == stop_file:
            st.session_state.deletion_logs = f"Stopped deletion for {folder} because {stop_file} was found.\n{st.session_state.deletion_logs}"
            terminal_placeholder.markdown(
                f"""
                <div style="background-color: black; color: white; padding: 10px; border-radius: 5px; font-family: monospace; height: 200px; overflow-y: scroll;">
                    <pre>{st.session_state.deletion_logs}</pre>
                </div>
                """,
                unsafe_allow_html=True
            )
            return  # Stop deletion for this folder

        # Check if the file matches the delete file name
        if delete_file_only:
            if file_name == delete_file_only:
                # Delete only the specific file and skip the rest
                if delete_file(folder, file_name, file_sha):
                    st.session_state.deletion_logs = f"Deleted: {file_path}\n{st.session_state.deletion_logs}"
                else:
                    st.session_state.deletion_logs = f"Failed to delete: {file_path}\n{st.session_state.deletion_logs}"
                terminal_placeholder.markdown(
                    f"""
                    <div style="background-color: black; color: white; padding: 10px; border-radius: 5px; font-family: monospace; height: 200px; overflow-y: scroll;">
                        <pre>{st.session_state.deletion_logs}</pre>
                    </div>
                    """,
                    unsafe_allow_html=True
                )
                return  # Skip deletion of other files
            else:
                continue  # Skip files that don't match the delete file name

        # Delete the file using the GitHub API with retries
        if delete_file(folder, file_name, file_sha):
            st.session_state.deletion_logs = f"Deleted: {file_path}\n{st.session_state.deletion_logs}"
        else:
            st.session_state.deletion_logs = f"Failed to delete: {file_path}\n{st.session_state.deletion_logs}"

        # Update the terminal-like box
        terminal_placeholder.markdown(
            f"""
            <div style="background-color: black; color: white; padding: 10px; border-radius: 5px; font-family: monospace; height: 200px; overflow-y: scroll;">
                <pre>{st.session_state.deletion_logs}</pre>
            </div>
            """,
            unsafe_allow_html=True
        )

# Main function
def main():
    st.title("GitHub Repository File Manager")

    # Create tabs
    tab1, tab2, tab3 = st.tabs(["Count Files", "Delete Files", "Advanced Delete"])

    # Tab 1: Count Files
    with tab1:
        st.header("Count Files")
        if st.button("Get Number of Files"):
            st.write("Fetching file counts...")

            # Use columns to organize the output
            col1, col2, col3 = st.columns(3)

            for i, (folder_name, folder_path) in enumerate(FOLDERS.items()):
                files = get_number_of_files(folder_path)
                num_files = len(files)  # Calculate the number of files
                github_url = f"https://github.com/bebedudu/keylogger/tree/main/uploads/{folder_path}"

                # Alternate between columns for better layout
                if i % 3 == 0:
                    with col1:
                        st.markdown(
                            f"""
                            <div style="padding: 10px; border-radius: 10px; background-color: #f0f2f6; margin: 10px 0;">
                                <a href="{github_url}" style="text-decoration: none; color: inherit;">
                                    <h3>{folder_name.capitalize()}</h3>
                                    <p style="font-size: 24px; font-weight: bold; color: #4a90e2;">{num_files} files</p>
                                </a>
                            </div>
                            """,
                            unsafe_allow_html=True
                        )
                elif i % 3 == 1:
                    with col2:
                        st.markdown(
                            f"""
                            <div style="padding: 10px; border-radius: 10px; background-color: #f0f2f6; margin: 10px 0;">
                                <a href="{github_url}" style="text-decoration: none; color: inherit;">
                                    <h3>{folder_name.capitalize()}</h3>
                                    <p style="font-size: 24px; font-weight: bold; color: #4a90e2;">{num_files} files</p>
                                </a>
                            </div>
                            """,
                            unsafe_allow_html=True
                        )
                else:
                    with col3:
                        st.markdown(
                            f"""
                            <div style="padding: 10px; border-radius: 10px; background-color: #f0f2f6; margin: 10px 0;">
                                <a href="{github_url}" style="text-decoration: none; color: inherit;">
                                    <h3>{folder_name.capitalize()}</h3>
                                    <p style="font-size: 24px; font-weight: bold; color: #4a90e2;">{num_files} files</p>
                                </a>
                            </div>
                            """,
                            unsafe_allow_html=True
                        )

    # Tab 2: Delete Files
    with tab2:
        st.header("Delete Files")
        st.write("Select folders and the number of files to delete.")

        # Track deletion progress
        if "deletion_progress" not in st.session_state:
            st.session_state.deletion_progress = {folder: {"total": 0, "deleted": 0} for folder in FOLDERS.keys()}

        # Initialize deletion logs in session state
        if "deletion_logs" not in st.session_state:
            st.session_state.deletion_logs = "Deletion Log:\n"

        # Display folder selection and sliders
        selected_folders = {}
        for folder_name, folder_path in FOLDERS.items():
            files = get_number_of_files(folder_path)
            num_files = len(files)

            # Card-like layout for each folder
            with st.container():
                st.subheader(f"Folder: {folder_name}")
                col1, col2 = st.columns([1, 3])
                with col1:
                    enable_deletion = st.checkbox(f"Enable deletion for {folder_name}", key=f"enable_{folder_name}")
                with col2:
                    if enable_deletion:
                        num_files_to_delete = st.slider(
                            f"Number of files to delete from {folder_name}",
                            min_value=0,
                            max_value=num_files,
                            key=f"slider_{folder_name}"
                        )
                        selected_folders[folder_name] = num_files_to_delete

        # Single delete button
        if st.button("Delete Selected Files"):
            if selected_folders:
                # Create a terminal-like output box
                terminal_placeholder = st.empty()
                terminal_placeholder.markdown(
                    f"""
                    <div style="background-color: black; color: white; padding: 10px; border-radius: 5px; font-family: monospace; height: 200px; overflow-y: scroll;">
                        <pre>{st.session_state.deletion_logs}</pre>
                    </div>
                    """,
                    unsafe_allow_html=True
                )

                # Simulate deletion for selected folders
                for folder_name, num_files_to_delete in selected_folders.items():
                    if num_files_to_delete > 0:
                        st.session_state.deletion_progress[folder_name]["total"] = num_files_to_delete
                        st.session_state.deletion_progress[folder_name]["deleted"] = 0

                        # Delete files
                        delete_files_advanced(folder_name, terminal_placeholder)
                        st.session_state.deletion_progress[folder_name]["deleted"] = num_files_to_delete

                st.success("Deletion completed!")
            else:
                st.warning("No folders selected for deletion.")

    # Tab 3: Advanced Delete
    with tab3:
        st.header("Advanced Delete")
        st.write("Choose an action and configure the options below.")

        # Advanced options
        stop_deletion = st.checkbox("Stop Deletion when a Specific File is Found")
        delete_specific = st.checkbox("Delete when a Specific File is Found")
        delete_by_date = st.checkbox("Delete Files within Date and Time Range")

        # Folder-specific options
        folder_options = {}
        for folder_name, folder_path in FOLDERS.items():
            with st.expander(f"Folder: {folder_path}"):
                folder_options[folder_name] = {
                    "stop_file": st.text_input(f"Stop File Name for {folder_name}", key=f"stop_{folder_name}"),
                    "delete_file_only": st.text_input(f"Delete File Name for {folder_name}", key=f"delete_{folder_name}")
                }

        # Date and time range
        if delete_by_date:
            col1, col2 = st.columns(2)
            with col1:
                start_date_str = st.text_input("Start Date (YYYYMMDD)", "20250125")
                start_time_str = st.text_input("Start Time (HHMMSS)", "000000")
            with col2:
                end_date_str = st.text_input("End Date (YYYYMMDD)", "20250125")
                end_time_str = st.text_input("End Time (HHMMSS)", "235959")

            try:
                start_date = datetime.strptime(f"{start_date_str} {start_time_str}", "%Y%m%d %H%M%S")
                end_date = datetime.strptime(f"{end_date_str} {end_time_str}", "%Y%m%d %H%M%S")
            except ValueError:
                st.error("Invalid date or time format. Please use YYYYMMDD for dates and HHMMSS for times.")
                start_date = end_date = None
        else:
            start_date = end_date = None

        # Delete button for advanced options
        if st.button("Delete Files with Advanced Options"):
            if stop_deletion or delete_specific or delete_by_date:
                # Create a terminal-like output box
                terminal_placeholder = st.empty()
                terminal_placeholder.markdown(
                    f"""
                    <div style="background-color: black; color: white; padding: 10px; border-radius: 5px; font-family: monospace; height: 200px; overflow-y: scroll;">
                        <pre>{st.session_state.deletion_logs}</pre>
                    </div>
                    """,
                    unsafe_allow_html=True
                )

                # Perform deletion for each folder
                for folder_name, folder_path in FOLDERS.items():
                    # Get folder-specific options
                    stop_file = folder_options[folder_name]["stop_file"] if stop_deletion else None
                    delete_file_only = folder_options[folder_name]["delete_file_only"] if delete_specific else None

                    # Skip deletion if both "stop_file" and "delete_file_only" are empty
                    if not stop_file and not delete_file_only:
                        continue

                    # Delete files with advanced options
                    delete_files_advanced(folder_path, terminal_placeholder, stop_file, delete_file_only, start_date, end_date)

                st.success("Advanced deletion completed!")
            else:
                st.warning("No advanced options selected.")

if __name__ == "__main__":
    main()