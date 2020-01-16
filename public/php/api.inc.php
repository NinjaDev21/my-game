<?php
class API{

	protected static $userid;

	public function __construct(){
		self::$gamename = '';
		self::$userid = 0;
	}

    public static function CheckLogin(){
    	/*
    		Check is user and isset SESSION
    	*/
    	self::$userid = 1;
    	return true;
    }

	public static function getUserCredits(){
		/*
			Return the credits from a user
		*/
		global $cfg;
		if(!isset($_SESSION['Credits'])){
			$credits = 1000;
			$_SESSION['Credits'] = $credits;
		} else {
			if($_SESSION['Credits'] <= $cfg->bet){
				$_SESSION['Credits'] = 1000;
			}
			$credits = $_SESSION['Credits'];
		}
		return $credits;
	}

	public static function writePool($amount, $desc){
		/*
			Draw the bet price
		*/
        $_SESSION['Credits'] -= $amount;
        return true;
	}

	public static function writeWin($amount, $desc){
		/*
			Withdraw the win
		*/
        $_SESSION['Credits'] += $amount;
        return true;
	}
}
?>