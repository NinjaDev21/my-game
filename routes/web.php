<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/my-game', 'MygameController@index');
Route::get('/game', 'MygameController@showAGame');
Route::post('/start-game-session', 'MygameController@startGameSession');
Route::post('/end-game-session', 'MygameController@endGameSession');
Route::post('/restart-game-level', 'MygameController@restartGameLevel');
Route::post('/save-game-score', 'MygameController@saveGameScore');
Route::post('/start-game-level', 'MygameController@startGameLevel');
Route::post('/end-game-level', 'MygameController@endGameLevel');
Route::get('/scratch-and-win-game', 'MygameController@scratchAndWinGame');
Route::get('/show-scratch-and-win-game', 'MygameController@showScratchAndWinGame');





