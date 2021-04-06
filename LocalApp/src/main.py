import requests
import json

from InitialWindow import InitialWindow
from UploadDataWindow import UploadDataWindow
from TaskWindow import TaskWindow
from MultipleChoiceQuestionWindow import MultipleChoiceQuestionWindow
from TextQuestionWindow import TextQuestionWindow
from RecordingWindow import RecordingWindow
from Loading import LoadingWindow

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *


class MainProgram():
    # ENTRY_API = "https://usabcheck.herokuapp.com/api/localapp/"
    ENTRY_API = "http://localhost:8090/api/localapp/"

    def __init__(self):
        self.began = False
        self.answers = []
        self.sequenceTimeStamp = []
        self.previousTaskPos = None
        self.sequenceIndex = None
        self.data = None

        self.mainWindow = InitialWindow(self)
        self.mainWindow.show()


    # When usability test/recording is forcefully stopped
    def onRecordingStopped(self):
        ferCameraData = self.recordingWindow.fer.ferCameraData
        for timeStamp in ferCameraData:
            print(timeStamp)

        self.recordingWindow.close()
        self.window.close()

        print("\n\n", self.sequenceTimeStamp)


    def testFinishedSuccessfully(self):
        self.recordingWindow.stopProcesses()
        self.ferCameraData = self.recordingWindow.fer.ferCameraData
        self.videoFileName = self.recordingWindow.videoFileName
        
        self.recordingWindow.close()
        self.window.close()

        self.uploadDataWindow = UploadDataWindow(self)
        self.uploadDataWindow.show()


    def uploadData(self):
        instanceRefRequest = requests.post(self.ENTRY_API + "getInstanceReference", data={})
        self.testInstanceRef = instanceRefRequest.text
        print("Test Instance Reference:", self.testInstanceRef)

        sendData = self.packageData()
        print("Uploading Data", sendData)

        saveTestRequest = requests.post(self.ENTRY_API + "saveTestResults", data=sendData)
        print(saveTestRequest.text)

        self.uploadDataWindow.uploadVideo(self.testInstanceRef, self.videoFileName)


    def packageData(self):
        packagedData = {
            "participantName": self.data["participantName"],
            "referenceCode": self.data["referenceCode"],
            "ferCameraData":  json.dumps(self.ferCameraData),
            "sequenceTimeStamp":  json.dumps(self.sequenceTimeStamp),
            "questionAnswers":  json.dumps(self.answers),
            "instanceReference":  self.testInstanceRef
        }

        return packagedData

    
    def addSequenceStamp(self):        
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
        if returnData != None:
            if returnDataType == "Question Answer":
                self.answers.append(returnData)

        if self.sequenceIndex < len(self.data["sequenceData"]) - 1:
            self.previousWindow = self.window

            if "stepsJSON" in self.data["sequenceData"][self.sequenceIndex].keys():
                self.previousTaskPos = self.window.pos()

            self.loadNextSequenceItem()
        else:
            sequenceSize = len(self.sequenceTimeStamp)
            if sequenceSize > 0:
                self.sequenceTimeStamp[sequenceSize - 1]["endTime"] = self.recordingWindow.screenRecorder.currentTime
            self.testFinishedSuccessfully()

    
    def loadNextSequenceItem(self):
        if self.sequenceIndex == None:
            self.sequenceIndex = 0
        else:
            self.sequenceIndex += 1

        self.addSequenceStamp()

        # Create instruction text body
        sequenceDataItem = self.data["sequenceData"][self.sequenceIndex]

        # If the sequence item is a task
        if "stepsJSON" in sequenceDataItem.keys():
            self.window = TaskWindow(self, sequenceDataItem, self.previousTaskPos)
            self.window.show()

        # If the sequence item is a question
        elif "questionConfigsJSON" in sequenceDataItem.keys():
            questionConfigsJSON = json.loads(sequenceDataItem["questionConfigsJSON"])
            questionType = questionConfigsJSON["questionType"]

            if questionType == "text":
                self.window = TextQuestionWindow(self.nextSequenceItem, len(self.data["sequenceData"]), sequenceDataItem)
                self.window.show()

            elif questionType == "multiple-choice":
                # print("\n\n"+ str(sequenceDataItem) +"\n\n")
                self.window = MultipleChoiceQuestionWindow(self.nextSequenceItem, len(self.data["sequenceData"]), sequenceDataItem)
                self.window.show()
                

        # Close the previous window
        try:
            self.previousWindow.close()
        except AttributeError:
            pass


    def getDebugData(self):
        refCode = "H8VH1NLA"
        sendData = {"referenceCode": str(refCode)}
        request = requests.post(self.ENTRY_API + "getTestDetailsByReferenceCode", data=sendData)
        data = json.loads(request.text)
        data["sequenceData"].sort(key=lambda obj: obj["sequenceNumber"], reverse=False)
        
        return data
    

    def loadComponents(self, data):
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
    print("----------- Starting (MAIN) ----------- ")

    try:
        app = QApplication([])
        app.setStyle('Fusion')
        
        main = MainProgram()

        app.exec_()
    except Exception as e:
        print('Unexpected error:' + str(e))
        input()
    