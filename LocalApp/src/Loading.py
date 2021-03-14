from ScrollLabel import *
from QuestionWindow import *

from ScreenRecorder import *
from FacialExpressionRecog import *

from win32api import GetSystemMetrics
import win32gui as win32gui
from datetime import datetime

class LoadingWindow(QWidget):
    def __init__(self, parent):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.parent = parent

        self.status = "Loading..."

        # Window configurations
        self.setGeometry(400, 350, 300, 250)
        self.setWindowTitle("UsabCheck")
        self.setStyleSheet("font-size: 22px;")

        self.displayStatusLayout = QGroupBox("Loading")
        
        # Layout
        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(20, 20, 20, 20)
        self.displayStatus()
        self.setLayout(self.mainLayout)


    # Display the data so that the user can verify that the test is correct
    def displayStatus(self):
        # Remove the widget if it already exists (if the user submits another code the data is reloaded)
        self.mainLayout.removeWidget(self.displayStatusLayout)
        self.displayStatusLayout = QGroupBox("")
        self.displayStatusLayout.setMinimumWidth(400)
        layout = QFormLayout()
        layout.setSpacing(10)
        layout.addRow(QLabel("Loading Status: "), QLabel(str(self.status)))
        self.displayStatusLayout.setLayout(layout)
        
        self.mainLayout.addWidget(self.displayStatusLayout)

    def setStatus(self, text):
        self.status = text
        self.displayStatus()
        if text == "Finished!":
            # self.parent.loadNextSequenceItem()
            self.parent.begin()
            self.close()


    def busyFunc(self):
        self.thread = StartupThread(self)
        self.thread.signal.connect(self.setStatus)
        self.thread.start() 


class StartupThread(QThread):
    signal = pyqtSignal(str)

    def __init__(self, parent=None):
        QThread.__init__(self, parent)
        self.parent = parent

    def run(self):
        debug = False

        parent = self.parent.parent
        while True:
            screenRecCreated = hasattr(parent, 'recordingWindow')
            self.signal.emit("Loading Screen Recorder..")
            if screenRecCreated:
                if debug:
                    self.signal.emit("Finished!")
                    break

                self.signal.emit("Loading Camera")
                ferCreated = hasattr(parent.recordingWindow, 'fer')

                if ferCreated:
                    self.signal.emit("Configuring Camera")
                    ferStarted = parent.recordingWindow.fer.started
                    if ferStarted:
                        self.signal.emit("Finished!")
                        break

            time.sleep(0.1)

