import requests
import json
from win32api import GetSystemMetrics
import win32gui as win32gui

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


class TestBodyWindow(QWidget):
    def __init__(self, data):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.previousTaskPos = None

        self.data = data
        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(0, 0, 0, 0)
        self.setLayout(self.mainLayout)

        self.sequenceIndex = 0
        self.loadNextSequenceItem()

    
    def loadNextSequenceItem(self):
        # Create instruction text body
        sequenceDataItem = self.data["sequenceData"][self.sequenceIndex]

        while "stepsJSON" not in sequenceDataItem.keys() and self.sequenceIndex < len(self.data["sequenceData"]) - 1:
            sequenceDataItem = self.data["sequenceData"][self.sequenceIndex]
            self.sequenceIndex += 1

        self.renderTaskWindow()
        self.renderTask(sequenceDataItem)


    def renderTextQuestion():
        pass


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

        # Remove previous Hide button
        try:
            self.mainLayout.removeWidget(self.hideButton)
        except AttributeError:
            pass
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
        try:
            self.mainLayout.removeWidget(self.taskLayout)
        except AttributeError:
            pass
        
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
            self.textBody.hide()

        elif (currentState == "Show"):
            self.hideButton.setText('Hide')
            self.setFixedSize(self.windowW, self.windowH)
            x = int(self.pos().x() - self.windowW + self.buttonMinW)
            y = int(self.pos().y())
            self.setGeometry(x, y, 0, 0)
            self.textBody.show()
            

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
        print("Next Task")
        if (self.sequenceIndex < len(self.data["sequenceData"]) - 1):
            self.sequenceIndex += 1
            self.loadNextSequenceItem()
        else:
            print("TEST FINISHED!")


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