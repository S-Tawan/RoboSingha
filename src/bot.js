const {
    Client,
    MessageAttachment
} = require('discord.js');
const client = new Client();
const auth = require('./auth.json');
const songs = require('./../db/songs.json')
const allFoods = require('./../db/foods.json')
const foodsUsers = require('./../db/foods_users.json')
const pathfileSongs = "../db/songs.json";
const pathfileFoods = "../db/foods.json";
const pathfileFoodsUsers = "../db/foods_users.json";
const faker = require('faker');
const ffmpeg = require('ffmpeg');
const axios = require('axios');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if (!msg.author.bot) {
        console.log(msg)
        let userId = msg.author.id;
        let user = foodsUsers.users.find(user => user.id === userId);
        if (msg.content.startsWith('-p ')) {
            index = songs.indexOf(msg.content);
            console.log(index);

            if (index == -1) {
                songs.push(msg.content)
                storeData(songs, pathfileSongs)
            } else {
                songs.splice(index, 1)
                songs.push(msg.content)
                storeData(songs, pathfileSongs)
            }
        }
        if (msg.content.startsWith('-r ')) {
            let index = parseInt(msg.content.substring(3), 10) - 1;
            songs.splice(index, 1)
            storeData(songs, pathfileSongs)

        }
        if (msg.content.startsWith('ฉันชอบกิน ')) {
            let food = msg.content.split(' ')[1];
            if (!!user) {
                let foods = user.foods;
                let index = foods.indexOf(food);
                if (index === -1) {
                    foods.push(food);
                    await msg.reply('บันทึกสำเร็จ ' + food);
                    storeData(foodsUsers, pathfileFoodsUsers);
                } else {
                    await msg.reply('รู้แล้ว');
                }
            } else {
                let user = {};
                user.id = userId;
                user.foods = [];
                user.foods.push(food);
                foodsUsers.users.push(user);
                await msg.reply('บันทึกสำเร็จ ' + food);
                storeData(foodsUsers, pathfileFoodsUsers);

            }
        }
        if (msg.content.startsWith('ฉันไม่ชอบกิน ')) {
            let food = msg.content.split(' ')[1];
            if (!!user) {
                let foods = user.foods;
                let index = foods.indexOf(food);
                if (index === -1) {
                    await msg.reply('แล้วไง')
                } else {
                    foods.splice(index, 1);
                    storeData(foodsUsers, pathfileFoodsUsers);
                    await msg.reply('ไม่ชอบก็ไม่ชอบ ' + food)
                }
            }
        }
        if (msg.content.startsWith('เรียก ')) {
            let strings = msg.content.split(' ');
            let userId = strings[1].substring(3,21);
            let n = strings[3];
            await msg.reply("จัดให้");
            let user = client.users.find(value => value.id === userId);
            for (let i = 0; i < n; i++) {
                await user.send('สวัสดีจ่ะ มาม้ะ ๆ '+(i+1));
                console.log(i)
            }
            await user.send(msg.author.username + 'ให้มาเรียก 55555')
        }
        if (msg.channel.id === '899519561320263720') {
            await msg.channel.send("สู้ ๆ นะนายท่านน");
        }

        switch (msg.content) {
            case "show":
                // code block
                await msg.channel.send(songs.length > 0 ? songs : "Empty")
                break;
            case "-clear":
                // code block
                storeData([], pathfileSongs)
                await msg.reply("It's Empty")
                break;
            case "-cls":
                // code block
                await msg.reply("-clear")
                break;
            case "roll":
                // code block

                await msg.reply(Math.floor(Math.random() * 6) + 1)
                break;
            case "name":
                // code block
                let randomName = faker.name.findName();
                await msg.reply(randomName)
                break;
            case "come on":
                // code block
                // msg.author.member.voiceChannel;
                // msg.reply(msg.author);
                if (!msg.guild) return;
                console.log(msg.member.voiceChannelID);
                if (!msg.member.voiceChannelID) {
                    await msg.reply('You need to join a voice channel first!');
                } else {
                    msg.member.voiceChannel.join().then(connection => console.log('Connected!'));
                }
                break;
            case "อีกะเทย":
                await msg.reply("มึงสิอีกะเทย")
                break;
            case "วันนี้กินอะไรดี":
                let foodsText = 'แฮมเบอร์เกอร์,ซาลาเปา,ข้าวกระเพราไก่,ข้าวกระเพราหมู,ข้าวกระเพราปลา,ข้าวคะน้าหมูกรอบ,ก๋วยเตี๋ยว,ขนมจีบ,มาม่า,พิซซ่า,ราดหน้า,ขนมจีน,ผัดไท,หอยทอด,กระเพาะปลา,ติ่มซำ,ข้าวราดแกง,หมูกะทะ,ขาหมู,กระเพราหมูกรอบ,ข้าวมันไก่,สเต็ก,ต้มยำกุ้ง,ส้มตำ,ยำวุ้นเส้น,กุ้งอบวุ้นเส้น,ไก่อบซอสเทอริยากิ,ไข่พะโล้,ไข่ลูกเขย,ไข่เจียวหมูสับ,ขาหมูน้ำแดง,ห่อหมกปลากราย,น้ำพริกปลาทู,น้ำพริกลงเรือ,น้ำพริกกุ้งสด,ก๋วยเตี๋ยวไก่ตุ๋น,ก๋วยเตี๋ยวเรือ,บะหมี่หมูแดง,หูฉลามน้ำแดง,ผัดไทยกุ้งสด,ก๋วยเตี๋ยวลุยสวน,ข้าวคลุกกะปิ,ข้าวผัดน้ำพริกลงเรือ,ข้าวผัดปู,มักกะโรนี,สปาเก็ตตี้,ราเมง,ซูชิ,ข้าวหน้าเนื้อ,ข้าวหน้าปลาดิบ,สลัด,ข้าวผัดอเมริกัน,แซนวิช,แซลมอน,สปาเก็ตตี้คาโบนาร่า,แกงเขียวหวาน,เป็ดปักกิ่ง,ทอดมัน,ข้าวกระเทียม,ก๋วยเตี๋ยวคั่วไก่,ห่อหมก,ผัดผักรวมมิตร,แกงไตปลา,แกงส้มชะอมทอด,แกงมัสมั่น,แกงจืดเต้าหู,แกงกะหรี่,ผัดขี้เมา,ผักบุ้งไฟแดง,ผัดซีอิ้ว,สุกี้น้ำ,หอยหลอดผัดฉ่า,ไก่ต้มน้ำปลา,ปลากระพงทอดน้ำปลา,ข้าวหมูแดง,ข้าวหน้าเป็ด,ข้าวหมูกรอบ,ข้าวต้ม,โจ๊ก,ทอดมันปลากราย,ฉู่ฉี่,บะหมี่เกี๊ยว,เปาะเปี๊ยะทอด,ปลากะพงนึ่งมะนาว,หมูมะนาว,หมูปิ้ง,เนื้อผัดน้ำมันหอย,ราดหน้าหมี่กรอบ,ก๋วยจั๊บ,ไข่ตุ๋น,ไข่ตุ๋นทรงเครื่อง,กระเพราปลาหมึก,กระเพราไข่เยี่ยวม้า,ผัดคะน้าปลาเค็ม,ผัดคะน้าน้ำมันหอย,สุกี้แห้ง,ยำมาม่า,ไก่ผัดเม็ดมะม่วงหิมพานต์,กระเพราหมูสับไข่ดาว,เต้าหู้ทรงเครื่อง,ผัดพริกแกงไก่,ผัดวุ้นเส้น,แกงจืดเต้าหู้หมูสับ,ไข่เจียวกุ้งสับ,ไก่ทอด,ยำถั่วพลู,กระเพราเนื้อ,ข้าวผัดปลากระป๋อง,ข้าวผัดแหนม,ผัดผงกระหรี่,ไก่บอนชอน,หมูย่างเกาหลี,ข้าวปั้น,ซาชิมิ,ข้าวแกงกะหรี่,ชาบู,ข้าวหน้าปลาไหล,ข้าวหน้าไข่,ยากิโซบะ,พอร์คชอป,รีซอตโต้,เย็นตาโฟ,ไม่รู้';
                let foods = foodsText.split(',');
                await msg.reply(foods[Math.floor(Math.random() * foods.length)])
                break;
            case "ฉันชอบกินอะไร":
                if (!!user) {
                    await msg.reply(user.foods.length > 0 ? user.foods : "ไม่มีข้อมูล");
                } else {
                    await msg.reply('ไม่เคยบอกจะรู้ได้ไง');
                }
                break;
            case "วันนี้ฉันกินอะไรดี":
                if (!!user) {
                    await msg.reply(user.foods[Math.floor(Math.random() * user.foods.length)]);
                } else {
                    await msg.reply('ไม่เคยบอกจะรู้ได้ไง');
                }
                break;

            case "ฉันคือใคร":
                await msg.reply("คุณคือ " + msg.author.id)
                break;
            case "แมว":


                let config = {
                    method: 'get',
                    url: 'https://api.thecatapi.com/v1/images/search',
                    headers: {}
                };
                let catFact = {
                    method: 'get',
                    url: 'https://catfact.ninja/fact',
                    headers: {}
                };
                axios(catFact)
                    .then(function (response) {
                        axios(config)
                            .then(function (response2) {
                                msg.reply(response.data.fact, {file: response2.data[0].url});
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });


                break;
            case "หมา":
                let dog = {
                    method: 'get',
                    url: 'https://dog.ceo/api/breeds/image/random',
                    headers: {}
                };
                axios(dog)
                    .then(function (response) {
                        msg.reply("หน้าโง่", {file: response.data.message});
                    }).catch(function (error) {
                    console.log(error);
                });
                break;
        }
    }

});

const fs = require('fs')

const storeData = (data, path) => {

    fs.writeFileSync(path, JSON.stringify(data))

}

client.login(auth.token);