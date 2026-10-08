document.addEventListener("DOMContentLoaded", () => {
    const readerArea = document.getElementById('readerArea');

    // ==========================================
    // 1. 无缝加载下一篇文档的逻辑
    // ==========================================
    function setupScrollTrigger(triggerEl) {
        if (!triggerEl) return;

        // 使用交叉观察器侦测“下拉触发区”是否进入了屏幕
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadNextChapter(triggerEl);
            }
        }, { 
            root: readerArea, 
            threshold: 0.1 // 稍微滚动进触发区 10% 就开始加载
        });
        
        observer.observe(triggerEl);
    }

    function loadNextChapter(triggerEl) {
        const nextUrl = triggerEl.getAttribute('data-next');
        if (!nextUrl) return; // 如果没有下一章了，就停止

        // ⚠️【极其重要的保护机制】
        // 如果你在本地电脑上直接双击 html 文件打开，由于浏览器安全限制，无法使用静默拉取。
        // 这时我们让它优雅地回退为“普通的跳转页面”，依然不影响你的阅读体验。
        if (window.location.protocol === 'file:') {
            triggerEl.innerHTML = "<span>正在进入下一章...</span>";
            setTimeout(() => { window.location.href = nextUrl; }, 300);
            return;
        }

        // 如果在服务器上（比如传到了 GitHub），则执行高级的无缝拉取！
        triggerEl.innerHTML = "<span>正在解析文档...</span>";

        fetch(nextUrl)
            .then(response => response.text())
            .then(htmlString => {
                // 将拉取到的网页代码转换成可操作的 DOM 结构
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');

                // 提取下一章的正文和下一章的触发器
                const newChapter = doc.querySelector('.chapter');
                const newTrigger = doc.querySelector('.scroll-trigger');

                if (newChapter) {
                    triggerEl.remove(); // 删掉旧的触发器文字
                    readerArea.appendChild(newChapter); // 把新章节像拼图一样拼接到下面

                    if (newTrigger) {
                        readerArea.appendChild(newTrigger); // 拼接新的触发器
                        setupScrollTrigger(newTrigger); // 重新给新的触发器装上侦测雷达
                    }
                    
                    // 新章节进来了，重新启动目录定位雷达
                    setupSidebarObserver(); 
                }
            })
            .catch(() => {
                // 如果网络波动加载失败，强制改为页面跳转
                window.location.href = nextUrl;
            });
    }

    // 初始化页面底部的触发器
    setupScrollTrigger(document.querySelector('.scroll-trigger'));


    // ==========================================
    // 2. 左侧目录高亮 & 网址自动更改逻辑
    // ==========================================
    let sidebarObserver;
    
    function setupSidebarObserver() {
        if (sidebarObserver) sidebarObserver.disconnect(); // 清除旧雷达

        // 侦测哪个章节目前在屏幕的中上部
        sidebarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentUrl = entry.target.getAttribute('data-url');

                    // 1. 改变左侧目录高亮
                    document.querySelectorAll('.toc-link').forEach(link => {
                        link.classList.remove('active');
                        // 如果目录链接和当前章节的文件名对上了，就点亮它
                        if (link.getAttribute('href') === currentUrl) {
                            link.classList.add('active');
                        }
                    });

                    // 2. 静默修改浏览器上方的网址栏 (极客细节，用户刷新也不会回到第一章)
                    window.history.replaceState(null, '', currentUrl);
                }
            });
        }, { 
            root: readerArea, 
            rootMargin: '-10% 0px -60% 0px' // 侦测区域设定在屏幕上半截
        });

        // 让雷达扫描当前载入的所有章节
        document.querySelectorAll('.chapter').forEach(chap => {
            sidebarObserver.observe(chap);
        });
    }

    setupSidebarObserver();
});