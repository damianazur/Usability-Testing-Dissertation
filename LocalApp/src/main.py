import requests
import json

from PyQt5.QtCore import Qt
import PyQt5.QtGui as QPalette
from PyQt5.QtWidgets import QMainWindow, QPushButton, QApplication, QLabel, QLineEdit, QVBoxLayout, QHBoxLayout, QWidget, QDialogButtonBox, QGroupBox, QFormLayout, QComboBox, QSpinBox



class Window(QWidget):
    def __init__(self):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        # self.setWindowFlag(Qt.FramelessWindowHint) 
        self.setGeometry(400, 350, 500, 350)
        self.setWindowTitle("UsabCheck")
        
        self.mainLayout = QVBoxLayout()
        self.createTestEnterLayout()

        self.displayTestLayout = QGroupBox()
        layout = QFormLayout()
        layout.addRow(QLabel("Name:"), QLineEdit())
        self.displayTestLayout.setLayout(layout)
        self.mainLayout.addWidget(self.displayTestLayout)
        
        self.setLayout(self.mainLayout)


    def createTestEnterLayout(self):
        layout = QFormLayout()
        
        refCodeLabel = QLabel("Reference Code:")
        refCodeLabel.setStyleSheet("font-size: 14px;")
        self.refCodeInput = QLineEdit()
        self.refCodeInput.setStyleSheet("font-size: 14px;")
        btn = QPushButton("Submit", self)
        btn.clicked.connect(self.submitRefCode)
        btn.resize(btn.sizeHint())

        layout.addRow(refCodeLabel)
        layout.addRow(self.refCodeInput)
        layout.addRow(btn)

        self.mainLayout.addLayout(layout)
        self.mainLayout.addWidget(btn)
    

    def submitRefCode(self, e):
        refCode = self.refCodeInput.text()
        if refCode == "":
            refCode = "H8VH1NLA"

        print("Submitted", refCode)

        sendData = {"referenceCode": str(refCode)}
        request = requests.post("http://localhost:8090/api/localapp/getTestDetailsByReferenceCode", data=sendData)
        data = json.loads(request.text)
        print(data)

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
        self.displayTestData()

    
    def displayTestData(self):
        self.mainLayout.removeWidget(self.displayTestLayout)
        self.displayTestLayout = QGroupBox("Test Details")
        layout = QFormLayout()
        layout.addRow(QLabel("Name:"), QLineEdit())
        layout.addRow(QLabel("Country:"), QComboBox())
        layout.addRow(QLabel("Age:"), QSpinBox())
        self.displayTestLayout.setLayout(layout)

        # self.mainLayout.removeWidget(self.displayTestLayout)
        # self.displayTestLayout.deleteLater()
        self.mainLayout.addWidget(self.displayTestLayout)
        # self.displayTestLayout = groupBox


class MainWindow(QMainWindow):
    def __init__(self):
        QMainWindow.__init__(self, None, Qt.WindowStaysOnTopHint)
        # self.setWindowFlag(Qt.FramelessWindowHint) 
        self.initUI()

    def initUI(self):
        # Window settings
        self.setGeometry(400, 350, 700, 350)
        self.setWindowTitle("UsabCheck")

        paddingLeft = 30
        startingY = 20
        
        label_1 = QLabel('Enter Test Code', self)
        label_1.move(paddingLeft, 20) 
        label_1.setStyleSheet("font-size: 14px;") 
        

        self.layout = QHBoxLayout()
        self.layout.addWidget(QPushButton("Left-Most"))
        self.layout.addWidget(QPushButton("Center"), 1)
        self.layout.addWidget(QPushButton("Right-Most"), 2)


        # self.textBox = QLineEdit(self)
        # self.textBox.move(paddingLeft, 80)
        # self.textBox.resize(280, 20)

        self.setLayout(self.layout)
        self.setCentralWidget()

        btn = QPushButton("Hello", self)
        btn.setToolTip("Say Hello!")
        btn.clicked.connect(self.closeEvent)
        btn.resize(btn.sizeHint())
        btn.move(paddingLeft, 200)

        self.window = Window()
        # self.window.show()

        self.show()

def showGUI():
    app = QApplication([])
    app.setStyle('Fusion')
    # app.setStyleSheet("QPushButton { margin: 10ex; }")

    mainWindow = Window()
    mainWindow.show()
    app.exec_()


if __name__ == '__main__':
    print("----------- Starting ----------- H8VH1NLA ")

    # data = {
    #     "referenceCode": "H8VH1NLA"
    # }

    # r = requests.post("http://localhost:8090/api/localapp/getTestDetailsByReferenceCode", data=data)
    # # print(dir(r))
    # # print("\nTEXT\n", r.text)

    # d = json.loads(r.text)

    # # print(json.dumps(d, indent=1))

    # for item in d["sequenceData"]:
    #     # print("Item", item)
    #     if ("questionConfigsJSON" in item.keys()):
    #         print("Item", item["questionConfigsJSON"])

    showGUI()
    