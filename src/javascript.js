String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
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

function setTileTextAndColor(data) {
    for (var i = 0; i < data.length; i++) {
        document.getElementById(i + 1).innerHTML = data[i].text;
        toggleBorderColor(i + 1, data[i].difficulty);
    }
}

function prepareBoard(reset) {
    var storedBoard = localStorage.getItem("currentBoard");

    if (reset == false && storedBoard) {
        setTileTextAndColor(JSON.parse(storedBoard));
    } else {
        fetch("bingo_list.json").then(function (response) {
            return response.json();
        }).then(function (data) {
            var shuffledArray = shuffle(data);
            localStorage.setItem("currentBoard", JSON.stringify(shuffledArray));
            setTileTextAndColor(shuffledArray);
        }).catch(function (error) {
            console.log("error: " + error);
        });

        resetBackgroundColor();
    }
}

function toggleTileColor(id) {
    document.getElementById(id).onclick = function (event) {
        var defaultBG = "none";
        var marked = "rgba(37, 84, 192, 0.17)";
        var done = "rgb(20, 175, 154)";

        switch (document.getElementById(id).style.background) {
            case defaultBG:
            case "":
                document.getElementById(id).style.background = marked;
                break;
            case marked:
                document.getElementById(id).style.background = done;
                break;
            case done:
                document.getElementById(id).style.background = "";
                break;
            default:
                document.getElementById(id).style.background = "";
        }
    }
}

function toggleBorderColor(id, difficulty) {

    var easy = "circle";
    var medium = "circle";
    var hard = "circle";
    var insane = "circle";
    
    var easyColor = "rgb(0, 202, 0)";
    var mediumColor = "rgb(251 255 0)";
    var hardColor = "rgb(255, 166, 0)";
    var insaneColor = "rgb(202, 0, 0)";

    switch (difficulty) {
        case 1:
            document.getElementById(id).style.borderColor = easyColor;
            document.getElementById("i" + id).innerHTML = easy;
            document.getElementById("i" + id).style.color = easyColor;
            break;
        case 2:
            document.getElementById(id).style.borderColor = mediumColor;
            document.getElementById("i" + id).innerHTML = medium;
            document.getElementById("i" + id).style.color = mediumColor;
            break;
        case 3:
            document.getElementById(id).style.borderColor = hardColor;
            document.getElementById("i" + id).innerHTML = hard;
            document.getElementById("i" + id).style.color = hardColor;
            break;
        case 4:
            document.getElementById(id).style.borderColor = insaneColor;
            document.getElementById("i" + id).innerHTML = insane;
            document.getElementById("i" + id).style.color = insaneColor;
            break;
        default:
            document.getElementById("i" + id).style.borderColor = "black";
            document.getElementById("i" + id).innerHTML = "";
    }
}

function toggleBorder() {
    for (var i = 0; i < 25; i++) {
        var elem = document.getElementsByClassName("board-cell");
        elem[i].classList.toggle("no-border")
    }
}

function resetBackgroundColor() {
    for (var i = 0; i < 25; i++) {
        var elem = document.getElementsByClassName("board-cell");
        elem[i].style.background = "";
    }
}

function toggleIcons() {
    for (var i = 0; i < 25; i++) {
        var elem = document.getElementsByClassName("material-icons");
        elem[i].classList.toggle("display-none");
    }
}

function getSeed() 
{
    var storedBoard = localStorage.getItem("currentBoard");
    document.getElementById("seed").innerHTML = storedBoard.hexEncode();
}

function readSeed() {
    var input = document.getElementById('seedInput').value.trim();
    var input = input.hexDecode();
    setTileTextAndColor(JSON.parse(input));
}
