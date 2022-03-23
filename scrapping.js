const puppeteer = require("puppeteer");
const expectResult = 'Kullanıcı Tanımlama';

var fs = require('fs');
const cookie = JSON.parse(fs.readFileSync("./cookies/cookie.json", "utf8"));

(async () => {
    console.info('Test start.');
    //Headless mode açık olarak tarayıcı oluşturuldu. 
    //Headless mode için değer belirtilmezse varsayılan olarak true değeri ile işlem yapar.
    const browser = await puppeteer.launch(
        {
            "headless": false,
            "slowMo": 25
        });

    const url = 'https://bum.baskentkariyer.com.tr/gecmis-dersler?t=ap&g=106&page=4' ;

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

    let videoList= [];

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

    for (let index = 0; index < 1; index++) {
       await videoList.push({
            title : list[index],
            pass : zoomPass[index],
            url: zoomLink[index],
        });
    }



    async function zoomFunction(index){
        let zoomUrl = videoList[index].url;
        let zoomPass = videoList[index].pass;
        let zoomVideoTitle = videoList[index].title;


        await page.goto(zoomUrl, { waitUntil: 'networkidle0' });


        await page.type('[name=password]', zoomPass);
    // await page.type('[id=password]', 'baskent_kariyer');

     await Promise.all([
         await page.click('div.controls.recording-passwd > button.btn.btn-primary.submit'),
         await page.waitForNavigation(105000),
     ]);


     await Promise.all([
        await page.click('[id=zoom-downloader]'),
        await page.waitForNavigation(105000),
    ]);

    let a = Array.from(document.querySelectorAll('a.zoom'));
    let zoomDownloadLink = a.map(c => c.getAttribute('href'));

    zoomDownloader(zoomDownloadLink);

    }


    async function zoomDownloader(url) {
        const path = require('path');
    const downloadPath = path.resolve('./download');
    async function simplefileDownload() {
        const browser = await puppeteer.launch({
            headless: false,
        });
        
        const page = await browser.newPage();
        await page.goto(
            url, 
            { waitUntil: 'networkidle2' }
        );
        
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath 
        });
        await page.click('._2vsJm ')
    }
        
    }


    for (let i = 0; i < videoList.length; i++) {

        await zoomFunction(i);



        
    }

    // let text = '';
    // await page.evaluate(() => {
    //     const el = document.getElementsByClassName('text-primary searchBy');
    //     text = el.textContent;
    // })
    // console.log(text);



    await browser.close();
    console.info('Test finish.');
})();