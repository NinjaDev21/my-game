var DEBUGMODE = false;
var GAME_PATH = '';

var BasicGame = {};

var SFX = $.jStorage.get("opt_sfx");
var LANGUAGE = $.jStorage.get("opt_language");
if(SFX === null){SFX = true;}
if(LANGUAGE === null){LANGUAGE = 'en';}

var LANG = {
	en:{
		welcome: "Welcome",
		settings_title_1: "Settings",
		settings_title_2: "Language",
		settings_opt_label_1: "Sound",
		settings_opt_label_2: "Fullscreen",
		settings_opt_label_3: "",
		msg_error_credits: "No credits!",
		msg_error_login: "Please login!",
		msg_error_params: "Unknown error!",
		msg_error_booking: "Unknown error!",
		msg_begin_scratch: "Begin to scratch",
		msg_play: "Game is running ...",
		msg_win: "You win",
		msg_win_jp: "You win the Jackpot!",
		msg_nowins: "Lose!",
		label_jackpot: "TOPPRIZE",
		label_ticket: "one ticket",
		btn_start: "Play",
		helpmenu_title: "Paytable",
		help_table_1: "WIN",
		help_table_2: "CHANCE TO SELECT",
		help_table_3: "CHANCE TO WIN",
		btn_paytable: "Paytable"
	},
	de:{
		welcome: "Willkommen",
		settings_title_1: "Einstellungen",
		settings_title_2: "Sprache",
		settings_opt_label_1: "Soundeffekte",
		settings_opt_label_2: "Vollbild",
		settings_opt_label_3: "",
		msg_error_credits: "Keine Kredits!",
		msg_error_login: "Bitte einloggen!",
		msg_error_params: "Unbekannter Fehler!",
		msg_error_booking: "Unbekannter Fehler!",
		msg_begin_scratch: "Begin zu Rubbeln",
		msg_play: "Spiel läuuft ...",
		msg_win: "Gewonnen",
		msg_win_jp: "Du hast den Jackpot gewonnen!",
		msg_nowins: "Verloren!",
		label_jackpot: "TOP GEWINN",
		label_ticket: "Ein Ticket",
		btn_start: "Spielen",
		helpmenu_title: "Gewinntabelle",
		help_table_1: "GEWINN",
		help_table_2: "CHANCE DER AUSWAHL",
		help_table_3: "CHANCE ZUM GEWINN",
		btn_paytable: "Gewinntabelle"
	},
	es:{
		welcome: "Bienvenida",
		settings_title_1: "Ajustes",
		settings_title_2: "Idioma",
		settings_opt_label_1: "Efectos sonoros",
		settings_opt_label_2: "Pantalla completa",
		settings_opt_label_3: "",
		msg_error_credits: "Sin crédito!",
		msg_error_login: "Entra en la cuenta!",
		msg_error_params: "error desconocido!",
		msg_error_booking: "error desconocido!",
		msg_begin_scratch: "Comenzar a arañazos",
		msg_play: "El juego se está ejecutando ...",
		msg_win: "Ganado",
		msg_win_jp: "Te has ganado la bote!",
		msg_nowins: "Perdido!",
		label_jackpot: "PRIMER PREMIO",
		label_ticket: "Un billete",
		btn_start: "Jugar",
		helpmenu_title: "Tabla de ganancia",
		help_table_1: "PREMIO",
		help_table_2: "CHANCE DE SELECTA",
		help_table_3: "CHANCE DE GANA",
		btn_paytable: "Tabla de ganancia"
	}
};

function sizeHandler(){
    $("#game").css("height", $(window).innerHeight());
}
$(window).resize(function() {
    sizeHandler();
});
$(document).ready(function(){
    sizeHandler();
});

BasicGame.GameLoad = function (game){};

