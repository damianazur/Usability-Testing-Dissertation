from ScrollLabel import *
from QuestionWindow import *
import json

class TextQuestionWindow(QuestionWindow):
    def __init__(self, onSubmitFunc, numSequenceItems, sequenceDataItem):
        # QuestionWindow.__init__(self, parent, sequenceDataItem)
        super().__init__(sequenceDataItem)

        self.onSubmitFunc = onSubmitFunc
        self.numSequenceItems = numSequenceItems
        self.renderQuestion(sequenceDataItem)


    def renderQuestion(self, sequenceDataItem):
        questionConfigs = json.loads(sequenceDataItem["questionConfigsJSON"])

        questionText = questionConfigs["questionText"]

        # Set the text
        taskLayout = ScrollLabel(self) 
        taskLayout.setGeometry(0, 40, 400, 0)
        taskLayout.setContentsMargins(0, 0, 0, 0)

        progress = "Progress: [" + str(sequenceDataItem["sequenceNumber"] + 1) + "/" + str(self.numSequenceItems) + "]" + "\n"

        answerForm = QFormLayout()
        questionLabel = QLabel(progress + "Question:")
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
        # self.answerInput = QLineEdit()
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
        self.onSubmitFunc(returnData, "Question Answer")