# Dependencies
import cv2
import json
import pytesseract

# Startup
settings = open("./settings.json", "r")
settings = json.loads(settings.read())

# Configurations
pytesseract.pytesseract.tesseract_cmd = settings["tesseract_exe"]

# Variables
img = cv2.imread("./image.png")
img = cv2.resize(img, (90, 90))

# Main
cv2.imshow("Image", img)

text = pytesseract.image_to_string(img)

print(text)

cv2.destroyAllWindows()
