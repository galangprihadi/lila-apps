
class Menu {

    sounds = {
        transition: new Howl({
            src: "../sounds/transition.mp3",
        }),

        pop: new Howl({
            src: "../sounds/pop.mp3",
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
        this.eLogo = document.querySelector("#logo");
        this.eButton = document.querySelectorAll("#menu button");
        
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
                    targets: [this.eLogo, ...this.eButton],
                    translateY: [-80, 0],
                    opacity: [0, 1],
                    duration: 2000,
                    delay: anime.stagger(300, { start: 300 }),
                    easing: 'easeOutElastic(1, .6)' 
                });
            }
        });
    }

    moveTo(path) {
        this.sounds.pop.play();
        
        anime({
            targets: this.eCurtain,
            opacity: 1,
            duration: 500,
            easing: "easeInQuart",
            begin: () => {
                this.eCurtain.style.pointerEvents = "auto";
            },
            complete: () => {
                window.location.replace(path);
            }
        });
    }
}

const menu = new Menu();