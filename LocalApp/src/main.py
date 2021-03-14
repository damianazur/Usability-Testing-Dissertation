import requests
import json
import os

from ScreenRecorder import *
from FacialExpressionRecog import *
from VideoUploading import *
from TaskWindow import *
from ScrollLabel import *
from MultipleChoiceQuestionWindow import *
from TextQuestionWindow import *
from RecordingWindow import *
from Loading import *


from win32api import GetSystemMetrics
import win32gui as win32gui
from datetime import datetime

from functools import partial

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import threading


class InitialWindow(QWidget):
    LOCAL_APP_API = "http://localhost:8090/api/localapp/"
    GET_TEST_BY_REF_CODE_ENTRY = "getTestDetailsByReferenceCode/"


    def __init__(self, parent):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.parent = parent

        # Window configurations
        self.setGeometry(400, 350, 500, 250)
        self.setWindowTitle("UsabCheck")
        self.setStyleSheet("font-size: 16px;")
        
        # Layout
        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(20, 20, 200, 0)
        self.createTestEnterLayout()

        self.displayTestLayout = QGroupBox()
        self.setLayout(self.mainLayout)


    # Creates the first part of the form where the user enters a test reference code
    def createTestEnterLayout(self):
        layout = QFormLayout()
        
        refCodeLabel = QLabel("Reference Code:")
        self.refCodeInput = QLineEdit()
        btn = QPushButton("Submit", self)
        btn.clicked.connect(self.submitRefCode)
        btn.resize(btn.sizeHint())
        btn.setStyleSheet("background-color: rgb(32, 123, 207);")
        btn.setFixedWidth(100)

        layout.addRow(refCodeLabel)
        layout.addRow(self.refCodeInput)
        layout.addRow(btn)
        layout.setContentsMargins(0, 0, 0, 30)

        self.mainLayout.addLayout(layout)
    

    # When the user submits the code get the data
    def submitRefCode(self, e):
        refCode = self.refCodeInput.text()
        if refCode == "":
            refCode = "H8VH1NLA"

        sendData = {"referenceCode": str(refCode)}
        request = requests.post(self.LOCAL_APP_API + self.GET_TEST_BY_REF_CODE_ENTRY, data=sendData)
        data = json.loads(request.text)
        data["sequenceData"].sort(key=lambda obj: obj["sequenceNumber"], reverse=False)

        self.displayTestData(data)

    
    # Display the data so that the user can verify that the test is correct
    def displayTestData(self, data):
        testName = data["testName"]
        createdDate = data["launchedDate"]
        noOfTasks = 0
        noOfQuestions = 0

        print(data)

        # Counte the number of tasks and questions
        for item in data["sequenceData"]:
            if ("questionConfigsJSON" in item.keys()):
                noOfQuestions += 1
            if ("stepsJSON" in item.keys()):
                noOfTasks += 1

        # Remove the widget if it already exists (if the user submits another code the data is reloaded)
        self.mainLayout.removeWidget(self.displayTestLayout)
        self.displayTestLayout = QGroupBox("Usability Test Details")
        layout = QFormLayout()
        layout.setSpacing(10)
        layout.addRow(QLabel("Test Name:  "), QLabel(str(testName)))
        layout.addRow(QLabel("Created Date:  "), QLabel(str(createdDate)))
        layout.addRow(QLabel("No. of Tasks:  "), QLabel(str(noOfTasks)))
        layout.addRow(QLabel("No. of Questions:  "), QLabel(str(noOfQuestions)))
        layout.addRow(QLabel("Scenario/Information:"))

        scenarioLabel = QLabel(data["scenario"])
        scenarioLabel.setFixedWidth(400)
        scenarioLabel.setWordWrap(True) 
        scenarioLabel.setTextInteractionFlags(Qt.TextSelectableByMouse)
        layout.addRow(scenarioLabel)
        self.displayTestLayout.setLayout(layout)
        
        self.mainLayout.addWidget(self.displayTestLayout)
        
        # Form that asks the user for their info
        layout = QFormLayout()
        self.userNameLabel = QLabel("Your name:")
        self.userNameInput = QLineEdit()
        btn = QPushButton("Begin", self)
        btn.clicked.connect(partial(self.begin, data))
        btn.resize(btn.sizeHint())
        btn.setStyleSheet("background-color: rgb(32, 207, 76);")
        btn.setFixedWidth(100)

        layout.addRow(self.userNameLabel)
        layout.addRow(self.userNameInput)
        layout.addRow(btn)
        layout.setContentsMargins(0, 30, 0, 30)

        self.mainLayout.addLayout(layout)


    def begin(self, data):
        data["participantName"] = self.userNameInput.text()
        self.parent.loadComponents(data)


