from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import sys

class TutorialWindow(QWidget):
    def __init__(self, parent=None):
        QWidget.__init__(self, parent)
        self.setStyleSheet("font-size: 16px;")

        videoPath = "./tutorial_videos/"
        title = "UsabCheck Tutorial"
        self.tutorialGifs = {
          "Video Recording Slider": videoPath + "RecordingSliderPanning.gif",
          "Task Window": videoPath + "Task.gif",
          "Multiple Choice Question Window": videoPath + "MultipleChoiceQuestion.gif",
          "Text Question Window": videoPath + "QuestionWindowPanning.gif"
        }
        self.tutorialText = {
          "Video Recording Slider": 
            "You can click and hold with your left mouse button on the video recording slider and move it side to side.\n" + 
            "You can also minimize the window.",

          "Task Window": 
            "You can click and hold with your left mouse button anywhere on the task and move it around.\n" + 
            "You can also minimize the window and move the button if you wish.\n" + 
            "Scroll down to the bottom of the task and click the submit button when you are finished with the task.\n" + 
            "A confirmation screen will appear, click \"Yes\" to proceed to the next task.",

          "Multiple Choice Question Window":
            "You can click and hold with your left mouse button anywhere on the window and move it around.\n" + 
            "Once you select an option a submit button will appear.",

          "Text Question Window": 
            "You can click and hold with your left mouse button anywhere on the window and move it around.\n" + 
            "You may input any text inside the box."
        }

        self.currentTutorialIndex = -1
        scaleFactor = 2
        self.width = int(1920/scaleFactor)
        self.height = int(1080/scaleFactor)

        self.setGeometry(200, 200, self.width, self.height)
        self.setWindowTitle(title)

        self.movieContainer = QLabel()
        self.movieContainer.setAlignment(Qt.AlignCenter)
        self.mainLayout = QVBoxLayout()

        self.currentTutorial = QLabel("")
        self.currentTutorial.setStyleSheet("font-size: 20px;")
        self.tutorialTextLabel = QLabel("")
        button = QPushButton('Next', self)
        button.move(10,10)
        button.clicked.connect(self.nextVideo)
        button.setStyleSheet("background-color: rgb(32, 207, 76);")
        button.setFixedWidth(100)

        self.mainLayout.addWidget(self.currentTutorial)
        self.mainLayout.addWidget(button)
        self.mainLayout.addWidget(self.tutorialTextLabel)
        self.mainLayout.addWidget(QLabel(""))

        self.mainLayout.addWidget(self.movieContainer)
        self.setLayout(self.mainLayout)
        self.nextVideo()


    def nextVideo(self):
        gifListSize = len(list(self.tutorialGifs.keys()))
        self.currentTutorialIndex = (self.currentTutorialIndex + 1) % gifListSize
        gifTitle = list(self.tutorialGifs.keys())[self.currentTutorialIndex]
        gif = self.tutorialGifs[gifTitle]

        self.currentTutorial.setText("[" + str(self.currentTutorialIndex + 1) + "/" +  str(gifListSize) + "] " + gifTitle)
        self.tutorialTextLabel.setText(self.tutorialText[gifTitle])
        self.tutorialTextLabel.adjustSize()
        self.adjustSize()

        self.movie = QMovie(gif, QByteArray(), self)
        self.movie.setCacheMode(QMovie.CacheAll)
        self.movieContainer.setMovie(self.movie)
        self.movie.setScaledSize(QSize(self.width, self.height))
        self.movie.start()


# if __name__ == "__main__":
#     app = QApplication(sys.argv)
#     app.setStyle('Fusion')
#     player = TutorialWindow()
#     player.show()

# sys.exit(app.exec_())