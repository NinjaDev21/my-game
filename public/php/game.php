<?php
session_start();

require_once('api.inc.php');
$cfg = json_decode(file_get_contents('config/config.json'));
$response = array();

function CalcGame(){
	global $cfg;
    $isJP = 0;
    $isWin = 0;
    $win = 0;
    $jp = $cfg->wins[count($cfg->wins)-1]->win;
    $win_arr = array();
    $temp_win = $cfg->wins;
    for($i = 0; $i < count($temp_win); $i++){
        for($n = 0; $n < $temp_win[$i]->count; $n++){
            $win_arr[] = $temp_win[$i]->win;
            $temp_win_arr[] =$temp_win[$i]->win;
        }
    }
    shuffle($win_arr);
    $rand = mt_rand(0, count($win_arr)-1);
    $winnumber = $win_arr[$rand];
    $percent = 0;
    for($i = 0; $i < count($temp_win); $i++){
        if($temp_win[$i]->win == $winnumber){
            $percent = $temp_win[$i]->percent;
        }
    }
    $rand2 = mt_rand(0, 100);
    if($rand2 <= $percent){
        if($winnumber == $jp){
            $isJP = 1;
            $win = $jp;

        } else {
            $isWin = 1;
            $win = $winnumber;
        }
    }
    $result_arr = array();
    if($win != 0){
        for($i = 0; $i < 3; $i++){
            $result_arr[] = $winnumber;
        }
        shuffle($temp_win);
        for($i = 0; $i < 3; $i++){
            $result_arr[] = $temp_win[$i]->win;
        }
    } else {
        shuffle($temp_win);
        for($i = 0; $i < 6; $i++){
            $result_arr[] = $temp_win[$i]->win;
        }
    }
    shuffle($result_arr);
    $data = array(
    	'isWin' => $isWin,
    	'isJP' => $isJP,
    	'win' => $win,
    	'jp' => $jp,
    	'result' => $result_arr
    );
    return $data;
}
if(isset($_GET['u']) AND $_GET['u'] == 'calc'){
	$wins = 0;
	$bets = 0;
	$games = 0;
	$games_win = 0;

	$search_arr = array();
    $winsymbols = array();
    for($i = 0; $i < count($cfg->wins); $i++){
        $winsymbols[] = 0;
        $search_arr[] = $cfg->wins[$i]->win;
    }

	for($i = 0; $i < $_GET['games']; $i++){
		$game = CalcGame();
		$games++;
		$bets += $cfg->bet;
        if($game['isWin'] == 1){
            $pos = array_search($game['win'], $search_arr);
            $winsymbols[$pos]++;
        }
        elseif($game['isJP'] == 1) {
            $pos = count($cfg->wins)-1;
            $winsymbols[$pos]++;
        }
		if($game['win'] > 0){
			$wins += $game['win'];
			$games_win++;
		}
	}

	$response = array(
		'wins' => $wins,
		'bets' => $bets,
		'games' => $games,
		'games_win' => $games_win,
		'winsyms' => $winsymbols,
		'pos_wins' => $search_arr,
		'currency' => $cfg->currency
	);
}
elseif(API::CheckLogin() == true){
    if(isset($_GET['u'])){
        if($_GET['u'] == 'init'){
        	$c_chance = 0;
        	for($i = 0; $i < count($cfg->wins); $i++){
        		$c_chance += $cfg->wins[$i]->count;
        	}
            $response = array(
                'status' => 1,
                'decimal' => $cfg->decimal,
                'currency' => $cfg->currency,
                'credits' => API::getUserCredits(),
                'bet' => $cfg->bet,
                'wins' => $cfg->wins,
                'c_chance' => $c_chance,
                'jp' => $cfg->wins[count($cfg->wins)-1]->win
            );
        }
        elseif($_GET['u'] == 'game'){
        	$credits = API::getUserCredits();
        	if($credits >= $cfg->bet){
                $chk = API::writePool($cfg->bet, '');
                if($chk){
                    $game = CalcGame();
                    if($game['win'] > 0){
                        if($game['isJP'] == 1){
                            API::writeWin($game['win'], '');
                        } else {
                            API::writeWin($game['win'], '');
                        }
                    }
                    $response = array(
                        'credits' => $credits - $cfg->bet + $game['win'],
                        'old_credits' => $credits - $cfg->bet,
                        'win' => $game['win'],
                        'jp' => $game['jp'],
                        'isJP' => $game['isJP'],
                        'isWin' => $game['isWin'],
                        'numbers' => $game['result']
                    );
                } else {
                    $response = array(
                        'error' => 'msg_error_booking'
                    );
                }
            } else {
                $response = array(
                    'error' => 'msg_error_credits'
                );
            }
        } else {
            $response = array(
                'error' => 'msg_error_params'
            );
        }
    } else {
        $response = array(
            'error' => 'msg_error_params'
        );
    }
} else {
	$response = array(
		'error' => 'msg_error_login'
	);
}
echo json_encode($response);
?>