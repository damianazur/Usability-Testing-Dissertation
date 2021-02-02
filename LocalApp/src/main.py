import requests
import json
import os
from win32api import GetSystemMetrics
import win32gui as win32gui

from functools import partial

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *


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
        self.mainLayout.setContentsMargins(0, 0, 0, 3)
        self.setLayout(self.mainLayout)

        self.renderTaskWindow()
        self.renderTask(sequenceDataItem)


    def renderTaskWindow(self):
        # Setting dimensions
        self.screenW = GetSystemMetrics(0)
        self.screenH = GetSystemMetrics(1)
        self.windowW = 300
        self.windowH = 200
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
        self.dragPos = QPoint(self.pos().x(), self.pos().y())
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
        stepString = "Task: " + sequenceDataItem["taskName"] + "\n"
        for step in jsonSteps:
            stepString += "\n" + str(stepIndex) + ".    " + (str(step["value"]) + " ") + "\n"
            stepIndex += 1


        # Set the text
        taskLayout = ScrollLabel(self) 
        taskLayout.setText(stepString) 
        taskLayout.setGeometry(0, 40, 300, 0) 
        taskLayout.setContentsMargins(0, 0, 0, 0)

        # Add "Finish Task" button
        hbox = QHBoxLayout()
        finishTaskButton = QPushButton("Finish Task", self)
        finishTaskButton.clicked.connect(self.finishTaskButton)
        finishTaskButton.resize(finishTaskButton.sizeHint())
        finishTaskButton.setStyleSheet("background-color: rgb(32, 207, 76);")
        finishTaskButton.setFixedWidth(100)
        hbox.setAlignment(Qt.AlignCenter)
        hbox.addWidget(finishTaskButton)
        taskLayout.lay.addLayout(hbox)
        self.taskLayout = taskLayout

        self.mainLayout.addWidget(self.taskLayout)
    

    def hideButtonPress(self):
        _, _, (x,y) = win32gui.GetCursorInfo()
        self.dragPos = QPoint(x, y)

    def hideButtonDrag(self, event):
        if event.buttons() == Qt.LeftButton:
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
            self.mainLayout.setContentsMargins(0, 0, 0, 0)

        elif (currentState == "Show"):
            self.hideButton.setText('Hide')
            self.setFixedSize(self.windowW, self.windowH)
            x = int(self.pos().x() - self.windowW + self.buttonMinW)
            y = int(self.pos().y())
            self.setGeometry(x, y, 0, 0)
            self.taskLayout.show()
            self.mainLayout.setContentsMargins(0, 0, 0, 3)
            

    # Clicking on the body of the window before it is dragged and repositioned
    # The click position needs to be saved to know where to move the window to
    def mousePressEvent(self, event):
        self.dragPos = event.globalPos()
    
    # When the user drags the window
    def mouseMoveEvent(self, event):
        if event.buttons() == Qt.LeftButton:
            self.move(self.pos() + event.globalPos() - self.dragPos)
            self.dragPos = event.globalPos()
            self.previousTaskPos = self.pos()
    
    
    # User clicked finish task
    def finishTaskButton(self, e):
        self.parent.nextSequenceItem(None)


# Scroll Label is used for the body of the task
class ScrollLabel(QScrollArea): 
    def __init__(self, *args, **kwargs): 
        QScrollArea.__init__(self, *args, **kwargs) 
        self.setWidgetResizable(True) 
  
        content = QWidget(self) 
        self.setWidget(content) 
  
        self.lay = QVBoxLayout(content) 
        # self.lay.setAlignment(Qt.AlignLeft | Qt.AlignTop) 
        self.lay.setContentsMargins(15, 0, 15, 10)
        self.label = QLabel(content) 

        self.label.setAlignment(Qt.AlignLeft | Qt.AlignTop) 
        self.label.setWordWrap(True) 
        self.lay.addWidget(self.label) 
  
    def setText(self, text): 
        self.label.setText(text) 


