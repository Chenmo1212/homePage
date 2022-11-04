var globe, scene, node, guestbook

document.onreadystatechange = completeLoading

//加载状态为complete时移除loading效果
function completeLoading() {
  if (document.readyState === 'complete') {
    document.getElementById('loading').style.display = 'none'
  }
}

// 页面加载完以后加载字体文件
function getHomeFont() {
  let xhr = new XMLHttpRequest() // 定义一个异步对象
  xhr.open('GET', './dist/fonts/SemiBold.ttf', true) // 异步GET方式加载字体
  xhr.responseType = 'arraybuffer' //把异步获取类型改为arraybuffer二进制类型
  xhr.onload = function () {
    // 这里做了一个判断：如果浏览器支持FontFace方法执行
    if (typeof FontFace != 'undefined') {
      let buffer = this.response  //获取字体文件二进制码
      let myFonts = new FontFace('SemiBold', buffer)  // 通过二进制码实例化字体对象
      document.fonts.add(myFonts) // 将字体对象添加到页面中
    } else {
      // 如果浏览器不支持FontFace方法，直接添加样式到页面
      let styles = document.createElement('style')
      styles.innerHTML = '@font-face{font-family:"SemiBold";src:url("./dist/fonts/SemiBold.ttf") format("truetype");font-display:swap;}'
      console.log(document.getElementsByTagName('head'))
      document.getElementsByTagName('head')[0].appendChild(styles)
    }
  }
  xhr.send()
}

window.onload = () => {
  globe = new Globe()
  globe.init()

  scene = new Scene()
  scene.init()

  node = new Node()
  guestbook = new Guestbook()
  guestbook.init()

  getHomeFont()
}

const switchLanguage = () => {
  const current = document.getElementsByTagName('html')[0].getAttribute('lang').substr(0, 2)
  document.cookie = 'lang=' + (current === 'en' ? 'zh' : 'en')
  location.reload()
}

class Globe {
  constructor() {
    this.canvas = document.getElementById('globe')
    this.planet = planetaryjs.planet()
    this.diameter = 0
  }

  init() {
    this.planet.loadPlugin(this.rotate(10))
    this.planet.loadPlugin(
      planetaryjs.plugins.earth({
        topojson: { file: './dist/data/borderless-world.json' },
        oceans: { fill: '#dddee0' },
        land: { fill: '#f7f7f7' }
      })
    )
    this.planet.loadPlugin(planetaryjs.plugins.drag({
      onDragStart() {
        this.plugins.rotate.pause()
      },
      onDragEnd() {
        this.plugins.rotate.resume()
      }
    }))

    this.planet.loadPlugin(planetaryjs.plugins.pings({
      color: '#df5f5f', ttl: 2000, angle: 2
    }))

    this.locations()
    this.scale()
    this.planet.draw(this.canvas)
    this.planet.projection.rotate([0, -25, 0]) // Focus on the northern hemisphere
    window.addEventListener('resize', () => this.scale())
  }

  scale() {
    const vw = window.innerWidth
    const diam = Math.max(300, Math.min(500, vw - (vw * .6)))
    const radius = diam / 2
    this.canvas.width = diam
    this.canvas.height = diam
    this.planet.projection.scale(radius).translate([radius, radius])
    this.diameter = diam
  }

  rotate(dps) {
    return planet => {
      let lastTick = null
      let paused = false

      planet.plugins.rotate = {
        pause() {
          paused = true
        },
        resume() {
          paused = false
        }
      }

      planet.onDraw(() => {
        if (paused || !lastTick) {
          lastTick = new Date()
        } else {
          const now = new Date()
          const delta = now - lastTick
          const rotation = planet.projection.rotate()
          rotation[0] += dps * delta / 1000

          if (rotation[0] >= 180)
            rotation[0] -= 360

          planet.projection.rotate(rotation)
          lastTick = now
        }
      })
    }
  }

  locations() {
    d3.json('./dist/data/coordinates.json', (error, data) => {
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
      this.selfIntro(),
      this.globe(),
      this.experience(),
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
      this.book(),
    ])
  }

