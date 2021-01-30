import requests
import json

from functools import partial

from TestBodyWindow import TestBodyWindow

from PyQt5.QtCore import Qt
import PyQt5.QtCore as QtCore
import PyQt5.QtGui as QPalette
from PyQt5.QtGui import QFont, QStandardItemModel, QStandardItem
from PyQt5.QtWidgets import (
    QMainWindow, 
    QPushButton, 
    QApplication, 
    QLabel, 
    QLineEdit, 
    QVBoxLayout, 
    QHBoxLayout, 
    QWidget, 
    QDialogButtonBox, 
    QGroupBox, 
    QFormLayout, 
    QComboBox, 
    QSpinBox, 
    QListWidget, 
    QScrollArea)


class Window(QWidget):
    LOCAL_APP_API = "http://localhost:8090/api/localapp/"
    GET_TEST_BY_REF_CODE_ENTRY = "getTestDetailsByReferenceCode/"


    def __init__(self):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)

        # Window configurations
        self.setGeometry(400, 350, 500, 250)
        self.setWindowTitle("UsabCheck")
        self.setStyleSheet("font-size: 14px;")
        
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
        print(data)

        self.displayTestData(data)

    
    # Display the data so that the user can verify that the test is correct
    def displayTestData(self, data):
        testName = data["testName"]
        createdDate = data["launchedDate"]
        noOfTasks = 0
        noOfQuestions = 0

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
        self.displayTestLayout.setLayout(layout)
        
        self.mainLayout.addWidget(self.displayTestLayout)
        
        # Form that asks the user for their info
        layout = QFormLayout()
        refCodeLabel = QLabel("Your name:")
        self.refCodeInput = QLineEdit()
        btn = QPushButton("Begin", self)
        btn.clicked.connect(partial(self.begin, data))
        btn.resize(btn.sizeHint())
        btn.setStyleSheet("background-color: rgb(32, 207, 76);")
        btn.setFixedWidth(100)

        layout.addRow(refCodeLabel)
        layout.addRow(self.refCodeInput)
        layout.addRow(btn)
        layout.setContentsMargins(0, 30, 0, 30)

        self.mainLayout.addLayout(layout)


    def begin(self, data):
        self.window = TestBodyWindow(data)
        self.window.show()
        self.close()


def showGUI():
    app = QApplication([])
    app.setStyle('Fusion')
    # mainWindow = Window()
    # mainWindow.show()

    refCode = "H8VH1NLA"
    sendData = {"referenceCode": str(refCode)}
    request = requests.post("http://localhost:8090/api/localapp/getTestDetailsByReferenceCode", data=sendData)
    data = json.loads(request.text)
    data["sequenceData"].sort(key=lambda obj: obj["sequenceNumber"], reverse=False)
    window = TestBodyWindow(data)
    window.show()

    app.exec_()


if __name__ == '__main__':
    print("----------- Starting ----------- ")

    showGUI()
    