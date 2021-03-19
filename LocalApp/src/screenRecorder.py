import cv2
import numpy as np
import pyautogui
import time
import datetime
from win32api import GetSystemMetrics
import imageio
import os
from PIL import ImageGrab


class ScreenRecorder:
  def __init__(self, fileName):
    self.currentTime = 0
    screenW = GetSystemMetrics(0)
    screenH = GetSystemMetrics(1)
    self.screenSize = (screenW, screenH)
    fourcc = cv2.VideoWriter_fourcc(*"XVID")
    self.fps = 30.0
    self.out = cv2.VideoWriter("./videos/"+fileName, fourcc, self.fps, (self.screenSize))
    self.quit = False

    print(print(os.getcwd()))

    self.mouseImg = cv2.imread("./assets/cursor.png")
    self.mouseInv = cv2.imread("./assets/cursor_inverse.png")
    self.mouseInv = cv2.cvtColor(self.mouseInv, cv2.COLOR_BGR2GRAY)

  
  def begin(self):
    print("BEGIN")
    self.startRecording(self.out, self.fps)

  
  # Adds the coursor on top of the image
  # This is done by cropping out the region where the mouse goes and pasting in the image of the icon
  # into the place
  def addCursor(self, mousePos, frame):
    screenWidth = self.screenSize[0]
    screenHeight = self.screenSize[1]

    pt1 = mousePos
    # The width and height of the curson icon is recalulated in case it goes out of the screen
    iconWidth = 12
    if mousePos[0] + iconWidth > screenWidth:
      iconWidth = screenWidth - mousePos[0]

    iconHeight = 19
    if mousePos[1] + iconHeight > screenHeight:
      iconHeight = screenHeight - mousePos[1]
    
    # The region is cropped, the mouse will be put on top of this region and the region will be put back into the original image
    pt2 = (mousePos[0] + iconWidth, mousePos[1] + iconHeight)
    croppedRegion = frame[pt1[1] : pt2[1], pt1[0] : pt2[0]]

    # The cursor image and the inverse cursor image is cropped if need be
    iconPt1 = (0, 0)
    iconPt2 = (iconWidth, iconHeight)
    croppedIcon = self.mouseImg[iconPt1[1] : iconPt2[1], iconPt1[0] : iconPt2[0]]
    croppedInvIcon = self.mouseInv[iconPt1[1] : iconPt2[1], iconPt1[0] : iconPt2[0]]

    # The cropped region and the icon are comined
    # The result is an image with a black region where the cursor should go and the original background
    newRegion = cv2.bitwise_or(croppedRegion, croppedIcon, mask = croppedInvIcon)
    # The cursor icon is put on top of the region. Now we have the cursor and the original background
    newRegion = cv2.bitwise_or(newRegion, croppedIcon)

    # The cropped region is put back on the original
    x_offset = mousePos[0]
    y_offset = mousePos[1]
    frame[y_offset:(y_offset + self.mouseImg.shape[0]), x_offset:(x_offset + self.mouseImg.shape[1])] = newRegion

    return frame


  def startRecording(self, out, fps):
    print("Recording Starting!")
    start_time = time.time()
    # print(start_time)
    currentFrameCount = 0

    while True:
      elapsedAtStartTime = abs(start_time - time.time())
      shouldHaveFrames = elapsedAtStartTime * fps

      if (currentFrameCount < shouldHaveFrames):
        img = pyautogui.screenshot()

        self.currentTime = abs(start_time - time.time())
        # print(self.currentTime)
        # img = ImageGrab.grab()
        # img = imageio.imread('<screen>')
        
        frame = np.array(img)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        mousePos = pyautogui.position()
        frame = self.addCursor(mousePos, frame)

        out.write(frame)

        elapsedAtEndTime = abs(start_time - time.time())
        frameTime = elapsedAtEndTime - elapsedAtStartTime
        currentFPS = int(1.0/frameTime)
        currentFrameCount += 1

        shouldHaveFrames = elapsedAtEndTime * fps
        # Add any frames to make up for the time
        while (currentFrameCount < shouldHaveFrames):
          out.write(frame)
          currentFrameCount += 1

        # Display the current time in the window
        elapsedTotalTime = int(abs(start_time - time.time()))
        currentTime = str(datetime.timedelta(seconds=elapsedTotalTime))
        timeImage = np.zeros((100, 300, 3), np.uint8)
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(timeImage,'Time: ' + str(currentTime) + " FPS: " + str(currentFPS), (10, 50), font, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
        # cv2.imshow("Screen Recorder", timeImage)

      # if the user clicks q, it exits
      if cv2.waitKey(1) == ord("q") or self.quit == True:
        break

    # make sure everything is closed when exited
    cv2.destroyAllWindows()
    out.release()


# ScreenRecorder().begin()