// ==UserScript==
// @name         AnimeGO Schedule Tabs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Горизонтальные табы для расписания.
// @author       ninetyoneno ft. Qwen
// @match        https://animego.me/
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const widget = document.querySelector('.anime-widget');
        if (!widget || document.querySelector('#my-tabs')) return;

        const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
        const shortDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        let activeDay = 6;

        const style = document.createElement('style');
        style.textContent = `
            #my-tabs {
                display: flex !important;
                gap: 4px !important;
                margin-bottom: 10px !important;
                padding: 8px !important;
                background: #1f1f1f !important;
                border-radius: 8px !important;
                flex-shrink: 0 !important;
            }
            .my-tab {
                flex: 1 !important;
                padding: 8px 4px !important;
                background: #2a2a2a !important;
                border: 1px solid #333 !important;
                border-radius: 6px !important;
                color: #999 !important;
                cursor: pointer !important;
                font-size: 11px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 2px !important;
                line-height: 1.2 !important;
            }
            .my-tab:hover {
                background: #333 !important;
                color: #fff !important;
            }
            .my-tab.active {
                background: #3a3a3a !important;
                border-color: #4a9eff !important;
                color: #fff !important;
                font-weight: 600 !important;
            }
            .my-tab-day {
                font-weight: 600 !important;
                font-size: 12px !important;
            }
            .my-tab-date {
                font-size: 10px !important;
                opacity: 0.7 !important;
            }
            #my-content {
                flex: 1 !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                padding-right: 5px !important;
                min-height: 0 !important;
            }
            #my-content::-webkit-scrollbar {
                width: 6px !important;
            }
            #my-content::-webkit-scrollbar-track {
                background: #1f1f1f !important;
                border-radius: 3px !important;
            }
            #my-content::-webkit-scrollbar-thumb {
                background: #3a3a3a !important;
                border-radius: 3px !important;
            }
            #my-content::-webkit-scrollbar-thumb:hover {
                background: #4a4a4a !important;
            }
            .my-day-block {
                display: none !important;
            }
            .my-day-block.active {
                display: block !important;
            }
            /* Скрываем оригинальные элементы */
            .anime-widget .aw-day,
            .anime-widget .aw-day-title,
            .anime-widget .collapse {
                display: none !important;
            }
            /* Стили для карточек */
            .aw-item {
                display: flex !important;
                gap: 10px !important;
                padding: 8px !important;
                background: #2a2a2a !important;
                border-radius: 6px !important;
                margin-bottom: 6px !important;
                cursor: pointer !important;
                transition: background 0.2s !important;
            }
            .aw-item:hover {
                background: #333 !important;
            }
            .aw-cover img {
                width: 50px !important;
                height: 70px !important;
                object-fit: cover !important;
                border-radius: 4px !important;
            }
            .aw-info {
                flex: 1 !important;
                min-width: 0 !important;
            }
            .aw-name {
                font-size: 13px !important;
                color: #fff !important;
                margin-bottom: 3px !important;
                line-height: 1.3 !important;
            }
            .aw-meta {
                font-size: 11px !important;
                color: #888 !important;
            }
        `;
        document.head.appendChild(style);

        const tabsDiv = document.createElement('div');
        tabsDiv.id = 'my-tabs';

        shortDays.forEach((short, idx) => {
            const btn = document.createElement('button');
            btn.className = 'my-tab' + (idx === activeDay ? ' active' : '');

            // Находим дату для этого дня
            const awDay = Array.from(widget.querySelectorAll('.aw-day')).find(el =>
                el.querySelector('.schedule-day')?.textContent.trim() === days[idx]
            );
            let dateText = '';
            if (awDay) {
                const dateEl = awDay.querySelector('.schedule-date, .schedule-today, .schedule-tomorrow');
                dateText = dateEl?.textContent.trim() || '';
            }

            // Создаём HTML для кнопки с датой
            btn.innerHTML = `
                <span class="my-tab-day">${short}</span>
                ${dateText ? `<span class="my-tab-date">${dateText}</span>` : ''}
            `;

            btn.onclick = () => {
                activeDay = idx;
                tabsDiv.querySelectorAll('.my-tab').forEach((b, i) => {
                    b.classList.toggle('active', i === idx);
                });
                contentDiv.querySelectorAll('.my-day-block').forEach((block, i) => {
                    block.classList.toggle('active', i === idx);
                });
            };
            tabsDiv.appendChild(btn);
        });

        const contentDiv = document.createElement('div');
        contentDiv.id = 'my-content';

        for (let i = 0; i < 7; i++) {
            const block = document.createElement('div');
            block.className = 'my-day-block' + (i === activeDay ? ' active' : '');
            block.dataset.day = i;

            const awDay = Array.from(widget.querySelectorAll('.aw-day')).find(el =>
                el.querySelector('.schedule-day')?.textContent.trim() === days[i]
            );

            if (awDay) {
                const collapse = awDay.querySelector('.collapse');
                const items = collapse?.querySelectorAll('.aw-item') || [];

                items.forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.style.display = 'flex';
                    block.appendChild(clone);
                });
            }

            contentDiv.appendChild(block);
        }

        widget.before(tabsDiv);
        widget.before(contentDiv);

    }, 2000);

})();