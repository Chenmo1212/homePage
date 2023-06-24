var globe, scene, node, guestbook

document.onreadystatechange = completeLoading

//Remove the loading effect when the loading status is complete
function completeLoading() {
  if (document.readyState === 'complete') {
    document.getElementById('loading').style.display = 'none'
  }
}

// Load the font file after the page is loaded
function getHomeFont() {
  let xhr = new XMLHttpRequest() // define an asynchronous object
  xhr.open('GET', './dist/fonts/SemiBold.ttf', true) // Asynchronous GET way to load fonts
  xhr.responseType = 'arraybuffer' //Change the asynchronous acquisition type to arraybuffer binary type
  xhr.onload = function () {
    //Here is a judgment: if the browser supports FontFace method execution
    if (typeof FontFace != 'undefined') {
      let buffer = this.response  //Get font file binary code
      let myFonts = new FontFace('SemiBold', buffer)  // Instantiate font object by binary code
      document.fonts.add(myFonts) // Add the font object to the page
    } else {
      // If the browser does not support the FontFace method, add styles directly to the page
      let styles = document.createElement('style')
      styles.innerHTML = '@font-face{font-family:"SemiBold";src:url("./dist/fonts/SemiBold.ttf") format("truetype");font-display:swap;}'
      console.log(document.getElementsByTagName('head'))
      document.getElementsByTagName('head')[0].appendChild(styles)
    }
  }
  xhr.send()
}

function getJSONFile(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const jsonData = JSON.parse(xhr.responseText);
      callback(jsonData);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

// Functions to replace HTML text content
function replaceTextContent(language) {
  const url = "./dist/lang/lang.json";
  getJSONFile(url, function(data) {
    // Process the obtained JSON data
    const translations = data;
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
      element.classList.add('fade-transition');

      setTimeout(function () {
        const translationKey = element.getAttribute('data-i18n');
        const translationKeys = translationKey.split('.');
        let translationText = translations;

        translationKeys.forEach(key => {
          translationText = translationText[key];
          if (!translationText) return '';
        });

        if (translationText && translationText[language]) {
          element.innerHTML = translationText[language];
        }
      }, 500)
    });

    setTimeout(function () {
      document.getElementsByTagName('html')[0].setAttribute('lang', language)
    }, 500)

    setTimeout(function() {
      elements.forEach(element => {
        element.classList.remove('fade-transition');
      });
    }, 1000); // 延时时间根据过渡效果的持续时间进行调整
  });
}

window.onload = () => {
  globe = new Globe()
  globe.init()

  scene = new Scene()
  scene.init()

  node = new Node()
  guestbook = new Guestbook()
  guestbook.init()

  lazyLoad()

  // getHomeFont()
}

const switchLanguage = () => {
  let current = document.getElementsByTagName('html')[0].getAttribute('lang').substr(0, 2)
  current = current === 'en' ? 'zh' : 'en'
  document.cookie = 'lang=' + current
  replaceTextContent(current)
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
      TweenMax.set('#intro_text2', { autoAlpha: 0, opacity: 0 }),

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
      // TweenMax.set('#self_intro', { y: -200 }),

      TweenMax.fromTo('#intro_text1', 3, { y: 0 }, { y: -100, ease: Linear.easeInOut }),
      TweenMax.to('#intro_text1', 3, { autoAlpha: 0, ease: Linear.easeInOut }),

      TweenMax.fromTo('#intro_text2', 2, { y: 400, autoAlpha: 0 }, { y: 100, autoAlpha: 1 }),
      TweenMax.fromTo('#intro_text3', 4, { autoAlpha: 0, y: 350 }, { y: 250, autoAlpha: 1 })
    ])
    return new ScrollMagic.Scene({
      triggerElement: '#self_intro',
      offset: 100, // 距离触发元素距离为200时开始动画
      duration: '61.8%', // 动画有效范围, 不是时间
    })
      .setTween(tween)
  }

  globe() {
    const blur = d3.scale.linear().domain([375, 2560]).range([3, 6])
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#intro_text2', 1, { autoAlpha: 1 }, { y: 0, autoAlpha: 0 }),
      TweenMax.fromTo('#intro_text3', 1, { autoAlpha: 1 }, { y: 100, autoAlpha: 0 }),
      TweenMax.fromTo('#globe1', 0.6, { autoAlpha: 0 }, { y: 100, autoAlpha: 1 }),

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
    tween.fromTo('#experience1', 3, { y: 0, autoAlpha: 0 }, { y: -50, autoAlpha: 1 })
    tween.fromTo('#experience2', 3, { y: 100, autoAlpha: 0 }, { y: 50, autoAlpha: 1 }, '+=2')

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
 *  ============================
 *  dark mode
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
  document.documentElement.classList.add('transition')

  setTimeout(function () {
    document.documentElement.classList.remove('transition')
  }, 600)
}

/**
 * Image lazy loading
 */
const images = document.getElementsByTagName('img');
const defaultUrl = 'https://images.pexels.com/photos/1646311/pexels-photo-1646311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

// Load images in the visible area when the page is loaded or scrolled
window.onscroll = lazyLoad;

/**
 * Lazy load images
 */
function lazyLoad() {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imageRect = image.getBoundingClientRect();

    if ((imageRect.top < 1000 && imageRect.bottom > -1000) && image.getAttribute('src') === defaultUrl) {
      image.src = image.getAttribute('data-src');
    }
  }
}