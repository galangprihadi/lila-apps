
class GameEngine {

    question = [
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9],
        [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
        [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
        [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
        [6, 1], [6, 2], [6, 3], [6, 4],
        [7, 1], [7, 2], [7, 3],
        [8, 1], [8, 2],
        [9, 1], 
    ];

    sounds = {
        transition: new Howl({
            src: "../sounds/transition.mp3",
        }),

        pop: new Howl({
            src: "../sounds/pop.mp3",
        }),

        cling: new Howl({
            src: "../sounds/cling.mp3",
        }),

        shake: new Howl({
            src: "../sounds/shake.mp3",
        }),

        wrong: new Howl({
            src: "../sounds/wrong.mp3",
        }),

        clap: new Howl({
            src: "../sounds/clap.mp3",
        }),

        // backsound: new Howl({
        //     src: "../sounds/winter-weather.mp3",
        //     loop: true,
        //     volume: 0.5,
        //     // autoplay: true,
        // }),
    }

    constructor () {
        this.sounds.transition.play();

        this.eCurtain = document.querySelector("#curtain");
        this.eQuests = document.querySelectorAll(".quest");
        this.ePinPannel = document.querySelector("#pin-wrapper");
        this.ePinText = this.ePinPannel.querySelector("#pin-text");
        this.ePinBtn = this.ePinPannel.querySelectorAll(".pin-btn");
        this.eScore = document.querySelector("#paper-score");
        this.btnHome = document.querySelector("#home-btn");

        this.numA = undefined;
        this.numB = undefined;
        this.answers = [];
        this.activeIndex = 0;
        this.checkQuests = [];

        this.generateQuestion();
        this.setButton();

        anime({
            targets: this.eCurtain,
            opacity: 0,
            duration: 500,
            easing: "easeInQuart",
            delay:200,
            begin: () => {
                this.eCurtain.style.pointerEvents = "none";
                this.ePinPannel.style.pointerEvents = "none";
                this.ePinPannel.style.opacity = 0;

                window.scrollTo({
                    top: 0,
                    left: 0,
                });
            },
            complete: () => {
                anime({
                    targets: this.eQuests,
                    translateY: [-80, 0],
                    opacity: [0, 1],
                    duration: 2000,
                    delay: anime.stagger(300, { start: 300 }),
                    easing: 'easeOutElastic(1, .6)' 
                });
            }
        });
    }


    generateQuestion() {
        // Shuffle questions
        for(let i=0; i < this.question.length; i++) {
            const rand = Math.floor(Math.random() * this.question.length);
            const temp = this.question[i];
            this.question[i] = this.question[rand];
            this.question[rand] = temp;
        }

        // Write questions (first)
        this.eQuests.forEach((quest, i) => {
            quest.textContent = `${this.question[i][0]} + ${this.question[i][1]} =`;
            this.checkQuests.push(false);
            this.answers.push(undefined);
        });
    }

    showQuestion() {
        let correct = 0;

        this.eQuests.forEach((quest, i) => {
            if (this.answers[i] == undefined){
                quest.textContent = `${this.question[i][0]} + ${this.question[i][1]} =`;
            }
            else {
                quest.textContent = `${this.question[i][0]} + ${this.question[i][1]} = ${this.answers[i]}`;

                if (this.question[i][0] + this.question[i][1] != this.answers[i]) {
                    quest.classList.add("wrong");
                }
                else {
                    quest.className = "quest";
                    correct += 1;
                }
            }
        });

        if (correct == this.eQuests.length) {
            setTimeout(() => {
                this.sounds.pop.play();
                this.eScore.style.opacity = 1;

                setTimeout(() => {
                    this.sounds.clap.play();
                }, 1000);
            }, 2000);
        }
    }


    setButton() {
        this.btnHome.addEventListener("click", () => {
            this.sounds.pop.play();

            anime({
                targets: this.btnHome,
                scale: [1, 1.5],
                direction: 'alternate',
                duration: 300,
                easing: 'easeInOutBack',
                complete: () => {
                    anime({
                        targets: this.eCurtain,
                        opacity: 1,
                        duration: 500,
                        easing: "easeInQuart",
                        begin: () => {
                            this.eCurtain.style.pointerEvents = "auto";
                        },
                        complete: () => {
                            window.location.replace("../index.html");
                        }
                    });
                }
            });
        });

        this.eQuests.forEach((quest, i) => {
            quest.addEventListener("click", () => {
                if (this.question[i][0] + this.question[i][1] != this.answers[i]) {
                    this.sounds.pop.play();

                    this.activeIndex = i;
                    this.ePinText.textContent = `${this.question[i][0]} + ${this.question[i][1]} =`;

                    anime({
                        targets: this.ePinPannel,
                        opacity: 1,
                        duration: 500,
                        easing: "easeInQuart",
                        begin: () => {
                            this.ePinPannel.style.pointerEvents = "auto";
                        },
                    });
                }
            });
        });

        this.ePinBtn.forEach((btn, i) => {
            btn.addEventListener("click", () => {
                this.answers[this.activeIndex] = i + 1;

                if (this.question[this.activeIndex][0] + this.question[this.activeIndex][1] == this.answers[this.activeIndex]) {
                    this.sounds.cling.play();
                }
                else {
                    this.sounds.wrong.play();
                }

                anime({
                    targets: this.ePinPannel,
                    opacity: 0,
                    duration: 500,
                    easing: "easeInQuart",
                    delay:200,
                    begin: () => {
                        this.ePinPannel.style.pointerEvents = "none";
                        this.showQuestion();
                    },
                });
            });
        });
    }
}

const game = new GameEngine();