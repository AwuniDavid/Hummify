# In backend/test_acrcloud.py

import os
import time
import base64
import hmac
import hashlib
import requests
from dotenv import load_dotenv

def run_acrcloud_test():
    """
    A simplified, direct script to test the ACRCloud connection and signature.
    """
    # Step 1: Load environment variables from .env file
    load_dotenv()
    access_key = os.getenv("ACRCLOUD_ACCESS_KEY")
    access_secret = os.getenv("ACRCLOUD_ACCESS_SECRET")
    host = os.getenv("ACRCLOUD_HOST")

    # Step 2: Check if keys were loaded
    if not all([access_key, access_secret, host]):
        print("--- ❌ FATAL ERROR ---")
        print("Could not find ACRCloud keys in your .env file.")
        print("Please make sure ACRCLOUD_HOST, ACRCLOUD_ACCESS_KEY, and ACRCLOUD_ACCESS_SECRET are set correctly.")
        return

    # Step 3: Check for the test file
    file_path = "test_song.mp3"
    if not os.path.exists(file_path):
        print(f"--- ❌ FATAL ERROR ---")
        print(f"test_song.mp3 not found in the 'backend' folder.")
        return

    # Step 4: Define constants exactly as per the official example
    requrl = f"https://{host}/v1/identify"
    http_method = "POST"
    http_uri = "/v1/identify"
    data_type = "audio"
    signature_version = "1"
    timestamp = time.time()

    # Step 5: Create the signature string
    string_to_sign = f"{http_method}\n{http_uri}\n{access_key}\n{data_type}\n{signature_version}\n{str(timestamp)}"
    
    # Step 6: Generate the final signature
    sign = base64.b64encode(hmac.new(access_secret.encode('ascii'), string_to_sign.encode('ascii'), digestmod=hashlib.sha1).digest()).decode('ascii')

    # Step 7: Prepare the request and send it
    files = [('sample', (os.path.basename(file_path), open(file_path, 'rb'), 'audio/mpeg'))]
    data = {
        'access_key': access_key,
        'sample_bytes': str(os.path.getsize(file_path)),
        'timestamp': str(timestamp),
        'signature': sign,
        'data_type': data_type,
        "signature_version": signature_version
    }

    print("--- Sending request to ACRCloud with simplified test script... ---")
    try:
        r = requests.post(requrl, files=files, data=data)
        
        print(f"\nStatus Code: {r.status_code}")
        print("--- ACRCloud Raw Response ---")
        print(r.text)
        print("----------------------------")

        if "invalid signature" in r.text or "Invalid Signature" in r.text:
            print("\n--- ❌ FAILURE: The 'invalid signature' error persists. ---")
            print("This confirms the problem is with the keys in your .env file.")
            print("ACTION: Please carefully follow the instructions below to re-copy your keys.")
        elif '"code":0' in r.text:
            print("\n--- ✅ SUCCESS! The signature is valid and the request was processed! ---")
            print("This proves your keys are correct. We can now update the main application.")
        else:
            print("\n--- ❗ UNKNOWN ERROR ---")
            print("The signature might be valid, but another error occurred.")

    except Exception as e:
        print(f"\n--- ❌ CRITICAL FAILURE: An exception occurred during the request ---")
        print(e)

if __name__ == '__main__':
    run_acrcloud_test()
    