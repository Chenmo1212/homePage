var globe, scene, node, guestbook;

document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState === "complete") {
        document.getElementById('loading').style.display = 'none';
    }
}

window.onload = () => {
    globe = new Globe();
    globe.init();

    scene = new Scene();
    scene.init();

    node = new Node();
    guestbook = new Guestbook();
    guestbook.init()
};

const switchLanguage = () => {
    const current = document.getElementsByTagName("html")[0].getAttribute("lang").substr(0, 2);
    document.cookie = "lang=" + (current === "en" ? "zh" : "en");
    location.reload()
};

class Globe {
    constructor() {
        this.canvas = document.getElementById("globe");
        this.planet = planetaryjs.planet();
        this.diameter = 0
    }

    init() {
        this.planet.loadPlugin(this.rotate(10));
        this.planet.loadPlugin(
            planetaryjs.plugins.earth({
                topojson: {file: "./dist/data/borderless-world.json"},
                oceans: {fill: "#dddee0"},
                land: {fill: "#f7f7f7"}
            })
        );
        this.planet.loadPlugin(planetaryjs.plugins.drag({
            onDragStart() {
                this.plugins.rotate.pause()
            },
            onDragEnd() {
                this.plugins.rotate.resume()
            }
        }));

        this.planet.loadPlugin(planetaryjs.plugins.pings({
            color: "#df5f5f", ttl: 2000, angle: 2
        }));

        this.locations();
        this.scale();
        this.planet.draw(this.canvas);
        this.planet.projection.rotate([0, -25, 0]); // Focus on the northern hemisphere
        window.addEventListener("resize", () => this.scale())
    }

    scale() {
        const vw = window.innerWidth;
        const diam = Math.max(300, Math.min(500, vw - (vw * .6)));
        const radius = diam / 2;
        this.canvas.width = diam;
        this.canvas.height = diam;
        this.planet.projection.scale(radius).translate([radius, radius]);
        this.diameter = diam;
    }

    rotate(dps) {
        return planet => {
            let lastTick = null;
            let paused = false;

            planet.plugins.rotate = {
                pause() {
                    paused = true
                },
                resume() {
                    paused = false
                }
            };

            planet.onDraw(() => {
                if (paused || !lastTick) {
                    lastTick = new Date()
                } else {
                    const now = new Date();
                    const delta = now - lastTick;
                    const rotation = planet.projection.rotate();
                    rotation[0] += dps * delta / 1000;

                    if (rotation[0] >= 180)
                        rotation[0] -= 360;

                    planet.projection.rotate(rotation);
                    lastTick = now
                }
            })
        }
    }

    locations() {
        d3.json("./dist/data/coordinates.json", (error, data) => {
            if (error) return console.error(error)

            for (const c of data.coordinates) {
                setInterval(() => {
                    this.planet.plugins.pings.add(c[0], c[1])
                }, Math.floor(Math.random() * 3000) + 2000)
            }
        })
    }
}

class Scene {
    constructor() {
        this.controller = new ScrollMagic.Controller()
    }

    init() {
        this.controller.addScene([
            this.intro(),
            this.autodidact(),
            this.globe(),
            this.goFar(),
            this.photography_text(),
            this.photo(),
            this.design(),
            this.programming(),
            this.node(),
            this.connectProgram(),
            this.blog(),
            this.blogShowcase(),
            this.emoji(),
            this.tiku(),
        ])
    }

    intro() {
        const tween = new TimelineMax().add([
            TweenMax.fromTo("#heading", 1, {zIndex: 1, z: 1}, {yPercent: -23.6, autoAlpha: 0, ease: Linear.easeNone}),
            TweenMax.fromTo("#subheading", 1, {zIndex: 1}, {yPercent: -14.5, autoAlpha: 0, ease: Linear.easeNone}),
            TweenMax.to("#slice-left", 1, {yPercent: -38.2, autoAlpha: 0, ease: Linear.easeNone}),
            TweenMax.to("#slice-right", 1, {yPercent: -61.8, autoAlpha: 0, ease: Linear.easeNone})
        ]);

        return new ScrollMagic.Scene({
            duration: "61.8%"
        })
            .setTween(tween)
    }

