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
    return array.slice(0, 25);
}

function setTileTextAndColor(data) {
    for (var i = 0; i < data.length; i++) {
        document.getElementById(i + 1).innerHTML = data[i].text;
        toggleBorderColor(i + 1, data[i].difficulty);
    }
}

function prepareBoard(reset) {

    fetch("bingo_list.json").then(function (response) {
        return response.json();
    }).then(function (data) {
        var shuffledArray = shuffle(data);
        setTileTextAndColor(shuffledArray);
    }).catch(function (error) {
        console.log("error: " + error);
    });

    if (reset == true) {
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
    switch (difficulty) {
        case 1:
            document.getElementById(id).style.borderColor = "rgb(0, 202, 0)"
            document.getElementById("i" + id).innerHTML = "remove";
            break;
        case 2:
            document.getElementById(id).style.borderColor = "rgb(251 255 0)"
            document.getElementById("i" + id).innerHTML = "density_large";
            break;
        case 3:
            document.getElementById(id).style.borderColor = "rgb(255, 166, 0)"
            document.getElementById("i" + id).innerHTML = "density_medium";
            break;
        case 4:
            document.getElementById(id).style.borderColor = "rgb(202, 0, 0)"
            document.getElementById("i" + id).innerHTML = "density_small"
            break;
        default:
            document.getElementById("i" + id).style.borderColor = "black"
            document.getElementById("i" + id).innerHTML = ""
    }
}

function toggleBorder() {
    for (var i = 0; i < 25; i++) {
        var elem = document.getElementsByClassName("board-cell");
        elem[i].classList.toggle("no-border")
    }
}

function resetBackgroundColor() {
    console.log(document.getElementsByClassName("board-cell"));
    for (var i = 0; i < 25; i++) {
        var elem = document.getElementsByClassName("board-cell");
        elem[i].style.background = "";
    }
}

function toggleIcons() {
    for (var i = 0; i < 25; i++) {
        var elem = document.getElementsByClassName("material-symbols-outlined");
        elem[i].classList.toggle("display-none");
    }
}