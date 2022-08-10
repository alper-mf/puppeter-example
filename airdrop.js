const puppeteer = require("puppeteer");



///Target URL
const url = 'https://airdrops.io';



(async () => {

    console.info('Test started.');

    const browser = await puppeteer.launch({
        headless: false, // for test disable the headlels mode,
        //   args: ['--headless'], // headless but GPU enable
        // userDataDir: "/home/anto/Downloads/MyChromeDir"
    });

    //Tarayıcıda yeni sekme açıldı. (Mutlaka yapılması gerekmektedir)
    const page = await browser.newPage();

    //Açılacak olan ekranın ölçüleri manuel girildi.
    await page.setViewport({ width: 1366, height: 768 });

    //Adrese git
    await page.goto(url, { waitUntil: 'networkidle0' });

    //scrraping işleminin yapılacağı fonksiyon
    async function scrappingCard() {
        console.log('functions is started');
        try {

            ///airdropList i oluştur
            let airdropList = await page.evaluate(() => {
                console.log('airdropList içinde');
                let list = [];

                ///card ların listesini çek ve liste oluştur.
                let cards = Array.from(document.querySelectorAll('div.container div.inside-article'));
                if (cards.length != 0) {

                    ///Çekilen listeyi list'e ata.
                    for (let index = 0; index < cards.length; index++) {
                        list.push(
                            { title: cards[index].textContent, 
                            url: cards[index].baseURI,
                            }
                        );
                    }
                }
                return list;
            });


            console.log('functions is finished ' + airdropList.length);

            ///Listeyi yazdıran döngü
            for (let index = 0; index < airdropList.length; index++) {
                console.log(airdropList[index].title + '  --> ' + airdropList[index].url);
            }
        } catch (error) {
            console.log(error);
            await browser.close();
        }
    }

    try {
        await scrappingCard();
        await browser.close();
    } catch (error) {
        console.log(error);
        await browser.close();
    }


})();




function waitUntil(t) {
    return new Promise((r) => {
        setTimeout(r, t)
    })
}