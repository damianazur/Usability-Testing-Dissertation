import threading
import os

from ScrollLabel import *
from QuestionWindow import *

from ScreenRecorder import *
from FacialExpressionRecog import *
from ConfirmWindow import *

from win32api import GetSystemMetrics
import win32gui as win32gui
from datetime import datetime

class RecordingWindow(QWidget):
    def __init__(self, parent):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)

        self.mainLayout = QHBoxLayout()
        self.mainLayout.setContentsMargins(0, 0, 0, 0)
        self.mainLayout.setSpacing(0)
        self.setStyleSheet("font-size: 16px;")

        self.parent = parent
        self.isMinimized = False
        self.setAttribute(Qt.WA_TranslucentBackground)

        self.renderBorder()
        self.renderRecordingOptions()


        self.videoFileName = "UsabTest-" + datetime.today().strftime('%Y-%m-%d-%H-%M-%S') +".avi"
        
        screenRecThread = threading.Thread(target=self.startRecorder, args=(self,)) 
        screenRecThread.start()
        
        while not hasattr(self, "screenRecorder"):
            time.sleep(0.1)

        ferThread = threading.Thread(target=self.startFER, args=(self,))
        ferThread.start()
        

    def startRecorder(self, parent):
        parent.screenRecorder = ScreenRecorder(parent.videoFileName)
        parent.screenRecorder.begin()


    def startFER(self, parent):
        parent.fer = FacialExpressionRecog("Model 1", parent.screenRecorder)
        parent.fer.begin()


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
        frame = QWidget(self)
        
        self.frameWidth = 200
        self.frameHeight = 40
        frameX = self.screenW / 2 - self.frameWidth/2
        frameY = self.screenH - self.frameHeight

        frame.setFixedSize(self.frameWidth, self.frameHeight)
        frame.move(frameX, frameY)
        frame.setStyleSheet("background-color: rgb(211,211,211);")

        innerLayout = QHBoxLayout()
        innerLayout.setContentsMargins(0, 0, 15, 0)

        label = QLabel("Recording")
        label.setFixedHeight(self.frameHeight)
        label.setContentsMargins(10, 0, 5, 0)

        recordingIconLabel = QLabel(self) 
        recIcon = QPixmap("./assets/RecordingIcon20x20.png") 
        recIcon = recIcon.scaled(20, 20, Qt.KeepAspectRatio)
        recordingIconLabel.setPixmap(recIcon) 
        recordingIconLabel.resize(
            recIcon.width(), 
            recIcon.height()) 

        stopButton = QPushButton("STOP", self)
        stopButton.clicked.connect(self.stopRecording)
        stopButton.resize(stopButton.sizeHint())
        stopButton.setStyleSheet("background-color: rgb(255,51,51); margin: 0; padding: 2; font-size: 16px;")
        stopButton.setFixedWidth(60)

        minimizeButton = QPushButton(self)

        leftArrowIcon = QIcon("./assets/LeftArrow40x80.png") 
        minimizeButton.setIcon(leftArrowIcon) 
        minimizeButton.setIconSize(QSize(15,35))
        minimizeButton.pressed.connect(self.minimizeButtonPress)
        minimizeButton.clicked.connect(self.minimize)
        minimizeButton.resize(minimizeButton.sizeHint())
        minimizeButton.setStyleSheet("background-color: gray; border: 1px solid gray;")
        minimizeButton.setFixedWidth(20)
        minimizeButton.setFixedHeight(self.frameHeight)
        minimizeButton.mouseMoveEvent = self.minimizeButtonDrag
        minimizeButton.move(frameX + self.frameWidth, frameY)
        self.minimizeButtonDragged = False

        self.minimizeButton = minimizeButton

        innerLayout.addWidget(label)
        innerLayout.addWidget(recordingIconLabel)
        innerLayout.addWidget(stopButton)
        self.innerLayout = innerLayout
        frame.setLayout(self.innerLayout)

        self.frame = frame
    

    def stopProcesses(self):
        self.fer.running = False
        self.fer.cap.release()
        self.screenRecorder.quit = True


    def onConfirmStop(self):
        print("STOPPING RECORDING!")
        self.stopProcesses()

        self.parent.onRecordingStopped()
        self.close()


    def stopRecording(self):
        self.confirmWindow = ConfirmWindow(self, "Are you sure you want to stop the study? All data will be lost.", None, None, self.onConfirmStop)
        self.confirmWindow.show()


    def minimize(self):
        if not self.minimizeButtonDragged:
            if self.isMinimized:
                self.frame.show()
                self.isMinimized = False
            else:
                self.frame.hide()
                self.isMinimized = True


    def minimizeButtonPress(self):
        _, _, (x,y) = win32gui.GetCursorInfo()
        self.minimizeButtonDragged = False
        self.dragPos = QPoint(x, y)

    def minimizeButtonDrag(self, event):
        self.minimizeButtonDragged = True
        self.mouseMoveEvent(event)


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