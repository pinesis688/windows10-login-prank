(function() {
    var openMenu = null;

    function closeAll() {
        if (openMenu) {
            openMenu.classList.remove('show');
            openMenu = null;
        }
    }

    function positionMenu(menu, anchor) {
        var rect = anchor.getBoundingClientRect();
        var menuRect = menu.getBoundingClientRect();
        var left = rect.left + rect.width / 2 - (menuRect.width || menu.offsetWidth) / 2;
        var top = rect.top - (menuRect.height || menu.offsetHeight) - 8;

        if (left < 10) left = 10;
        if (left + (menuRect.width || menu.offsetWidth) > window.innerWidth - 10) {
            left = window.innerWidth - (menuRect.width || menu.offsetWidth) - 10;
        }
        if (top < 10) top = rect.bottom + 8;

        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
    }

    function toggleMenu(menuId, anchorId) {
        var menu = document.getElementById(menuId);
        var anchor = document.getElementById(anchorId);
        if (!menu || !anchor) return;

        if (openMenu === menu) {
            closeAll();
            return;
        }

        closeAll();
        menu.classList.add('show');
        positionMenu(menu, anchor);
        openMenu = menu;
    }

    function attachMenuTrigger(triggerId, menuId) {
        var trigger = document.getElementById(triggerId);
        if (trigger) {
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMenu(menuId, triggerId);
            });
        }
    }

    document.addEventListener('click', function(e) {
        if (openMenu && !e.target.closest('.popup-menu') && !e.target.closest('.tray-icon')) {
            closeAll();
        }
    });

    window.TrayIcons = {
        init: function() {
            attachMenuTrigger('lock-network-icon', 'network-menu');
            attachMenuTrigger('login-network-icon', 'network-menu');
            attachMenuTrigger('lock-ease-icon', 'ease-menu');
            attachMenuTrigger('login-ease-icon', 'ease-menu');
            attachMenuTrigger('lock-power-icon', 'power-menu');
            attachMenuTrigger('login-power-icon', 'power-menu');
            attachMenuTrigger('login-lang-icon', 'lang-menu');

            var powerMenu = document.getElementById('power-menu');
            if (powerMenu) {
                powerMenu.querySelectorAll('.menu-item').forEach(function(item) {
                    item.addEventListener('click', function() {
                        var action = this.getAttribute('data-action');
                        if (action === 'shutdown' || action === 'restart' || action === 'sleep') {
                            closeAll();
                            document.getElementById('black-screen').classList.add('active');
                        }
                    });
                });
            }
        },
        closeAll: closeAll
    };
})();