    autodidact() {
        const tween = new TimelineMax().add([
            TweenMax.set("#content", {y: -200}),
            TweenMax.fromTo("#text-become-autodidact", 1, {y: 200}, {y: 0, ease: Linear.easeNone}),
            TweenMax.to("#text-become-autodidact", .5, {autoAlpha: 0, ease: Linear.easeNone}),
            // TweenMax.fromTo("#text-learn-from", 1, {y: 200}, {y: 0, ease: Linear.easeNone}),
            // TweenMax.fromTo("#text-learn-from", 1, {y: 200}, {y: 0, ease: Linear.easeNone}),
            // TweenMax.to("#text-learn-from", .5, {autoAlpha: 0, ease: Linear.easeNone}),

            TweenMax.fromTo("#traveling1", 1, {y: 330}, {y: 280, ease: Linear.easeNone}),
            TweenMax.fromTo("#traveling1", .5, {autoAlpha: 0}, {autoAlpha: 1, ease: Linear.easeNone})
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#content",
            offset: 500, // 距离触发元素距离为500时开始动画
            duration: "61.8%", // 动画有效范围
        })
            .setTween(tween)
    }

    globe() {
        const blur = d3.scale.linear().domain([375, 2560]).range([3, 6]);
        const tween = new TimelineMax().add([
            TweenMax.fromTo("#globe-container", .8, {"-webkit-filter": `blur(${blur(window.innerWidth)}px)`}, {
                "-webkit-filter": "blur(0)",
                ease: Linear.easeNone
            }),
            TweenMax.fromTo("#globe", .5, {scale: Math.max(800, window.innerWidth) / globe.diameter}, {
                scale: 1,
                y: 240,
                ease: Linear.easeNone
            })
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#content",
            offset: 380,
            duration: "50%",
        })
            .setTween(tween)
    }

    goFar() {
        const tween = new TimelineMax().add([
            TweenMax.to("#motto", 1, {yPercent: -30, autoAlpha: 0, ease: Linear.easeNone}),
            TweenMax.fromTo("#look", 1, {yPercent: 30, autoAlpha: 0}, {
                yPercent: 0,
                autoAlpha: 1,
                ease: Linear.easeNone
            }),
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#go_far",
            triggerHook: .5,
            duration: "38.2%",
        })
            .setTween(tween)
    }

    photography_text() {
        const tween = new TimelineMax().add([
            TweenMax.to("#look", 1, {yPercent: -30, autoAlpha: 0, ease: Linear.easeNone}),
            TweenMax.fromTo("#photo", 1, {yPercent: 30, autoAlpha: 0}, {
                yPercent: 0,
                autoAlpha: 1,
                ease: Linear.easeNone
            }),
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#go_far",
            triggerHook: .5,
            offset: 300,
            duration: "38.2%",
        })
            .setTween(tween)
    }

