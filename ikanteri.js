var Bot = require('node-telegram-bot');
var dpertanyaan = [{
	id:1,
	quest:"[Pertanyaan harian] makanan khas lombok?",
	answ:['pelecing','kangkung siong', 'ambon lepak']
}];
var answ=['pelecing','kangkung siong', 'ambon lepak','sate pusut','pelecing ayam','ayam taliwang','pecel'];
var hasAnswer=[];
var gamestart=false;
var bot = new Bot({
  token: '298843630:AAHSkZTZSKHZ0YMVT8yaMxV1mdyQqcjm3Ag'
})
.enableAnalytics('2LvN8c:M1EDcst9CofEGzohf1-91Z7zp')
.on('message', function (message) {
  console.log(message);
  if(typeof message.text != 'undefined'){
	 if(gamestart==true){
		 if(answ.indexOf(message.text)>=0){
			 if(hasAnswer.indexOf(message.text)>=0){
				 bot.sendMessage({
					chat_id : message.chat.id,
					text	 : 'jawaban "'+message.text+'" sudah ada...',
				});
			 }else{
				 bot.sendMessage({
					chat_id : message.chat.id,
					text	 : 'benar "'+message.text+'" adalah masakan khas lombok',
				});
				hasAnswer.push(message.text);
			 }
			 
		 }else{
			 bot.sendMessage({
			 chat_id : message.chat.id,
			 text	 : 'salah "'+message.text+'" tidak terdapat dalam database masakan khas lombok kami',
		 });
		 }
	 }
	 if (message.text == '/mulai' || message.text == '/mulai@ikanteribot') {
		 bot.sendMessage({
			 chat_id : message.chat.id,
			 text	 : 'Game di mulai?',
		 });
		 var mcm= "1] ___________ \n";
		 mcm+= "2] ___________ \n";
		 mcm+= "3] ___________ \n";
		 mcm+= "4] ___________ \n";
		 mcm+= "5] ___________ \n";
		 mcm+= "6] ___________ \n";
		 mcm+= "7] ___________ \n";
		 bot.sendMessage({
			 chat_id : message.chat.id,
			 text	 : dpertanyaan[0].quest + '\n' + mcm,
		 });
		 
		 setTimeout(function(){
			 gamestart=false;
			 bot.sendMessage({
			 chat_id : message.chat.id,
			 text	 : 'game selesai..',
		 });
		 var berhasilss= "";
			 hasAnswer.forEach(function(item,index){
				 berhasilss+= (index+1)+"] "+item+" \n";
			 });
		 bot.sendMessage({
			 chat_id : message.chat.id,
			 text	 : "Jawaban yang berhasil dijawab :\n"+ berhasilss,
		 });
		 },180000);
		 gamestart=true;
	 }
	 if(answ.indexOf('pelecing')==1){
		 console.log(answ.indexOf('pelecing'));
	 }
	 console.log(answ.indexOf('pelecing'));
  }
})
.on('error', function (message) {
  console.log(message);
})
.on('start', function (message) {
  bot.start();
})
.start();
