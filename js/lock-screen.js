(function() {
    var transitioning = false;

    function resetLoginState() {
        var error = document.getElementById('login-error');
        var wrapper = document.getElementById('password-wrapper');
        var input = document.getElementById('password-input');
        var optionsIcons = document.getElementById('signin-options-icons');
        if (error) error.classList.remove('show');
        if (wrapper) wrapper.classList.remove('error');
        if (optionsIcons) optionsIcons.classList.remove('show');
        if (input) {
            input.value = '';
            input.setAttribute('placeholder', '密码');
            input.removeAttribute('inputmode');
        }
        var optionIcons = document.querySelectorAll('.option-icon');
        optionIcons.forEach(function(icon, i) {
            var svg = icon.querySelector('svg');
            if (svg) svg.setAttribute('fill', i === 0 ? 'white' : 'rgba(255,255,255,0.5)');
        });
    }

    function goToLogin() {
        if (transitioning) return;
        transitioning = true;

        var lockScreen = document.getElementById('lock-screen');
        var loginScreen = document.getElementById('login-screen');
        var hint = document.getElementById('lock-hint');

        TrayIcons.closeAll();

        if (hint) hint.classList.add('hidden');

        lockScreen.classList.add('leaving-up');

        setTimeout(function() {
            lockScreen.classList.remove('active', 'leaving-up');
            lockScreen.style.transform = '';
            loginScreen.classList.add('active', 'fade-in');

            var input = document.getElementById('password-input');
            if (input) {
                setTimeout(function() { input.focus(); }, 400);
            }

            setTimeout(function() {
                loginScreen.classList.remove('fade-in');
                transitioning = false;
            }, 500);
        }, 550);
    }

    function goToLock() {
        if (transitioning) return;
        transitioning = true;

        var lockScreen = document.getElementById('lock-screen');
        var loginScreen = document.getElementById('login-screen');

        TrayIcons.closeAll();
        resetLoginState();

        loginScreen.classList.add('fade-out');

        setTimeout(function() {
            loginScreen.classList.remove('active', 'fade-out');

            lockScreen.classList.add('active', 'entering-down');

            var hint = document.getElementById('lock-hint');
            if (hint) hint.classList.remove('hidden');

            setTimeout(function() {
                lockScreen.classList.remove('entering-down');
                lockScreen.style.transform = '';
                transitioning = false;
            }, 500);
        }, 300);
    }

    window.LockScreen = {
        init: function() {
            var lockScreen = document.getElementById('lock-screen');
            var hint = document.getElementById('lock-hint');

            function isInteractiveTarget(target) {
                return target.closest('.tray-icon') ||
                       target.closest('.popup-menu') ||
                       target.closest('.lock-hint');
            }

            lockScreen.addEventListener('click', function(e) {
                if (isInteractiveTarget(e.target)) return;
                goToLogin();
            });

            document.addEventListener('keydown', function(e) {
                if (!lockScreen.classList.contains('active')) return;
                if (e.target.closest('.popup-menu')) return;
                if (e.key === 'Escape') return;
                if (e.ctrlKey || e.altKey || e.metaKey) return;
                goToLogin();
            });

            lockScreen.addEventListener('wheel', function(e) {
                if (!lockScreen.classList.contains('active')) return;
                if (e.deltaY < -15) {
                    goToLogin();
                }
            }, { passive: true });

            var touchStartY = null;
            lockScreen.addEventListener('touchstart', function(e) {
                if (isInteractiveTarget(e.target)) return;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            lockScreen.addEventListener('touchend', function(e) {
                if (touchStartY !== null && lockScreen.classList.contains('active')) {
                    var endY = e.changedTouches[0].clientY;
                    if (touchStartY - endY > 40) {
                        goToLogin();
                    }
                }
                touchStartY = null;
            });

            var backBtn = document.getElementById('login-back');
            if (backBtn) {
                backBtn.addEventListener('click', goToLock);
            }

            document.addEventListener('keydown', function(e) {
                if (login_screen_active() && e.key === 'Escape') {
                    goToLock();
                }
            });
        }
    };

    function login_screen_active() {
        var ls = document.getElementById('login-screen');
        return ls && ls.classList.contains('active');
    }
})();