    photo() {
        const tween = new TimelineMax().add([
            TweenMax.to("#group", 1, {rotationX: 6, rotationY: 0, rotationZ: 4.5, ease: Linear.easeNone}),
            TweenMax.fromTo("#photo-a", 1, {"-webkit-filter": "blur(0)"}, {
                "-webkit-filter": `blur(3px)`,
                scale: 1.3,
                xPercent: -38.2,
                yPercent: -38.2,
                ease: Linear.easeIn
            }),
            TweenMax.to("#photo-b", 1, {xPercent: -18.2, yPercent: -18.2, ease: Linear.easeIn}),
            TweenMax.fromTo("#photo-c", 1, {"-webkit-filter": "blur(0)"}, {
                "-webkit-filter": `blur(6px)`,
                scale: 1.6,
                xPercent: -61.8,
                yPercent: -61.8,
                ease: Linear.easeIn
            }),
            TweenMax.to("#photo-d", 1, {xPercent: -1.8, yPercent: -1.8, ease: Linear.easeIn}),
            TweenMax.fromTo("#photo-e", 1, {"-webkit-filter": "blur(0)"}, {
                "-webkit-filter": `blur(8px)`,
                xPercent: -38.2,
                yPercent: -38.2,
                ease: Linear.easeIn
            }),
            TweenMax.fromTo("#photo-f", 1, {"-webkit-filter": "blur(0)"}, {
                "-webkit-filter": `blur(6px)`,
                xPercent: -21.8,
                yPercent: -21.8,
                ease: Linear.easeIn
            }),
            TweenMax.fromTo("#photo-g", 1, {"-webkit-filter": "blur(0)"}, {
                "-webkit-filter": `blur(3px)`,
                scale: 1.1,
                xPercent: -68.8,
                yPercent: -88.8,
                ease: Linear.easeIn
            }),
            TweenMax.fromTo("#photo-h", 1, {"-webkit-filter": "blur(0)"}, {
                "-webkit-filter": `blur(2px)`,
                scale: 1.1,
                xPercent: -51.8,
                yPercent: -61.8,
                ease: Linear.easeIn
            }),
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#photography",
            triggerHook: .1,
            offset: -300,
            duration: "100%",
        })
            .setTween(tween)
    }

    programming() {
        const tween = new TimelineMax().add([
            TweenMax.fromTo(".text-programming", 1, {autoAlpha: 0}, {
                yPercent: -30,
                autoAlpha: 1,
                ease: Linear.easeNone
            }),
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#programming",
            triggerHook: .5,
            duration: "38.2%",
        })
            .setTween(tween)
    }

    design() {
        const tween = new TimelineMax().add([
            TweenMax.fromTo("#text-design", .5, {autoAlpha: 0.5}, {yPercent: -30, autoAlpha: 1, ease: Linear.easeNone}),
            TweenMax.fromTo(".design-pic-left", 1, {rotation: 60, scale: 0.6, autoAlpha: 0, x: -100}, {
                rotation: 0,
                scale: 1.1,
                autoAlpha: 1,
                x: 0,
                ease: Linear.easeNone
            }),
            TweenMax.fromTo(".design-pic-right", 1, {rotation: -60, scale: 0.6, autoAlpha: 0, x: 100}, {
                rotation: 0,
                scale: 1.1,
                autoAlpha: 1,
                x: 0,
                ease: Linear.easeNone
            })
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#design",
            triggerHook: .5,
            offset: -200,
            duration: "40.2%",
        })
            .setTween(tween)
    }

    node() {
        const tween = new TimelineMax().add([
            TweenMax.fromTo("#nodes path", 1, {"stroke-dashoffset": 1200}, {
                "stroke-dashoffset": 0,
                ease: Linear.easeIn
            })
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#nodes",
            triggerHook: .5,
            duration: "80%",
        })
            .setTween(tween)
    }

    connectProgram() {
        const tween = new TimelineMax().add([
            TweenMax.to("#text-Undo", 1, {yPercent: -30, autoAlpha: 0, ease: Linear.easeNone}),
            TweenMax.fromTo("#text-dot-connecting", 1, {yPercent: 30, autoAlpha: 0}, {
                yPercent: 0,
                autoAlpha: 1,
                ease: Linear.easeNone
            })
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#connect",
            triggerHook: .5,
            duration: "38.2%",
        })
            .setTween(tween)
    }

    blog() {
        const tween = new TimelineMax().add([
            TweenMax.fromTo("#text-blog", 1, {y: "-50vh"}, {y: 0, ease: Linear.easeNone}),
            TweenMax.fromTo("#backdrop", 1, {height: 0}, {height: "100%", ease: Linear.easeNone}),
            TweenMax.fromTo("#text-blog", 1, {color: '#404040'}, {color: '#fff', ease: Linear.easeNone}),
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#blog",
            triggerHook: 1,
            duration: "100%",
        })
            .setTween(tween)
    }

    blogShowcase() {
        return new ScrollMagic.Scene({
            triggerElement: "#blog",
            triggerHook: .1,
            duration: "100%",
        })
            .setClassToggle("#blog", "active")
    }

