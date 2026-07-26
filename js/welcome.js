(function() {
    function closePage() {
        try {
            window.close();
        } catch(e) {}

        setTimeout(function() {
            var all = document.body.children;
            for (var i = all.length - 1; i >= 0; i--) {
                var el = all[i];
                if (el.id !== 'black-screen' && el.id !== 'shutdown-text') {
                    el.style.display = 'none';
                }
            }
            var st = document.getElementById('shutdown-text');
            if (st) {
                st.textContent = '请手动关闭此窗口';
                st.classList.add('show');
            }
            document.body.style.background = '#000';
            document.documentElement.style.background = '#000';
        }, 100);

        setTimeout(function() {
            try { window.close(); } catch(e) {}
        }, 500);
    }

    function start() {
        var loginScreen = document.getElementById('login-screen');
        var welcomeScreen = document.getElementById('welcome-screen');
        var blackScreen = document.getElementById('black-screen');

        loginScreen.classList.add('fade-out');

        setTimeout(function() {
            loginScreen.classList.remove('active', 'fade-out');

            welcomeScreen.classList.add('active');

            setTimeout(function() {
                welcomeScreen.style.transition = 'opacity 0.6s ease';
                welcomeScreen.style.opacity = '0';

                setTimeout(function() {
                    welcomeScreen.classList.remove('active');
                    welcomeScreen.style.transition = '';
                    welcomeScreen.style.opacity = '';

                    blackScreen.classList.add('active');

                    setTimeout(function() {
                        closePage();
                    }, 1500);
                }, 600);
            }, 2500);
        }, 400);
    }

    window.Welcome = {
        start: start
    };
})();