  intro() {
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#heading', 1, { zIndex: 1, z: 1 }, { yPercent: -23.6, autoAlpha: 0, ease: Linear.easeNone }),
      TweenMax.fromTo('#subheading', 1, { zIndex: 1 }, { yPercent: -14.5, autoAlpha: 0, ease: Linear.easeNone }),
      TweenMax.to('#slice-left', 1, { yPercent: -38.2, autoAlpha: 0, ease: Linear.easeNone }),
      TweenMax.to('#slice-right', 1, { yPercent: -61.8, autoAlpha: 0, ease: Linear.easeNone })
    ])

    return new ScrollMagic.Scene({
      duration: '61.8%'
    })
      .setTween(tween)
  }

  selfIntro() {
    const tween = new TimelineMax().add([
      TweenMax.set('#self_intro', { y: -200 }),

      TweenMax.fromTo('#intro_text1', 1, { y: 100 }, { y: 0, ease: Linear.easeInOut }),
      TweenMax.to('#intro_text1', 1, { autoAlpha: 0, ease: Linear.easeInOut }),

      TweenMax.fromTo('#intro_text2', .5, { y: 200, autoAlpha: 0 }, { y: 150, autoAlpha: 1 }),
      TweenMax.fromTo('#intro_text3', 3, { autoAlpha: 0, y: 350 }, { y: 250, autoAlpha: 1 })
    ])
    return new ScrollMagic.Scene({
      triggerElement: '#self_intro',
      offset: 200, // 距离触发元素距离为200时开始动画
      duration: '61.8%', // 动画有效范围, 不是时间
    })
      .setTween(tween)
  }

  globe() {
    const blur = d3.scale.linear().domain([375, 2560]).range([3, 6])
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#intro_text2', 1, { autoAlpha: 1 }, { y: 0, autoAlpha: 0 }),
      TweenMax.fromTo('#intro_text3', 1, { autoAlpha: 1 }, { y: 100, autoAlpha: 0 }),
      TweenMax.fromTo('#globe1', .5, { autoAlpha: 0 }, { y: 100, autoAlpha: 1 }),

      TweenMax.fromTo('#globe-container', .8, { '-webkit-filter': `blur(${blur(window.innerWidth)}px)` }, {
        '-webkit-filter': 'blur(0)',
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('#globe', .5, { scale: Math.max(1000, window.innerWidth) / globe.diameter }, {
        scale: 1,
        y: 240,
        ease: Linear.easeNone
      })
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#go_far',
      offset: -100,
      duration: '100%',
    })
      .setTween(tween)
  }

  experience() {
    const tween = new TimelineMax()
    tween.fromTo('#experience1', 1, { y: 0, autoAlpha: 0 }, { y: -100, autoAlpha: 1 })
    tween.fromTo('#experience2', 1, { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '+=2')

    return new ScrollMagic.Scene({
      triggerElement: '#experience',
      triggerHook: .5,
      duration: '38.2%',
    })
      .setTween(tween)
  }

  photography_text() {
    const tween = new TimelineMax().add([
      TweenMax.to('#experience2', 1, { yPercent: -30, autoAlpha: 0, ease: Linear.easeNone }),
      TweenMax.fromTo('#photo', 1, { yPercent: 30, autoAlpha: 0 }, {
        yPercent: 0,
        autoAlpha: 1,
        ease: Linear.easeNone
      }),
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#photography_text',
      triggerHook: .5,
      offset: -100,
      duration: '38.2%',
    })
      .setTween(tween)
  }

  photo() {
    const tween = new TimelineMax().add([
      TweenMax.to('#group', 1, { rotationX: 6, rotationY: 0, rotationZ: 4.5, ease: Linear.easeNone }),
      TweenMax.fromTo('#photo-a', 1, { '-webkit-filter': 'blur(0)' }, {
        '-webkit-filter': `blur(3px)`,
        scale: 1.3,
        xPercent: -38.2,
        yPercent: -38.2,
        ease: Linear.easeIn
      }),
      TweenMax.to('#photo-b', 1, { xPercent: -18.2, yPercent: -18.2, ease: Linear.easeIn }),
      TweenMax.fromTo('#photo-c', 1, { '-webkit-filter': 'blur(0)' }, {
        '-webkit-filter': `blur(6px)`,
        scale: 1.6,
        xPercent: -61.8,
        yPercent: -61.8,
        ease: Linear.easeIn
      }),
      TweenMax.to('#photo-d', 1, { xPercent: -1.8, yPercent: -1.8, ease: Linear.easeIn }),
      TweenMax.fromTo('#photo-e', 1, { '-webkit-filter': 'blur(0)' }, {
        '-webkit-filter': `blur(8px)`,
        xPercent: -38.2,
        yPercent: -38.2,
        ease: Linear.easeIn
      }),
      TweenMax.fromTo('#photo-f', 1, { '-webkit-filter': 'blur(0)' }, {
        '-webkit-filter': `blur(6px)`,
        xPercent: -21.8,
        yPercent: -21.8,
        ease: Linear.easeIn
      }),
      TweenMax.fromTo('#photo-g', 1, { '-webkit-filter': 'blur(0)' }, {
        '-webkit-filter': `blur(3px)`,
        scale: 1.1,
        xPercent: -68.8,
        yPercent: -88.8,
        ease: Linear.easeIn
      }),
      TweenMax.fromTo('#photo-h', 1, { '-webkit-filter': 'blur(0)' }, {
        '-webkit-filter': `blur(2px)`,
        scale: 1.1,
        xPercent: -51.8,
        yPercent: -61.8,
        ease: Linear.easeIn
      }),
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#photography',
      triggerHook: .1,
      offset: -300,
      duration: '100%',
    })
      .setTween(tween)
  }

  programming() {
    const tween = new TimelineMax()
    tween.add(TweenMax.fromTo('.programming1', 1, { autoAlpha: 0 }, { autoAlpha: 1 }))
    tween.add(TweenMax.fromTo('.programming2', 1, { y: 150, autoAlpha: 0 }, { y: 100, autoAlpha: 1 }, '+=2'))
    tween.add(TweenMax.fromTo('.programming3', 1, { y: 250, autoAlpha: 0 }, { y: 200, autoAlpha: 1 }, '+=2'))

    return new ScrollMagic.Scene({
      triggerElement: '#programming',
      duration: '100%',
    })
      .setTween(tween)
  }

  design() {
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#text-design', .5, { autoAlpha: 0.5 }, { yPercent: -30, autoAlpha: 1, ease: Linear.easeNone }),
      TweenMax.fromTo('.design-pic-left', 1, { rotation: 60, scale: 0.6, autoAlpha: 0, x: -100 }, {
        rotation: 0,
        scale: 1.1,
        autoAlpha: 1,
        x: 0,
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('.design-pic-right', 1, { rotation: -60, scale: 0.6, autoAlpha: 0, x: 100 }, {
        rotation: 0,
        scale: 1.1,
        autoAlpha: 1,
        x: 0,
        ease: Linear.easeNone
      })
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#design',
      triggerHook: .5,
      offset: -200,
      duration: '40.2%',
    })
      .setTween(tween)
  }

  node() {
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#nodes path', 1, { 'stroke-dashoffset': 1200 }, {
        'stroke-dashoffset': 0,
        ease: Linear.easeIn
      })
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#learned',
      triggerHook: .5,
      duration: '80%',
    })
      .setTween(tween)
  }

  connectProgram() {
    const tween = new TimelineMax().add([
      TweenMax.to('#text-Undo', 1, { yPercent: -30, autoAlpha: 0, ease: Linear.easeNone }),
      TweenMax.fromTo('#text-dot-connecting', 1, { yPercent: 30, autoAlpha: 0 }, {
        yPercent: 0,
        autoAlpha: 1,
        ease: Linear.easeNone
      })
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#connect',
      triggerHook: .5,
      duration: '38.2%',
    })
      .setTween(tween)
  }

  blog() {
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#text-blog', 1, { y: '-50vh' }, { y: 0, ease: Linear.easeNone }),
      TweenMax.fromTo('#backdrop', 1, { height: 0 }, { height: '100%', ease: Linear.easeNone }),
      TweenMax.fromTo('#text-blog', 1, { color: '#404040' }, { color: '#fff', ease: Linear.easeNone }),
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#blog',
      triggerHook: 1,
      duration: '100%',
    })
      .setTween(tween)
  }

  blogShowcase() {
    return new ScrollMagic.Scene({
      triggerElement: '#blog',
      triggerHook: .1,
      duration: '100%',
    })
      .setClassToggle('#blog', 'active')
  }

  emoji() {
    const tween = new TimelineMax().add([
      TweenMax.to('#emoji-showcase-a', 1, { yPercent: -20, ease: Linear.easeNone }),
      TweenMax.to('#emoji-showcase-b', 1, { yPercent: -30, ease: Linear.easeNone })
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#emoji',
      triggerHook: .1,
      duration: '100%',
    })
      .setTween(tween)
  }

  tiku() {
    const tween = new TimelineMax().add([
      TweenMax.from('#tiku-showcase-a', 1, { xPercent: 10, ease: Linear.easeNone }),
      TweenMax.from('#tiku-showcase-b', 1, { xPercent: 30, ease: Linear.easeNone }),
      TweenMax.from('#tiku-showcase-c', 1, { xPercent: 60, ease: Linear.easeNone }),
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#tiku',
      triggerHook: .8,
      duration: '100%',
    })
      .setTween(tween)
  }

  book() {
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#book-showcase-a', 1, { yPercent: '40%', xPercent: '25%' }, {
        yPercent: '0%',
        xPercent: '5%',
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('#book-showcase-b', 1, { yPercent: '40%', xPercent: '-5%' }, {
        yPercent: '0%',
        xPercent: '0%',
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('#book-showcase-c', 1, { yPercent: '40%', xPercent: '-20%' }, {
        yPercent: '0%',
        xPercent: '-2%',
        ease: Linear.easeNone
      }),
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#book',
      triggerHook: 1,
      duration: '100%',
    })
      .setTween(tween)
  }
}

