import vimeo
import json


if __name__ == '__main__':
    print("----------- Starting Video Upload ----------- ")

    client = vimeo.VimeoClient(
      token='{8617caf723060007eeee7b26e1ded3b9}',
      key='{68c0d97e7b6fa360e3e4e87079ab02eef6198078}',
      secret='{DtXMmxJ47Wz4TExYAn+09Tr+EF0ItDioZ3kU1nOv8L5VmZDfZ0BAIcV1nUFxDJuF7goYFMSjCFdrMANy4Xzaid45/0tvdUdgbhzwJjH9yLjuFQPDMRIonKXf/3q13XcT}'
    )

    uri = "https://api.vimeo.com/oauth/authorize"
    # uri = "https://api.vimeo.com/oauth/access_token"

    response = client.get(uri)
    print(response)
    # print(json.loads(response))
        