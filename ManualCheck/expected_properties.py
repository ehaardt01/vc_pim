import json
import os

def load_json(file_path):
    with open(file_path) as f:
        return json.load(f)

def compare_properties():
    directory = os.path.dirname(os.path.abspath(__file__))
    expected = load_json(os.path.join(directory, 'properties.json'))["properties"]
    received = load_json(os.path.join(directory, 'product_received_by_beeceptor.json'))
    for property in expected:
        if property["export_name"] not in received:
            print(f"Key {property["name"]} not found in received properties")
            continue

def main():
    compare_properties()

if __name__ == '__main__':
    main()