BasicGame.GameLoad.prototype = {
	init: function() {
        this.game.renderer.renderSession.roundPixels = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
	},
	preload: function() {
		this.game.load.image('bg', GAME_PATH+'assets/bg.png');
		this.game.load.image('preloader_logo', GAME_PATH+'assets/loading.png');
	},
    create: function() {
  		var bg = this.game.add.sprite(0, 0, 'bg');
		var bar = this.LoaderBar('408', '20', this.game.world.centerX-204, 550, '#000000', '#ffb807');
		this.LoaderBar_Set(bar, 0);
		this.game.load.onFileComplete.add(function(progress, cacheKey, success, totalLoaded, totalFiles){
            this.LoaderBar_Set(bar, progress);
            if(DEBUGMODE === true){
            	console.log('progress: '+progress);
            }
        	if(progress == 100){
            	this.CallEventTimer = this.time.events.add(Phaser.Timer.SECOND, this.CallGame, this);
          	}
		}, this);
		this.logo = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY - 50, 'preloader_logo');
		this.logo.anchor.setTo(0.5);
		this.logo.scale.setTo(0.5);
		this.logo_ani = this.add.tween(this.logo.scale).to( { x: 0.9, y: 0.9 }, 1500, Phaser.Easing.Bounce.Out, true);
		this.logo_ani.onComplete.add(function(){
			this.BeginLoad();
		}, this);

    },
    BeginLoad: function (){
        this.load.atlasJSONHash('basis', GAME_PATH+'assets/basis_high.png', GAME_PATH+'assets/basis_high.json');
        this.game.load.image('canvas', GAME_PATH+'assets/mask.png');
		this.load.audio('sfx_click', [GAME_PATH+'assets/audio/click.mp3', GAME_PATH+'assets/audio/click.ogg']);
        this.load.audio('sfx_win', [GAME_PATH+'assets/audio/win.mp3', GAME_PATH+'assets/audio/win.ogg']);
        this.load.audio('sfx_lose', [GAME_PATH+'assets/audio/lose.mp3', GAME_PATH+'assets/audio/lose.ogg']);
    	this.load.start();
    },
	CallGame: function (){
		this.state.start('Game');
	},
	LoaderBar: function(width, height, pos_x, pos_y, Color, BarColor){
		var progress = game.add.group();

        var barbg = game.add.bitmapData(width, height);
        barbg.ctx.beginPath();
        barbg.ctx.rect(0, 0, width, height);
        barbg.ctx.fillStyle = Color;
        barbg.ctx.fill();

        var bar = game.add.bitmapData(width-4, height-4);
        bar.ctx.beginPath();
        bar.ctx.rect(0, 0, width-4, height-4);
        bar.ctx.fillStyle = BarColor;
        bar.ctx.fill();

        barbg = game.add.sprite(pos_x, pos_y, barbg);
        bar = game.add.sprite(pos_x+2, pos_y+2, bar);
		bar.origsize = width-4;
        progress.add(barbg);
        progress.add(bar);

		return progress;
	},
	LoaderBar_Set: function(bar, percent){
		bar.children[1].width = bar.children[1].origsize / 100 * percent
	}
};

BasicGame.Game = function (game){
	this.play = 0;
	this.posWins = '';
	this.c_chance = 0;
	this.decimal = 0;
	this.settings = 0;
	this.settings_delay = 0;
	this.help = 0;
	this.help_delay = 0;
	this.IsJPWin = false;
	this.IsWin = false;
	this.newCredits = 0;
	this.newJP = 0;
	this.currency = '';
	this.Win = 0;
};

