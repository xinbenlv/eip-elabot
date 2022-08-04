import { marked } from 'marked';
const rp = require('request-promise');
const markdownLinkExtractor = require('markdown-link-extractor');

let main = async () => {
    let markdownText = await rp(`https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-1.md`);
    const links = markdownLinkExtractor(markdownText);
    links.forEach(link => console.log(link));
}

main().then(()=>{
    console.log("done")
});
