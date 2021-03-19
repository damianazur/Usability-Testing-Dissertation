from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

from VideoUploader import *
import requests


class UploadDataWindow(QWidget):
    def __init__(self, parent):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.parent = parent

        self.status = "Upload Not Started"

        self.statusTextPair = {
            "Upload Not Started": "",
            "Uploading": "Uploading, please wait...",
            "Finished": "The video has uploaded and will be available shortly. You may close this window."
        }

        # Window configurations
        self.setGeometry(400, 350, 500, 250)
        self.setWindowTitle("UsabCheck")
        self.setStyleSheet("font-size: 16px;")

        self.displayStatusLayout = QGroupBox("")
        
        # Layout
        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(20, 20, 20, 20)

        self.displayContent()
        self.setLayout(self.mainLayout)


    # Display the data so that the user can verify that the test is correct
    def displayContent(self):
        # Remove the widget if it already exists (if the user submits another code the data is reloaded)
        self.mainLayout.removeWidget(self.displayStatusLayout)
        self.displayStatusLayout = QWidget(self)
        self.displayStatusLayout.setMinimumWidth(400)
        layout = QFormLayout()
        layout.setSpacing(10)

        infoText = QLabel("""The usability study is finished. Click on the 'Upload Data' button to upload the data to server.\nPlease do not close this window until the data upload is finished.\nThank you for your participation.\n\n""")
        infoText.setFixedWidth(400)
        infoText.setWordWrap(True) 

        statusText = QLabel(str(self.statusTextPair[self.status]))
        statusText.setFixedWidth(400)
        statusText.setWordWrap(True) 

        btn = QPushButton("Upload Data", self)
        btn.clicked.connect(self.uploadDataToBackend)
        btn.resize(btn.sizeHint())
        if self.status == "Upload Not Started":
            btn.setStyleSheet("background-color: rgb(32, 123, 207);")
        else:
            btn.setStyleSheet("background-color: rgb(204, 204, 204);")
        btn.setFixedWidth(100)

        layout.addRow(infoText)
        layout.addRow(btn)
        layout.addRow(QLabel("Uploading Status: "), statusText)
        self.displayStatusLayout.setLayout(layout)
        
        self.mainLayout.addWidget(self.displayStatusLayout)


    def updateStatus(self, text):
        self.status = text
        self.displayContent() 


    # When the user submits the code get the data
    def uploadDataToBackend(self, e):
        if self.status == "Upload Not Started":
            self.parent.uploadData()
    

    def uploadVideo(self, testInstanceRef, videoFileName):
        self.testInstanceRef = testInstanceRef
        self.updateStatus("Uploading")
        self.uploadThread = VideoUploadingThread(videoFileName, self)
        self.uploadThread.updateVideoLinkSignal.connect(self.updateVideoId)
        self.uploadThread.start() 


    def updateVideoId(self, videoId):
        videoLinkData = {
            "testInstanceRef": self.testInstanceRef,
            "videoId": videoId
        }
        saveVideoLinkRequest = requests.post("http://localhost:8090/api/localapp/saveVideoLink", data=videoLinkData)
        print(saveVideoLinkRequest)
        self.updateStatus("Finished")



class VideoUploadingThread(QThread):
    updateVideoLinkSignal = pyqtSignal(str)

    def __init__(self, videoFileName, parent=None):
        QThread.__init__(self, parent)
        self.parent = parent
        self.videoFileName = videoFileName


    def run(self):
        self.videoUploader = VideoUploader(self.videoFileName)
        videoId = self.videoUploader.upload()

        self.updateVideoLinkSignal.emit(str(videoId))
        print("Video ID: ", videoId)