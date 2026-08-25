// 获取包裹所有图片的容器
const sliderWrapper = document.getElementById('sliderWrapper');
// 获取所有的单独图片（幻灯片）
const slides = document.querySelectorAll('.slide');

let currentIndex = 0; // 当前显示的图片索引（从 0 开始计数）
const totalSlides = slides.length; // 自动计算一共有多少张图片

/**
 * 切换到指定图片的函数
 */
function updateSlider() {
    // 根据当前索引，向左平移容器的百分比。例如 index=1，就向左平移 100% 显示第二张图
    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
}

/**
 * 下一张图片的函数
 */
function nextSlide() {
    // 如果已经到了最后一张图，就回到第一张（0）；否则进入下一张
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
}

/**
 * 上一张图片的函数
 */
function prevSlide() {
    // 如果是第一张图，就跳到最后一张；否则回到上一张
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
}

// 可选：实现自动轮播功能
// setInterval 意思是“每隔一段时间自动执行一次代码”
// 这里的 5000 代表 5000 毫秒（即 5 秒），每5秒自动切下一张图。
// 如果你不需要自动轮播，把下面这行代码前面加上 // 注释掉即可。
let autoPlay = setInterval(nextSlide, 5000);

// 用户手动点击时，重置自动播放的时间，防止体验不佳
const buttons = document.querySelectorAll('.slider-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        clearInterval(autoPlay); // 停止计时器
        autoPlay = setInterval(nextSlide, 5000); // 重新开始计时
    });
});