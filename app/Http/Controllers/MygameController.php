<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MygameController extends Controller
{
    function index(){
        return view('my-game', ['name' => 'James']);
    }

    function showAGame(){
        return view('game', ['name' => '3Game Monte']);
    }

    function startGameSession(Request $request){
        print_r($request->all());
        echo "Hi i will record when game is starting ....  ";
    }

    function endGameSession(Request $request){
        echo "Hi i will record data when game is ending ....";
        print_r($request->all());
    }

    function restartGameLevel(Request $request){
        echo "Hi i will record when game level is restarting ....";
        print_r($request->all());
    }

    function saveGameScore(Request $request){
        echo "Hi i will record data when game score needs to save ....";
        print_r($request->all());
    }

    function startGameLevel(Request $request) {
        echo "Hi i will record data when game Lavel is started .... ";
        print_r($request->all());
    }

    function endGameLevel(Request $request) {
        echo "Hi i will record data when game Lavel is ends .... ";
        print_r($request->all());
    }

    function showScratchAndWinGame() {
        return view('show-scratch-and-win-game', ['name' => '3Game Monte']);
    }

    function scratchAndWinGame(){
        return view('scratch-and-win-game', ['name' => '3Game Monte']);
    }

}
