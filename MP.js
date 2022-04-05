const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const mpApis = "http://localhost:3000/songs";
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const songs = $$('.song');
const playlist = $('.playlist');

class app {
    constructor() {
        this.isPlaying = true;
        this.currentIndex = 0;
        this.isRandom = false;
        this.isRepeat = false;
        this.songs = [{
                id: 1,
                name: "Hoa hải đường",
                singer: "J97",
                path: "./audio/hoa-hai-duong.mp3",
                image: "./images/hoa-hai-duong.jpeg"
            },
            {
                name: "Thiên đàng",
                singer: "Wowy",
                path: "./audio/thien-dang.mp3",
                image: "./images/thien-dang.jpeg",
                id: 2
            },
            {
                name: "Rồi tới luôn",
                singer: "Ukn",
                path: "./audio/roi-toi-luon.mp3",
                image: "./images/roi-toi-luon.jpeg",
                id: 3
            },
            {
                name: "Thương nhau tới bến",
                singer: "Ukn",
                path: "./audio/thuong-nhau-toi-ben.mp3",
                image: "./images/thuong-nhau-toi-ben.jpeg",
                id: 4
            },
            {
                name: "Sầu hồng gai",
                singer: "Ukn",
                path: "./audio/sau-hong-gai.mp3",
                image: "./images/sau-hong-gai.jpeg",
                id: 5
            }
        ];
    }

    getSongs(callback) {
        fetch(mpApis)
            .then(function(response) {
                return response.json();
            })
            .then(callback)
    }
    render() {
        let htmls = this.songs.map((song, index) => {
            return `
                        <div data-index="${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                        </div>
                        </div>
                    `;
        });
        return $('.playlist').innerHTML = htmls.join("");
    }
    definedProperties() {
        Object.defineProperty(this, "currentSong", {
            get() {
                return this.songs[this.currentIndex];
            }
        })
    }

    handleEvents() {
        const _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        document.onscroll = function() {
            const newCd = cdWidth - window.scrollY;
            cd.style.width = newCd > 0 ? newCd + "px" : 0;
            cd.style.opacity = newCd / cdWidth;
        }
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        }
        audio.onplay = () => {
            $('.player').classList.add('playing');
            _this.isPlaying = false;
            cdThumbAnimate.play();
        }
        audio.onpause = () => {
            $('.player').classList.remove('playing');
            _this.isPlaying = true;
            cdThumbAnimate.pause();
        }

        audio.ontimeupdate = (e) => {
            if (audio.duration) {
                const percent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = percent;
            }
        }
        progress.onchange = () => {
            audio.currentTime = progress.value / 100 * audio.duration;
        }
        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.currentIndex++;
                if (_this.currentIndex >= _this.songs.length)
                    _this.currentIndex = 0
                _this.loadCurrentSong();
                audio.play();
            }
            cdThumbAnimate.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        prevBtn.onclick = () => {
            _this.currentIndex--;
            if (_this.currentIndex < 0)
                _this.currentIndex = _this.songs.length - 1;
            _this.loadCurrentSong();
            audio.play();
            cdThumbAnimate.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        randBtn.onclick = () => {
            const rd = _this.isRandom = !_this.isRandom;
            randBtn.classList.toggle("active", rd);
        }
        repeatBtn.onclick = () => {
            const rp = _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", rp);
        }

        audio.onended = () => {
            if (_this.isRepeat)
                _this.repeatSong();
            else
                nextBtn.click();
        }

        playlist.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                }

            }
        }

    }
    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    }
    randomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        audio.play();
    }

    repeatSong() {
        let index = this.currentIndex;
        this.currentIndex = index;
        this.loadCurrentSong();
        audio.play();
    }


    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    }


    start() {
        this.definedProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}

const appStart = new app();
appStart.start();