const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

async function downloadFile(uri, destination) {
    try {
        const response = await axios({
            method: 'GET',
            url: uri,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(destination);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        throw new Error(`Failed to download file: ${error.message}`);
    }
}

async function downloadFiles(uris, directory) {
    try {
        // Ensure the directory exists
        fs.mkdirSync(directory, { recursive: true });

        for (let i = 0; i < uris.length; i++) {
            const uri = uris[i];
            const fileName = path.basename(uri);
            const destination = path.join(directory, fileName);
            await downloadFile(uri, destination);
            console.log(`File ${fileName} downloaded successfully!`);
        }
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    const uri = 'https://archive.org/download/doki-doki-wallpapers/';
    const directory = path.join(__dirname, 'doki-doki-wallpapers');

    try {
        const response = await axios.get(uri);
        const $ = cheerio.load(response.data);
        const uris = [];
        $('tbody').find('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href.endsWith('.png')) {
                uris.push(`${uri}${href}`);
            }
        });

        await downloadFiles(uris, directory);
        console.log('All files downloaded successfully!');
    } catch (error) {
        console.error(error);
    }
}

main();
