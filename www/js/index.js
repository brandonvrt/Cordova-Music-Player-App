let app = {
    trackIndex: "",
    isPlaying: false,
    currentStatus: "",
    track: [
        {
            id: 0,
            src: 'file:///android_asset/www/media/tssf/Roam.mp3',
            title: 'Roam',
            artist: 'The Story So Far',
            volume: 0.5,
            img: "./img/usad.jpg"

        },
        {
            id: 1,
            src: 'file:///android_asset/www/media/tssf/Four Years.mp3',
            title: 'Four Years',
            artist: 'The Story So Far',
            volume: 0.5,
            img: "./img/usad.jpg"

        },
        {
            id: 2,
            src: 'file:///android_asset/www/media/tssf/High Regard.mp3',
            title: 'High Regard',
            artist: 'The Story So Far',
            volume: 0.5,
            img: "./img/usad.jpg"
        },
        {
            id: 3,
            src: 'file:///android_asset/www/media/tssf/Quicksand.mp3',
            title: 'Quicksand',
            artist: 'The Story So Far',
            volume: 0.5,
            img: "./img/usad.jpg"
        },
        {
            id: 4,
            src: 'file:///android_asset/www/media/zeppelin/Black Dog.mp3',
            title: 'Black Dog',
            artist: 'Led Zeppelin',
            volume: 0.5,
            img: "./img/IV.jpg"
        },
        {
            id: 5,
            src: 'file:///android_asset/www/media/zeppelin/Misty Mountain Hop.mp3',
            title: 'Misty Moutain Hop',
            artist: 'Led Zeppelin',
            volume: 0.5,
            img: "./img/IV.jpg"
        },
        {
            id: 6,
            src: 'file:///android_asset/www/media/zeppelin/Four Sticks.mp3',
            title: 'Four Sticks',
            artist: 'Led Zeppelin',
            volume: 0.5,
            img: "./img/IV.jpg"
        },
        {
            id: 7,
            src: 'file:///android_asset/www/media/zeppelin/Rock and Roll.mp3',
            title: 'Rock and Roll',
            artist: 'Led Zeppelin',
            volume: 0.5,
            img: "./img/IV.jpg"
        },
    ],
    media: null,
    status: {
        '0': 'MEDIA_NONE',
        '1': 'MEDIA_STARTING',
        '2': 'MEDIA_RUNNING',
        '3': 'MEDIA_PAUSED',
        '4': 'MEDIA_STOPPED'
    },
    err: {
        '1': 'MEDIA_ERR_ABORTED',
        '2': 'MEDIA_ERR_NETWORK',
        '3': 'MEDIA_ERR_DECODE',
        '4': 'MEDIA_ERR_NONE_SUPPORTED'
    },
    init: function () {
        document.addEventListener('deviceready', app.addListeners, false);

        app.createTrackList();

        app.pages = document.querySelectorAll('.page');
        app.pages[0].classList.add('active');
        app.pages.forEach(page => {
            page.querySelector('.nav').addEventListener('click', app.navigate);
        });

    },
    navigate: function (ev) {
        ev.preventDefault();
        let tapped = ev.currentTarget;
        console.log(tapped);
        document.querySelector('.active').classList.remove('active');

        let target = tapped.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    },
    createTrackList: function () {
        let unorderedList = document.getElementById("tracklist");
        unorderedList.innerHTML = "";
        unorderedList.style.listStyle = "none";
        let tracks = app.track,
            fragment = document.createDocumentFragment();

        tracks.forEach(function (track) {
            let trackList = document.createElement("li"),
                albumCover = document.createElement("img"),
                trackTitle = document.createElement("h2"),
                artistName = document.createElement("h3");

            trackList.setAttribute("class", "trackList");

            albumCover.setAttribute("class", "albumCover");
            albumCover.setAttribute("src", track.img);
            albumCover.setAttribute("alt", track.title);
            albumCover.setAttribute("data-id", track.id);
            albumCover.addEventListener("click", app.showDetails);
            albumCover.setAttribute("width", "100");
            albumCover.setAttribute("height", "100");

            trackTitle.setAttribute("class", "trackTitle");
            trackTitle.textContent = track.title;
            trackTitle.setAttribute("data-id", track.id);
            trackTitle.addEventListener("click", app.playTrack);

            artistName.setAttribute("class", "artistName");
            artistName.textContent = track.artist;
            artistName.setAttribute("data-id", track.id);
            artistName.addEventListener("click", app.playTrack);

            trackList.appendChild(albumCover);
            trackList.appendChild(trackTitle);
            trackList.appendChild(artistName);

            fragment.appendChild(trackList);

        });

        unorderedList.appendChild(fragment);
    },
    showDetails: function (ev) {
        ev.preventDefault();
        let trackId = ev.currentTarget.getAttribute("data-id"),
            track = app.track,
            trackList = track.filter(function (track) {
                if (track.id == trackId) {
                    return track;
                }
            });

        app.trackIndex = trackId;

        let detailsDiv = document.getElementById("detailsDiv"),
            fragment = document.createDocumentFragment();
        detailsDiv.innerHTML = "";

        app.ready(trackId);

        let albumCover = document.createElement("img"),
            trackTitle = document.createElement("h2"),
            artistName = document.createElement("h3");

        albumCover.setAttribute("id", "albumCover");
        albumCover.setAttribute("src", trackList[0].img);
        albumCover.setAttribute("alt", trackList[0].title);
        albumCover.setAttribute("width", "300");
        albumCover.setAttribute("height", "300");
        albumCover.setAttribute("data-id", track.id);
        
        trackTitle.setAttribute("class", "trackTitle");
        trackTitle.textContent = trackList[0].title;

        artistName.setAttribute("class", "artistName");
        artistName.textContent = trackList[0].artist;

        fragment.appendChild(albumCover);
        fragment.appendChild(trackTitle);
        fragment.appendChild(artistName);

        detailsDiv.appendChild(fragment);

        document.getElementById("homePage").classList.remove("active");
        document.getElementById("detailsPage").classList.add("active");
    },
    playTrack: function (ev) {
        app.isPlaying = false;
        ev.preventDefault();
        let trackId = ev.currentTarget.getAttribute("data-id");
        app.trackIndex = trackId;

        app.ready(trackId);
        app.media.play();

        app.isPlaying = true;

        console.log("played");

        document.getElementById("play-btn").style.display = "none";
        document.getElementById("pause-btn").style.display = "block";
    },
    ready: function (trackId) {
        let track = app.track,
            src = track[trackId].src;
        app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
    },
    ftw: function () {
        //success creating the media object and playing, stopping, or recording
        console.log('success doing something');
    },
    wtf: function (err) {
        //failure of playback of media object
        console.warn('failure');
        console.error(err);
    },
    statusChange: function (status) {
        console.log('media status is now ' + app.status[status]);
        app.currentStatus = app.status[status];
    },
    addListeners: function () {
        document.querySelector('#play-btn').addEventListener('click', app.play);
        document.querySelector('#pause-btn').addEventListener('click', app.pause);
        document.querySelector('#up-btn').addEventListener('click', function () {
            app.volumeUp(app.trackIndex);
        });
        document.querySelector('#down-btn').addEventListener('click', function () {
            app.volumeDown(app.trackIndex);
        });
        document.querySelector('#mute-btn').addEventListener('click', function () {
            app.mute(app.trackIndex);
        });
        document.querySelector('#ff-btn').addEventListener('click', app.ff);
        document.querySelector('#rew-btn').addEventListener('click', app.rew);
        document.addEventListener('pause', () => {
            app.media.release();
        });
        document.addEventListener('menubutton', () => {
            console.log('clicked the menu button');
        });
        document.addEventListener('resume', () => {
            app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
        })
    },
    play: function () {
        app.isPlaying = false;

        app.media.play();
        
        app.isPlaying = true;

        document.getElementById("play-btn").style.display = "none";
        document.getElementById("pause-btn").style.display = "block";


        console.log(app.currentStatus);

    },
    pause: function () {
        if (app.isPlaying) {
            app.media.pause();

            document.getElementById("pause-btn").style.display = "none";
            document.getElementById("play-btn").style.display = "block";
            document.getElementById("pause-btn2").style.display = "none";
            document.getElementById("play-btn2").style.display = "block";
        }
    },
    volumeUp: function (trackId) {
        let track = app.track,
            vol = parseFloat(track[trackId].volume);
        console.log('current volume', vol);
        vol += 0.1;
        if (vol > 1) {
            vol = 1.0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        track[trackId].volume = vol;
    },
    volumeDown: function (trackId) {
        let track = app.track,
            vol = track[trackId].volume;
        console.log('current volume', vol);
        vol -= 0.1;
        if (vol < 0) {
            vol = 0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        track[trackId].volume = vol;
    },
    mute: function (trackId) {
        let track = app.track,
            vol = track[trackId].volume;
        console.log('current volume', vol);
        vol -= 1;
        if (vol < 0) {
            vol = 0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        track[trackId].volume = vol;
    },
    ff: function () {
        app.media.getCurrentPosition((pos) => {
            let dur = app.media.getDuration();
            console.log('current position', pos);
            console.log('duration', dur);
            pos += 10;
            if (pos < dur) {
                app.media.seekTo(pos * 1000);
            }
        });
    },
    rew: function () {
        app.media.getCurrentPosition((pos) => {
            let dur = app.media.getDuration();
            console.log('current position', pos);
            console.log('duration', dur);
            pos -= 10;
            if (pos > 0) {
                app.media.seekTo(pos * 1000);
            } else {
                app.media.seekTo(0);
            }
        });
    }
};

app.init();