class UploadDataWindow(QWidget):
    def __init__(self, parent):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.parent = parent

        self.status = "Uploading, please wait..."

        # Window configurations
        self.setGeometry(400, 350, 300, 250)
        self.setWindowTitle("UsabCheck")
        self.setStyleSheet("font-size: 16px;")

        self.displayStatusLayout = QGroupBox("")
        
        # Layout
        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(20, 20, 20, 20)

        self.createInitialContent()

        self.displayContent()
        self.setLayout(self.mainLayout)


    def createInitialContent(self):
        self.initLayout = QFormLayout()
   
        btn = QPushButton("Upload Data", self)
        btn.clicked.connect(self.uploadDataToBackend)
        btn.resize(btn.sizeHint())
        btn.setStyleSheet("background-color: rgb(32, 123, 207);")
        btn.setFixedWidth(100)

        self.initLayout.addRow(btn)
        self.initLayout.setContentsMargins(0, 0, 0, 30)

        self.mainLayout.addLayout(self.initLayout)


    # Display the data so that the user can verify that the test is correct
    def displayContent(self):
        # Remove the widget if it already exists (if the user submits another code the data is reloaded)
        self.mainLayout.removeWidget(self.displayStatusLayout)
        self.displayStatusLayout = QGroupBox("")
        self.displayStatusLayout.setMinimumWidth(400)
        layout = QFormLayout()
        layout.setSpacing(10)

        infoText = QLabel("The usability study is finished. Please do not close this window until the data upload is finished.\nThank you for your participation.\n\n")
        infoText.setFixedWidth(400)
        infoText.setWordWrap(True) 

        statusText = QLabel(str(self.status))
        statusText.setFixedWidth(400)
        statusText.setWordWrap(True) 

        layout.addRow(infoText)
        layout.addRow(QLabel("Uploading Status: "), statusText)
        self.displayStatusLayout.setLayout(layout)
        
        self.mainLayout.addWidget(self.displayStatusLayout)


    def updateStatus(self, text):
        self.status = text
        self.displayContent() 


    # When the user submits the code get the data
    def uploadDataToBackend(self, e):
        self.parent.uploadData()
    

    def uploadVideo(self, testInstanceRef, videoFileName):
        self.testInstanceRef = testInstanceRef

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
        self.updateStatus("The video has uploaded and will be available shortly. You may close this window.")



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


