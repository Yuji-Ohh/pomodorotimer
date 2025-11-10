const body = document.body; 

const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('short-break-btn');

const timeDisplay = document.getElementById('time-display');

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

const alarmSound = document.getElementById('alarm-sound');
const memeSound = document.getElementById('meme-sound'); 


//　タイマーの状態

let timer; 
let timeLeft; 
let isPaused = true; 
let currentMode = 'pomodoro'; 

const pomodoroTime = 25 * 60; // 25分
const breakTime = 3 * 60; // 3分


//　アラームの再生回数
let alarmPlayCount = 0;
let memePlayCount = 0;
const maxPlayCount = 3;

// スマホの音声ロックが解除されたか
let isAudioUnlocked = false;


// 必要な関数

// 1, 時間表示を更新する関数
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60; 
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 2, モードを切り替える関数
function switchMode(mode) {
    currentMode = mode; 
    
    if (mode === 'pomodoro') {
        timeLeft = pomodoroTime;
        body.className = 'pomodoro-mode'; 
        pomodoroBtn.classList.add('active'); 
        shortBreakBtn.classList.remove('active'); 
    } else {
        timeLeft = breakTime;
        body.className = 'break-mode'; 
        shortBreakBtn.classList.add('active');
        pomodoroBtn.classList.remove('active');
    }
    updateDisplay(); 
}

// 3, アラーム音をすべて停止する関数
function stopAllAlarms() {
    // 音を止めて、再生位置とカウントをリセット
    memeSound.pause();
    memeSound.currentTime = 0;
    memePlayCount = 0;

    // 通常アラームを止めて、カウントをリセット
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmPlayCount = 0;
}

// スマホの音声制限を解除する関数
function unlockAudio() {
    if (isAudioUnlocked) return; // 1回だけ実行

    try {
        alarmSound.play();
        alarmSound.pause();
        alarmSound.currentTime = 0;
        
        memeSound.play();
        memeSound.pause();
        memeSound.currentTime = 0;

        isAudioUnlocked = true;
        console.log("オーディオのロックを解除しました。");
    } catch (e) {
        console.error("オーディオのアンロックに失敗:", e);
    }
}


//4, タイマーをスタートさせる関数
function startTimer() {
    // 鳴っているアラームを止めてからスタート
    stopAllAlarms(); 
    
    if (isPaused) { 
        isPaused = false; 

        timer = setInterval(() => {
            timeLeft--; 
            updateDisplay(); 

            if (timeLeft <= 0) {
                clearInterval(timer); 
                isPaused = true; 

                if (currentMode === 'pomodoro') {
                    alarmPlayCount = 1; // 1回目の再生
                    alarmSound.play(); 
                    switchMode('break'); 
                } else {
                    memePlayCount = 1; // 1回目の再生
                    memeSound.play(); 
                    switchMode('pomodoro'); 
                }
            }
        }, 1000);
    }
}

//5, タイマーを一時停止する関数
function pauseTimer() {
    clearInterval(timer); 
    isPaused = true; 
    // 一時停止したらアラームも止める
    stopAllAlarms(); 
}

//6, タイマーをリセットする関数
function resetTimer() {
    clearInterval(timer); 
    isPaused = true; 
    // リセットしたらアラームも止める
    stopAllAlarms(); 
    
    timeLeft = (currentMode === 'pomodoro') ? pomodoroTime : breakTime;
    updateDisplay(); 
}


//ボタンが押された時に、作った関数を呼び出す
startBtn.addEventListener('click', () => {
    unlockAudio(); // アンロック
    startTimer();
});

pauseBtn.addEventListener('click', () => {
    unlockAudio(); // アンロック
    pauseTimer();
});

resetBtn.addEventListener('click', () => {
    unlockAudio(); // アンロック
    resetTimer();
});

pomodoroBtn.addEventListener('click', () => {
    unlockAudio(); // アンロック
    pauseTimer(); 
    switchMode('pomodoro'); 
});

shortBreakBtn.addEventListener('click', () => {
    unlockAudio(); // アンロック
    pauseTimer(); 
    switchMode('break'); 
});

switchMode('pomodoro');


// ミーム

// 通常アラームが終了した時
alarmSound.addEventListener('ended', () => {
    if (alarmPlayCount > 0 && alarmPlayCount < maxPlayCount) {
        alarmPlayCount++;
        alarmSound.play();
    } else {
        alarmPlayCount = 0;
    }
});

// ミーム音声が終了した時
memeSound.addEventListener('ended', () => {
    if (memePlayCount > 0 && memePlayCount < maxPlayCount) {
        memePlayCount++;
        memeSound.play();
    } else {
        memePlayCount = 0;
    }
});