class Node {
  constructor() {
    this.container = document.getElementById('nodes')
  }

  increment() {
    this.container.scrollLeft += window.innerWidth
  }

  didScroll() {
    const margin = 60
    const predicate = this.container.scrollWidth - this.container.scrollLeft <= window.innerWidth + margin
    this.container.classList = predicate ? 'reached' : ''
  }
}

/**
 * 留言反馈
 */
class Guestbook {
  constructor() {
    this.messages = this.element('recent-messages')
    this.container = this.element('new-message')
    this.nextButton = this.element('next-step-button')
    this.contentField = this.element('message-content')
    this.nameField = this.element('message-name')
    this.emailField = this.element('message-email')
    this.URLField = this.element('message-url')
  }

  init() {
    if (!this.messages) return

    this.GET(xhr => {
      if (xhr.status === 200 || xhr.status == 201) {
        let data = JSON.parse(xhr.responseText).data
        for (let i = 0; i < data.length; i++) {
          data[i].date = this.changeTimeStyle(data[i])
          data[i].sex = 'female'
        }
        this.render(data)
        this.messages.parentNode.classList += ' fetched'
      } else
        console.error('Failed to load messages')
    })
  }

  sleep(n) {
    let start = new Date().getTime()//定义起始时间的毫秒数
    while (true) {
      let time = new Date().getTime()//每次执行循环取得一次当前时间的毫秒数
      if (time - start > n) {//如果当前时间的毫秒数减去起始时间的毫秒数大于给定的毫秒数，即结束循环
        break
      }
    }
  }

