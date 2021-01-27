import requests

if __name__ == '__main__':
    print("Hello")

    data = {
        "testId": "18"
    }

    r = requests.post("http://localhost:8090/api/localapp/test", data=data)
    print(r)