class QuestionWindow(QWidget):
    def __init__(self, parent, sequenceDataItem):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)

        print("sequenceDataItem", sequenceDataItem)

        self.parent = parent
        self.sequenceDataItem = sequenceDataItem

        self.mainLayout = QVBoxLayout()

        shadow = QGraphicsDropShadowEffect(self,
            blurRadius=20.0,
            color= QColor(105, 105, 105),
            offset= QPointF(2.0, 2.0)
        )
        self.setGraphicsEffect(shadow)

        self.mainLayout.setContentsMargins(20, 20, 20, 20)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setLayout(self.mainLayout)

        self.renderQuestionWindow()


    def renderQuestionWindow(self):
        # Setting dimensions
        self.screenW = GetSystemMetrics(0)
        self.screenH = GetSystemMetrics(1)
        self.windowW = 500
        self.windowH = 350

        self.initX = int(self.screenW/2 - self.windowW/2)
        self.initY = int(self.screenH/3 - self.windowH/2)

        self.dragPos = QPoint(self.initX, self.initY + self.windowH)

        self.buttonWidth = 100
        self.buttonHeight = 25

        # Configurations
        self.setWindowFlag(Qt.FramelessWindowHint) 
        self.setGeometry(self.initX, self.initY, self.windowW, self.windowH)
        self.setStyleSheet("font-size: 14px;")

    # Clicking on the body of the window before it is dragged and repositioned
    # The click position needs to be saved to know where to move the window to
    def mousePressEvent(self, event):
        self.dragPos = event.globalPos()
    

    # When the user drags the window
    def mouseMoveEvent(self, event):
        if event.buttons() == Qt.LeftButton:
            self.move(self.pos() + event.globalPos() - self.dragPos)
            self.dragPos = event.globalPos()


class TextQuestionWindow(QuestionWindow):
    def __init__(self, parent, sequenceDataItem):
        # QuestionWindow.__init__(self, parent, sequenceDataItem)
        super().__init__(parent, sequenceDataItem)
        self.renderQuestion(sequenceDataItem)


    def renderQuestion(self, sequenceDataItem):
        questionConfigs = json.loads(sequenceDataItem["questionConfigsJSON"])

        questionText = questionConfigs["questionText"]

        # Set the text
        taskLayout = ScrollLabel(self) 
        taskLayout.setGeometry(0, 40, 400, 0)
        taskLayout.setContentsMargins(0, 0, 0, 0)

        answerForm = QFormLayout()
        questionLabel = QLabel("Question:")
        questionLabel.setStyleSheet("font-size: 16px;")
        questionLabel.setContentsMargins(0, 0, 0, 0)

        hr = QFrame()
        hr.setFrameShape(QFrame.HLine)
        hr.setStyleSheet("color: gray")

        questionLabel2 = QLabel(questionText)
        questionLabel2.setContentsMargins(0, 0, 0, 10)
        questionLabel2.setWordWrap(True) 
        # questionLabel2.setStyleSheet("border-top: 1px solid gray")

        answerLabel = QLabel("Your answer:")
        self.answerInput = QLineEdit()
        self.answerInput = QTextEdit()
        self.answerInput.setFixedHeight(100)

        hr2 = QLabel("")
        hr2.setContentsMargins(30, 0, 0, 0)

        # Add "Submit Question" button
        submitButton = QPushButton("Submit", self)
        submitButton.clicked.connect(self.submitButtonPress)
        submitButton.resize(submitButton.sizeHint())
        submitButton.setStyleSheet("background-color: rgb(32, 207, 76);")
        submitButton.setFixedWidth(100)

        answerForm.addRow(questionLabel)
        answerForm.addRow(hr)
        answerForm.addRow(questionLabel2)
        answerForm.addRow(answerLabel)
        answerForm.addRow(self.answerInput)
        answerForm.addRow(hr2)
        answerForm.addRow(submitButton)
        answerForm.setContentsMargins(0, 0, 0, 15)

        taskLayout.lay.addLayout(answerForm)

        self.taskLayout = taskLayout
        self.mainLayout.addWidget(self.taskLayout)


    def submitButtonPress(self):
        answerJSON = {
            "answer": self.answerInput.toPlainText()
        }

        returnData = {
            "answerJSON": answerJSON,
            "questionId": self.sequenceDataItem["questionId"]
        }
        self.parent.nextSequenceItem(returnData)


