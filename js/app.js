(function() {
    function init() {
        document.addEventListener('DOMContentLoaded', function() {
            Wallpaper.init();
            Clock.init();
            TrayIcons.init();
            LockScreen.init();
            LoginScreen.init();

            try {
                document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(function(){});
            } catch(e) {}
        });
    }

    init();
})();