BasicGame.Game.prototype = {
	preload: function(){

	},
  	create: function(){
  		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.add.sprite(0, 0, 'basis', 'bg.png');
        this.mask = this.game.add.bitmapData(619, 428);
		this.LoseSFX = this.add.audio('sfx_lose');
		this.WinSFX = this.add.audio('sfx_win');
		this.CLICKSFX = this.add.audio('sfx_click');
		this.WinLables = this.add.group();
		var label1 = this.game.add.text(750, 235, '100.000', {font: "bold 30px Arial", fill: "#000000"});
		var label2 = this.game.add.text(949, 235, '100.000', {font: "bold 30px Arial", fill: "#000000"});
		var label3 = this.game.add.text(1148, 235, '100.000', {font: "bold 30px Arial", fill: "#000000"});
		var label4 = this.game.add.text(750, 435, '100.000', {font: "bold 30px Arial", fill: "#000000"});
		var label5 = this.game.add.text(949, 435, '100.000', {font: "bold 30px Arial", fill: "#000000"});
		var label6 = this.game.add.text(1148, 435, '100.000', {font: "bold 30px Arial", fill: "#000000"});
		label1.anchor.setTo(0.5);
		label2.anchor.setTo(0.5);
		label3.anchor.setTo(0.5);
		label4.anchor.setTo(0.5);
		label5.anchor.setTo(0.5);
		label6.anchor.setTo(0.5);
		this.WinLables.add(label1);
		this.WinLables.add(label2);
		this.WinLables.add(label3);
		this.WinLables.add(label4);
		this.WinLables.add(label5);
		this.WinLables.add(label6);
        this.mask.load('canvas');
        this.mask.addToWorld(640, 113);
        this.mask.y = 640;
		this.markers = this.add.group();
		for(var c in this.WinLables.children){
            var marker = game.add.bitmapData(5, 5);
            marker.ctx.beginPath();
            marker.ctx.rect(0, 0, 5, 5);
            marker.ctx.fillStyle = '#ffb807';
            marker.ctx.fill();
            var sprite = this.game.add.sprite(this.WinLables.children[c].x, this.WinLables.children[c].y - 15, marker);
            sprite.anchor.setTo(0.5);
            this.markers.add(sprite);
            var marker = game.add.bitmapData(5, 5);
            marker.ctx.beginPath();
            marker.ctx.rect(0, 0, 5, 5);
            marker.ctx.fillStyle = '#ffb807';
            marker.ctx.fill();
            var sprite = this.game.add.sprite(this.WinLables.children[c].x - this.WinLables.children[c].width / 2 - 15, this.WinLables.children[c].y - 15, marker);
            sprite.anchor.setTo(0.5);
            this.markers.add(sprite);
            var marker = game.add.bitmapData(5, 5);
            marker.ctx.beginPath();
            marker.ctx.rect(0, 0, 5, 5);
            marker.ctx.fillStyle = '#ffb807';
            marker.ctx.fill();
            var sprite = this.game.add.sprite(this.WinLables.children[c].x + this.WinLables.children[c].width / 2 + 15, this.WinLables.children[c].y - 15, marker);
            sprite.anchor.setTo(0.5);
            this.markers.add(sprite);
            var marker = game.add.bitmapData(5, 5);
            marker.ctx.beginPath();
            marker.ctx.rect(0, 0, 5, 5);
            marker.ctx.fillStyle = '#ffb807';
            marker.ctx.fill();
            var sprite = this.game.add.sprite(this.WinLables.children[c].x, this.WinLables.children[c].y + 15, marker);
            sprite.anchor.setTo(0.5);
            this.markers.add(sprite);
            var marker = game.add.bitmapData(5, 5);
            marker.ctx.beginPath();
            marker.ctx.rect(0, 0, 5, 5);
            marker.ctx.fillStyle = '#ffb807';
            marker.ctx.fill();
            var sprite = this.game.add.sprite(this.WinLables.children[c].x - this.WinLables.children[c].width / 2 - 15, this.WinLables.children[c].y + 15, marker);
            sprite.anchor.setTo(0.5);
            this.markers.add(sprite);
            var marker = game.add.bitmapData(5, 5);
            marker.ctx.beginPath();
            marker.ctx.rect(0, 0, 5, 5);
            marker.ctx.fillStyle = '#ffb807';
            marker.ctx.fill();
            var sprite = this.game.add.sprite(this.WinLables.children[c].x + this.WinLables.children[c].width / 2 + 15, this.WinLables.children[c].y + 15, marker);
            sprite.anchor.setTo(0.5);
            this.markers.add(sprite);
        }
        this.markers.setAll('visible', false);
        this.rubber = this.game.add.sprite(0, 0, 'basis', 'rubber.png');
        this.rubber.anchor.setTo(0.5);
        this.rubber.scale.setTo(1.5);
        this.rubber.visible = false;
		this.gamebuttons = this.add.group();
		this.startbutton = this.gamebuttons.create(640, 565, 'basis','btn_play.png');
		this.paybutton = this.gamebuttons.create(965, 20, 'basis','btn_play.png');
		this.settingsbutton = this.gamebuttons.create(1190, 20, 'basis','btn_settings.png');
		this.gamebuttons.setAll('inputEnabled', true);
		this.gamebuttons.setAll('input.useHandCursor', true);
		this.gamebuttons.setAll('input.pixelPerfectOver', true);
		this.gamebuttons.setAll('input.pixelPerfectClick', true);
        this.startbutton.events.onInputDown.add(this.PressPlay, this);
        this.paybutton.events.onInputDown.add(this.PressInfo, this);
		this.settingsbutton.events.onInputDown.add(this.PressSettings, this);
		this.label_jp = this.game.add.text(460, 500, LANG[LANGUAGE]['label_jackpot'], {font: "bold 38px Arial", fill: "#ffffff"});
		this.label_jp.anchor.setTo(0.5);
		this.label_bet = this.game.add.text(110, 620, LANG[LANGUAGE]['label_ticket'], {font: "bold 34px Arial", fill: "#ffffff"});
		this.label_bet.anchor.setTo(0.5);
		this.bet = this.game.add.text(110, 670, '2 �', {font: "bold 30px Arial", fill: "#ffffff"});
		this.bet.anchor.setTo(0.5);
		this.label_startbutton = this.game.add.text(745, 577, LANG[LANGUAGE]['btn_start'], {font: "bold 30px Arial", fill: "#ffffff"});
		this.label_startbutton.anchor.setTo(0.5, 0);
		this.label_paybutton = this.game.add.text(1070, 36, LANG[LANGUAGE]['btn_paytable'], {font: "bold 22px Arial", fill: "#ffffff"});
		this.label_paybutton.anchor.setTo(0.5, 0);
		this.label_credits = this.game.add.text(875, 577, '20', {font: "bold 30px Arial", fill: "#ffffff"});
		this.label_msg = this.game.add.text(655, 654, LANG[LANGUAGE]['welcome'], {font: "bold 30px Arial", fill: "#ffffff"});
		this.jp = this.game.add.text(460, 550, '', {font: "bold 28px Arial", fill: "#ffffff"});
		this.jp.anchor.setTo(0.5);

		// Helpmenu
		this.helpmenu = this.add.group();
		this.helpmenubuttons = this.add.group();
		this.helpbg_width = 700;
		this.helpbg_height = 440;

        var helpbg = game.add.bitmapData(this.helpbg_width, this.helpbg_height);
        helpbg.ctx.beginPath();
        helpbg.ctx.rect(0, 0, this.helpbg_width, this.helpbg_height);
        helpbg.ctx.fillStyle = '#ffb807';
        helpbg.ctx.fill();
		this.helpbg = this.game.add.sprite(this.game.width - this.helpbg_width, 160, helpbg);

        var helpbg2 = game.add.bitmapData(this.helpbg_width - 8, this.helpbg_height - 16);
        helpbg2.ctx.beginPath();
        helpbg2.ctx.rect(0, 0, this.helpbg_width, this.helpbg_height);
        helpbg2.ctx.fillStyle = '#3d844c';
        helpbg2.ctx.fill();
		this.helpbg2 = this.game.add.sprite(this.game.width - this.helpbg_width + 8, 168, helpbg2);

		this.helpmenu.add(this.helpbg);
		this.helpmenu.add(this.helpbg2);
		this.helpmenu_close_button = this.helpmenubuttons.create(this.helpbg2.x + 7, this.helpbg2.y + 7, 'basis','btn_close.png');
		this.helpmenubuttons.setAll('inputEnabled', true);
		this.helpmenubuttons.setAll('input.useHandCursor', true);
		this.helpmenubuttons.setAll('input.pixelPerfectOver', true);
		this.helpmenubuttons.setAll('input.pixelPerfectClick', true);
		this.helpmenu_close_button.events.onInputDown.add(this.PressInfo, this);
		this.helpmenu_title1 = this.game.add.text(this.helpbg.x + this.helpbg.width / 2, this.helpbg.y + 30, LANG[LANGUAGE]['helpmenu_title'], {font: "bold 34px Arial", fill: "#ffffff"});
		this.helpmenu_title1.anchor.x = 0.5;
		this.helpmenu.add(this.helpmenu_title1);
		this.helpmenu.add(this.helpmenubuttons);
        this.helpmenu_table_1 = this.game.add.text(this.helpbg.x + 30, this.helpbg.y + 100, LANG[LANGUAGE]['help_table_1'], {font: "bold 20px Arial", fill: "#ffffff"});
        this.helpmenu_table_2 = this.game.add.text(this.helpbg.x + 230, this.helpbg.y + 100, LANG[LANGUAGE]['help_table_2'], {font: "bold 20px Arial", fill: "#ffffff"});
        this.helpmenu_table_3 = this.game.add.text(this.helpbg.x + 470, this.helpbg.y + 100, LANG[LANGUAGE]['help_table_3'], {font: "bold 20px Arial", fill: "#ffffff"});
        this.helpmenu.add(this.helpmenu_table_1);
        this.helpmenu.add(this.helpmenu_table_2);
        this.helpmenu.add(this.helpmenu_table_3);

		this.helpmenu.x = this.game.width;

		// Settingsmenu
		this.settingsmenu = this.add.group();
		this.settingsmenubuttons = this.add.group();
		this.settingsbg_width = 430;
		this.settingsbg_height = 440;
        var settingsbg = game.add.bitmapData(this.settingsbg_width, this.settingsbg_height);
        settingsbg.ctx.beginPath();
        settingsbg.ctx.rect(0, 0, this.settingsbg_width, this.settingsbg_height);
        settingsbg.ctx.fillStyle = '#ffb807';
        settingsbg.ctx.fill();
		this.settingsbg = this.game.add.sprite(0, 0, settingsbg);
        var settingsbg2 = game.add.bitmapData(this.settingsbg_width - 8, this.settingsbg_height - 16);
        settingsbg2.ctx.beginPath();
        settingsbg2.ctx.rect(0, 0, this.settingsbg_width, this.settingsbg_height);
        settingsbg2.ctx.fillStyle = '#3d844c';
        settingsbg2.ctx.fill();
		this.settingsbg2 = this.game.add.sprite(0, 8, settingsbg2);
		this.settingsmenu.add(this.settingsbg);
		this.settingsmenu.add(this.settingsbg2);

		// labels
		this.settings_title1 = this.game.add.text(this.settingsbg_width / 2, 30, '', {font: "bold 34px Arial", fill: "#ffffff"});
		this.settings_title1.anchor.x = 0.5;
		this.settings_title2 = this.game.add.text(this.settingsbg_width / 2, 240, '', {font: "bold 34px Arial", fill: "#ffffff"});
		this.settings_title2.anchor.x = 0.5;
		this.settings_opt_label1 = this.game.add.text(100, 110, '', {font: "bold 20px Arial", fill: "#ffffff"});
		this.settings_opt_label2 = this.game.add.text(100, 150, '', {font: "bold 20px Arial", fill: "#ffffff"});
		this.settingsmenu.add(this.settings_title1);
		this.settingsmenu.add(this.settings_title2);
		this.settingsmenu.add(this.settings_opt_label1);
		this.settingsmenu.add(this.settings_opt_label2);
		this.settings_opt_label3 = this.game.add.text(100, 190, '', {font: "bold 20px Arial", fill: "#ffffff"});
		this.settingsmenu.add(this.settings_opt_label3);

		// Buttons
		this.settings_close_button = this.settingsmenubuttons.create(this.settingsmenu.width - 50, 15, 'basis','btn_close.png');
		this.settings_sfx_button = this.settingsmenubuttons.create(300, 110, 'basis','btn_opt_activ.png');
		if(SFX === false){this.settings_sfx_button.frameName = 'btn_opt_normal.png';}
		this.settings_fullscreen_button = this.settingsmenubuttons.create(300, 150, 'basis','btn_opt_normal.png');
		this.settings_lang1_button = this.settingsmenubuttons.create(this.settingsbg_width / 2 - 80, 320, 'basis','lang_en.png');
		this.settings_lang2_button = this.settingsmenubuttons.create(this.settingsbg_width / 2, 320, 'basis','lang_de.png');
		this.settings_lang3_button = this.settingsmenubuttons.create(this.settingsbg_width / 2 + 80, 320, 'basis','lang_es.png');
		this.settings_lang1_button.anchor.x = 0.5;
		this.settings_lang2_button.anchor.x = 0.5;
		this.settings_lang3_button.anchor.x = 0.5;
		this.settingsmenubuttons.setAll('inputEnabled', true);
		this.settingsmenubuttons.setAll('input.useHandCursor', true);
		this.settings_close_button.input.pixelPerfectOver = true;
		this.settings_close_button.input.pixelPerfectClick = true;
		this.settings_lang1_button.input.pixelPerfectOver = true;
		this.settings_lang1_button.input.pixelPerfectClick = true;
		this.settings_lang2_button.input.pixelPerfectOver = true;
		this.settings_lang2_button.input.pixelPerfectClick = true;
		this.settings_lang3_button.input.pixelPerfectOver = true;
		this.settings_lang3_button.input.pixelPerfectClick = true;
		this.settings_close_button.events.onInputDown.add(this.PressSettings, this);
		this.settings_sfx_button.events.onInputDown.add(this.PressSFX, this);
		this.settings_fullscreen_button.events.onInputDown.add(this.PressFullScreen, this);
		this.settings_lang1_button.events.onInputDown.add(function(){this.PressLang('en');}, this);
		this.settings_lang2_button.events.onInputDown.add(function(){this.PressLang('de');}, this);
		this.settings_lang3_button.events.onInputDown.add(function(){this.PressLang('es');}, this);
		this.settingsmenu.add(this.settingsmenubuttons);
		this.settingsmenu.x = -this.settingsbg_width - 50;
		this.settingsmenu.y = 160;
		this.UpdateLanguage();
		var stage = this;
		$.getJSON(GAME_PATH+"php/game.php?u=init", function(res){
			if(!res.error){
				stage.decimal = res.decimal;
				stage.currency = res.currency;
                stage.label_credits.text = stage.number_format(res.credits, stage.decimal, ',', '') + ' ' + stage.currency;
                stage.bet.text = stage.number_format(res.bet, stage.decimal, ",","") + ' ' + stage.currency;
                stage.jp.text = stage.number_format(res.jp, stage.decimal, ",","") + ' ' + stage.currency;
                stage.posWins = res.wins;
                stage.c_chance = res.c_chance;
                stage.WriteFactors();
			} else {
				stage.label_msg.text = LANG[LANGUAGE][res.error];
			}
		});
        this.game.input.addMoveCallback(this.paint, this);
  	},
  	WriteFactors(){
		var next = this.helpbg.y + 150;
		for(var i = 0; i < this.posWins.length; i++){
            this.helpmenu_pays = this.game.add.text(this.helpbg.x + 30, next, this.number_format(this.posWins[i].win, this.decimal, ",","") + ' ' + this.currency, {font: "bold 20px Arial", fill: "#ffffff"});
            this.helpmenu_pays2 = this.game.add.text(this.helpbg.x + 230, next, this.posWins[i].count + ' / ' + this.c_chance, {font: "bold 20px Arial", fill: "#ffffff"});
            this.helpmenu_pays3 = this.game.add.text(this.helpbg.x + 470, next, this.posWins[i].percent + '%', {font: "bold 20px Arial", fill: "#ffffff"});
            this.helpmenu.add(this.helpmenu_pays);
            this.helpmenu.add(this.helpmenu_pays2);
            this.helpmenu.add(this.helpmenu_pays3);
            next += 38;
		}
  	},
  	PressPlay: function(){
		if(SFX === true){
			this.CLICKSFX.play();
		}
    	if(!this.play && !this.isSettings){
            this.InitPlay();
            this.startbutton.tint = '0xcccccc';
        }
  	},
  	InitPlay: function(){
  		this.mask.load('canvas');
  		var stage = this;
		$.getJSON(GAME_PATH+"php/game.php?u=game", function(res){
			if(!res.error){
                stage.play = 1;
                stage.Win = res.win;
                stage.IsJPWin = res.isJP;
                stage.IsWin = res.isWin;
                stage.label_credits.text = stage.number_format(res.old_credits, stage.decimal, ",","") + ' ' + stage.currency;
                stage.newCredits = res.credits;
                stage.newJP = res.jp;
                stage.label_msg.text = LANG[LANGUAGE]['msg_begin_scratch'];
                for(var i = 0; i < 6; i++){
                	stage.WinLables.children[i].text = stage.number_format(res.numbers[i], stage.decimal, ",","");
                }
			} else {
				stage.label_msg.text = LANG[LANGUAGE][res.error];
				stage.play = 0;
			}
		});
  	},
	PressInfo: function(){
		if(SFX === true){
			this.CLICKSFX.play();
		}
    	if(!this.play && !this.settings && !this.settings_delay && !this.help && !this.help_delay){
    		this.paybutton.tint = '0xcccccc';
    		this.help_delay = true;
    		this.info_ani = this.add.tween(this.helpmenu).to( { x: 0 }, 300, Phaser.Easing.Linear.None, true, 500);
    		this.info_ani.onComplete.add(function(){
				this.help_delay = false;
				this.help = true;
    		},this);
    	}
        if(this.help == true && !this.help_delay){
    		this.help_delay = true;
    		this.info_ani2 = this.add.tween(this.helpmenu).to( { x: this.game.width }, 300, Phaser.Easing.Linear.None, true, 500);
    		this.info_ani2.onComplete.add(function(){
				this.help_delay = false;
				this.help = false;
				this.paybutton.tint = '0xffffff';
    		},this);
    	}
	},
	PressSettings: function(){
		if(SFX === true){
			this.CLICKSFX.play();
		}
    	if(!this.settings && !this.settings_delay && !this.help && !this.help_delay){
    		this.settingsbutton.tint = '0xcccccc';
    		this.settings_delay = true;
    		this.settings_ani = this.add.tween(this.settingsmenu).to( { x: 0 }, 300, Phaser.Easing.Linear.None, true, 500);
    		this.settings_ani.onComplete.add(function(){
				this.settings_delay = false;
				this.settings = true;
    		},this);
    	}
        if(this.settings == true && !this.settings_delay){
    		this.settings_delay = true;
    		this.settings_ani2 = this.add.tween(this.settingsmenu).to( { x: -this.settingsbg_width - 50 }, 300, Phaser.Easing.Linear.None, true, 500);
    		this.settings_ani2.onComplete.add(function(){
				this.settings_delay = false;
				this.settings = false;
				this.settingsbutton.tint = '0xffffff';
    		},this);
    	}
	},
    PressSFX: function(){
		if(SFX === true){
			this.CLICKSFX.play();
		}
    	if(SFX === true){
    		SFX = false;
    		this.settings_sfx_button.frameName = 'btn_opt_normal.png';
    	} else {
    		SFX = true;
    		this.settings_sfx_button.frameName = 'btn_opt_activ.png';
    	}
    	$.jStorage.set("opt_sfx", SFX);
    },
    PressFullScreen: function(){
		if(SFX === true){
			this.CLICKSFX.play();
		}
        if(this.game.scale.isFullScreen){
            this.game.scale.stopFullScreen();
            this.settings_fullscreen_button.frameName = 'btn_opt_normal.png';
        } else {
            this.game.scale.startFullScreen(false);
            this.settings_fullscreen_button.frameName = 'btn_opt_activ.png';
        }
    },
    PressLang: function(lang){
		if(SFX === true){
			this.CLICKSFX.play();
		}
        LANGUAGE = lang;
        this.UpdateLanguage();
    },
    UpdateLanguage: function(){
    	if(DEBUGMODE === true){
    		console.log('update language | new language: '+LANGUAGE);
    	}
        this.label_startbutton.text = LANG[LANGUAGE]['btn_start'];
        this.label_paybutton.text = LANG[LANGUAGE]['btn_paytable'];
        this.label_jp.text = LANG[LANGUAGE]['label_jackpot'];
        this.label_bet.text = LANG[LANGUAGE]['label_ticket'];
		this.settings_title1.text = LANG[LANGUAGE]['settings_title_1'];
		this.settings_title2.text = LANG[LANGUAGE]['settings_title_2'];
		this.settings_opt_label1.text = LANG[LANGUAGE]['settings_opt_label_1'];
		this.settings_opt_label2.text = LANG[LANGUAGE]['settings_opt_label_2'];
		this.settings_opt_label3.text = LANG[LANGUAGE]['settings_opt_label_3'];
		this.helpmenu_title1.text = LANG[LANGUAGE]['helpmenu_title'];
        this.helpmenu_table_1.text = LANG[LANGUAGE]['help_table_1'];
        this.helpmenu_table_2.text = LANG[LANGUAGE]['help_table_2'];
        this.helpmenu_table_3.text = LANG[LANGUAGE]['help_table_3'];
		this.label_msg.text = '';
		$.jStorage.set("opt_language", LANGUAGE);
    },
    shuffle: function(array){
    	var currentIndex = array.length, temporaryValue, randomIndex ;
      	while (0 !== currentIndex) {
      		randomIndex = Math.floor(Math.random() * currentIndex);
        	currentIndex -= 1;
        	temporaryValue = array[currentIndex];
        	array[currentIndex] = array[randomIndex];
        	array[randomIndex] = temporaryValue;
      	}
      	return array;
    },
	number_format: function(number, decimals, decPoint, thousandsSep){
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
		var n = !isFinite(+number) ? 0 : +number
		var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
		var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
		var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
		var s = ''
		var toFixedFix = function (n, prec) {
			var k = Math.pow(10, prec)
			return '' + (Math.round(n * k) / k).toFixed(prec)
		}

		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || ''
			s[1] += new Array(prec - s[1].length + 1).join('0')
		}
		return s.join(dec)
	},
    checkOverlap: function (spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },
    paint: function(pointer, x, y) {
    	this.rubber.y = y;
    	this.rubber.x = x;
    	this.checker = 0;
    	this.all_checkers = 0;
    	if(
    		x > 650 &&
    		x < 1245 &&
    		y > 123 &&
    		y < 531 &&
    		this.play == 1
    	){
    		if(pointer.isDown){
                for(var c in this.markers.children){
                    if(this.checkOverlap(this.rubber, this.markers.children[c])){
                        this.markers.children[c].check = true;
                    }
                }
			}
            for(var c in this.markers.children){
            	this.all_checkers++;
                if(this.markers.children[c].check === true){
                    this.checker++;
                }
            }
            if(this.checker >= this.all_checkers){
				this.Finish();
            } else {
                this.rubber.visible = true;
                if(pointer.isDown){
                    this.mask.draw(this.rubber, x - 640, y - 113, null, null, 'destination-out');
                }
            }
    	} else {
    		this.rubber.visible = false;
    	}
    },
    Finish: function(){
        if(this.IsJPWin == 1){
            this.label_msg.text = LANG[LANGUAGE]['msg_win_jp'] + ' ' + this.number_format(this.Win, this.decimal, ',', '') + ' ' + this.currency;
            if(SFX === true){
                this.WinSFX.play();
            }
        }
        else if(this.IsWin == 1){
            this.label_msg.text = LANG[LANGUAGE]['msg_win'] + ' ' + this.number_format(this.Win, this.decimal, ',', '') + ' ' + this.currency;
            if(SFX === true){
                this.WinSFX.play();
            }
        } else {
            this.label_msg.text = LANG[LANGUAGE]['msg_nowins'];
            if(SFX === true){
                this.LoseSFX.play();
            }
        }
        this.jp.text = this.number_format(this.newJP, this.decimal, ',', '') + ' ' + this.currency;
        this.label_credits.text = this.number_format(this.newCredits, this.decimal, ',', '') + ' ' + this.currency;
        for(var c in this.markers.children){
        	this.markers.children[c].check = false;
        }
        this.play = 0;
        this.startbutton.tint = '0xffffff';
    },
    update: function(){
        if(this.game.scale.isFullScreen){
            this.settings_fullscreen_button.frameName = 'btn_opt_activ.png';
        } else {
            this.settings_fullscreen_button.frameName = 'btn_opt_normal.png';
        }
    }
}

var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');
game.state.add('GameLoad', BasicGame.GameLoad);
game.state.add('Game', BasicGame.Game);
game.state.start('GameLoad');
