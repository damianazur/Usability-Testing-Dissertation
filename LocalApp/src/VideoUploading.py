import vimeo
import json


if __name__ == '__main__':
    print("----------- Starting Video Upload ----------- ")

    client = vimeo.VimeoClient(
      token='cd878f7f019c963e813fc639661661e7',
      key='68c0d97e7b6fa360e3e4e87079ab02eef6198078',
      secret='DtXMmxJ47Wz4TExYAn+09Tr+EF0ItDioZ3kU1nOv8L5VmZDfZ0BAIcV1nUFxDJuF7goYFMSjCFdrMANy4Xzaid45/0tvdUdgbhzwJjH9yLjuFQPDMRIonKXf/3q13XcT'
    )

    # uri = "https://api.vimeo.com/oauth/authorize"
    # uri = "https://api.vimeo.com/oauth/access_token"
    # response = client.get(uri)
    # print(response)
    # print(json.loads(response))

    file_name = './videos/uploadVideo.avi'
    uri = client.upload(file_name, data={
      'name': 'First Video',
      'description': 'No Description'
    })

    print('Your video URI is: %s' % (uri))
        