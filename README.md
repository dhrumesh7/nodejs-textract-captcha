# Correios Tracking Scraper

This project is a web scraper that retrieves tracking information from the Correios tracking page using Puppeteer and AWS Textract to solve the CAPTCHA presented on the site.

## Features

- **Web Scraping**: Uses Puppeteer to automate browser actions and scrape tracking data from the Correios website.
- **CAPTCHA Recognition**: Utilizes AWS Textract to extract text from CAPTCHA images, allowing for automated submission of tracking requests.
- **Simple Setup**: Easy to configure and run with just a few dependencies.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- An AWS account with Textract enabled

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dhrumesh7/nodejs-textract-captcha
   cd nodejs-textract-captcha

2. **Install dependencies**:
   ```bash
   npm install puppeteer aws-sdk

3. **Configure AWS Credentials: Update the AWS Textract configuration in the code with your AWS region and credentials**:
   ```bash
   const textract = new AWS.Textract({ 
    region: 'your-region', 
    credentials: {
        accessKeyId: 'your-access-key-id',
        secretAccessKey: 'your-secret-access-key'
    }
   });

## Usage

1. **Run the scraper with a specific tracking number**:
   ```bash
   node texatract.js

2. **Replace 'NM594891585BR' with the tracking number you want to scrape in the following line in index.js**:
   ```bash
   scrapeCorreiosTracking('NM594891585BR');
