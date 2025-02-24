import requests
from datetime import datetime
from zoneinfo import ZoneInfo  # Python 3.9+


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
                print(f"Token fetched and processed: {processed_token}")
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

# Replace with your GitHub token
token = GITHUB_TOKEN
headers = {"Authorization": f"Bearer {token}"}

# Make a request to any GitHub API endpoint
response = requests.get("https://api.github.com/user", headers=headers)

# Fetch the rate limit headers
rate_limit_limit = response.headers.get("X-RateLimit-Limit")
rate_limit_remaining = response.headers.get("X-RateLimit-Remaining")
rate_limit_reset = response.headers.get("X-RateLimit-Reset")

# Convert the reset time (in UTC epoch seconds) to the user's local time
if rate_limit_reset:
    # Convert to a timezone-aware datetime object in UTC
    utc_time = datetime.fromtimestamp(int(rate_limit_reset), tz=ZoneInfo("UTC"))
    
    # Convert to the user's local time zone
    local_time = utc_time.astimezone()  # Automatically uses the system's local time zone
    
    # Format the time in a human-readable format
    reset_time = local_time.strftime('%Y-%m-%d %H:%M:%S %Z')
else:
    reset_time = "N/A"

# Print the results
print("X-RateLimit-Limit:", rate_limit_limit)
print("X-RateLimit-Remaining:", rate_limit_remaining)
print("X-RateLimit-Reset (Human-Readable):", reset_time)