import json
import cv2
import numpy as np

from tensorflow.keras.models import load_model, model_from_json
from tensorflow.keras.preprocessing.image import img_to_array

import tensorflow as tf
config = tf.compat.v1.ConfigProto()
config.gpu_options.allow_growth = True
sess = tf.compat.v1.Session(config=config)

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

from win32api import GetSystemMetrics


class FacialExpressionRecog():
  def __init__(self, selectedModel, screenRecorder):
    selectedModel = "Model 1"

    if selectedModel == "Model 1":
        self.classifier = load_model(r'./models/Model1.h5')
        self.labels = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]
        
    elif selectedModel == "Model 2":
        self.classifier = model_from_json(open("Model2.json", "r").read())
        self.classifier.load_weights('Model2_Weights.h5')
        self.labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
    else:
        raise "No existing model selected"


    self.faceDetector = cv2.CascadeClassifier(r'./models/haarcascade_frontalface_default.xml')
    self.screenRecorder = screenRecorder
    self.cap = cv2.VideoCapture(0)
    self.started = False
    # self.begin()


  def begin(self):
    self.running = True

    self.ferCameraData = []
    previousLabel = None

    self.displayCameraWindow = DisplayCameraImage()
    self.displayCameraWindow.show()

    camImageDim = None
    while self.running:
        # Get frame from camera
        ret, frame = self.cap.read()

        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect the face
        faces = self.faceDetector.detectMultiScale(gray, 1.3, 5)
        
        # If camera does not detect a face, set the end time of the last face expression
        if len(faces) == 0:
          previousLabel = None
          if len(self.ferCameraData) != 0:
            currentIndex = len(self.ferCameraData) - 1
            currentTime = self.screenRecorder.currentTime
            if "endTime" not in self.ferCameraData[currentIndex].keys():
              self.ferCameraData[currentIndex]["endTime"] = currentTime

        # Iterate over the faces (bounding boxes)
        for (x, y, w, h) in faces:
            # Draw the rectangle bounding box of face
            cv2.rectangle(frame, (x,y), (x+w, y+h),(255,0,0), 2)
            croppedFace = gray[y:y+h, x:x+w]
            # Resize the face to the size the classifier expects (48 x 48)
            croppedFace = cv2.resize(croppedFace, (48,48), interpolation=cv2.INTER_AREA)

            # If a face has been detected and the image has pixel values
            if np.sum([croppedFace]) != 0:
                roi = croppedFace.astype('float')/255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi,axis=0)

                preds = self.classifier.predict(roi)[0]
                label = self.labels[preds.argmax()]
                label_position = (20,60)

                currentTime = self.screenRecorder.currentTime

                # If camera does not detect a face, set the end time of the last face expression
                if (len(self.ferCameraData) != 0 and previousLabel != label):
                  currentIndex = len(self.ferCameraData) - 1
                  if "endTime" not in self.ferCameraData[currentIndex].keys():
                    self.ferCameraData[currentIndex]["endTime"] = currentTime
                
                if previousLabel != label:
                  newTimeStamp = {
                    "startTime": str(currentTime),
                    "label": label
                  }
                  self.ferCameraData.append(newTimeStamp)
                  previousLabel = label

                cv2.putText(img=frame, text=label, org=label_position,
                    fontFace=cv2.FONT_HERSHEY_COMPLEX , fontScale=2, color=[255, 0, 0], lineType=cv2.LINE_AA, thickness=3)
            else:
                cv2.putText(frame,'No Face Detected',(20,60),cv2.FONT_HERSHEY_SIMPLEX,2,(0,255,0),2)

        if (self.started == False):
          print("FER START", self.screenRecorder.currentTime)
          self.started = True
          camImageDim = gray.shape
          print((int(camImageDim[1]/2), int(camImageDim[0]/2)))

        # width = int(camImageDim[1]/3)
        # height = int(camImageDim[0]/3)
        # resizedFrame = cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)
        
        # cv2.imshow('Facial Expression Detector', resizedFrame)
        self.displayCameraWindow.show_image(self.cap, frame)

        # If the q letter is pressed then exit the program
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    self.cap.release()
    cv2.destroyAllWindows()


class DisplayCameraImage(QWidget):
    def __init__(self, parent=None):
      QWidget.__init__(self, None, Qt.WindowStaysOnTopHint)

      self.showLabels = False

      self.setWindowTitle("Camera")

      self.screenW = GetSystemMetrics(0)
      self.screenH = GetSystemMetrics(1)
      self.windowW = 266
      self.windowH = 200
      self.windowPaddingLeft = 20
      self.windowPaddingBottom = 50
      self.initX = self.screenW - self.windowPaddingLeft - self.windowW
      self.initY = self.screenH - self.windowPaddingBottom - self.windowH

      self.setGeometry(self.initX, self.initY, self.windowW, self.windowH)
      self.mouseDown = False

      self.layout = QVBoxLayout()
      
      self.label = QLabel()
      self.label.setFixedSize(self.windowW, self.windowH)

      self.layout.addWidget(self.label)
      padding = 3
      self.layout.setContentsMargins(padding, padding, padding, padding)
      self.setFixedSize(self.windowW + padding * 2, self.windowH  + padding * 2)
      self.setLayout(self.layout)


    @pyqtSlot(QImage)
    def show_image(self, camera, frame):
      if not self.showLabels:
        _, frame = camera.read()

      frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
      resizedFrame = cv2.resize(frame, (320,240), interpolation=cv2.INTER_AREA)

      image = QImage(resizedFrame, resizedFrame.shape[1], resizedFrame.shape[0], QImage.Format_RGB888)
      pixmap = QPixmap.fromImage(image)
      scaledPixmap = pixmap.scaled(self.label.size(), Qt.KeepAspectRatio)
      self.label.setPixmap(scaledPixmap)
      QApplication.processEvents()
