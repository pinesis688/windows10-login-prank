(function() {
    var attemptCount = 0;
    var submitting = false;

    function submitPassword() {
        if (submitting) return;

        var input = document.getElementById('password-input');
        var password = input.value;

        if (password.length === 0) return;

        submitting = true;
        attemptCount++;

        var wrapper = document.getElementById('password-wrapper');
        var error = document.getElementById('login-error');

        if (attemptCount === 1) {
            setTimeout(function() {
                wrapper.classList.add('error');
                error.classList.add('show');
                input.value = '';
                input.focus();
                submitting = false;

                setTimeout(function() {
                    wrapper.classList.remove('error');
                }, 600);
            }, 400);
        } else {
            var optionsIcons = document.getElementById('signin-options-icons');
            var optionsLink = document.getElementById('signin-options');
            if (optionsIcons) optionsIcons.classList.remove('show');
            if (optionsLink) optionsLink.style.display = '';

            Welcome.start();
            submitting = false;
        }
    }

    function init() {
        var input = document.getElementById('password-input');
        var submitBtn = document.getElementById('submit-btn');
        var optionsLink = document.getElementById('signin-options-link');
        var optionsIcons = document.getElementById('signin-options-icons');
        var hintIcon = document.getElementById('password-hint-icon');

        if (submitBtn) {
            submitBtn.addEventListener('click', submitPassword);
        }

        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitPassword();
                }
            });

            input.addEventListener('input', function() {
                var error = document.getElementById('login-error');
                var wrapper = document.getElementById('password-wrapper');
                if (error) error.classList.remove('show');
                if (wrapper) wrapper.classList.remove('error');
            });
        }

        if (optionsLink) {
            optionsLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (optionsIcons.classList.contains('show')) {
                    optionsIcons.classList.remove('show');
                } else {
                    optionsIcons.classList.add('show');
                }
            });
        }

        if (optionsIcons) {
            var icons = optionsIcons.querySelectorAll('.option-icon');
            icons.forEach(function(icon) {
                icon.addEventListener('click', function() {
                    var type = this.getAttribute('data-type');
                    icons.forEach(function(i) { i.querySelector('svg').setAttribute('fill', 'rgba(255,255,255,0.5)'); });
                    this.querySelector('svg').setAttribute('fill', 'white');
                    if (input) {
                        input.focus();
                        if (type === 'pin') {
                            input.setAttribute('inputmode', 'numeric');
                            input.setAttribute('placeholder', 'PIN');
                        } else {
                            input.removeAttribute('inputmode');
                            input.setAttribute('placeholder', '密码');
                        }
                    }
                });
            });
        }

        // 真实 Win10 1903+ 密码框右侧眼睛图标：按住显示密码，松开恢复
        if (hintIcon && input) {
            hintIcon.addEventListener('mousedown', function(e) {
                e.stopPropagation();
                input.type = 'text';
            });
            hintIcon.addEventListener('mouseup', function(e) {
                e.stopPropagation();
                input.type = 'password';
            });
            hintIcon.addEventListener('mouseleave', function() {
                input.type = 'password';
            });
            // 触摸支持
            hintIcon.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                e.preventDefault();
                input.type = 'text';
            }, { passive: false });
            hintIcon.addEventListener('touchend', function(e) {
                e.stopPropagation();
                input.type = 'password';
            });
        }
    }

    window.LoginScreen = {
        init: init
    };
})();
