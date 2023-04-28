const beş_config = require("../../beş_config");
const client = global.client;
const db = client.db;
const canvafy = require("canvafy");
module.exports = async (member) => {
if(member.guild.id !== beş_config.guildID || member.user.bot)return;
let staffData = await db.get("five-register-staff") || [];
let unregisterRoles = await db.get("five-unregister-roles") || [];
let fiveImage = await db.get("five-welcome-image");
let fiveMentions = await db.get("five-welcome-mentions");
let tagData = await db.get("five-tags") || [];
let welcomeChannel = await db.get("five-channel-welcome");
let jailRoles = await db.get("five-jail-roles") || [];

if(!staffData.length > 0)throw new SyntaxError("Kayıt Yetkilisi Ayarlı Değil!");
if(!unregisterRoles.length > 0)throw new SyntaxError("Kayıtsız Rolleri Ayarlı Değil!");
if(!jailRoles.length > 0)throw new SyntaxError("Jail Rolleri Ayarlı Değil!");
if(!welcomeChannel)throw new SyntaxError("Welcome / Hoşgeldin Kanalı Ayarlı Değil!");

if(!member.guild.channels.cache.get(welcomeChannel)){
console.log(`[ 🚨 ] Welcome / Hoşgeldin Kanalı Bulunamadı,Kanalın Varlığını Kontrol Edin; ${member.user.tag} Kullanıcısı Sunucuya Katıldı`)
return;
}
var kurulus = (Date.now() - member.user.createdTimestamp);
var üyesayısı = member.guild.memberCount.toString().replace(/ /g, "    ")
var üs = üyesayısı.match(/([0-9])/g)
üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
if(üs) {üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
return {
'0': beş_config.sayılarEmoji.sıfır,
'1': beş_config.sayılarEmoji.bir,
'2': beş_config.sayılarEmoji.iki,
'3': beş_config.sayılarEmoji.üç,
'4': beş_config.sayılarEmoji.dört,
'5': beş_config.sayılarEmoji.beş,
'6': beş_config.sayılarEmoji.altı,
'7': beş_config.sayılarEmoji.yedi,
'8': beş_config.sayılarEmoji.sekiz,
'9': beş_config.sayılarEmoji.dokuz}[d];
})}

let beşWelcomeMessage = `🎉 Hoş geldin ${member}, Seninle birlikte **ADOLFİNA** sunucumuz ${üyesayısı} kişiye ulaştı!\n\n Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}> tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) önce oluşturulmuş,sunucumuza <t:${Math.floor(Date.now() / 1000)}:R> giriş yaptın!\n\n Kayıt olduktan sonra kurallar kanalını okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünde bulundurarak yapacağız.\n\n ${tagData.length > 0 ? `Tagımızı : \`\`${tagData ? tagData.map((five) => `${five}`).join(",") : "Beş_Error"}\`\`'ı alarak bizlere destek olabilir ve ailemize katılabilirsin, ` : ""}Adolfina ekibi olarak İYİ SOHBETLER dileriz.${fiveMentions ? `${staffData.length > 0 ? `||${staffData.map((five) => `<@&${five}>`).join(",")}||`:""}`:""}`;


if (kurulus > 604800000) {
if(!member.user.bot && unregisterRoles.length > 0)member.roles.set([...unregisterRoles])


member.setNickname(beş_config.kayitsizHesapIsim);
if(fiveImage){
const welcome = await new canvafy.WelcomeLeave()
.setAvatar(member.user.avatarURL({forceStatic:true,extension:"png"}))
.setBackground("image", beş_config.welcomeResimURL)
.setTitle(`${member.user.username}`)
.setDescription("Sunucumuza Hoşgeldin!")
.setBorder(beş_config.welcomeResimRenk)
.setAvatarBorder(beş_config.welcomeResimRenk)
.setOverlayOpacity(0.65)
.build();
member.guild.channels.cache.get(welcomeChannel).send({files:[{attachment: welcome.toBuffer(),name: `bes_welcome_${member.id}.png`}],content:beşWelcomeMessage});
}else{
member.guild.channels.cache.get(welcomeChannel).send({content:beşWelcomeMessage});
}
} else {
if(jailRoles.length > 0)member.roles.set([...jailRoles]);
member.setNickname(beş_config.supheliHesapIsim);
member.guild.channels.cache.get(welcomeChannel).send({ content: `**⚠ ${member}, Kullanıcısı Sunucuya Katıldı Hesabı <t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) Önce Açıldığı İçin Şüpheli Rolü Verildi.**\n**Sunucumuza <t:${Math.floor(Date.now() / 1000)}:R> Zamanında Giriş Yaptı!**`})}


}
module.exports.conf = {
name: "guildMemberAdd"
}