  render(items) {
    items.forEach(item => {
        this.messages.insertAdjacentHTML('beforeend', this.template(item))
        this.sleep(200)
      }
    )
  }

  template(item) {
    // 随机头像api： https://blog.csdn.net/ipython100/article/details/106719482
    let sex = item.sex === 'female' ? 'c2' : 'c3'
//        let avatar = 'http://api.btstu.cn/sjtx/api.php?lx=' + sex + '&format=images?' + new Date().getTime();
    let avatar = 'https://api.prodless.com/avatar.png?color=' + Math.floor(Math.random() * 0xffffff).toString(16)
    return `<div class="message">
    				<header>
    					<img src="./dist/images/default.png" />
    					<h3>${item.name || '匿名'}</h3>
    					<span class="message-date">${item.date}</span>
    				</header>
    				<div class="message-content">
    					<p>${item.content}</p>
    				</div>
    			</div>`
  }

  // todo: 获取网站的ico文件当作头像
  getAvatar(url) {
    this.POST(url, JSON.stringify(data), xhr => {
      if (xhr.status === 200 || xhr.status === 201)
        console.log(xhr)
      else
        alert('Please try again later')
    })
  }

  element(id) {
    return document.getElementById(id)
  }

  next() {
    this.container.className = 'second-step'
  }