    emoji() {
        const tween = new TimelineMax().add([
            TweenMax.to("#emoji-showcase-a", 1, {yPercent: -20, ease: Linear.easeNone}),
            TweenMax.to("#emoji-showcase-b", 1, {yPercent: -30, ease: Linear.easeNone})
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#emoji",
            triggerHook: .1,
            duration: "100%",
        })
            .setTween(tween)
    }

    tiku() {
        const tween = new TimelineMax().add([
            TweenMax.from("#tiku-showcase-a", 1, {xPercent: 10, ease: Linear.easeNone}),
            TweenMax.from("#tiku-showcase-b", 1, {xPercent: 30, ease: Linear.easeNone}),
            TweenMax.from("#tiku-showcase-c", 1, {xPercent: 60, ease: Linear.easeNone}),
        ]);

        return new ScrollMagic.Scene({
            triggerElement: "#tiku",
            triggerHook: .9,
            duration: "100%",
        })
            .setTween(tween)
    }
}

class Node {
    constructor() {
        this.container = document.getElementById("nodes")
    }

    increment() {
        this.container.scrollLeft += window.innerWidth
    }

    didScroll() {
        const margin = 60;
        const predicate = this.container.scrollWidth - this.container.scrollLeft <= window.innerWidth + margin;
        this.container.classList = predicate ? "reached" : ""
    }
}

/**
 * 留言反馈
 */
class Guestbook {
    constructor() {
        this.messages = this.element("recent-messages");
        this.container = this.element("new-message");
        this.nextButton = this.element("next-step-button");
        this.contentField = this.element("message-content");
        this.nameField = this.element("message-name");
        this.emailField = this.element("message-email");
        this.URLField = this.element("message-url");
    }

    init() {
        if (!this.messages) return

        this.GET(xhr => {
            if (xhr.status === 200 || xhr.status == 201) {
                // console.log(JSON.parse(xhr.responseText).GuestMsg)
                this.render(JSON.parse(xhr.responseText).GuestMsg)
                this.messages.parentNode.classList += " fetched"
            } else
                console.error("Failed to load messages")
        })
    }

    sleep(n) {
        let start = new Date().getTime();//定义起始时间的毫秒数
        while (true) {
            let time = new Date().getTime();//每次执行循环取得一次当前时间的毫秒数
            if (time - start > n) {//如果当前时间的毫秒数减去起始时间的毫秒数大于给定的毫秒数，即结束循环
                break;
            }
        }
    }

    render(items) {
        items.forEach(item => {
                this.messages.insertAdjacentHTML("beforeend", this.template(item))
                this.sleep(200)
            }
        )
    }

    template(item) {
        // 随机头像api： https://blog.csdn.net/ipython100/article/details/106719482
        let sex = item.sex === 'female' ? 'c2' : 'c3';
        let avatar = 'http://api.btstu.cn/sjtx/api.php?lx=' + sex + '&format=images?' + new Date().getTime();
        return `<div class="message">
    				<header>
    					<img src="${avatar}" />
    					<h3>${item.name}</h3>
    					<span class="message-date">${item.date}</span>
    				</header>
    				<div class="message-content">
    					<p>${item.content}</p>
    				</div>
    			</div>`
    }

    element(id) {
        return document.getElementById(id)
    }

    next() {
        this.container.className = "second-step"
    }

    post(button) {
        let author_content = this.contentField.value;
        let UID = 'UID_pNfFHmlL26qUZuXmGkrS9CGNUSLD';
        let appToken = 'AT_aGS8jqOTZDiEAwbZFH2WdEgV15tgIl7j';
        let author_email = this.emailField.value;
        const data = {
            summary: "主页留言", //消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
            content: `#### 类型：\n\n${'主页留言'}\n\n---\n\n#### 内容：\n\n${author_content}\n\n---\n\n#### 称呼：\n\n
            ${this.nameField.value}\n\n---\n\n#### 联系方式：\n\nEmail: ${author_email}\nUrl: ${this.URLField.value}\n
            Agent:${navigator.userAgent + " DWAPI/7.0"}\n`,
            contentType: 3,//内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
            uids: [UID], //发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
            appToken: appToken
        };

        const re = /\S+@\S+\.\S+/;
        if (author_email.length > 0 && !re.test(author_email)) {
            console.info("Todo: handle invalid email address");
            return
        }

        button.className = "posting";
        button.innerHTML = "";

        this.POST(JSON.stringify(data), xhr => {
            if (xhr.status === 200 || xhr.status === 201)
                this.messageDidPost();
            else
                alert("Please try again later")
        })
    }

