(function() {
    var WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    function pad(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function update() {
        var now = new Date();
        var timeEl = document.getElementById('lock-time');
        var dateEl = document.getElementById('lock-date');

        if (timeEl) {
            timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
        }

        if (dateEl) {
            dateEl.textContent = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + WEEKDAYS[now.getDay()];
        }
    }

    window.Clock = {
        init: function() {
            update();
            setInterval(update, 1000);
        }
    };
})();
