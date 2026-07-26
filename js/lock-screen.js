(function() {
    var transitioning = false;
    var idleTimer = null;

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
            input.type = 'password';
        }
        var optionIcons = document.querySelectorAll('.option-icon');
        optionIcons.forEach(function(icon, i) {
            var svg = icon.querySelector('svg');
            if (svg) svg.setAttribute('fill', i === 0 ? 'white' : 'rgba(255,255,255,0.5)');
        });
    }

    // 真实 Win10 锁屏解除方式（参考 Microsoft 官方文档）：
    // 1) 单击  2) 任意键  3) 触摸点击  4) 触摸上滑
    // 注意：滚轮滑动不触发解锁（当前实现正确）
    function goToLogin() {
        if (transitioning) return;
        transitioning = true;

        var lockScreen = document.getElementById('lock-screen');
        var loginScreen = document.getElementById('login-screen');

        TrayIcons.closeAll();
        lockScreen.classList.remove('idle');

        // 真实 Win10 过渡（ref: Windows-X Lockscreen.vue）：
        // 1. lockImg: blur(0->12px) + scale(1->1.1), transition 2s
        // 2. dimmer: opacity 0->0.65, transition 1.5s
        // 3. sign-in: fadeIn 1s
        // 4. lockscreen: opacity fade 700ms with 200ms delay
        lockScreen.classList.add('leaving');
        loginScreen.classList.add('active', 'fade-in');

        setTimeout(function() {
            var input = document.getElementById('password-input');
            if (input) input.focus();
        }, 700);

        setTimeout(function() {
            lockScreen.classList.remove('active', 'leaving');
            loginScreen.classList.remove('fade-in');
            transitioning = false;
        }, 1200);
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
            lockScreen.classList.add('active', 'entering');
            startIdleHint(lockScreen);

            setTimeout(function() {
                lockScreen.classList.remove('entering');
                transitioning = false;
            }, 400);
        }, 300);
    }

    // 真实 Win10 锁屏无"按任意键"提示，但为可用性保留极弱提示：
    // 闲置 4s 后极淡浮现，任意操作立即消失
    function startIdleHint(lockScreen) {
        clearTimeout(idleTimer);
        lockScreen.classList.remove('idle');
        idleTimer = setTimeout(function() {
            if (lockScreen.classList.contains('active') && !transitioning) {
                lockScreen.classList.add('idle');
            }
        }, 4000);
    }

    function clearIdleHint(lockScreen) {
        clearTimeout(idleTimer);
        lockScreen.classList.remove('idle');
    }

    window.LockScreen = {
        init: function() {
            var lockScreen = document.getElementById('lock-screen');

            function isInteractiveTarget(target) {
                return target.closest('.tray-icon') ||
                       target.closest('.popup-menu') ||
                       target.closest('.lock-hint');
            }

            startIdleHint(lockScreen);

            // 1) 单击解除（不响应滚轮）
            lockScreen.addEventListener('click', function(e) {
                if (isInteractiveTarget(e.target)) return;
                clearIdleHint(lockScreen);
                goToLogin();
            });

            // 2) 任意键解除（排除单独修饰键，避免误触）
            document.addEventListener('keydown', function(e) {
                if (!lockScreen.classList.contains('active')) return;
                if (transitioning) return;
                // 忽略单独按下的修饰键 / 输入法切换键
                if (['Control','Shift','Alt','Tab','Meta','CapsLock','IME'].indexOf(e.key) !== -1) return;
                if (e.ctrlKey || e.metaKey || e.altKey) return;
                clearIdleHint(lockScreen);
                e.preventDefault();
                goToLogin();
            });

            // 3) 触摸上滑解除
            var touchStartY = null;
            var touchStartX = null;
            lockScreen.addEventListener('touchstart', function(e) {
                if (isInteractiveTarget(e.target)) return;
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
                clearIdleHint(lockScreen);
            }, { passive: true });
            lockScreen.addEventListener('touchend', function(e) {
                if (touchStartY === null || transitioning) {
                    touchStartY = null;
                    return;
                }
                var endY = e.changedTouches[0].clientY;
                var endX = e.changedTouches[0].clientX;
                // 主要为向上滑动（垂直位移>40 且 >水平位移）
                if (touchStartY - endY > 40 && (touchStartY - endY) > Math.abs(endX - touchStartX)) {
                    goToLogin();
                }
                touchStartY = null;
                touchStartX = null;
            }, { passive: true });

            // 任意鼠标移动即清除提示
            lockScreen.addEventListener('mousemove', function() {
                if (lockScreen.classList.contains('idle')) {
                    clearIdleHint(lockScreen);
                    startIdleHint(lockScreen);
                }
            });

            // 返回按钮（登录屏 -> 锁屏）
            var backBtn = document.getElementById('login-back');
            if (backBtn) {
                backBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    goToLock();
                });
            }
        }
    };
})();
