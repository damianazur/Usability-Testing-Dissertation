import cv2
import numpy as np
import pyautogui
import time
import datetime

# display screen resolution, get it from your OS settings
SCREEN_SIZE = (1920, 1080)
# define the codec
fourcc = cv2.VideoWriter_fourcc(*"XVID")
fps = 30.0
# create the video write object
out = cv2.VideoWriter("output.avi", fourcc, fps, (SCREEN_SIZE))

start_time = time.time()
frameIdealTime = 1.0/fps
currentFrameCount = 0
print(frameIdealTime)
while True:
  elapsedAtStartTime = abs(start_time - time.time())

  shouldHaveFrames = elapsedAtStartTime * fps

  if (currentFrameCount < shouldHaveFrames):
    img = pyautogui.screenshot()
    frame = np.array(img)
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    out.write(frame)

    elapsedAtEndTime = abs(start_time - time.time())
    frameTime = elapsedAtEndTime - elapsedAtStartTime
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
    cv2.putText(timeImage,'Time: ' + str(currentTime), (10, 50), font, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
    cv2.imshow("screenshot", timeImage)

  # if the user clicks q, it exits
  if cv2.waitKey(1) == ord("q"):
    break

# make sure everything is closed when exited
cv2.destroyAllWindows()
out.release()