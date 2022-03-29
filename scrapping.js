const puppeteer = require("puppeteer");


const fetch = require('node-fetch');
const fs = require('fs');


const { DownloaderHelper } = require('node-downloader-helper');

const customArgs = [
    `--start-maximized`,
    `--load-extension=${process.env.extdarkreader}`
];

const cookie = JSON.parse(fs.readFileSync("./cookies/cookie.json", "utf8"));
const zoomCookie = JSON.parse(fs.readFileSync("./cookies/zoom.json", "utf8"));

(async () => {
    const paths = '~/Library/Application Support/Microsoft Edge/Default/Extensions/pdadlkbckhinonakkfkdaadceojbekep/8.0_0/';
    console.info('Test start.');
    //Headless mode açık olarak tarayıcı oluşturuldu. 
    //Headless mode için değer belirtilmezse varsayılan olarak true değeri ile işlem yapar.
    const browser = await puppeteer.launch(
        {
            headless: false,
            executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
            args: [
                `--disable-extensions-except=${paths}`,
                `--load-extension=${paths}`,
                '--enable-automation'
            ]
        }


    );


    const url = 'https://bum.baskentkariyer.com.tr/gecmis-dersler?t=ap&g=106&page=4';

    //Tarayıcıda yeni sekme açıldı. (Mutlaka yapılması gerekmektedir)
    const page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });
    await page.setCookie(...cookie)
    // await page.goto('https://bum.baskentkariyer.com.tr/login', { waitUntil: 'networkidle0' });

    // await page.type('[name=login]', '20438839782');
    // await page.type('[id=password]', 'baskent_kariyer');

    // await Promise.all([
    //     await page.click('[type=submit]'),
    // ]);

    // await page.waitForNavigation(); 

    await page.goto(url, { waitUntil: 'networkidle0' });

    //div.col-sm-6.col-md-4.mg-t-20

    let videoList = [];

    let list = await page.evaluate(() => {
        let titleList = Array.from(document.querySelectorAll('h5.text-primary.searchBy'));
        let titles = titleList.map(c => c.textContent);
        return titles;
    });

    let zoomPass = await page.evaluate(() => {
        let zoomPassList = Array.from(document.querySelectorAll('span.tx-company'));
        let zoomPass = zoomPassList.map(c => c.textContent);
        return zoomPass;
    });

    let zoomLink = await page.evaluate(() => {
        let zoomPassList = Array.from(document.querySelectorAll('a.btn.btn-xs.btn-primary'));
        let zoomPass = zoomPassList.map(c => c.getAttribute('href'));
        return zoomPass;
    });

    for (let index = 0; index < 12; index++) {
        videoList.push({
            title: list[index],
            pass: zoomPass[index],
            url: zoomLink[index],
        });
    }



    async function zoomFunction(index) {
        let zoomUrl = videoList[index].url;
        let zoomPass = videoList[index].pass;
        let zoomVideoTitle = videoList[index].title + '.mp4';


        await page.goto(zoomUrl, { waitUntil: 'networkidle0' });


        await page.type('[name=password]', zoomPass);
        // await page.type('[id=password]', 'baskent_kariyer');

        await Promise.all([
            await page.click('div.controls.recording-passwd > button.btn.btn-primary.submit'),
            await page.waitForNavigation(105000),
        ]);

        let zoomDownloadLink = await page.evaluate(() => {
            let a = Array.from(document.querySelectorAll('video.vjs-tech'));
            let b = a.map(c => c.getAttribute('src'));
            return b;
        });
    }








    for (let i = 0; i < videoList.length; i++) {
        await zoomFunction(i);
       // console.log(videoList[i]['title'])
    }



    console.info('Test finish.');
    //browser.close();
})();