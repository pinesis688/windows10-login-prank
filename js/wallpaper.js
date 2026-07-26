(function() {
    var FALLBACK_WALLPAPERS = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=80',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80'
    ];

    var BING_DIRECT = 'https://bing.img.run/1920x1080.php';

    function getRandomFallback() {
        return FALLBACK_WALLPAPERS[Math.floor(Math.random() * FALLBACK_WALLPAPERS.length)];
    }

    var currentWallpaper = '';

    function setWallpaper(url) {
        currentWallpaper = url;
        var lockBg = document.getElementById('lock-bg');
        var loginBg = document.getElementById('login-bg');
        var welcomeBg = document.getElementById('welcome-bg');
        var safeUrl = url.replace(/"/g, '\\"');
        if (lockBg) {
            lockBg.style.backgroundImage = 'url("' + safeUrl + '")';
            lockBg.style.opacity = '0';
            var img = new Image();
            img.onload = function() { lockBg.style.transition = 'opacity 0.5s'; lockBg.style.opacity = '1'; };
            img.src = url;
        }
        if (loginBg) loginBg.style.backgroundImage = 'url("' + safeUrl + '")';
        if (welcomeBg) welcomeBg.style.backgroundImage = 'url("' + safeUrl + '")';
    }

    function preloadImage(url, timeout) {
        return new Promise(function(resolve, reject) {
            var timer = setTimeout(function() { reject(new Error('Timeout')); }, timeout || 5000);
            var img = new Image();
            img.onload = function() { clearTimeout(timer); resolve(url); };
            img.onerror = function() { clearTimeout(timer); reject(new Error('Load failed')); };
            img.src = url;
        });
    }

    async function tryFetchBingJson() {
        var endpoints = [
            'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
            'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US'
        ];
        for (var i = 0; i < endpoints.length; i++) {
            try {
                var resp = await fetch(endpoints[i], { method: 'GET', mode: 'cors' });
                if (resp.ok) {
                    var data = await resp.json();
                    if (data.images && data.images[0] && data.images[0].url) {
                        var imgUrl = data.images[0].url;
                        if (imgUrl.indexOf('http') !== 0) {
                            imgUrl = 'https://cn.bing.com' + imgUrl;
                        }
                        return imgUrl;
                    }
                }
            } catch(e) {
                continue;
            }
        }
        return null;
    }

    window.Wallpaper = {
        init: function() {
            var fallback = getRandomFallback();
            setWallpaper(fallback);

            tryFetchBingJson().then(function(bingUrl) {
                if (bingUrl) {
                    return preloadImage(bingUrl, 5000).then(function() { setWallpaper(bingUrl); });
                }
                return preloadImage(BING_DIRECT, 4000).then(function() { setWallpaper(BING_DIRECT); });
            }).catch(function() {
                var fb = getRandomFallback();
                preloadImage(fb, 5000).then(function() { setWallpaper(fb); }).catch(function() {});
            });
        }
    };
})();
