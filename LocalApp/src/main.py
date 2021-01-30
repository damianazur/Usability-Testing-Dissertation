import requests
import json
from win32api import GetSystemMetrics
import win32gui as win32gui

from functools import partial

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


class InitialWindow(QWidget):
    LOCAL_APP_API = "http://localhost:8090/api/localapp/"
    GET_TEST_BY_REF_CODE_ENTRY = "getTestDetailsByReferenceCode/"


    def __init__(self, parent):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.parent = parent

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
        data["sequenceData"].sort(key=lambda obj: obj["sequenceNumber"], reverse=False)

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
        self.parent.begin(data)


class TaskWindow(QWidget):
    def __init__(self, parent, sequenceDataItem, previousTaskPos):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.parent = parent
        self.previousTaskPos = previousTaskPos
        self.sequenceDataItem = sequenceDataItem

        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(0, 0, 0, 0)
        self.setLayout(self.mainLayout)

        self.renderTaskWindow()
        self.renderTask(sequenceDataItem)


    def renderTaskWindow(self):
        # Setting dimensions
        self.screenW = GetSystemMetrics(0)
        self.screenH = GetSystemMetrics(1)
        self.windowW = 300
        self.windowH = 170
        self.windowPaddingLeft = 30
        self.windowsPaddingTop = 70

        if self.previousTaskPos == None:
            self.initX = self.screenW - self.windowW - self.windowPaddingLeft
            self.initY = self.windowsPaddingTop
        else:
            self.initX = self.previousTaskPos.x()
            self.initY = self.previousTaskPos.y()

        self.buttonMinW = 100
        self.buttonHeight = 25

        # Configurations
        self.setWindowFlag(Qt.FramelessWindowHint) 
        self.setGeometry(self.initX, self.initY, self.windowW, self.windowH)
        self.setStyleSheet("font-size: 14px;")
        self.dragPos = QtCore.QPoint(self.pos().x(), self.pos().y())
        self.hideButtonDragged = False

        # Hide button
        hideButton = QPushButton("Hide", self)
        hideButton.clicked.connect(self.toggleHide)
        hideButton.resize(hideButton.sizeHint())
        hideButton.setStyleSheet("background-color: rgb(32, 123, 207 );")
        hideButton.pressed.connect(self.hideButtonPress)
        hideButton.mouseMoveEvent = self.hideButtonDrag
        self.hideButton = hideButton
        self.mainLayout.addWidget(self.hideButton)


    def renderTask(self, sequenceDataItem):
        jsonSteps = json.loads(sequenceDataItem["stepsJSON"])

        # Create instruction text body
        stepIndex = 1
        stepString = "Task: " + sequenceDataItem["taskName"] + "\n\n"
        for step in jsonSteps:
            stepString += str(stepIndex) + ".\n" + (str(step["value"]) + " ") * 20 + "\n\n"
            stepIndex += 1


        # Set the text
        taskLayout = ScrollLabel(self) 
        taskLayout.setText(stepString) 
        taskLayout.setGeometry(0, 40, 300, 200) 
        taskLayout.setContentsMargins(0, 0, 0, 0)

        # Add "Finish Task" button
        hbox = QHBoxLayout()
        nextTaskButton = QPushButton("Finish Task", self)
        nextTaskButton.clicked.connect(self.nextTask)
        nextTaskButton.resize(nextTaskButton.sizeHint())
        nextTaskButton.setStyleSheet("background-color: rgb(32, 207, 76);")
        nextTaskButton.setFixedWidth(100)
        hbox.setAlignment(Qt.AlignCenter)
        hbox.addWidget(nextTaskButton)
        taskLayout.lay.addLayout(hbox)
        self.taskLayout = taskLayout

        self.mainLayout.addWidget(self.taskLayout)
    

    def hideButtonPress(self):
        _, _, (x,y) = win32gui.GetCursorInfo()
        self.dragPos = QtCore.QPoint(x, y)

    def hideButtonDrag(self, event):
        if event.buttons() == QtCore.Qt.LeftButton:
            self.hideButtonDragged = True
            self.move(self.pos() + event.globalPos() - self.dragPos)
            self.dragPos = event.globalPos()
            self.previousTaskPos = self.pos()


    # Hiding the content of the task with the button
    def toggleHide(self, e):
        currentState = self.hideButton.text()

        # If the hideButton was dragged (the window was moved when the button was selected)
        # then do not activate the button. Button will only be activated on click (no drag before click)
        if (self.hideButtonDragged):
            self.hideButtonDragged = False
            return

        if (currentState == "Hide"):
            self.hideButton.setText('Show')
            self.setFixedSize(self.buttonMinW, self.buttonHeight)
            x = int(self.pos().x() + self.windowW - self.buttonMinW)
            y = int(self.pos().y())
            self.setGeometry(x, y, 0, 0)
            self.taskLayout.hide()

        elif (currentState == "Show"):
            self.hideButton.setText('Hide')
            self.setFixedSize(self.windowW, self.windowH)
            x = int(self.pos().x() - self.windowW + self.buttonMinW)
            y = int(self.pos().y())
            self.setGeometry(x, y, 0, 0)
            self.taskLayout.show()
            

    # Clicking on the body of the window before it is dragged and repositioned
    # The click position needs to be saved to know where to move the window to
    def mousePressEvent(self, event):
        self.dragPos = event.globalPos()
    
    # When the user drags the window
    def mouseMoveEvent(self, event):
        if event.buttons() == QtCore.Qt.LeftButton:
            self.move(self.pos() + event.globalPos() - self.dragPos)
            self.dragPos = event.globalPos()
            self.previousTaskPos = self.pos()
    
    
    # User clicked finish task
    def nextTask(self, e):
        self.parent.nextTask()


