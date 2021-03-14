from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

from win32api import GetSystemMetrics

class QuestionWindow(QWidget):
    def __init__(self, parent, sequenceDataItem):
        QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)

        print("sequenceDataItem", sequenceDataItem)

        self.parent = parent
        self.sequenceDataItem = sequenceDataItem

        self.mainLayout = QVBoxLayout()

        shadow = QGraphicsDropShadowEffect(self,
            blurRadius=20.0,
            color= QColor(105, 105, 105),
            offset= QPointF(2.0, 2.0)
        )
        self.setGraphicsEffect(shadow)

        self.mainLayout.setContentsMargins(20, 20, 20, 20)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setLayout(self.mainLayout)

        self.renderQuestionWindow()


    def renderQuestionWindow(self):
        # Setting dimensions
        self.screenW = GetSystemMetrics(0)
        self.screenH = GetSystemMetrics(1)
        self.windowW = 500
        self.windowH = 350

        self.initX = int(self.screenW/2 - self.windowW/2)
        self.initY = int(self.screenH/3 - self.windowH/2)

        self.dragPos = QPoint(self.initX, self.initY + self.windowH)

        self.buttonWidth = 100
        self.buttonHeight = 25

        # Configurations
        self.setWindowFlag(Qt.FramelessWindowHint) 
        self.setGeometry(self.initX, self.initY, self.windowW, self.windowH)
        self.setStyleSheet("font-size: 16px;")

    # Clicking on the body of the window before it is dragged and repositioned
    # The click position needs to be saved to know where to move the window to
    def mousePressEvent(self, event):
        self.dragPos = event.globalPos()
    

    # When the user drags the window
    def mouseMoveEvent(self, event):
        if event.buttons() == Qt.LeftButton:
            self.move(self.pos() + event.globalPos() - self.dragPos)
            self.dragPos = event.globalPos()