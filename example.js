const puppeteer = require('puppeteer');
/**
 * 
 * @param {String} str 
 */
function parseQuery(str){
    var r = encodeURIComponent(str);
    return r;
}

function waitUntil(t){
    return new Promise((r)=>{
        setTimeout(r,t)
    })
}

async function LinkedinProfile(q){
    const browser = await puppeteer.launch({
        headless: false , // for test disable the headlels mode,
        args: ['--headless'], // headless but GPU enable
        userDataDir: "/home/anto/Downloads/MyChromeDir"
    }); 
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 926 });


    var openGOogle = async function(){
        console.log("open google")
        await page.goto("https://google.com/search?q=" + parseQuery(q),{waitUntil: 'networkidle2'});

        await waitUntil(1000)
    
        var goglinks =  await page.evaluate(function(){
            var listGresult = document.querySelectorAll('.g');
            var linkresult = []
            for(var x=0;x <listGresult.length;x++){
                 var aElem = listGresult[x].getElementsByTagName('a');
                 for(var i=0;i<aElem.length;i++){
                    var href = aElem[i].getAttribute('href');
                    if(href != null && href.indexOf("linkedin.com") > 1 && href.indexOf("translate.google") < 0){
                        linkresult.push(href)
                    }
                 }
            } 
            return linkresult;
        })

        return goglinks;
    }    

    var scrapLinkedin = async function(link){
        await page.goto(link);
        
        var objprofile = await page.evaluate( function(){
            // run on browser
            var frameElem = document.querySelector(".display-flex.mt2");  

            var nameElem = frameElem.querySelector('.pv-top-card--list.align-items-center>li')  
            var name = nameElem.textContent.trim()
             
            var headlineElem = frameElem.querySelector('h2');
            var headline = headlineElem.textContent.trim()


            var countryElem = frameElem.querySelector('.pv-top-card--list.pv-top-card--list-bullet.mt1>li')
            var country = countryElem.textContent.trim();
            
            var obj = {
                name : name,
                country : country,
                headline : headline,
            } 
            return obj;
        })

        return objprofile;

    }

    var result = []
    var googlinks = await openGOogle();
    for(var x=0;x<googlinks.length;x++){
        var link = googlinks[x]; 
        console.log('[ ' +x+' ] ' + link)
        var objprofile = await scrapLinkedin(link)
        objprofile.link = link;
        result.push(objprofile);
    } 

    console.log(result);
    browser.close()
} 

LinkedinProfile(`site:linkedin.com/in/ AND "Istanbul" AND "flutter developer"`)