(function() {
    function init() {
        document.addEventListener('DOMContentLoaded', function() {
            Wallpaper.init();
            Clock.init();
            TrayIcons.init();
            LockScreen.init();
            LoginScreen.init();

            // 浏览器策略：requestFullscreen 必须由用户手势触发
            // 在 DOMContentLoaded 直接调用会被静默拒绝，改为首次交互时触发
            var fullscreenTriggered = false;
            function tryFullscreen() {
                if (fullscreenTriggered) return;
                fullscreenTriggered = true;
                try {
                    var el = document.documentElement;
                    if (el.requestFullscreen) {
                        el.requestFullscreen().catch(function(){});
                    }
                } catch(e) {}
                document.removeEventListener('click', tryFullscreen);
                document.removeEventListener('keydown', tryFullscreen);
                document.removeEventListener('touchstart', tryFullscreen);
            }
            document.addEventListener('click', tryFullscreen);
            document.addEventListener('keydown', tryFullscreen);
            document.addEventListener('touchstart', tryFullscreen);
        });
    }

    init();
})();