    contentDidChange(e) {
        this.nextButton.className = e.value.length < 5 ? "inactive" : ""
    }

    messageDidPost() {
        this.container.className = "third-step"
    }

    request(url, method, payload, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && callback)
                callback(xhr)
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(payload)
    }

    GET(callback) {
        let url = './dist/data/guestMsg.json';
        this.request(url, "GET", null, callback)
    }

    POST(payload, callback) {
        let url = 'https://wxpusher.zjiecode.com/api/send/message/';
        this.request(url, "POST", payload, callback)
    }
}

/**
 *  ============================
 *  暗黑模式
 *  ============================
 */
let darkMode = localStorage.getItem("darkMode");
let obj = document.querySelector('.mode');
let obj_box = document.querySelector('.dark_mode');
let code = document.querySelector('#code');

function enableDarkMode() {
    darkMode = 'enabled';
    localStorage.setItem("darkMode", "enabled");
    document.documentElement.style.setProperty('--color-font', '#fdfdfd');
    document.documentElement.style.setProperty('--color-background', '#404040');
    obj_box.classList.toggle('dark');
    obj.classList.toggle('off');
    obj.classList.add('scaling');
    setTimeout(function () {
        obj.classList.remove('scaling');
    }, 520);
    code.src = './dist/images/code_dark.svg'
}

function disableDarkMode() {
    darkMode = null;
    localStorage.setItem("darkMode", null);
    document.documentElement.style.setProperty('--color-font', '#404040');
    document.documentElement.style.setProperty('--color-background', '#fdfdfd');
    obj_box.classList.toggle('dark');
    obj.classList.toggle('off');
    obj.classList.add('scaling');
    setTimeout(function () {
        obj.classList.remove('scaling');
    }, 520);
    code.src = './dist/images/code.svg'
}

if (darkMode === "enabled") {
    enableDarkMode();
    obj_box.classList.add('dark')
} else {
    disableDarkMode();
    obj_box.classList.remove('dark')
}

// Listeners
const darkModeToggle = document.querySelector("#darkMode");
darkModeToggle.onclick = function () {
    if (darkMode === 'enabled') {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

/**
 * 图片懒加载
 */
var num = document.getElementsByTagName('img').length;
var img = document.getElementsByTagName("img");
// 存储图片加载到的位置，避免每次都从第一张图片开始遍历
var n = 0;
// 页面载入完毕加载可视区域内的图片
lazyLoad();
window.onscroll = lazyLoad;

/**
 * 监听页面滚动事件
 */
function lazyLoad() {
    // 可见区域高度
    let seeHeight = document.documentElement.clientHeight;
    // 滚动条距离顶部高度
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    for (let i = n; i < num; i++) {

        // 用于定位的图片(offset仅为相对父元素的距离，因此需要进行判断）
        let offsetTop = img[i].offsetTop;
        let par = img[i].offsetParent;
        if (par.nodeName.toLowerCase() !== 'body') {
            while (par) {
                offsetTop += par.offsetTop;
                par = par.offsetParent;
            }
        }
        if (offsetTop < seeHeight + scrollTop + 300) {  // 提前300px进行加载，用作缓冲
            // console.log(i, '----', offsetTop)
            if (img[i].getAttribute("src") === "https://blog-img-1300024309.cos.ap-nanjing.myqcloud.com/img/me.jpg") {
                img[i].src = img[i].getAttribute("data-src");
            }
            n = i + 1;
        }
    }
}