  submit(button) {
    let content = this.contentField.value
    let name = this.nameField.value
    let email = this.emailField.value
    let website = this.URLField.value

    const re = /\S+@\S+\.\S+/
    if (name.length <= 0) {
      alert('请输入您的昵称。')
      return
    }
    if (email.length <= 0) {
      alert('提示：请输入邮箱。')
      return
    } else if (!re.test(email)) {
      alert('提示：您的邮箱格式不对。')
      return
    }

    // this.postWx(content, name, email, website)
    this.postBackend(button, content, name, email, website)
  }

  postWx(content, name, email, website) {
    const data = {
      'corpid': 'ww09de43a6da48f6a4',
      'corpsecret': 'A_Wtv3PFqgUHDnqV93HcCzsLQuLGUjRjkQMDaAUcb8w',
      'agentid': '1000006',
      'title': '主页留言',
      'description': `#### 类型：\\n\\n 主页留言 \\n\\n---\\n\\n#### 内容：\\n\\n ${content} \\n\\n---\\n\\n#### 称呼：\\n\\n
            ${name}\\n\\n---\\n\\n#### 联系方式：\\n\\nEmail: ${email}\\nUrl: ${website}\\n
            Agent:${navigator.userAgent + ' DWAPI/7.0'}\\n`,
      'url': '' // 需要跳转的链接
    }

    // 将留言信息发送给微信提醒
    let wxUrl = 'https://api.htm.fun/api/Wechat/text_card/'
    this.POST(wxUrl, JSON.stringify(data), xhr => {
      if (xhr.status === 200 || xhr.status === 201)
        this.messageDidPost()
      else
        alert('留言功能暂不可用')
    })
  }

  postBackend(button, content, name, email, website) {
    const data = {
      name: name,
      content: content,
      email: email,
      website: website,
      agent: navigator.userAgent + ' DWAPI/7.0'
    }

    button.className = 'posting'
    button.innerHTML = ''

    // 将留言信息发送给后端（可能会失败）
    let backendUrl = 'https://api.chenmo1212.cn/message/post'
    this.POST(backendUrl, JSON.stringify(data), xhr => {
      if (xhr.status === 200 || xhr.status === 201)
        this.messageDidPost()
      else
        alert('Please try again later')
    })
  }

  // 更改时间格式
  changeTimeStyle(item) {
    const d = new Date(item.create_time)
    let timeStamp = d.getTime() / 1000 - 28800
    return this.getDateDiff(timeStamp, new Date(item.create_time))
  }

  // 更改时间格式的函数，改成几天前
  getDateDiff(dateTimeStamp, d) {
    let minute = 60
    let hour = minute * 60
    let day = hour * 24
    let halfamonth = day * 15
    let month = day * 30
    let now = new Date().getTime() / 1000
    let diffValue = now - dateTimeStamp
    if (diffValue < 0) return
    let monthC = diffValue / month
    let weekC = diffValue / (7 * day)
    let dayC = diffValue / day
    let hourC = diffValue / hour
    let minC = diffValue / minute
    let result = null
    if (monthC >= 13) {
      const resDate = d.getFullYear() + '-' + this.add_0((d.getMonth() + 1)) + '-' + this.add_0(d.getDate())
      const resTime = this.add_0(d.getHours()) - 8 + ':' + this.add_0(d.getMinutes()) + ':' + this.add_0(d.getSeconds())
      return resDate + ' ' + resTime
    } else if (monthC >= 1) {
      result = '' + parseInt(monthC) + '月前'
    } else if (weekC >= 1) {
      result = '' + parseInt(weekC) + '周前'
    } else if (dayC >= 1) {
      result = '' + parseInt(dayC) + '天前'
    } else if (hourC >= 1) {
      result = '' + parseInt(hourC) + '小时前'
    } else if (minC >= 1) {
      result = '' + parseInt(minC) + '分钟前'
    } else
      result = '刚刚'
    return result
  }

