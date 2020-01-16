<!DOCTYPE html>
<html>
<head>
    <title>3 CARDS MONTE</title>
    <link rel="stylesheet" href="css/reset.css" type="text/css">
    <link rel="stylesheet" href="css/main.css" type="text/css">
    <link rel="stylesheet" href="css/ios_fullscreen.css" type="text/css">
    <link rel="stylesheet" href="css/orientation_utils.css" type="text/css">
    <link rel='shortcut icon' type='image/x-icon' href='./favicon.ico' />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui" />
    <meta name="msapplication-tap-highlight" content="no"/>

    <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="js/createjs.min.js"></script>
    <script type="text/javascript" src="js/howler.min.js"></script>
    <script type="text/javascript" src="js/screenfull.js"></script>
    <script type="text/javascript" src="js/platform.js"></script>
    <script type="text/javascript" src="js/ios_fullscreen.js"></script>
    <script type="text/javascript" src="js/ctl_utils.js"></script>
    <script type="text/javascript" src="js/sprite_lib.js"></script>
    <script type="text/javascript" src="js/settings.js"></script>
    <script type="text/javascript" src="js/CLang.js"></script>
    <script type="text/javascript" src="js/CPreloader.js"></script>
    <script type="text/javascript" src="js/CMain.js"></script>
    <script type="text/javascript" src="js/CTextButton.js"></script>
    <script type="text/javascript" src="js/CToggle.js"></script>
    <script type="text/javascript" src="js/CGfxButton.js"></script>
    <script type="text/javascript" src="js/CMenu.js"></script>
    <script type="text/javascript" src="js/CGame.js"></script>
    <script type="text/javascript" src="js/CInterface.js"></script>
    <script type="text/javascript" src="js/CHelpPanel.js"></script>
    <script type="text/javascript" src="js/CEndPanel.js"></script>
    <script type="text/javascript" src="js/CCard.js"></script>
    <script type="text/javascript" src="js/CCreditsPanel.js"></script>
    <script type="text/javascript" src="js/CCTLText.js"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}" />
</head>
<body ondragstart="return false;" ondrop="return false;" >
<div style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%"></div>
<script>
    $(document).ready(function(){
        $.ajaxSetup({

            headers: {

                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')

            }

        });
        var oMain = new CMain({

            points_to_win: 1, //Number of win points
            start_num_shuffle: 5, //Starting number of shuffle in a level
            num_level_to_increase_num_shuffle: 2, //Levels to play to increase by 1 the number of shuffle
            start_timespeed_shuffle: 800, //Starting time (in ms) to shuffle 2 cards
            decrease_timespeed_shuffle: -50, //Decrease starting timespeed to shuffle 2 cards every level (in ms)
            minimum_timespeed: 200, //Minimum time speed limit
            audio_enable_on_startup:false, //ENABLE/DISABLE AUDIO WHEN GAME STARTS
            show_credits:true,
            fullscreen:true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
            check_orientation:true     //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
        });


        $(oMain).on("start_session", function(evt) {
            //THIS EVENT IS TRIGGERED WHEN PLAY BUTTON IN MENU SCREEN IS CLICKED
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeStartSession();
            }
            //...ADD YOUR CODE HERE EVENTUALLY
            $.ajax({
                type: 'POST',
                url: "/start-game-session",
                data: { userActuon : "Start Game" },
                dataType: "text",
                success: function(resultData) { alert("Save Complete") }
            });
        });

        $(oMain).on("end_session", function(evt) {
            //THIS EVENT IS TRIGGERED WHEN GAME IS OVER OR THE EXIT BUTTON IS CLICKED.
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeEndSession();
            }
            //...ADD YOUR CODE HERE EVENTUALLY
            $.ajax({
                type: 'POST',
                url: "/end-game-session",
                data: { userActuon : "Stop Game" },
                dataType: "text",
                success: function(resultData) { alert("Save Complete") }
            });
        });

        $(oMain).on("restart_level", function(evt, iLevel) {
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeRestartLevel({level:iLevel});
            }
            //...ADD YOUR CODE HERE EVENTUALLY
            $.ajax({
                type: 'POST',
                url: "/restart-game-level",
                data: { userActuon : "Restart Level", UserRestartLevel: iLevel},
                dataType: "text",
                success: function(resultData) { alert("Save Complete") }
            });
        });

        $(oMain).on("save_score", function(evt,iScore) {
            //THIS EVENT IS TRIGGERED WHEN GAME IS OVER. IT CAN BE USEFUL TO CALL PHP SCRIPTS (NOT PROVIDED IN THE PACKAGE) THAT TO THE SCORE.
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeSaveScore({score:iScore});
            }
            //...ADD YOUR CODE HERE EVENTUALLY
            $.ajax({
                type: 'POST',
                url: "/save-game-score",
                data: { userActuon : "Restart Level", userGameScore: iScore},
                dataType: "text",
                success: function(resultData) { alert("Save Complete") }
            });
        });

        $(oMain).on("start_level", function(evt, iLevel) {
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeStartLevel({level:iLevel});
            }
            //...ADD YOUR CODE HERE EVENTUALLY
            $.ajax({
                type: 'POST',
                url: "/start-game-level",
                data: { userActuon : "Start Level", UserRestartLevel: iLevel},
                dataType: "text",
                success: function(resultData) { alert("Save Complete") }
            });
        });

        $(oMain).on("end_level", function(evt,iLevel) {
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeEndLevel({level:iLevel});
            }
            //...ADD YOUR CODE HERE EVENTUALLY
            $.ajax({
                type: 'POST',
                url: "/end-game-level",
                data: { userActuon : "Start Level", UserRestartLevel: iLevel},
                dataType: "text",
                success: function(resultData) { alert("Save Complete") }
            });
        });

        $(oMain).on("show_interlevel_ad", function(evt) {
            //THIS EVENT IS TRIGGERED WHEN GAME OVER PANEL IS CLOSED. MAY BE USEFUL TO CALL ADS SCRIPT.
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeShowInterlevelAD();
            }
            //...ADD YOUR CODE HERE EVENTUALLY
        });

        $(oMain).on("share_event", function(evt, iScore, szImage, szTitle, szMsg, szMsgShare) {
            //THIS EVENT IS TRIGGERED WHEN GAME OVER PANEL IS SHOWN. CAN BE USEFUL TO CALL SHARING FEATURE SCRIPTS.
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeShareEvent({   img:szImage,
                    title:szTitle,
                    msg:szMsg,
                    msg_share:szMsgShare});
            }
            //...ADD YOUR CODE HERE EVENTUALLY
        });

        if(isIOS()){
            setTimeout(function(){sizeHandler();},200);
        }else{
            sizeHandler();
        }
    });

</script>

<canvas id="canvas" class='ani_hack' width="1920" height="768"> </canvas>
<div data-orientation="landscape" class="orientation-msg-container"><p class="orientation-msg-text">Please rotate your device</p></div>
<div id="block_game" style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%; display:none"></div>

</body>
</html>
