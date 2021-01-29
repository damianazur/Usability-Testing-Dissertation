import requests
import json

from PyQt5.QtCore import Qt
import PyQt5.QtCore as QtCore
import PyQt5.QtGui as QPalette
from PyQt5.QtGui import QFont, QStandardItemModel, QStandardItem
from PyQt5.QtWidgets import QMainWindow, QPushButton, QApplication, QLabel, QLineEdit, QVBoxLayout, QHBoxLayout, QWidget, QDialogButtonBox, QGroupBox, QFormLayout, QComboBox, QSpinBox, QListWidget, QScrollArea


class Window(QWidget):
    def __init__(self):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        # self.setWindowFlag(Qt.FramelessWindowHint) 
        self.setGeometry(400, 350, 500, 250)
        self.setWindowTitle("UsabCheck")
        self.setStyleSheet("font-size: 14px;")
        
        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(20, 20, 200, 0)
        self.createTestEnterLayout()

        self.displayTestLayout = QGroupBox()
        self.setLayout(self.mainLayout)


    def createTestEnterLayout(self):
        layout = QFormLayout()
        
        refCodeLabel = QLabel("Reference Code:")
        self.refCodeInput = QLineEdit()
        btn = QPushButton("Submit", self)
        btn.clicked.connect(self.submitRefCode)
        btn.resize(btn.sizeHint())
        btn.setStyleSheet("background-color: rgb(32, 123, 207 );")
        btn.setFixedWidth(100)

        layout.addRow(refCodeLabel)
        layout.addRow(self.refCodeInput)
        layout.addRow(btn)
        layout.setContentsMargins(0, 0, 0, 30)

        self.mainLayout.addLayout(layout)
        # self.mainLayout.addWidget(btn)
    

    def submitRefCode(self, e):
        refCode = self.refCodeInput.text()
        if refCode == "":
            refCode = "H8VH1NLA"

        print("Submitted", refCode)

        sendData = {"referenceCode": str(refCode)}
        request = requests.post("http://localhost:8090/api/localapp/getTestDetailsByReferenceCode", data=sendData)
        data = json.loads(request.text)
        print(data)

        self.displayTestData(data)

    
    def displayTestData(self, data):
        testName = data["testName"]
        createdDate = data["launchedDate"]
        noOfTasks = 0
        noOfQuestions = 0

        for item in data["sequenceData"]:
            if ("questionConfigsJSON" in item.keys()):
                noOfQuestions += 1
            if ("stepsJSON" in item.keys()):
                noOfTasks += 1
        
        print(testName, createdDate, noOfTasks, noOfQuestions)

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

        
        layout = QFormLayout()
        refCodeLabel = QLabel("Your name:")
        self.refCodeInput = QLineEdit()
        btn = QPushButton("Begin", self)
        btn.clicked.connect(self.begin, data)
        btn.resize(btn.sizeHint())
        btn.setStyleSheet("background-color: rgb(32, 207, 76);")
        btn.setFixedWidth(100)

        layout.addRow(refCodeLabel)
        layout.addRow(self.refCodeInput)
        layout.addRow(btn)
        layout.setContentsMargins(0, 30, 0, 30)

        self.mainLayout.addLayout(layout)


    def begin(self, e, data):
        self.window = OtherWindow(data)
        self.window.show()
        self.close()


class OtherWindow(QWidget):
    def __init__(self, data):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.setWindowFlag(Qt.FramelessWindowHint) 
        self.setGeometry(1600, 70, 300, 200)
        self.setWindowTitle("Instructions")
        self.setStyleSheet("font-size: 14px;")
        self.dragPos = QtCore.QPoint()

        self.sequenceIndex = 4
        self.renderTask(data)
    

    def renderTask(self, data):
        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(0, 0, 0, 0)
        
        hideButton = QPushButton("Hide", self)
        hideButton.clicked.connect(self.hide)
        hideButton.resize(hideButton.sizeHint())
        hideButton.setStyleSheet("background-color: rgb(32, 123, 207 );")
        self.mainLayout.addWidget(hideButton)
        
        sequenceData = data["sequenceData"][self.sequenceIndex]
        jsonSteps = json.loads(sequenceData["stepsJSON"])
        
        print(jsonSteps)

        stepIndex = 1
        stepString = ""
        for step in jsonSteps:
            stepString += str(stepIndex) + ".\n" + (str(step["value"]) + " ") * 20 + "\n\n"
            stepIndex += 1

        label = ScrollLabel(self) 
        label.setText(stepString) 
        label.setGeometry(0, 40, 300, 200) 
        label.setContentsMargins(0, 0, 0, 0)

        hbox = QHBoxLayout()
        nextTaskButton = QPushButton("Finish Task", self)
        nextTaskButton.clicked.connect(self.hide)
        nextTaskButton.resize(nextTaskButton.sizeHint())
        nextTaskButton.setStyleSheet("background-color: rgb(32, 207, 76);")
        nextTaskButton.setFixedWidth(100)
        hbox.setAlignment(Qt.AlignCenter)
        hbox.addWidget(nextTaskButton)
        label.lay.addLayout(hbox)

        self.mainLayout.addWidget(label)

        # self.mainLayout.addWidget(label)
        self.setLayout(self.mainLayout)
    
    def hide(self, e):
        print("Hide")

    def mousePressEvent(self, event):
        self.dragPos = event.globalPos()
        

    def mouseMoveEvent(self, event):
        if event.buttons() == QtCore.Qt.LeftButton:
            self.move(self.pos() + event.globalPos() - self.dragPos)
            self.dragPos = event.globalPos()
            event.accept()
        


# class for scrollable label 
class ScrollLabel(QScrollArea): 
  
    # contructor 
    def __init__(self, *args, **kwargs): 
        QScrollArea.__init__(self, *args, **kwargs) 
  
        # making widget resizable 
        self.setWidgetResizable(True) 
  
        # making qwidget object 
        content = QWidget(self) 
        self.setWidget(content) 
  
        # vertical box layout 
        self.lay = QVBoxLayout(content) 
  
        # creating label 
        self.label = QLabel(content) 
  
        # setting alignment to the text 
        self.label.setAlignment(Qt.AlignLeft | Qt.AlignTop) 
  
        # making label multi-line 
        self.label.setWordWrap(True) 
  
        # adding label to the layout 
        self.lay.addWidget(self.label) 
  
    # the setText method 
    def setText(self, text): 
        # setting text to the label 
        self.label.setText(text) 

def showGUI():
    app = QApplication([])
    app.setStyle('Fusion')
    # mainWindow = Window()
    # mainWindow.show()

    refCode = "H8VH1NLA"
    sendData = {"referenceCode": str(refCode)}
    request = requests.post("http://localhost:8090/api/localapp/getTestDetailsByReferenceCode", data=sendData)
    data = json.loads(request.text)

    window = OtherWindow(data)
    window.show()

    app.exec_()


if __name__ == '__main__':
    print("----------- Starting ----------- ")

    showGUI()
    