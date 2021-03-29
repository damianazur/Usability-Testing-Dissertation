import sys
import time
import unittest
import asyncio
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
from PyQt5.QtTest import *
import json

from Main import MainProgram
from MultipleChoiceQuestionWindow import MultipleChoiceQuestionWindow

app = QApplication([])
app.setStyle('Fusion')
        

class ProgramTest(unittest.TestCase):
  def setUp(self):
    # Create Window
    self.program = MainProgram()


  def test_defaults(self):
    # Test that the input box is empty
    self.assertEqual(self.program.mainWindow.refCodeInput.text(), "")


  def test_submitRef(self):
    # Input reference code
    QTest.keyClicks(self.program.mainWindow.refCodeInput, "OBVIVVGV")

    # Press submit
    submitBtn = self.program.mainWindow.submitBtn
    QTest.mouseClick(submitBtn, Qt.LeftButton)

    # Verify that the retrieved and processed data is correct
    self.assertEqual(self.program.mainWindow.testName, "UsabCheck Web App")
    self.assertEqual(self.program.mainWindow.createdDate, "2021-03-26")
    self.assertEqual(self.program.mainWindow.noOfTasks, 10)
    self.assertEqual(self.program.mainWindow.noOfQuestions, 14)


  def test_multipleChoiceQuestion(self):
    # Initialize sample data
    sequenceDataItemStr = r"""{"questionId":103,"testId":123,"questionConfigsJSON":"{\"type\":\"question\",\"questionType\":\"multiple-choice\",\"questionText\":\"Please rate the difficulty of the task\",\"choices\":[{\"value\":\"Easy\"},{\"value\":\"Moderate\"},{\"value\":\"Difficult\"}]}","sequenceNumber":3,"stage":"test"}"""
    sequenceDataItem = json.loads(sequenceDataItemStr)
    totalNumberOfItems = 5
    
    # Create and show the window
    window = MultipleChoiceQuestionWindow(None, totalNumberOfItems, sequenceDataItem)
    window.show()

    # Check that the data has been processed and displayed correctly 
    self.assertEqual(window.radioButtonLayout.count(), 3)
    self.assertEqual(window.radioButtonLayout.itemAt(0).widget().text(), "Easy")
    self.assertEqual(window.radioButtonLayout.itemAt(1).widget().text(), "Moderate")
    self.assertEqual(window.radioButtonLayout.itemAt(2).widget().text(), "Difficult")
    self.assertEqual(window.progress, "Progress: [4/5]\n")

    # Select an option and check to make sure that the option is selected
    window.radioButtonLayout.itemAt(1).widget().click()
    self.assertEqual(window.choiceSelected, "Moderate")


if __name__ == "__main__":
  print("\n\n---------------- STARTING ----------------")
  unittest.main()