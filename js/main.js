let startButton = document.querySelector('#start-button')
let stopButton = document.querySelector('#stop-button')
let resetButton = document.querySelector('#reset-button')
let saveButton = document.querySelector('#save-button')

let arrowsDisplay = document.querySelectorAll('.arrow-display')

let greenNumber = document.querySelector('#green-number')

let bpm = document.querySelector('#bpm')
let keyIntervalValue = document.querySelector('#key-interval').value

let keyInterval = document.querySelector('#key-interval')

let isSrand = document.querySelector('#is-srand')
let zeroArrowRatio = document.querySelector('#zero-arrow-ratio')
let oneArrowRatio = document.querySelector('#one-arrow-ratio')
let twoArrowRatio = document.querySelector('#two-arrow-ratio')


let started = false

window.onload = () => {
    let ddrSettingSaveData = JSON.parse(localStorage.getItem('ddrSettingSaveData'))
    if (ddrSettingSaveData) {
        console.log(ddrSettingSaveData)
        greenNumber.value = ddrSettingSaveData.greenNumberValue
        bpm.value = ddrSettingSaveData.bpmValue
        keyInterval.value = ddrSettingSaveData.keyIntervalValue
        isSrand.checked = ddrSettingSaveData.isSrandChecked
        zeroArrowRatio.value = ddrSettingSaveData.zeroArrowRatioValue
        oneArrowRatio.value = ddrSettingSaveData.oneArrowRatioValue
        twoArrowRatio.value = ddrSettingSaveData.twoArrowRatioValue
    }
}


// ノーツの個数を選択
const selectArrowsNum = (arrows_rate_list) => { // 0arrowsから2arrowsまでのそれぞれ出てくる確率を配列で渡す
    let arrows_list = [] // 確率の数だけarrowsを入れる
    for (let i = 0; i < 3; i++) {
        let arrows = arrows_rate_list[i]
        for (let j = 0; j < arrows; j++) {
            arrows_list.push(i)
        }
    }
    if (arrows_list.length === 0) {
        return -1
    }
    let n = arrows_list.length
    let arrows_num = arrows_list[Math.floor(Math.random() * n)]
    return arrows_num
}

// 重複なしでノーツを選択
let pre_select_arrows = []
const selectArrows = (arrows_num) => {
    let select_arrows = []
    while (select_arrows.length < arrows_num) {
        let arrow = Math.floor(Math.random() * 4)
        if (select_arrows.indexOf(arrow) === -1 && pre_select_arrows.indexOf(arrow) === -1) {
            select_arrows.push(arrow)
        }
    }
    pre_select_arrows = select_arrows
    return select_arrows
}

// 重複ありでノーツを選択
const sSelectArrows = (arrows_num) => {
    let select_arrows = []
    while (select_arrows.length < arrows_num) {
        let arrow = Math.floor(Math.random() * 4)
        if (select_arrows.indexOf(arrow) === -1) {
            select_arrows.push(arrow)
        }
    }
    return select_arrows
}


// 以下は各ボタンの処理

startButton.addEventListener('click', () => {
    if (started) {
        return
    }
    // ノーツの割合を取得
    let zeroArrowRatioValue = document.querySelector('#zero-arrow-ratio').value
    let oneArrowRatioValue = document.querySelector('#one-arrow-ratio').value
    let twoArrowRatioValue = document.querySelector('#two-arrow-ratio').value
    // 緑数字
    let greenNumber = document.querySelector('#green-number').value
    // BPM, 1小節の拍数
    let bpm = document.querySelector('#bpm').value
    let keyIntervalValue = document.querySelector('#key-interval').value
    let keyIntervalTime = 240000 / bpm / keyIntervalValue

    // S乱かどうか
    let isSrand = document.querySelector('#is-srand').checked

    // 
    let noteAnimation = [
        { top: "80%" },
        { top: "0" },
    ];

    started = true
    let si = setInterval(()=> {
        if (!started) {
            clearInterval(si);// インターバルを止める
            return
        }
        // ノーツの作成
        // 0arrowsから2arrowsまでのそれぞれ出てくる確率を配列で渡す
        let arrows_rate_list = [zeroArrowRatioValue, oneArrowRatioValue, twoArrowRatioValue]
        let arrows_num = selectArrowsNum(arrows_rate_list)
        if (arrows_num === -1) {
            console.log('矢印の個数それぞれの割合を入力してください')
            return
        }
        let select_arrows = []
        if (isSrand) {
            select_arrows = sSelectArrows(arrows_num)
        } else {
            select_arrows = selectArrows(arrows_num)
        }
        let speed = greenNumber * 1000 / 600
        arrowsDisplay.forEach((arrowDisplay,i) => {
            if (select_arrows.indexOf(i) === -1) {
                return
            }
            // ノーツの見た目
            let newArrow = document.createElement("img");
            newArrow.src = `./img/arrow.png`
            newArrow.alt = 'arrow'
            newArrow.classList.add('arrow')
            newArrow.animate(noteAnimation, {
                duration: speed, // 何秒見えるか
            })

            arrowDisplay.appendChild(newArrow)
            setTimeout(function () {
                newArrow.remove();
            }, speed);
        })
    }, keyIntervalTime)
})

stopButton.addEventListener('click', () => {
    started = false
})

resetButton.addEventListener('click', () => {
    document.querySelector('#green-number').value = 330; 
    
    document.querySelector('#bpm').value = 150;
    document.querySelector('#key-interval').value = 4;
    
    document.querySelector('#is-srand').checked = false;

    document.querySelector('#zero-arrow-ratio').value = 0;
    document.querySelector('#one-arrow-ratio').value = 0;
    document.querySelector('#two-arrow-ratio').value = 0;
})

saveButton.addEventListener('click', () => {
    let ddrSettingSaveData = {
        greenNumberValue: document.querySelector('#green-number').value,
        bpmValue: document.querySelector('#bpm').value,
        keyIntervalValue: document.querySelector('#key-interval').value,
        isSrandChecked: document.querySelector('#is-srand').checked,
        zeroArrowRatioValue: document.querySelector('#zero-arrow-ratio').value,
        oneArrowRatioValue: document.querySelector('#one-arrow-ratio').value,
        twoArrowRatioValue: document.querySelector('#two-arrow-ratio').value,
    }
    localStorage.setItem('ddrSettingSaveData', JSON.stringify(ddrSettingSaveData))
})