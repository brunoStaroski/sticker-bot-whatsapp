const venom = require('venom-bot');
const async = require("async");
const fs = require('fs');
const mime = require('mime-types');


    venom.create({
            session: 'session-name', //name of session
            multidevice: false // for version not multidevice use false.(default: true)
        })
        .then((client) => start(client))
        .catch((erro) => {
            console.log(erro);
        });

    function start(client) {
        client.onMessage(async (message) => {
            //554789129999-1627597620@g.us
            if (message.isMedia && message.type === 'image' && message.isGroupMsg && message.chat.contact.name === 'Caçadores de figurinha') {
                console.log(message);
                let buffer = await client.decryptFile(message);
                const fileName = `./temp/temp.jpeg`;
                await fs.writeFile(fileName, buffer, async (err) => {
                    if (err) {
                        throw console.log('Erro writefile: ', err);
                    }
                    await client.sendImageAsSticker(message.from, fileName)
                        .then((result) => {
                            //  console.log('Result: ', result); //return object success
                        })
                        .catch((erro) => {
                            console.error('Error when sending: ', erro); //return object error
                        });
                });
            }

        });
    }


