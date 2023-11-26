import sys
import json

def analyze(data):
    return data['a']+data['b']

if __name__ == "__main__":
    data_str = sys.argv[1]
    data = json.loads(data_str)
    print(analyze(data))