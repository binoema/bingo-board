let board;

String.prototype.hexEncode = function () {
    let hex, i;

    let result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }

    return result;
}

String.prototype.hexDecode = function () {
    let j;
    let hexes = this.match(/.{1,4}/g) || [];
    let back = "";
    for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    // Only need the 25 items for the board to display
    return array.slice(0, 25);
}

function setTileTextAndColor() {
    for (let i = 0; i < globalThis.board.length; i++) {
        document.getElementById(i + 1).innerHTML = globalThis.board[i].text;
        toggleDifficulty(i + 1, globalThis.board[i].difficulty);

        if (globalThis.board[i].amount > 0) {
            if (!globalThis.board[i].count) {
                globalThis.board[i].count = 0;
            }
            addCounter(i + 1, globalThis.board[i]);
        }

    }
}

function randomizeBoard(reset) {
    let storedBoard = localStorage.getItem("currentBoard");
    globalThis.board = JSON.parse(storedBoard);

    if (reset == false) addEvents();

    if (reset == false && storedBoard) {
        setTileTextAndColor();
    } else {
        fetch("bingo_list.json").then(function (response) {
            return response.json();
        }).then(function (data) {
            let shuffledArray = shuffle(data);
            localStorage.setItem("currentBoard", JSON.stringify(shuffledArray));
            globalThis.board = shuffledArray;
            setTileTextAndColor();
        }).catch(function (error) {
            console.log("error: " + error);
        });
        resetAllCounter();
        resetBackgroundColor();
        resetFavoriteIcons();
    }
}

function toggleTileColor(id) {
    let marked = "rgba(37, 84, 192, 0.17)";
    let done = "rgb(20, 175, 154)";
    let taskCompleted = false;

    if (globalThis.board[id - 1]?.amount > 0 && globalThis.board[id - 1]?.amount > globalThis.board[id - 1]?.count) {
        taskCompleted = handleCounter(id - 1);
    } else if (globalThis.board[id - 1]?.amount && globalThis.board[id - 1]?.count && globalThis.board[id - 1]?.amount == globalThis.board[id - 1]?.count) {
        taskCompleted = false;
        resetCounter(id - 1);
    } else {
        taskCompleted = true;
    }

    switch (document.getElementById(id).style.background) {
        case "":
        case marked:
            if (taskCompleted) {
                document.getElementById(id).style.background = done;
            };
            break;
        case done:
            document.getElementById(id).style.background = "";
            break;
        default:
            document.getElementById(id).style.background = "";
    }
}

function handleCounter(id) {
    globalThis.board[id].count = (globalThis.board[id].count + 1)
    document.getElementById((id + 1) + 'c').innerHTML = `${globalThis.board[id].count} / ${globalThis.board[id].amount}`;
    return globalThis.board[id]?.count >= globalThis.board[id].amount;
}

function resetCounter(id) {
    globalThis.board[id].count = 0;
    document.getElementById((id + 1) + 'c').innerHTML = `0 / ${globalThis.board[id].amount}`;
}

function resetAllCounter() {
    let allCounter = document.getElementsByClassName("counter");
    for (var i = allCounter.length - 1; i >= 0; i--) {
        allCounter[i].remove();
    }
}

function toggleDifficulty(id, difficulty) {

    let easy = "circle";
    let medium = "circle";
    let hard = "circle";
    let insane = "skull";

    let easyColor = "rgb(0, 202, 0)";
    let mediumColor = "rgb(251 255 0)";
    let hardColor = "rgb(255, 166, 0)";
    let insaneColor = "rgb(202, 0, 0)";

    switch (difficulty) {
        case 1:
            document.getElementById("i" + id).innerHTML = easy;
            document.getElementById("i" + id).style.color = easyColor;
            break;
        case 2:
            document.getElementById("i" + id).innerHTML = medium;
            document.getElementById("i" + id).style.color = mediumColor;
            break;
        case 3:
            document.getElementById("i" + id).innerHTML = hard;
            document.getElementById("i" + id).style.color = hardColor;
            break;
        case 4:
            document.getElementById("i" + id).innerHTML = insane;
            document.getElementById("i" + id).style.color = insaneColor;
            break;
        default:
            document.getElementById("i" + id).style.borderColor = "black";
            document.getElementById("i" + id).innerHTML = "";
    }
}