class MultipleChoiceQuestionWindow(QuestionWindow):
    def __init__(self, parent, sequenceDataItem):
        super().__init__(parent, sequenceDataItem)
        self.renderQuestion(sequenceDataItem)


    def renderQuestion(self, sequenceDataItem):
        questionConfigs = json.loads(sequenceDataItem["questionConfigsJSON"])
        questionText = questionConfigs["questionText"]
        choices = questionConfigs["choices"]

        # Set the text
        taskLayout = ScrollLabel(self) 
        taskLayout.setGeometry(0, 40, 200, 0)

        answerForm = QFormLayout()
        questionLabel = QLabel("Multiple-Choice Question:")
        questionLabel.setStyleSheet("font-size: 16px;")
        questionLabel.setContentsMargins(0, 0, 0, 0)
        questionLabel.setFixedWidth(420)

        hr = QFrame()
        hr.setFrameShape(QFrame.HLine)
        hr.setStyleSheet("color: gray")

        questionLabel2 = QLabel(questionText)
        questionLabel2.setContentsMargins(0, 0, 0, 10)
        questionLabel2.setWordWrap(True) 

        answerLabel = QLabel("Select one answer")
        radioButtonLayout = QVBoxLayout()
        radioButtonLayout.setContentsMargins(0, 0, 0, 0)

        for choice in choices:
            button = QRadioButton(str(choice["value"]))
            button.toggled.connect(self.radioSelect)
            radioButtonLayout.addWidget(button)

        hr2 = QLabel("")
        hr2.setContentsMargins(30, 0, 0, 0)

        # Add "Submit Question" button
        submitButton = QPushButton("Submit", self)
        submitButton.clicked.connect(self.submitButtonPress)
        submitButton.resize(submitButton.sizeHint())
        submitButton.setStyleSheet("background-color: rgb(32, 207, 76);")
        submitButton.setFixedWidth(100)
        submitButton.hide()
        self.submitButton = submitButton

        answerForm.addRow(questionLabel)
        answerForm.addRow(hr)
        answerForm.addRow(questionLabel2)
        answerForm.addRow(answerLabel)
        answerForm.addRow(radioButtonLayout)
        answerForm.addRow(hr2)
        answerForm.addRow(self.submitButton)
        answerForm.setContentsMargins(0, 0, 0, 15)

        taskLayout.lay.addLayout(answerForm)
        taskLayout.lay.setAlignment(Qt.AlignLeft | Qt.AlignTop) 

        self.taskLayout = taskLayout
        self.mainLayout.addWidget(self.taskLayout)


    def radioSelect(self):
        self.submitButton.show()

        radioButton =  self.sender()
        if radioButton.isChecked():
            self.choiceSelected = radioButton.text()
            print("Selected: ", radioButton.text())


    def submitButtonPress(self):
        answerJSON = {
            "answer": self.choiceSelected
        }

        returnData = {
            "answerJSON": answerJSON,
            "questionId": self.sequenceDataItem["questionId"]
        }
        self.parent.nextSequenceItem(returnData)


