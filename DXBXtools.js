// ==UserScript==
// @name         DXBX Инструменты
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Инструменты для dxbx.ru: кнопка инструментов слева от объемных списаний
// @author       @dieesau + t.me/tiltmachinegun + https://t.me/kseity
// @downloadUrl  https://raw.githubusercontent.com/tiltmachinegun/dxbxtools/refs/heads/main/DXBXtools.js
// @updateUrl    https://raw.githubusercontent.com/tiltmachinegun/dxbxtools/refs/heads/main/DXBXtools.js
// @match        https://dxbx.ru/*
// @match        http://dxbx.ru/*
// @icon         https://img.icons8.com/?size=256&id=1OTMIGesNl9k&format=png
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/bwip-js@3.0.2/dist/bwip-js-min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== КОНФИГУРАЦИЯ ==========
    const CONFIG = {
        gapPx: 8,
        extraShiftLeft: 0,
        extraShiftTop: 0
    };

    // ========== СТИЛИ ==========
    GM_addStyle(`
        #dxbx-tools-btn {
            position: absolute !important;
            z-index: 10010 !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 8px !important;
            padding: 8px 14px !important;
            background: #fff !important;
            color: #000000 !important;
            border: 1px solid #d9d9d9 !important;
            border-radius: 10px !important;
            line-height: 1 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            cursor: pointer !important;
            transition: all .15s ease !important;
            white-space: nowrap !important;
            text-decoration: none !important;
            box-shadow: 0 2px 6px rgba(0,0,0,.06) !important;
            user-select: none !important;
        }
        #dxbx-tools-btn:hover { border-color: #000000 !important; transform: translateY(-1px) !important; }

        #tools-menu {
            position: absolute !important;
            background: #ffffff !important;
            display: none;
            min-width: 320px !important;
            max-width: 420px !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 8px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,.12) !important;
            z-index: 10020 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            color: #000000 !important;
            box-sizing: border-box !important;
        }
        #tools-menu * {
            box-sizing: border-box !important;
        }
        #tools-menu .__tools-header {
            display: flex !important; 
            align-items: center !important; 
            justify-content: space-between !important;
            padding: 6px 8px 10px !important; 
            border-bottom: 1px solid #f0f2f5 !important; 
            margin-bottom: 6px !important;
            font-weight: 600 !important; 
            color: #000000 !important;
            font-size: 14px !important;
            background: transparent !important;
        }
        #tools-menu .__tools-header-title {
            color: #000000 !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            background: transparent !important;
            display: inline !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
        }
        #tools-menu .__tools-item {
            cursor: pointer !important; 
            margin: 2px 0 !important; 
            color: #000000 !important; 
            font-weight: 500 !important;
            padding: 10px 12px !important; 
            border-radius: 8px !important; 
            display: flex !important; 
            align-items: center !important;
            justify-content: space-between !important; 
            gap: 8px !important; 
            transition: background .15s ease !important;
            width: 100% !important; 
            background: transparent !important; 
            border: none !important; 
            text-align: left !important; 
            font-size: 14px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            line-height: 1.4 !important;
            outline: none !important;
        }
        #tools-menu .__tools-item:hover { background: #f5f7fa !important; }
        #tools-menu .__tools-item:focus { outline: 2px solid #1890ff !important; outline-offset: -2px !important; }
        #tools-menu .__tools-item:disabled { opacity: 0.5 !important; cursor: not-allowed !important; }
        #tools-menu .__tools-item:disabled:hover { background: transparent !important; }
        #tools-menu .__tools-item .__tools-label {
            color: #000000 !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            display: inline !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            line-height: inherit !important;
            height: auto !important;
            white-space: normal !important;
            text-shadow: none !important;
        }
        #tools-menu .__tools-item .__tools-info { 
            color: #000000 !important; 
            font-weight: 700 !important; 
            font-size: 13px !important; 
            user-select: none !important; 
            margin-left: 10px !important;
            background: transparent !important;
            border: none !important;
            padding: 2px 4px !important;
            display: inline !important;
            height: auto !important;
            line-height: inherit !important;
            border-radius: 0 !important;
        }
        #tools-menu .__tools-close {
            cursor: pointer !important; 
            color: #6b7280 !important; 
            font-weight: 600 !important; 
            background: transparent !important; 
            border: none !important;
            padding: 4px 8px !important; 
            font-size: 16px !important; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            line-height: 1 !important;
            display: inline !important;
            margin: 0 !important;
            height: auto !important;
            width: auto !important;
        }
        #tools-menu .__tools-close:hover { color: #000 !important; background: transparent !important; }
        #tools-menu .__tools-close:focus { outline: 2px solid #1890ff !important; }

        .__tools-tooltip {
            display: none; 
            position: fixed !important; 
            background: rgba(17,24,39,.98) !important; 
            color: #fff !important;
            padding: 10px 12px !important; 
            border-radius: 8px !important; 
            z-index: 10021 !important; 
            width: 280px !important; 
            font-weight: 400 !important; 
            font-size: 12px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            box-shadow: 0 6px 18px rgba(0,0,0,.28) !important;
            line-height: 1.4 !important;
        }

        .status-indicator {
            position: fixed; top: 60px; right: 20px; z-index: 10000; padding: 8px 12px;
            background: rgba(76, 175, 80, 0.9); color: white; border-radius: 15px; font-size: 12px; font-family: Arial, sans-serif;
        }
    `);

    // ========== УТИЛИТЫ ==========
    const normalize = s => (s || '').toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();
    
    const isVisible = el => !!el && el.offsetWidth > 0 && el.offsetHeight > 0 &&
                                 getComputedStyle(el).visibility !== 'hidden' &&
                                 getComputedStyle(el).display !== 'none';

    // Проверка текущего URL для SPA
    function getCurrentUrl() {
        return window.location.href + window.location.hash;
    }

    function isInvoicePage() {
        const url = getCurrentUrl();
        return url.includes('#app/edit/invoice/') || url.includes('/app/edit/invoice/');
    }

    function throttle(fn, ms) {
        let t = 0, th;
        return function(...args) {
            const now = Date.now();
            if (now - t >= ms) {
                t = now; fn.apply(this, args);
            } else {
                clearTimeout(th);
                th = setTimeout(() => { t = Date.now(); fn.apply(this, args); }, ms - (now - t));
            }
        };
    }

    function debugLog(message, data = null) {
        if (data) {
            console.log('[DXBX-TOOLS]', message, data);
            GM_log('[DXBX-TOOLS] ' + message + ' ' + JSON.stringify(data));
        } else {
            console.log('[DXBX-TOOLS]', message);
            GM_log('[DXBX-TOOLS] ' + message);
        }
    }

    // ========== ФУНКЦИИ ИНСТРУМЕНТОВ ==========
    function findBulkWriteoffButton() {
        const clickable = document.querySelectorAll('a, button, div[role="button"], span[role="button"]');
        for (const el of clickable) {
            const t = normalize(el.textContent);
            if (t && t.includes('объем') && t.includes('списан') && isVisible(el)) return el;
        }
        const guess = document.querySelector('[href*="writeoff"], [class*="writeoff"], [data-testid*="writeoff"]');
        if (guess && isVisible(guess)) return guess;
        return null;
    }

    function createToolsMenu() {
        let menu = document.getElementById('tools-menu');
        if (menu) return menu;

        menu = document.createElement('div');
        menu.id = 'tools-menu';
        menu.setAttribute('role', 'menu');

        const header = document.createElement('div');
        header.className = '__tools-header';
        const headerTitle = document.createElement('span');
        headerTitle.className = '__tools-header-title';
        headerTitle.textContent = 'Инструменты';
        const closeBtn = document.createElement('button');
        closeBtn.className = '__tools-close';
        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('aria-label', 'Закрыть меню');
        closeBtn.textContent = '✖';
        closeBtn.onclick = () => menu.style.display = 'none';
        header.appendChild(headerTitle);
        header.appendChild(closeBtn);
        menu.appendChild(header);

        const actions = [
            { id: 'extract-marks', text: 'Вытащить марки из накладной', onclick: displayMarkValues, description: 'Извлекает марки из алконакладной (крепкий алкоголь) в новую вкладку.', requiresInvoicePage: true },
            { id: 'set-zero', text: 'Проставить факт остаток = 0', onclick: setZeroRemaining, description: 'Проставляет всем позициям фактический остаток = 0.', requiresInvoicePage: false },
            { id: 'auto-checkboxes', text: 'Авто-чекбоксы', onclick: checkAllCheckboxes, description: 'Автоматически отмечает чекбоксы на странице.', requiresInvoicePage: false },
            { id: 'find-fb', text: 'Найти FB значения', onclick: findFBValues, description: 'Ищет FB-XXXXXXXXXXXXXXX и копирует в буфер обмена.', requiresInvoicePage: false },
            { id: 'auto-expand', text: 'Автораскрытие строк', onclick: startAutoExpand, description: 'Раскрывает строки с «плюсами», кликает «Распознать».', requiresInvoicePage: false },
            { id: 'gen-password', text: 'Сгенерировать пароль для Сбис', onclick: generatePassword, description: 'Генерирует пароль из 16 уникальных символов.', requiresInvoicePage: false }
        ];

        actions.forEach(a => {
            const item = document.createElement('button');
            item.className = '__tools-item';
            item.setAttribute('type', 'button');
            item.setAttribute('role', 'menuitem');
            item.dataset.actionId = a.id;
            item.dataset.requiresInvoice = a.requiresInvoicePage ? 'true' : 'false';
            item.innerHTML = `<span class="__tools-label">${a.text}</span><span class="__tools-info" tabindex="0" role="button" aria-label="Информация">i</span>`;

            const tip = document.createElement('div');
            tip.className = '__tools-tooltip';
            tip.setAttribute('role', 'tooltip');
            tip.textContent = a.description;
            document.body.appendChild(tip);

            const info = item.querySelector('.__tools-info');
            const showTip = () => {
                tip.style.display = 'block';
                const r = info.getBoundingClientRect();
                tip.style.left = (r.right + 10) + 'px';
                tip.style.top = (r.top + window.scrollY) + 'px';
            };
            const hideTip = () => tip.style.display = 'none';
            
            info.onmouseenter = showTip;
            info.onmouseleave = hideTip;
            info.onfocus = showTip;
            info.onblur = hideTip;

            item.onclick = (e) => {
                if ((e.target).classList && (e.target).classList.contains('__tools-info')) return;
                if (item.disabled) return;
                a.onclick();
                menu.style.display = 'none';
            };

            menu.appendChild(item);
        });

        document.body.appendChild(menu);
        return menu;
    }

    // Обновление состояния пунктов меню в зависимости от текущей страницы
    function updateMenuItemsState() {
        const menu = document.getElementById('tools-menu');
        if (!menu) return;

        const onInvoicePage = isInvoicePage();
        const items = menu.querySelectorAll('.__tools-item[data-requires-invoice="true"]');
        
        items.forEach(item => {
            if (onInvoicePage) {
                item.disabled = false;
                item.title = '';
            } else {
                item.disabled = true;
                item.title = 'Доступно только на странице накладной (invoice)';
            }
        });
    }

    function getOrCreateBtn() {
        let btn = document.getElementById('dxbx-tools-btn');
        if (btn) return btn;

        btn = document.createElement('a');
        btn.id = 'dxbx-tools-btn';
        btn.href = 'javascript:void(0)';
        btn.innerHTML = '<span>Инструменты ⚙️</span>';

        const menu = createToolsMenu();
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            updateMenuItemsState(); // Обновляем состояние при каждом открытии
            const rect = btn.getBoundingClientRect();
            menu.style.left = rect.left + 'px';
            menu.style.top = (rect.bottom + window.scrollY + 8) + 'px';
            menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
        });

        if (!window.__dxbxToolsDocClickBound) {
            document.addEventListener('click', function(event) {
                const menuEl = document.getElementById('tools-menu');
                const btnEl = document.getElementById('dxbx-tools-btn');
                if (!menuEl) return;
                if (menuEl.style.display === 'block' && !menuEl.contains(event.target) && event.target !== btnEl) {
                    menuEl.style.display = 'none';
                }
            });
            window.__dxbxToolsDocClickBound = true;
        }

        return btn;
    }

    // Отслеживание изменений URL для SPA
    function setupUrlWatcher() {
        let lastUrl = getCurrentUrl();
        
        // Обновляем состояние при изменении hash
        window.addEventListener('hashchange', () => {
            updateMenuItemsState();
        });

        // Также перехватываем pushState/replaceState для полной поддержки SPA
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(updateMenuItemsState, 100);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(updateMenuItemsState, 100);
        };

        window.addEventListener('popstate', () => {
            setTimeout(updateMenuItemsState, 100);
        });

        // Периодическая проверка (backup для сложных SPA)
        setInterval(() => {
            const currentUrl = getCurrentUrl();
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                updateMenuItemsState();
            }
        }, 1000);
    }

    function positionBtnLeftOf(targetEl, btnEl) {
        if (!targetEl || !btnEl) return;

        const parent = targetEl.offsetParent || targetEl.parentElement || document.body;
        if (btnEl.parentElement !== parent) {
            const prevPos = getComputedStyle(parent).position;
            if (prevPos === 'static') parent.style.position = 'relative';
            parent.appendChild(btnEl);
        }

        const prevDisp = btnEl.style.display;
        const prevVis = btnEl.style.visibility;
        if (getComputedStyle(btnEl).display === 'none') btnEl.style.display = 'inline-flex';
        btnEl.style.visibility = 'hidden';
        btnEl.style.left = '-9999px';
        btnEl.style.top = '-9999px';
        btnEl.getBoundingClientRect();

        const pRect = parent.getBoundingClientRect();
        const tRect = targetEl.getBoundingClientRect();
        const bRect = btnEl.getBoundingClientRect();

        const gap = CONFIG.gapPx;
        let left = (tRect.left - pRect.left) - gap - bRect.width - CONFIG.extraShiftLeft;
        let top = (tRect.top - pRect.top) + (tRect.height - bRect.height) / 120 + CONFIG.extraShiftTop;

        left = Math.max(left, -200);

        btnEl.style.left = left + 'px';
        btnEl.style.top = top + 'px';
        btnEl.style.visibility = 'visible';
        btnEl.style.display = prevDisp || 'inline-flex';
    }

    function mountLeftOfBulk() {
        const bulkBtn = findBulkWriteoffButton();
        if (!bulkBtn) return false;

        const btn = getOrCreateBtn();
        positionBtnLeftOf(bulkBtn, btn);
        return true;
    }

    const reposition = throttle(() => {
        const bulkBtn = findBulkWriteoffButton();
        const btn = document.getElementById('dxbx-tools-btn');
        if (bulkBtn && btn) positionBtnLeftOf(bulkBtn, btn);
    }, 100);

    function initTools() {
        let tries = 0;
        const tryMount = () => {
            if (mountLeftOfBulk()) {
                window.addEventListener('scroll', reposition, { passive: true });
                window.addEventListener('resize', reposition);

                if (!window.__dxbxObserverLeft) {
                    let scheduled = null;
                    const remount = () => {
                        if (scheduled) return;
                        scheduled = setTimeout(() => { scheduled = null; mountLeftOfBulk(); }, 200);
                    };
                    window.__dxbxObserverLeft = new MutationObserver(remount);
                    window.__dxbxObserverLeft.observe(document.body, { childList: true, subtree: true });
                }
            } else if (tries++ < 20) {
                setTimeout(tryMount, 300);
            }
        };
        tryMount();
    }

    // ========== ФУНКЦИОНАЛ ИНСТРУМЕНТОВ ==========
    function displayMarkValues() {
        try {
            var htmlContent = document.documentElement.innerHTML;
            var markRegex = /"mark":"(.*?)"/g;
            var fullNameRegex = /"productInfo":\{"docVersion":"V2_0","fullName":"(.*?)","shortName":/g;
            var matches = [], matchesForCopy = [], match, fullNameMatch;
            var fullNames = [], currentFullName = 'Неизвестное название';

            while ((fullNameMatch = fullNameRegex.exec(htmlContent)) !== null) {
                fullNames.push({ name: fullNameMatch[1].replace(/\\/g, ''), index: fullNameMatch.index });
            }

            var fullNameIndex = 0;
            while ((match = markRegex.exec(htmlContent)) !== null) {
                var value = match[1].replace(/"/g, '');
                if (fullNameIndex < fullNames.length && match.index < fullNames[fullNameIndex].index) {
                    currentFullName = fullNames[fullNameIndex].name;
                } else if (fullNameIndex < fullNames.length && match.index >= fullNames[fullNameIndex].index) {
                    fullNameIndex++;
                    if (fullNameIndex < fullNames.length) currentFullName = fullNames[fullNameIndex].name;
                }
                matches.push({ mark: value, fullName: currentFullName });
                matchesForCopy.push(value);
            }

            if (matches.length > 0) {
                showValuesInNewTab(matches, matchesForCopy);
            } else {
                showErrorWindow("Марки не найдены. Это алко накладная или пивная?");
            }
        } catch (error) {
            console.error('Ошибка в displayMarkValues:', error);
            showErrorWindow("Произошла ошибка при извлечении марок. Проверьте консоль.");
        }
    }

    function showValuesInNewTab(values, valuesForCopy) {
        try {
            var newTab = window.open("", "_blank");
            if (!newTab) { alert("Не удалось открыть новую вкладку. Проверьте настройки браузера."); return; }
            
            // Создаём HTML страницу с современным UI
            var html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Марки из накладной (${values.length} шт.)</title>
    <script src="https://cdn.jsdelivr.net/npm/bwip-js@3.0.2/dist/bwip-js-min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"><\/script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
        }
        .header p {
            opacity: 0.9;
            font-size: 16px;
        }
        .stats {
            display: flex;
            gap: 16px;
            margin-top: 16px;
        }
        .stat-badge {
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            backdrop-filter: blur(10px);
        }
        .toolbar {
            background: white;
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-primary {
            background: #667eea;
            color: white;
        }
        .btn-primary:hover {
            background: #5a6fd6;
            transform: translateY(-1px);
        }
        .btn-secondary {
            background: #e9ecef;
            color: #495057;
        }
        .btn-secondary:hover {
            background: #dee2e6;
        }
        .btn-success {
            background: #28a745;
            color: white;
        }
        .btn-success:hover {
            background: #218838;
        }
        .search-box {
            flex: 1;
            min-width: 200px;
        }
        .search-box input {
            width: 100%;
            padding: 10px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        .search-box input:focus {
            outline: none;
            border-color: #667eea;
        }
        .copy-area {
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .copy-area h3 {
            margin-bottom: 12px;
            font-size: 16px;
            color: #495057;
        }
        .copy-area textarea {
            width: 100%;
            height: 120px;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            resize: vertical;
            transition: border-color 0.2s;
        }
        .copy-area textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        .marks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        .mark-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .mark-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .mark-card-header {
            background: #f8f9fa;
            padding: 12px 16px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .mark-number {
            background: #667eea;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
        }
        .mark-card-body {
            padding: 16px;
        }
        .mark-name {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 12px;
            color: #333;
            line-height: 1.4;
        }
        .mark-code {
            background: #f8f9fa;
            padding: 10px 12px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 11px;
            word-break: break-all;
            color: #666;
            margin-bottom: 16px;
            cursor: pointer;
            transition: background 0.2s;
            position: relative;
        }
        .mark-code:hover {
            background: #e9ecef;
        }
        .mark-code::after {
            content: 'Копировать';
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: #667eea;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .mark-code:hover::after {
            opacity: 1;
        }
        .datamatrix-container {
            display: flex;
            justify-content: center;
            padding: 16px;
            background: white;
            border-radius: 8px;
            border: 2px dashed #e9ecef;
        }
        .datamatrix-container canvas {
            max-width: 150px;
            max-height: 150px;
        }
        .copy-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .copy-toast.show {
            opacity: 1;
            transform: translateY(0);
        }
        .hidden {
            display: none !important;
        }
        @media (max-width: 768px) {
            .marks-grid {
                grid-template-columns: 1fr;
            }
            .toolbar {
                flex-direction: column;
            }
            .search-box {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍾 Марки из накладной</h1>
            <p>Извлеченные марки крепкого алкоголя с DataMatrix кодами</p>
            <div class="stats">
                <span class="stat-badge">📦 Всего: ${values.length} марок</span>
                <span class="stat-badge" id="visibleCount">👁 Показано: ${values.length}</span>
            </div>
        </div>

        <div class="toolbar">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="🔍 Поиск по названию или марке...">
            </div>
            <button class="btn btn-primary" onclick="copyAllMarks()">📋 Копировать все марки</button>
            <button class="btn btn-secondary" onclick="toggleCopyArea()">📄 Текстовый список</button>
            <button class="btn btn-success" onclick="downloadCSV()">⬇️ Скачать CSV</button>
            <button class="btn btn-primary" onclick="downloadImagesZip()" style="background: #6f42c1;">🖼️ Скачать фото (ZIP)</button>
        </div>

        <div class="copy-area hidden" id="copyArea">
            <h3>Все марки (для копирования)</h3>
            <textarea id="allMarksText" readonly>${valuesForCopy.join('\n')}</textarea>
        </div>

        <div class="marks-grid" id="marksGrid">
            <!-- Карточки будут сгенерированы через JS -->
        </div>
    </div>

    <div class="copy-toast" id="copyToast">✅ Скопировано!</div>

    <script>
        const marksData = ${JSON.stringify(values)};
        const allMarks = ${JSON.stringify(valuesForCopy)};

        // Генерация карточек
        function renderCards(data) {
            const grid = document.getElementById('marksGrid');
            grid.innerHTML = '';
            
            data.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'mark-card';
                card.dataset.name = item.fullName.toLowerCase();
                card.dataset.mark = item.mark.toLowerCase();
                
                card.innerHTML = \`
                    <div class="mark-card-header">
                        <span class="mark-number">\${index + 1}</span>
                        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="copyMark('\${item.mark}')">📋 Копировать</button>
                    </div>
                    <div class="mark-card-body">
                        <div class="mark-name">\${item.fullName}</div>
                        <div class="mark-code" onclick="copyMark('\${item.mark}')">\${item.mark}</div>
                        <div class="datamatrix-container">
                            <canvas id="dm-\${index}"></canvas>
                        </div>
                    </div>
                \`;
                
                grid.appendChild(card);
            });

            // Генерируем DataMatrix для каждой карточки
            data.forEach((item, index) => {
                try {
                    bwipjs.toCanvas(document.getElementById('dm-' + index), {
                        bcid: 'datamatrix',
                        text: item.mark,
                        scale: 3,
                        padding: 2
                    });
                } catch (e) {
                    console.error('Error generating DataMatrix for index ' + index, e);
                }
            });

            document.getElementById('visibleCount').textContent = '👁 Показано: ' + data.length;
        }

        // Поиск
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const filtered = marksData.filter(item => 
                item.fullName.toLowerCase().includes(query) || 
                item.mark.toLowerCase().includes(query)
            );
            renderCards(filtered);
        });

        // Копирование одной марки
        function copyMark(mark) {
            navigator.clipboard.writeText(mark).then(() => showToast());
        }

        // Копирование всех марок
        function copyAllMarks() {
            navigator.clipboard.writeText(allMarks.join('\\n')).then(() => showToast());
        }

        // Показ/скрыть текстовую область
        function toggleCopyArea() {
            document.getElementById('copyArea').classList.toggle('hidden');
        }

        // Тост-уведомление
        function showToast() {
            const toast = document.getElementById('copyToast');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }

        // Скачать CSV
        function downloadCSV() {
            let csv = '\\uFEFF№;Название;Марка\\n';
            marksData.forEach((item, index) => {
                csv += \`\${index + 1};"\${item.fullName}";"\${item.mark}"\\n\`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'марки_' + new Date().toISOString().slice(0,10) + '.csv';
            link.click();
        }

        // Извлечение короткого кода марки (начиная с позиции 3, 11 символов)
        function getShortCode(mark) {
            if (!mark || mark.length < 14) return mark.substring(0, 11);
            return mark.substring(3, 14);
        }

        // Очистка имени файла от недопустимых символов
        function sanitizeFilename(name) {
            return name.replace(/[\\\\/:*?"<>|]/g, '_').substring(0, 100);
        }

        // Скачать фото в ZIP архив
        async function downloadImagesZip() {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '⏳ Генерация...';
            btn.disabled = true;

            try {
                const zip = new JSZip();
                const imgFolder = zip.folder('марки_datamatrix');

                for (let i = 0; i < marksData.length; i++) {
                    const item = marksData[i];
                    const shortCode = getShortCode(item.mark);
                    const filename = sanitizeFilename(item.fullName + '_' + shortCode) + '.png';

                    // Создаём новый canvas для качественного изображения
                    const canvas = document.createElement('canvas');
                    try {
                        bwipjs.toCanvas(canvas, {
                            bcid: 'datamatrix',
                            text: item.mark,
                            scale: 5,
                            padding: 10
                        });

                        // Получаем PNG blob
                        const dataUrl = canvas.toDataURL('image/png');
                        const base64Data = dataUrl.split(',')[1];
                        imgFolder.file(filename, base64Data, { base64: true });
                    } catch (e) {
                        console.error('Error generating image for:', item.fullName, e);
                    }

                    // Обновляем прогресс
                    btn.textContent = \`⏳ \${i + 1}/\${marksData.length}\`;
                }

                // Генерируем ZIP
                btn.textContent = '⏳ Создание архива...';
                const content = await zip.generateAsync({ type: 'blob' });

                // Скачиваем
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'марки_datamatrix_' + new Date().toISOString().slice(0,10) + '.zip';
                link.click();

                showToast();
            } catch (e) {
                console.error('Error creating ZIP:', e);
                alert('Ошибка при создании архива: ' + e.message);
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }

        // Инициализация
        renderCards(marksData);
    <\/script>
</body>
</html>`;

            newTab.document.write(html);
            newTab.document.close();
        } catch (error) {
            console.error('Ошибка в showValuesInNewTab:', error);
            alert("Ошибка при открытии новой вкладки. Проверьте консоль.");
        }
    }

    function showErrorWindow(errorMessage) {
        alert(errorMessage);
    }

    async function setZeroRemaining() {
        try {
            const legalPersonId = localStorage.getItem('savedRestsLegalPersonId');
            if (!legalPersonId) { alert('Не удалось извлечь ID из localStorage.'); return; }

            async function fetchData() {
                let response = await fetch(`https://dxbx.ru/api/front/egais/rests/legalpersons/${legalPersonId}/beer`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pagination: { page: 0, size: 100 }, sort: [] })
                });
                if (!response.ok) throw new Error('Ошибка при загрузке данных');
                let data = await response.json();
                return data.records || [];
            }

            async function updateRealQuantity(alcoCode, realQuantity) {
                let response = await fetch(`https://dxbx.ru/api/front/egais/rests/legalpersons/${legalPersonId}/beer`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ alcoCode, realQuantity })
                });
                if (!response.ok) console.warn(`Ошибка при обновлении alcoCode ${alcoCode}`);
            }

            let records = await fetchData();
            if (records.length > 0) {
                for (const record of records) { await updateRealQuantity(record.alcoCode, 0); }
                alert('Остатки успешно обновлены на 0.');
            } else {
                alert('Записи для обновления не найдены.');
            }
        } catch (error) {
            console.error('Ошибка в setZeroRemaining:', error);
            alert('Произошла ошибка: ' + error.message);
        }
    }

    function checkAllCheckboxes() {
        try {
            let checkboxes = document.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length === 0) { alert('Чекбоксы не найдены на странице.'); return; }
            let checkedCount = 0;
            checkboxes.forEach(function(checkbox) {
                if (!checkbox.checked && !checkbox.disabled) {
                    checkbox.checked = true; checkedCount++;
                    const changeEvent = new Event('change', { bubbles: true });
                    checkbox.dispatchEvent(changeEvent);
                }
            });
            alert(`Отмечено чекбоксов: ${checkedCount}`);
        } catch (error) {
            console.error('Ошибка в checkAllCheckboxes:', error);
            alert('Произошла ошибка при установке чекбоксов.');
        }
    }

    function findFBValues() {
        try {
            const pattern = /FB-\d{15}/g;
            let fbValues = new Set();
            let foundCount = 0;
            $('*').each(function() {
                const text = $(this).text();
                const matches = text.match(pattern);
                if (matches) matches.forEach(m => { if (!fbValues.has(m)) { fbValues.add(m); foundCount++; } });
            });
            const sortedValues = Array.from(fbValues).sort();
            if (sortedValues.length > 0) {
                GM_setClipboard(sortedValues.join('\n'));
                alert(`Найдено: ${foundCount} значений | Уникальных: ${sortedValues.length}. Скопировано в буфер обмена.`);
            } else {
                alert('FB значения не найдены на странице.');
            }
            window.fbExtractedValues = sortedValues;
            return sortedValues;
        } catch (error) {
            console.error('Ошибка в findFBValues:', error);
            alert('Произошла ошибка при поиске FB значений.');
            return [];
        }
    }

    function startAutoExpand() {
        try {
            const config = { maxAttempts: 10, delayBetweenAttempts: 500 };
            function expandAllRows() {
                let expandedCount = 0;
                const possibleExpanders = [
                    '[class*="plus"]','[class*="expand"]','[class*="toggle"]',
                    '[onclick*="expand"]','[onclick*="show"]','[onclick*="open"]',
                    '.fa-plus','.glyphicon-plus','.icon-plus'
                ];
                possibleExpanders.forEach(selector => {
                    try {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(el => {
                            if (isVisible(el) && !isAlreadyExpanded(el)) { el.click(); expandedCount++; }
                        });
                    } catch (e) {}
                });
                const recognizeButtons = document.querySelectorAll('button, a, div, span');
                recognizeButtons.forEach(el => {
                    if (el.textContent.includes('Распознать') && isVisible(el)) { el.click(); expandedCount++; }
                });
                return expandedCount;
            }
            function isAlreadyExpanded(el) {
                return el.getAttribute('aria-expanded') === 'true' ||
                       el.className.includes('expanded') ||
                       el.className.includes('open') ||
                       el.className.includes('active');
            }
            function tryToExpandWithRetry(attempt = 1) {
                if (attempt > config.maxAttempts) { updateStatus('Завершено (макс. попыток)'); return; }
                updateStatus(`Работаем... Попытка ${attempt}/${config.maxAttempts}`);
                const expandedCount = expandAllRows();
                if (expandedCount > 0) {
                    updateStatus(`Раскрыто: ${expandedCount} элементов`);
                    setTimeout(() => tryToExpandWithRetry(attempt + 1), config.delayBetweenAttempts);
                } else {
                    updateStatus('Завершено (элементы не найдены)');
                }
            }
            function updateStatus(message) {
                let status = document.getElementById('expand-status');
                if (!status) { status = document.createElement('div'); status.id = 'expand-status'; status.className = 'status-indicator'; document.body.appendChild(status); }
                status.textContent = message;
                setTimeout(() => { if (status && status.textContent === message) status.remove(); }, 3000);
            }
            setTimeout(() => tryToExpandWithRetry(1), 1000);
        } catch (error) {
            console.error('Ошибка в startAutoExpand:', error);
            alert('Произошла ошибка при автораскрытии строк. Проверьте консоль для деталей.');
        }
    }

    function generatePassword() {
        try {
            const lowercase = 'abcdefghijklmnopqrstuvwxyz';
            const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const allChars = lowercase + uppercase + numbers + specialChars;
            let password = '';
            let used = new Set();

            const upperChar = uppercase[Math.floor(Math.random() * uppercase.length)];
            password += upperChar; used.add(upperChar);
            for (let i = 0; i < 15; i++) {
                let ch;
                do { ch = allChars[Math.floor(Math.random() * allChars.length)]; } while (used.has(ch));
                password += ch; used.add(ch);
            }
            password = password.split('').sort(() => Math.random() - 0.5).join('');
            GM_setClipboard(password);
            alert(`Сгенерирован пароль: ${password}\nПароль скопирован в буфер обмена.`);
        } catch (error) {
            console.error('Ошибка в generatePassword:', error);
            alert('Произошла ошибка при генерации пароля.');
        }
    }

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    function init() {
        debugLog('Скрипт DXBX Инструменты инициализирован');
        initTools();
        setupUrlWatcher();
        // Первичное обновление состояния меню
        setTimeout(updateMenuItemsState, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


