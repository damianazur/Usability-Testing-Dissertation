from ScrollLabel import *
from QuestionWindow import *
import json

class MultipleChoiceQuestionWindow(QuestionWindow):
    def __init__(self, onSubmitFunc, numSequenceItems, sequenceDataItem):
        super().__init__(sequenceDataItem)

        self.onSubmitFunc = onSubmitFunc
        self.numSequenceItems = numSequenceItems
        self.renderQuestion(sequenceDataItem)


    def renderQuestion(self, sequenceDataItem):
        questionConfigs = json.loads(sequenceDataItem["questionConfigsJSON"])
        questionText = questionConfigs["questionText"]
        choices = questionConfigs["choices"]

        # Set the text
        taskLayout = ScrollLabel(self) 
        taskLayout.setGeometry(0, 40, 200, 0)

        self.progress = "Progress: [" + str(sequenceDataItem["sequenceNumber"] + 1) + "/" + str(self.numSequenceItems) + "]" + "\n"

        answerForm = QFormLayout()
        questionLabel = QLabel(self.progress + "Multiple-Choice Question:")
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
        self.radioButtonLayout = QVBoxLayout()
        self.radioButtonLayout.setContentsMargins(0, 0, 0, 0)

        for choice in choices:
            button = QRadioButton(str(choice["value"]))
            button.toggled.connect(self.radioSelect)
            self.radioButtonLayout.addWidget(button)

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
        answerForm.addRow(self.radioButtonLayout)
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
        self.onSubmitFunc(returnData, "Question Answer")