class RecordingWindow(QWidget):
    def __init__(self, parent):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)

        self.parent = parent

        self.setAttribute(Qt.WA_TranslucentBackground)

        self.renderBorder()
        self.renderRecordingOptions()


    def renderBorder(self):
        # Setting dimensions
        self.screenW = GetSystemMetrics(0)
        self.screenH = GetSystemMetrics(1)

        # Configurations
        self.setWindowFlag(Qt.FramelessWindowHint) 
        self.setGeometry(0, 0, self.screenW - 0, self.screenH - 0)

        redFrame = QFrame(self)
        redFrame.setGeometry(0, 0, self.screenW - 0, self.screenH - 0)
        redFrame.setStyleSheet("border: 2px solid red;")

    
    def renderRecordingOptions(self):
        self.mainLayout = QHBoxLayout()
        self.mainLayout.setContentsMargins(0, 0, 0, 0)
        self.mainLayout.setAlignment(Qt.AlignCenter | Qt.AlignBottom) 
        self.mainLayout.setSpacing(0)
        self.setStyleSheet("font-size: 16px;")

        frame = QWidget(self)
        width = 200
        height = 40
        frame.setFixedSize(width, height)
        frame.setStyleSheet("background-color: rgb(211,211,211);")

        innerLayout = QHBoxLayout()
        innerLayout.setContentsMargins(0, 0, 15, 0)

        label = QLabel("Recording")
        label.setFixedHeight(height)
        label.setContentsMargins(10, 0, 5, 0)

        recordingIconLabel = QLabel(self) 
        recIcon = QPixmap("C:/Users/New User/Desktop/Fourth Year/Usability_Testing_FYP/LocalApp/src/RecordingIcon20x20.png") 
        recIcon = recIcon.scaled(20, 20, Qt.KeepAspectRatio)
        recordingIconLabel.setPixmap(recIcon) 
        recordingIconLabel.resize(
            recIcon.width(), 
            recIcon.height()) 

        stopButton = QPushButton("STOP", self)
        stopButton.clicked.connect(self.stopRecording)
        stopButton.resize(stopButton.sizeHint())
        stopButton.setStyleSheet("background-color: rgb(255,51,51); margin: 0; padding: 2; font-size: 14px;")
        stopButton.setFixedWidth(60)

        minimizeButton = QPushButton(self)

        leftArrowIcon = QIcon("C:/Users/New User/Desktop/Fourth Year/Usability_Testing_FYP/LocalApp/src/LeftArrow40x80.png") 
        minimizeButton.setIcon(leftArrowIcon) 
        minimizeButton.setIconSize(QSize(15,35))
        minimizeButton.clicked.connect(self.minimize)
        minimizeButton.resize(minimizeButton.sizeHint())
        minimizeButton.setStyleSheet("background-color: gray; border: 1px solid gray")
        minimizeButton.setFixedWidth(20)
        minimizeButton.setFixedHeight(height)

        self.minimizeButton = minimizeButton

        frame.setLayout(innerLayout)
        innerLayout.addWidget(label)
        innerLayout.addWidget(recordingIconLabel)
        innerLayout.addWidget(stopButton)

        self.frame = frame
        
        self.mainLayout.addWidget(frame)
        self.mainLayout.addWidget(minimizeButton)
        self.setLayout(self.mainLayout)

    
    def stopRecording():
        pass


    def minimize(self):
        self.frame.hide()


    # Clicking on the body of the window before it is dragged and repositioned
    # The click position needs to be saved to know where to move the window to
    def mousePressEvent(self, event):
        self.dragPos = event.globalPos()
    
    # When the user drags the window
    def mouseMoveEvent(self, event):
        if event.buttons() == Qt.LeftButton:
            self.frame.move(self.frame.pos().x() + event.globalPos().x() - self.dragPos.x(), self.frame.pos().y())
            self.minimizeButton.move(self.minimizeButton.pos().x() + event.globalPos().x() - self.dragPos.x(), self.minimizeButton.pos().y())
            self.dragPos = event.globalPos()


class MainProgram():
    def __init__(self):
        app = QApplication([])
        app.setStyle('Fusion')
        
        self.answers = []
        self.previousTaskPos = None
        self.sequenceIndex = None
        self.data = None

        # self.mainWindow = InitialWindow(self)
        # self.mainWindow.show()

        # self.data = self.getDebugData()
        # self.loadNextSequenceItem()

        self.window = RecordingWindow(self)
        self.window.show()

        app.exec_()


    def nextSequenceItem(self, returnData):
        print("NEXT SEQUENCE ITEM: ")
        if returnData != None:
            print("RETURN: ", returnData)

        if (self.sequenceIndex < len(self.data["sequenceData"]) - 1):
            self.previousWindow = self.window

            if "stepsJSON" in self.data["sequenceData"][self.sequenceIndex].keys():
                self.previousTaskPos = self.window.pos()

            self.loadNextSequenceItem()
        else:
            print("TEST FINISHED!")

    
    def loadNextSequenceItem(self):
        if self.sequenceIndex == None:
            self.sequenceIndex = 0
        else:
            self.sequenceIndex += 1

        print("SEQUENCE NUM: ", self.sequenceIndex)

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
    

    def begin(self, data):
        print("Begin...")
        self.mainWindow.close()
        self.data = data
        self.loadNextSequenceItem()



if __name__ == '__main__':
    print("----------- Starting ----------- ")

    main = MainProgram()
    