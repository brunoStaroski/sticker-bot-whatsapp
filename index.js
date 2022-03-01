const venom = require('venom-bot');
const async = require("async");
const fs = require('fs');
const mime = require('mime-types');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
      ffmpeg.setFfmpegPath(ffmpegPath);

const fileNameImage = './temp/temp.jpeg';
const fileNameVideo = './temp/temp.';

    venom.create({
            session: 'main', //name of session
            multidevice: false // for version not multidevice use false.(default: true)
        })
        .then((client) => start(client))
        .catch((erro) => {
            console.log(erro);
        });

    function start(client) {
        client.onMessage(async (message) => {
            //554789129999-1627597620@g.us
            if (message.isMedia && message.isGroupMsg && (message.chat.contact.id === '120363040259212719@g.us' || message.chat.name === 'Caçadores de figurinha')) {
                console.log(message);
                if (message.type === 'image') {
                    await exportImageToSticker(client, message);
                } else if (message.type === 'video') {
                    await exportGifToSticker(client, message);
                }
            }
        });
    }

    async function exportImageToSticker(client, message) {
        let buffer = await client.decryptFile(message);
        if (message.type === 'image') {
            fs.writeFile(fileNameImage, buffer,  (err) => {
                if (err) {
                    throw console.log('Erro ao escrever arquivo imagem temporario: ', err);
                }
                client.sendImageAsSticker(message.from, fileNameImage)
                    .then((result) => {
                        //  console.log('Result: ', result); //return object success
                    })
                    .catch((erro) => {
                        console.log(new Date() + 'Erro enviar mensagem');
                        console.error('Erro ao enviar mensagem: ', erro);
                    });
            })
        }
    }
    
    async function exportGifToSticker(client, message) {
        let buffer = await client.decryptFile(message);
        await fs.writeFile(fileNameVideo + mime.extension(message.mimetype), buffer, async (err) => {
            if (err) {
                throw console.log('Erro ao escrever arquivo animado temporario: ', err);
            }
            handleAnimatedFileConversion(message.mimetype).then(() => {
                client.sendImageAsStickerGif(message.from, `${fileNameVideo}gif`)
                    .then((result) => {
                        //  console.log('Result: ', result); //return object success
                    })
                    .catch((erro) => {
                        console.error('Erro ao enviar mensagem: ', erro);
                    });
            })

        });
    }

    async function handleAnimatedFileConversion(mimeType) {
        return new Promise((resolve, reject) => {
            ffmpeg(fileNameVideo + mime.extension(mimeType))
                .setStartTime('00:00:00')
                .setDuration('10')
                .on('end', resolve)
                .on('error', reject)
                .save(`${fileNameVideo}gif`);
        })
    }