function resetBackgroundColor() {
    for (let i = 0; i < 25; i++) {
        let elem = document.getElementsByClassName("board-cell");
        elem[i].style.background = "";
        elem[i].classList.remove("marked");
    }
}

function resetFavoriteIcons() {
    for (let i = 1; i <= 25; i++) {
        document.getElementById("i" + i + "s").innerHTML = "";
        document.getElementById("i" + i + "s").classList.remove("favorite");
    }
}

function toggleIcons() {
    for (let i = 1; i <= 25; i++) {
        document.getElementById("i" + i).classList.toggle("display-none");
    }
}

function addHighlightRow(id) {
    let elem = document.getElementsByClassName("board-cell");

    let i = (id - 1) * 5;

    while (i < (id * 5)) {
        elem[i].classList.add("highlight");
        i += 1;
    }
}

function removeHighlightRow(id) {
    let elem = document.getElementsByClassName("board-cell");

    let i = (id - 1) * 5;

    while (i < (id * 5)) {
        elem[i].classList.remove("highlight");
        i += 1;
    }
}

function addHighlightColumn(id) {
    let elem = document.getElementsByClassName("board-cell");

    let i = id - 1;

    while (i < (id + 20)) {
        elem[i].classList.add("highlight");
        i += 5;
    }
}

function removeHighlightColumn(id) {
    let elem = document.getElementsByClassName("board-cell");

    let i = id - 1;

    while (i < (id + 20)) {
        elem[i].classList.remove("highlight");
        i += 5;
    }
}

function addHighlightDiagonal(corner) {
    let elem = document.getElementsByClassName("board-cell");

    let i = corner == "top" ? 0 : 20;
    let counter = 0;

    while (i < elem.length && counter < 5) {
        elem[i].classList.add("highlight");
        i = corner == "top" ? i + 6 : i - 4;
        counter += 1;
    }
}

function removeHighlightDiagonal(corner) {
    let elem = document.getElementsByClassName("board-cell");

    let i = corner == "top" ? 0 : 20;
    let counter = 0;

    while (i < elem.length && counter < 5) {
        elem[i].classList.remove("highlight");
        i = corner == "top" ? i + 6 : i - 4;
        counter += 1;
    }
}

function getSeed() {
    let storedBoard = JSON.stringify(globalThis.board);
    document.getElementById("seed").innerHTML = storedBoard.hexEncode();
}

function readSeed() {
    // Remove whitespaces
    let input = document.getElementById('seedInput').value.trim();
    input = input.hexDecode();
    globalThis.board = JSON.parse(input);
    resetAllCounter();
    resetBackgroundColor();
    setTileTextAndColor();
}

function addEvents() {
    let list = document.getElementsByClassName("board-cell-wrapper");
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('auxclick', (e) => {
            if (e.button == 2) {
                toggleFavorite(i + 1);
            }
        })
    }
}

function toggleFavorite(id) {
    switch (document.getElementById("i" + id + "s").innerHTML) {
        case "star":
            document.getElementById("i" + id + "s").innerHTML = "close";
            document.getElementById("i" + id + "s").classList.remove("favorite");
            document.getElementById("i" + id + "s").classList.add("denied");
            break;
        case "close":
            document.getElementById("i" + id + "s").innerHTML = "";
            document.getElementById("i" + id + "s").classList.remove("favorite");
            break;
        default:
            document.getElementById("i" + id + "s").innerHTML = "star";
            document.getElementById("i" + id + "s").classList.remove("denied");
            document.getElementById("i" + id + "s").classList.add("favorite");
            break;
    }
}

function addCounter(id, element) {
    let counterSpan = document.createElement('span');
    counterSpan.setAttribute("id", id + 'c');
    counterSpan.classList.add("counter");
    document.getElementById(id).parentElement.appendChild(counterSpan);
    document.getElementById(id + 'c').innerHTML = `${element.count} / ${element.amount}`;
}