class MainProgram():
    def __init__(self):
        app = QApplication([])
        app.setStyle('Fusion')
        
        self.began = False
        self.answers = []
        self.sequenceTimeStamp = []
        self.previousTaskPos = None
        self.sequenceIndex = None
        self.data = None

        self.mainWindow = InitialWindow(self)
        self.mainWindow.show()


        app.exec_()


    # When usability test/recording is forcefully stopped
    def onRecordingStopped(self):
        ferCameraData = self.recordingWindow.fer.ferCameraData
        for timeStamp in ferCameraData:
            print(timeStamp)
        self.recordingWindow.close()
        self.window.close()

        print(self.sequenceTimeStamp)


    def testFinishedSuccessfully(self):
        self.recordingWindow.stopProcesses()
        self.ferCameraData = self.recordingWindow.fer.ferCameraData
        self.videoFileName = self.recordingWindow.videoFileName
        
        self.recordingWindow.close()
        self.window.close()

        self.uploadDataWindow = UploadDataWindow(self)
        self.uploadDataWindow.show()


    def uploadData(self):
        print("Uploading Data")
        sendData = self.packageData()
        print(sendData)

        saveTestRequest = requests.post("http://localhost:8090/api/localapp/saveTestResults", data=sendData)
        self.testInstanceRef = saveTestRequest.text
        print(saveTestRequest, self.testInstanceRef)

        self.uploadDataWindow.uploadVideo(self.testInstanceRef, self.videoFileName)


    def packageData(self):
        packagedData = {
            "participantName": self.data["participantName"],
            "referenceCode": self.data["referenceCode"],
            "ferCameraData":  json.dumps(self.ferCameraData),
            "sequenceTimeStamp":  json.dumps(self.sequenceTimeStamp),
            "questionAnswers":  json.dumps(self.answers)
        }

        return packagedData

    
    def addSequenceStamp(self):
        print("SEQ INX", self.sequenceIndex, self.data["sequenceData"][self.sequenceIndex])
        
        sequenceTimeStamp = {
            "startTime": str(self.recordingWindow.screenRecorder.currentTime),
            "label": str(self.sequenceIndex),
            "endTime": "N/A"
        }
        sequenceSize = len(self.sequenceTimeStamp)
        if sequenceSize > 0:
            self.sequenceTimeStamp[sequenceSize - 1]["endTime"] = self.recordingWindow.screenRecorder.currentTime
        self.sequenceTimeStamp.append(sequenceTimeStamp)


    def nextSequenceItem(self, returnData, returnDataType):
        print("NEXT SEQUENCE ITEM: ")
        if returnData != None:
            print("RETURN: ", returnData)
            if returnDataType == "Question Answer":
                self.answers.append(returnData)

        if self.sequenceIndex < len(self.data["sequenceData"]) - 1:
            self.previousWindow = self.window

            if "stepsJSON" in self.data["sequenceData"][self.sequenceIndex].keys():
                self.previousTaskPos = self.window.pos()

            self.loadNextSequenceItem()
        else:
            print("TEST FINISHED!")
            sequenceSize = len(self.sequenceTimeStamp)
            if sequenceSize > 0:
                self.sequenceTimeStamp[sequenceSize - 1]["endTime"] = self.recordingWindow.screenRecorder.currentTime
            self.testFinishedSuccessfully()

    
    def loadNextSequenceItem(self):
        if self.sequenceIndex == None:
            self.sequenceIndex = 0
        else:
            self.sequenceIndex += 1

        print("SEQUENCE NUM: ", self.sequenceIndex)
        self.addSequenceStamp()

        # Create instruction text body
        sequenceDataItem = self.data["sequenceData"][self.sequenceIndex]

        # If the sequence item is a task
        if "stepsJSON" in sequenceDataItem.keys():
            print("Creating Task: ", sequenceDataItem)
            self.window = TaskWindow(self, sequenceDataItem, self.previousTaskPos)
            self.window.show()

        # If the sequence item is a question
        elif "questionConfigsJSON" in sequenceDataItem.keys():
            questionConfigsJSON = json.loads(sequenceDataItem["questionConfigsJSON"])
            questionType = questionConfigsJSON["questionType"]
            print("Creating Question: ", questionType)

            if questionType == "text":
                print("Text Question")
                self.window = TextQuestionWindow(self, sequenceDataItem)
                self.window.show()

            elif questionType == "multiple-choice":
                # self.loadNextSequenceItem()
                self.window = MultipleChoiceQuestionWindow(self, sequenceDataItem)
                self.window.show()
                

        # Close the previous window
        try:
            self.previousWindow.close()
        except AttributeError:
            pass


    def getDebugData(self):
        refCode = "H8VH1NLA"
        sendData = {"referenceCode": str(refCode)}
        request = requests.post("http://localhost:8090/api/localapp/getTestDetailsByReferenceCode", data=sendData)
        data = json.loads(request.text)
        data["sequenceData"].sort(key=lambda obj: obj["sequenceNumber"], reverse=False)
        
        return data
    

    def loadComponents(self, data):
        print(data)
        if (self.began == False):
            self.data = data
            self.began = True
            print("Begin...")

            self.loadingWindow = LoadingWindow(self)
            self.loadingWindow.show()
            self.loadingWindow.busyFunc()

            self.mainWindow.close()

            self.recordingWindow = RecordingWindow(self)
            self.recordingWindow.show()


    def begin(self):
        self.loadNextSequenceItem()

if __name__ == '__main__':
    print("----------- Starting ----------- ")

    main = MainProgram()
    