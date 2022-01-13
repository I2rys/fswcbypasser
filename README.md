
<h1 align="center">FSWCBypasser</h1>
<h4 align="center">IP UDP stresser using FreeStresser with captcha bypasser</h4>
<p align="center">
	<a href="https://github.com/I2rys/FSWCBypasser/blob/main/LICENSE"><img src="https://img.shields.io/github/license/I2rys/FSWCBypasser?style=flat-square"></img></a>
	<a href="https://github.com/I2rys/FSWCBypasser/issues"><img src="https://img.shields.io/github/issues/I2rys/FSWCBypasser.svg"></img></a>
	<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/-Nodejs-green?style=flat-square&logo=Node.js"></img></a>
	<a href="https://python.com"><img src="https://img.shields.io/badge/python-3670A0?style=flat-square&logo=python&logoColor=ffdd54"></img></a>
</p>


## Installation
Github:

    git clone https://github.com/I2rys/FSWCBypasser

NPM Packages:

    npm i puppeteer-extra-plugin-stealth && npm i puppeteer-extra && npm i python-shell && npm i is-ip
    
Python Packages:

    pip install -r requirements.txt
    
## Setup
1. Install [Tesseract OCR](https://github.com/tesseract-ocr/tessdoc/blob/main/Installation.md).
2. Find tesseract.exe path then open settings.json and paste the tesseract.exe path to **tesseract_exe** variable then save it.
3. Install [Python 3](https://www.python.org/) and make sure you can use it in your CLI.
4. Done!

## Usage

    node index.js <ip> <port> <seconds>
    
+ ip - The IP to stress.
+ port - The port of the IP to stress.
+ seconds - The seconds to stress the IP then stop, maximum is 60.

## License
MIT © I2rys
