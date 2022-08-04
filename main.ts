import { create } from 'ipfs-http-client';
import * as IPFS from 'ipfs-core';

import rp from 'request-promise';
import markdownLinkExtractor from 'markdown-link-extractor';
import {config} from 'dotenv';


let uploadToIpfsViaNode = async (node, link:URL, content:string):Promise<string> => {
    const fileAdded = await node.add({
        path: link.href.split('/').pop(),
        content: content,
    });
    console.log("Added file:", fileAdded.path, fileAdded.cid);
    console.log(`Examine file with this link: https://ipfs.io/ipfs/${fileAdded.cid}`);
    return fileAdded.cid;
};

let main = async () => {
    config();
    const ipfsNode = await IPFS.create();
    const version = await ipfsNode.version();
    console.log("Version:", version.version);

    let markdownText = await rp(`https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-1.md`);
    const links = markdownLinkExtractor(markdownText);

    links.filter(link => /ietf\.org/.test(link)).forEach(async link => {
        let buffer:string = await rp(link);
        await uploadToIpfsViaNode(ipfsNode, new URL(link), buffer);
    });
    return;
}

main().then(()=>{
    console.log("done")
});