# Scroll Label is used for the body of the task
class ScrollLabel(QScrollArea): 
    def __init__(self, *args, **kwargs): 
        QScrollArea.__init__(self, *args, **kwargs) 
        self.setWidgetResizable(True) 
  
        content = QWidget(self) 
        self.setWidget(content) 
  
        self.lay = QVBoxLayout(content) 
        self.label = QLabel(content) 

        self.label.setAlignment(Qt.AlignLeft | Qt.AlignTop) 
        self.label.setWordWrap(True) 
        self.lay.addWidget(self.label) 
  
    def setText(self, text): 
        self.label.setText(text) 


class MainProgram():
    def __init__(self):
        app = QApplication([])
        app.setStyle('Fusion')

        # self.mainWindow = InitialWindow(self)
        # self.mainWindow.show()

        self.data = self.getDebugData()
        self.previousTaskPos = None
        self.sequenceIndex = 0
        self.loadNextSequenceItem()

        app.exec_()


    def nextTask(self):
        print("Next Task")
        if (self.sequenceIndex < len(self.data["sequenceData"]) - 1):
            self.previousWindow = self.window
            self.previousTaskPos = self.window.pos()
            self.sequenceIndex += 1
            self.loadNextSequenceItem()
        else:
            print("TEST FINISHED!")

    
    def loadNextSequenceItem(self):
        # Create instruction text body
        sequenceDataItem = self.data["sequenceData"][self.sequenceIndex]

        while "stepsJSON" not in sequenceDataItem.keys() and self.sequenceIndex < len(self.data["sequenceData"]) - 1:
            sequenceDataItem = self.data["sequenceData"][self.sequenceIndex]
            self.sequenceIndex += 1

        print("Creating Task: ", sequenceDataItem)

        self.window = TaskWindow(self, sequenceDataItem, self.previousTaskPos)
        self.window.show()

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
    
    def begin(self, data):
        print("Begin...")
        self.mainWindow.close()
        self.window = TaskWindow(data)
        self.window.show()

    


if __name__ == '__main__':
    print("----------- Starting ----------- ")

    main = MainProgram()
    