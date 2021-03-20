import json
import os

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

from win32api import GetSystemMetrics
import win32gui as win32gui

from ConfirmWindow import *


class ConfirmWindow(QWidget):
    def __init__(self, parent, text, position, size, onConfirm):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)
        self.parent = parent
        self.onConfirm = onConfirm

        # Setting dimensions
        self.screenW = GetSystemMetrics(0)
        self.screenH = GetSystemMetrics(1)

        padding = 15

        if size == None:
          self.windowW = 200
          self.windowH = 100
        else:
          self.windowW = size[0]
          self.windowH = size[1]

        self.windowPaddingLeft = 30
        self.windowsPaddingTop = 70

        if position == None:
          x = int(self.screenW/2 - self.windowW/2)
          y = int(self.screenH/2 - self.windowH/2)
          self.position = QPoint(x, y)
        else:
          self.position = position

        self.text = text

        self.mainLayout = QVBoxLayout()
        self.mainLayout.setContentsMargins(padding, padding, padding, padding)

        self.renderWindow()

        self.setLayout(self.mainLayout)


    # def renderBorder(self):
    #   # Setting dimensions
    #   frame = QFrame(self)
    #   frame.setGeometry(self.position.x(), self.position.y(), self.windowW, self.windowH)
    #   frame.setFixedWidth(self.windowW)
    #   frame.setFixedHeight(self.windowH)
    #   frame.setStyleSheet("border: 20px solid blue;")


    def renderWindow(self):
        frame = QFrame()

        self.buttonMinW = 100
        self.buttonHeight = 25

        print(self.position)

        # Configurations
        self.setWindowFlags(Qt.Window | Qt.CustomizeWindowHint | Qt.WindowStaysOnTopHint) 
        self.setGeometry(self.position.x(), self.position.y(), self.windowW, self.windowH)
        self.setStyleSheet("font-size: 16px;")

        confirmLabel = QLabel(self.text)
        labelWidth = self.windowW - 30
        confirmLabel.setFixedWidth(labelWidth)
        confirmLabel.setWordWrap(True) 

        yesButton = QPushButton("Yes", self)
        yesButton.resize(yesButton.sizeHint())
        yesButton.setStyleSheet("background-color: rgb(32, 207, 76);")
        yesButton.setFixedWidth(self.buttonMinW)
        yesButton.pressed.connect(self.confirm)

        noButton = QPushButton("No", self)
        noButton.resize(noButton.sizeHint())
        noButton.setStyleSheet("background-color: rgb(32, 123, 207 );")
        noButton.setFixedWidth(self.buttonMinW)
        noButton.pressed.connect(self.closeWindow)

        layout = QFormLayout(frame)
        layout.addRow(confirmLabel)
        layout.addRow(yesButton, noButton)

        self.mainLayout.addWidget(frame)


    def confirm(self):
      self.onConfirm()
      self.close()


    def closeWindow(self):
      self.close()