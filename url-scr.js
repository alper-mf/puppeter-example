const puppeteer = require("puppeteer");

const fetch = require('node-fetch');
const fs = require('fs');
var ncp = require("copy-paste");



const customArgs = [
    `--start-maximized`,
    `--load-extension=${process.env.extdarkreader}`
];

const cookie = JSON.parse(fs.readFileSync("./cookies/cookie.json", "utf8"));

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


    const url = 'https://www.linkedin.com/search/results/people/?keywords=flutter%20developer&origin=CLUSTER_EXPANSION&page=1&sid=BvG';

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
        let titleList = Array.from(document.querySelectorAll('reusable-search__result-container .mb1.'));
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

        
        await page.goto(zoomUrl );


        await page.type('[name=password]', zoomPass);
        let options = {button : 'middle'};
        await Promise.all([
           
            await page.click('div.controls.recording-passwd > button.btn.btn-primary.submit', { waitUntil: 'networkidle0' }) ,
            
        ]);
        
        // let zoomDownloadLink = await page.evaluate(() => {
        //     let a = Array.from(document.querySelectorAll('video.vjs-tech'));
        //     let b = a.map(c => c.getAttribute('src'));
        //     return b;
        // });
        //page.setDefaultNavigationTimeout(0); 

    }



    function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }




    for (let i = 0; i < videoList.length; i++) {

        ncp.copy(videoList[i]['title']);
        await zoomFunction(i);
       // await sleep(25000);

    }




    console.info('Test finish.');
    //browser.close();
})();