import requests
import json

from functools import partial

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

from TutorialWindow import TutorialWindow

class InitialWindow(QWidget):
    LOCAL_APP_API = "http://localhost:8090/api/localapp/"
    GET_TEST_BY_REF_CODE_ENTRY = "getTestDetailsByReferenceCode/"


    def __init__(self, parent):
        QWidget.__init__(self, None) #, Qt.WindowStaysOnTopHint)
        self.parent = parent

        # Window configurations
        self.setGeometry(400, 350, 500, 250)
        self.setWindowTitle("UsabCheck")
        self.setStyleSheet("font-size: 16px;")
        
        # Layout
        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(20, 20, 150, 0)
        self.createTestEnterLayout()

        self.displayTestLayout = QGroupBox()
        self.beginForm = QWidget(self)
        self.setLayout(self.mainLayout)


    # Creates the first part of the form where the user enters a test reference code
    def createTestEnterLayout(self):
        layout = QFormLayout()
        
        refCodeLabel = QLabel("Test Reference Code:")
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
        self.data = data
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
        self.mainLayout.removeWidget(self.beginForm)
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
        self.displayBeginForm()

    
    def displayBeginForm(self):
        self.beginForm = QWidget(self) 

        # Form that asks the user for their info
        layout = QFormLayout()
        
        tutorialBtn = QPushButton("Open Tutorial", self)
        tutorialBtn.clicked.connect(partial(self.showTutorial))
        tutorialBtn.resize(tutorialBtn.sizeHint())
        tutorialBtn.setStyleSheet("background-color: rgb(32, 123, 207);")
        tutorialBtn.setFixedWidth(150)
        tutorialBtn.setContentsMargins(100, 100, 100, 100)

        self.userNameLabel = QLabel("Your name:")
        self.userNameInput = QLineEdit()
        btn = QPushButton("Begin", self)
        btn.clicked.connect(partial(self.begin))
        btn.resize(btn.sizeHint())
        btn.setStyleSheet("background-color: rgb(32, 207, 76);")
        btn.setFixedWidth(100)

        layout.addRow(tutorialBtn)
        layout.addRow(QLabel())
        layout.addRow(self.userNameLabel)
        layout.addRow(self.userNameInput)
        layout.addRow(btn)
        layout.setContentsMargins(0, 30, 0, 30)

        self.beginForm.setLayout(layout)
        self.mainLayout.addWidget(self.beginForm)


    def begin(self):
        data = self.data
        data["participantName"] = self.userNameInput.text()
        self.parent.loadComponents(data)


    def showTutorial(self):
        self.tutorialWindow = TutorialWindow()
        self.tutorialWindow.show()