  add_0(s) {
    return s < 10 ? '0' + s : s
  }

  contentDidChange(e) {
    this.nextButton.className = e.value.length < 5 ? 'inactive' : ''
  }

  messageDidPost() {
    this.container.className = 'third-step'
  }

  request(url, method, payload, callback) {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && callback)
        callback(xhr)
    }
    xhr.open(method, url, true)
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(payload)
  }

  GET(callback) {
    let url = 'https://api.chenmo1212.cn/message/get'
    // let url = './dist/data/guestMsg.json';
    this.request(url, 'GET', null, callback)
  }

  POST(url, payload, callback) {
    this.request(url, 'POST', payload, callback)
  }
}

/**
 *  ============================
 *  暗黑模式
 *  ============================
 */
let darkMode = localStorage.getItem('darkMode')
let obj = document.querySelector('.mode')
let obj_box = document.querySelector('.dark_mode')
let code = document.querySelector('#code')

function enableDarkMode() {
  darkMode = 'enabled'
  localStorage.setItem('darkMode', 'enabled')
  document.documentElement.style.setProperty('--color-font', '#fdfdfd')
  document.documentElement.style.setProperty('--color-background', '#404040')
  obj_box.classList.toggle('dark')
  obj.classList.toggle('off')
  obj.classList.add('scaling')
  setTimeout(function () {
    obj.classList.remove('scaling')
  }, 520)
  code.src = './dist/images/code_dark.svg'
}

function disableDarkMode() {
  darkMode = null
  localStorage.setItem('darkMode', null)
  document.documentElement.style.setProperty('--color-font', '#404040')
  document.documentElement.style.setProperty('--color-background', '#fdfdfd')
  obj_box.classList.toggle('dark')
  obj.classList.toggle('off')
  obj.classList.add('scaling')
  setTimeout(function () {
    obj.classList.remove('scaling')
  }, 520)
  code.src = './dist/images/code.svg'
}

if (darkMode === 'enabled') {
  enableDarkMode()
  obj_box.classList.add('dark')
} else {
  disableDarkMode()
  obj_box.classList.remove('dark')
}

// Listeners
const darkModeToggle = document.querySelector('#darkMode')
darkModeToggle.onclick = function () {
  if (darkMode === 'enabled') {
    disableDarkMode()
  } else {
    enableDarkMode()
  }
}

/**
 * 图片懒加载
 */
var num = document.getElementsByTagName('img').length
var img = document.getElementsByTagName('img')
// 存储图片加载到的位置，避免每次都从第一张图片开始遍历
var n = 0
// 页面载入完毕加载可视区域内的图片
lazyLoad()
window.onscroll = lazyLoad

/**
 * 监听页面滚动事件
 */
function lazyLoad() {
  // 可见区域高度
  let seeHeight = document.documentElement.clientHeight
  // 滚动条距离顶部高度
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  for (let i = n; i < num; i++) {

    // 用于定位的图片(offset仅为相对父元素的距离，因此需要进行判断）
    let offsetTop = img[i].offsetTop
    let par = img[i].offsetParent
    if (par.nodeName.toLowerCase() !== 'body') {
      while (par) {
        offsetTop += par.offsetTop
        par = par.offsetParent
      }
    }
    if (offsetTop < seeHeight + scrollTop + 300) {  // 提前300px进行加载，用作缓冲
      if (img[i].getAttribute('src') === 'https://blog-img-1300024309.cos.ap-nanjing.myqcloud.com/img/home_me.jpg') {
        img[i].src = img[i].getAttribute('data-src')
      }
      n = i + 1
    }
  }
}
