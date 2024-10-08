const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS Textract
const textract = new AWS.Textract({ region: '', credentials: {
    accessKeyId: '',
    secretAccessKey: ''
} });

async function scrapeCorreiosTracking(trackingNumber) {
    const browser = await puppeteer.launch({ headless: true, timeout: 50000 });
    const page = await browser.newPage();

    try {
        // Navigate to the Correios tracking page
        await page.goto('https://rastreamento.correios.com.br/app/index.php');

        // Input the tracking number
        await page.type('#objeto', trackingNumber);

        // Capture the CAPTCHA image
        const captchaImageSelector = '#captcha_image'; // Adjust the selector based on the page
        const captchaImage = await page.$(captchaImageSelector);
        const captchaImageBuffer = await captchaImage.screenshot();
        fs.writeFileSync('captcha.png', captchaImageBuffer);

        // Send the CAPTCHA image to AWS Textract
        const captchaText = await solveCaptchaWithTextract('captcha.png');
        console.log('Extracted CAPTCHA Text:', captchaText);

        // Type the CAPTCHA response
        await page.type('#captcha', captchaText.trim());

        // Submit the form
        await page.click('#b-pesquisar');

        // Wait for the results to load
        await page.waitForSelector('#ver-mais'); // Adjust this as per the page structure

        // Scrape the tracking data
        const trackingData = await page.evaluate(() => {
            return document.querySelector('#ver-mais').innerText;
        });

        console.log('Tracking Data:', trackingData);
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        await browser.close();
    }
}

// Function to send the CAPTCHA image to AWS Textract
async function solveCaptchaWithTextract(imagePath) {
    const imageBytes = fs.readFileSync(imagePath); // Read the image file

    const params = {
        Document: {
            Bytes: imageBytes
        }
    };

    // Call AWS Textract
    return new Promise((resolve, reject) => {
        textract.detectDocumentText(params, (err, data) => {
            if (err) {
                return reject(err);
            }

            // Extract text from the Textract response
            const detectedText = data.Blocks
                .filter(block => block.BlockType === 'LINE')
                .map(block => block.Text)
                .join(' ');

            resolve(detectedText);
        });
    });
}

// Example: scrape the Correios page with a tracking number
scrapeCorreiosTracking('NM594891585BR');
