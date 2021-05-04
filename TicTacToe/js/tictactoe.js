// simple tic tac toe script

const gameboard = document.querySelectorAll(".block");
const print_winner = document.querySelector(".winner");
const reset_button = document.querySelector(".reset-game");
const chuck = document.querySelector(".chucknorris");

gameboard.forEach(function (block, index) {
    block.addEventListener('click', () => {
        game['ADD_MOVE'](index);
    });
});

reset_button.addEventListener('click', () => {
    game['RESET']();
});

chuck.addEventListener('click', () => {
    game['CHUCK']();
});

var x_effect = new Audio("C:/Users/xturb/formazione ws/TeamBlue/TeamBlue/TicTacToe/sound/xsound.mp3");
var o_effect = new Audio("C:/Users/xturb/formazione ws/TeamBlue/TeamBlue/TicTacToe/sound/osound.mp3");
var win_effect = new Audio("C:/Users/xturb/formazione ws/TeamBlue/TeamBlue/TicTacToe/sound/win.mp3");
var lose_effect = new Audio("C:/Users/xturb/formazione ws/TeamBlue/TeamBlue/TicTacToe/sound/lost.mp3");
var tie_effect = new Audio("C:/Users/xturb/formazione ws/TeamBlue/TeamBlue/TicTacToe/sound/tie.mp3");
const delay = ms => new Promise(res => setTimeout(res, ms));
const wait = async (ms) => {
    await delay(ms);
};

const game = {
    playboard: ["", "", "", "", "", "", "", "", ""],
    winners: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
    best_moves: [[4], [0, 2, 6, 8], [1, 3, 5, 7]],
    difficulty: {
        easy: [[4, 2, 5, 8], [0, 3, 7, 8], [1, 2, 5, 6]],
        medium: [[4], [1, 2, 6, 7], [0, 3, 5, 8]],
        hard: [[4], [0, 2, 6, 8], [1, 3, 5, 7]],
        chucknorris: false
    },
    turn: 1,
    winner: "",
    gameover: false,
    players: {
        '0': "O",
        '1': "X"
    },
    sound_effects: {
        X: x_effect,
        O: o_effect,
        win: win_effect,
        lose: lose_effect,
        tie: tie_effect
    },

    draw_func: function () { },

    INIT_DRAW(draw) {
        this.draw_func = draw;
    },

    IA_MOVE() {
        if (!this.gameover) {
            var checkmate = this.CHECK_POSSIBLE_CHECKMATE();
            if (checkmate !== false)
                this.MOVE(checkmate);
            else {
                if (this.difficulty['chucknorris']) {
                    if (this.DONTEVENTRY())
                        return;
                    else if (this.turn < 5) {
                        var lpattern = this.CHECK_L_PATTERN();
                        if (lpattern !== false) {
                            this.MOVE(lpattern);
                            return;
                        }
                    }
                } else {
                    let dice_roll = Math.floor(Math.random() * 2);
                    if (dice_roll) {
                        if (this.DONTEVENTRY())
                            return;
                    }
                }
                for (const best of this.best_moves) {
                    shuffleArray(best);
                    for (const move of best)
                        if (this.MOVE(move))
                            return;
                }
            }
        }
    },

    CHECK_POSSIBLE_CHECKMATE() {
        if (this.turn >= 3) {
            for (const player in this.players)
                for (const row of this.winners) {
                    var bestmove = this.CHECKMATE_CONDITION(row, this.players[player]);
                    if (bestmove !== false)
                        return bestmove;
                }
        }
        return false;
    },

    DONTEVENTRY() {
        if (this.playboard[0] === "X" && this.playboard[8] === "X") {
            this.MOVE(1);
            return true;
        }
        else if (this.playboard[2] === "X" && this.playboard[6] === "X") {
            this.MOVE(7);
            return true;
        }
        return false;
    },

    CHECK_L_PATTERN() {
        var l_pattern = [[6, 1], [0, 5], [2, 7], [8, 3], [1, 8], [5, 6], [7, 0], [3, 2]];
        var block_position = [0, 2, 8, 6, 2, 8, 6, 0];

        for (var i = 0; i < l_pattern.length; i++) {
            if (this.playboard[l_pattern[i][0]] === this.players['1'] && this.playboard[l_pattern[i][1]] === this.players['1'])
                return block_position[i];
        }
        return false;
    },

    CHECKMATE_CONDITION(row, player) {
        var checkmate_counter = 0;
        var empty_position = "";

        for (const col of row) {
            if (this.playboard[col] === player)
                checkmate_counter++;
            else if (!this.playboard[col])
                empty_position = col;
        }
        if (checkmate_counter === 2 && empty_position !== "")
            return empty_position;
        else
            return false;
    },
    MOVE(box_number) {
        if (!this.playboard[box_number] && !this.gameover) {
            this.playboard[box_number] = this.players[this.turn % 2];
            this.draw_func();
            this.GAMEOVER();
            return true;
        } else
            return false;
    },

    GAMEOVER() {
        if (this.CHECK_WIN_CONDITION()) {
            print_winner.innerHTML = `${this.winner}    WON! `;
            this.gameover = true;
            if (this.winner === "X")
                this.PLAYSOUND("win");
            else
                this.PLAYSOUND("lose");
        } else {
            this.turn++;
            if (this.turn > 9) {
                print_winner.innerHTML = "TIE!";
                this.PLAYSOUND("tie");
            }
        }
    },

    ADD_MOVE(box_number) {
        if (this.MOVE(box_number)) {
            this.PLAYSOUND("X");
            this.IA_MOVE();
            this.PLAYSOUND("O");
        }

    },

    READ_MOVE(index) {
        return this.playboard[index];
    },

    CHECK_WIN_CONDITION() {
        if (this.turn >= 5) {
            for (const row of this.winners) {
                if (this.CHECK_ROW(row)) {
                    this.winner = this.playboard[row[0]];
                    return true;
                }
            }
        } else
            return false;
    },

    CHECK_ROW(row) {
        for (const col of row) {
            if (this.playboard[col] === "")
                return false;
        }
        if ((this.playboard[row[0]] === this.playboard[row[1]]) && this.playboard[row[1]] === this.playboard[row[2]])
            return true;
        else
            return false;
    },

    RESET() {
        this.playboard = ["", "", "", "", "", "", "", "", ""];
        this.turn = 1;
        this.winner = "";
        this.gameover = false;
        print_winner.innerHTML = "";
        gameboard.forEach(function (block, index) {
            document.querySelector(`#block${index + 1}`).classList.remove("occupied");
        });
        this.draw_func();
    },

    PLAYSOUND(sound) {
        wait(800);
        this.sound_effects[sound].play();
    },

    CHUCK() {
        if (!this.difficulty['chucknorris']) {
            this.difficulty['chucknorris'] = true;
            chuck.classList.add("active");
        }
        else {
            this.difficulty['chucknorris'] = false;
            chuck.classList.remove("active");
        }
    }

}

function draw() {
    gameboard.forEach(function (block, index) {
        block.innerHTML = `${game['READ_MOVE'](index)}`;
        if (game['READ_MOVE'](index)) {
            document.querySelector(`#block${index + 1}`).classList.add("occupied");
        }
    });
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

game['INIT_DRAW'](draw);
