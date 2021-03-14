import json
import os

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

from win32api import GetSystemMetrics
import win32gui as win32gui

from ScrollLabel import *

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
        self.setStyleSheet("font-size: 16px;")
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

        progress = "[" + str(sequenceDataItem["sequenceNumber"] + 1) + "/" + str(len(self.parent.data["sequenceData"])) + "]"
        stepString = "Progress: " + progress + "\n"

        # Create instruction text body
        stepIndex = 1
        stepString += "Task: " + sequenceDataItem["taskName"] + "\n"
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
        self.parent.nextSequenceItem(None, "Task")