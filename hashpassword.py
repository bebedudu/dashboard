import hashlib

passwords = {
    "bibekin": "bibekindata",
    "bibeknp": "bibeknpdata", 
    "admin": "adminbibek",
    "devraj": "devrajdata"
}

for username, pwd in passwords.items():
    hash = hashlib.sha256(pwd.encode()).hexdigest()
    print(f'"{username}": "{hash}"')