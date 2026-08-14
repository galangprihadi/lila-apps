
class GameEngine {

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
        this.eButtons = document.querySelectorAll(".matching-btn");
        this.btnHome = document.querySelector("#home-btn");

        this.questImage = "../images/question.png";
        this.btnImages = [];
        this.firstOpened = null;
        this.btnReady = true;
        this.correct = 0;

        this.setImages();
        this.setButton();

        anime({
            targets: this.eCurtain,
            opacity: 0,
            duration: 500,
            easing: "easeInQuart",
            delay:200,
            begin: () => {
                this.eCurtain.style.pointerEvents = "none";

                window.scrollTo({
                    top: 0,
                    left: 0,
                });
            },
            complete: () => {
                anime({
                    targets: this.eButtons,
                    translateY: [-80, 0],
                    opacity: [0, 1],
                    duration: 2000,
                    delay: anime.stagger(200, { start: 200 }),
                    easing: 'easeOutElastic(1, .6)' 
                });
            }
        });
    }

    setImages() {

        this.imagePaths = [
            "../images/animal1.png",
            "../images/animal2.png",
            "../images/animal3.png",
            "../images/animal4.png",
            "../images/animal5.png",
            "../images/animal6.png",
            "../images/animal7.png",
            "../images/animal8.png",
            "../images/animal9.png",
            "../images/animal10.png",
        ];

        // Shuffle image paths
        for (let i=0; i < this.imagePaths.length; i++) {
            const rand = Math.floor(Math.random() * this.imagePaths.length);
            const temp = this.imagePaths[i];
            this.imagePaths[i] = this.imagePaths[rand];
            this.imagePaths[rand] = temp;
        }

        // Set button images
        for (let i=0; i < this.eButtons.length/2; i++) {
            this.btnImages[i] = this.imagePaths[i];
            this.btnImages[i + (this.eButtons.length/2)] = this.imagePaths[i];
        }

        // Shuffle button images
        for (let i=0; i < this.eButtons.length; i++) {
            const rand = Math.floor(Math.random() * this.eButtons.length);
            const temp = this.btnImages[i];
            this.btnImages[i] = this.btnImages[rand];
            this.btnImages[rand] = temp;
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


        this.eButtons.forEach((btn, i) => {
            btn.addEventListener("click", () => {

                if (this.btnReady && this.btnImages[i] != null && this.firstOpened != i) {
                    this.sounds.pop.play();
                    this.btnReady = false;

                    setTimeout(() => {
                        btn.style.backgroundImage = `url('${this.btnImages[i]}')`;
                    }, 150);

                    anime({
                        targets: btn,
                        scale: [1, 1.2],
                        direction: 'alternate',
                        duration: 300,
                        easing: 'easeInOutBack',
                    });

                    if (this.firstOpened == null) {
                        this.firstOpened = i;

                        setTimeout(() => {
                            this.btnReady = true;
                        }, 300);
                    }
                    else {
                        if (this.btnImages[this.firstOpened] != this.btnImages[i]) {
                            setTimeout(() => {
                                this.sounds.pop.play();

                                anime({
                                    targets: [btn, this.eButtons[this.firstOpened]],
                                    scale: [1, 1.2],
                                    direction: 'alternate',
                                    duration: 300,
                                    easing: 'easeInOutBack',
                                    complete: () => {
                                        this.btnReady = true;
                                    }
                                });
                            }, 1000);

                            setTimeout(() => {
                                btn.style.backgroundImage = `url('${this.questImage}')`;
                                this.eButtons[this.firstOpened].style.backgroundImage = `url('${this.questImage}')`;
                                this.firstOpened = null;
                            }, 1150);
                        }
                        else {
                            setTimeout(() => {
                                this.sounds.cling.play();

                                anime({
                                    targets: [btn, this.eButtons[this.firstOpened]],
                                    scale: [1, 1.2],
                                    direction: 'alternate',
                                    duration: 300,
                                    easing: 'easeInOutBack',
                                });

                                this.btnImages[this.firstOpened] = null;
                                this.btnImages[i] = null;
                                this.firstOpened = null;
                                this.btnReady = true;

                                this.correct += 1;

                                if (this.correct == this.eButtons.length/2) {
                                    setTimeout(() => {
                                        this.sounds.clap.play();

                                        anime({
                                            targets: this.eButtons,
                                            scale: [1, 1.2],
                                            direction: 'alternate',
                                            duration: 300,
                                            easing: 'easeInOutBack',
                                        });
                                    }, 1000);
                                }
                            }, 500);
                        }
                    }

                    console.log(this.btnImages[i]);
                }
            });
        });
    }
}

const game = new GameEngine();