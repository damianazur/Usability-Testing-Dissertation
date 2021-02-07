import json
import cv2
import numpy as np

from tensorflow.keras.models import load_model, model_from_json
from tensorflow.keras.preprocessing.image import img_to_array

import tensorflow as tf
config = tf.compat.v1.ConfigProto()
config.gpu_options.allow_growth = True
sess = tf.compat.v1.Session(config=config)



if __name__ == '__main__':
  print("----------- Starting FER ----------- ")
  
  selectedModel = "Model 1"

  if selectedModel == "Model 1":
      classifier = load_model(r'./models/Model1.h5')
      labels = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]
      
  elif selectedModel == "Model 2":
      classifier = model_from_json(open("Model2.json", "r").read())
      classifier.load_weights('Model2_Weights.h5')
      labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
  else:
      raise "No existing model selected"


  faceDetector = cv2.CascadeClassifier(r'./models/haarcascade_frontalface_default.xml')

  cap = cv2.VideoCapture(0)

  while True:
      # Get frame from camera
      ret, frame = cap.read()

      # Convert to grayscale
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

      # Detect the face
      faces = faceDetector.detectMultiScale(gray, 1.3, 5)
      
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

              preds = classifier.predict(roi)[0]
              label=labels[preds.argmax()]
              label_position = (20,60)

              cv2.putText(img=frame, text=label, org=label_position,
                  fontFace=cv2.FONT_HERSHEY_COMPLEX , fontScale=2, color=[255, 0, 0], lineType=cv2.LINE_AA, thickness=3)
          else:
              cv2.putText(frame,'No Face Detected',(20,60),cv2.FONT_HERSHEY_SIMPLEX,2,(0,255,0),2)
      
      cv2.imshow('Facial Expression Detector', frame)

      # If the q letter is pressed then exit the program
      if cv2.waitKey(1) & 0xFF == ord('q'):
          break

  cap.release()
  cv2.destroyAllWindows()