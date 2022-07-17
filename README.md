# FSWCBypasser
IP UDP stresser using FreeStresser with captcha bypasser.

## Installation
Github:
```
git clone https://github.com/I2rys/FSWCBypasser
```

NpmJS:
```
npm i puppeteer-extra-plugin-stealth puppeteer-extra python-shell is-ip
```

Python Packages:
```
pip install -r requirements.txt
```

## Setup
1. Install [Tesseract OCR](https://github.com/tesseract-ocr/tessdoc/blob/main/Installation.md).
2. Find tesseract.exe path then open settings.json and paste the tesseract.exe path to **tesseract_exe** variable then save it.
3. Install [Python 3](https://www.python.org/) and make sure you can use it in your CLI.

## Usage
```
node index.js <ip> <port> <seconds>
```

+ ip - The IP to stress.
+ port - The port of the IP to stress.
+ seconds - The seconds to stress the IP then stop, maximum is 60.

## License
MIT © I2rys
