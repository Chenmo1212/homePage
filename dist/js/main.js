var globe, scene, node, guestbook

document.onreadystatechange = completeLoading

//Remove the loading effect when the loading status is complete
function completeLoading() {
  if (document.readyState === 'complete') {
    document.getElementById('loading').style.display = 'none'
  }
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function addStatistics() {
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?fe38adea9165b7e07b70c8b5bac9b6a9";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
}

window.onload = () => {
  globe = new Globe()
  globe.init()

  scene = new Scene()
  scene.init()

  node = new Node()
  guestbook = new Guestbook()
  guestbook.init()

  const lang = getLanguageFromURL() || getBrowserLanguage();
  applyLanguage(lang);
  addStatistics();

  if (cookieLanguage !== htmlLanguage) {
    applyLanguage(cookieLanguage)
  }

  // Simple elevator usage.
  let elementButton = document.querySelector('.elevator');
  new Elevator({
    element: elementButton,
    mainAudio: 'https://tholman.com/elevator.js/music/elevator.mp3', // Music from http://www.bensound.com/
    endAudio: 'https://tholman.com/elevator.js/music/ding.mp3'
  });
}

/**
 *  ============================
 *  language
 *  ============================
 */

const cookieLanguage = getLanguageFromCookie()
const htmlLanguage = document.getElementsByTagName('html')[0].getAttribute('lang').substr(0, 2)

const switchLanguage = () => {
  let currentLanguage = document.getElementsByTagName('html')[0].getAttribute('lang').substr(0, 2)
  let res = currentLanguage === 'en' ? 'zh' : 'en'
  applyLanguage(res)
}

const applyLanguage = (lang) => {
  if (!lang) lang = cookieLanguage
  document.cookie = 'lang=' + lang
  replaceTextContent(lang)
}

function getLanguageFromCookie() {
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf('lang=') === 0) {
      return cookie.substring(5);
    }
  }
  return 'en';
}

const getBrowserLanguage = () => {
  const lang = navigator.language.toLowerCase() || navigator.userLanguage.toLowerCase();
  return lang.indexOf('en')=== 0 ? 'en' : 'zh';
}

function getLanguageFromURL() {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('lang');
}


function getJSONFile(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
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
  const url = "https://cdn.chenmo1212.cn/files/json/lang.json";
  getJSONFile(url, function (data) {
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

    setTimeout(function () {
      elements.forEach(element => {
        element.classList.remove('fade-transition');
      });
    }, 1000); // 延时时间根据过渡效果的持续时间进行调整
  });
}

/**
 *  ============================
 *  Globe
 *  ============================
 */

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
        topojson: {file: 'https://cdn.chenmo1212.cn/files/json/borderless-world.json'},
        oceans: {fill: '#dddee0'},
        land: {fill: '#f7f7f7'}
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
    d3.json('https://cdn.chenmo1212.cn/files/json/coordinates.json', (error, data) => {
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
    this.controller = new ScrollMagic.Controller();
    this.lottie = null;
  }

  init() {
    this.lottie = document.getElementById('lottieAnimation').getLottie();
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
      this.connectAnimation(),
      this.blog(),
      this.blogShowcase(),
      this.emoji(),
      this.tiku(),
      this.book(),
    ])
  }

  intro() {
    const tween = new TimelineMax().add([
      TweenMax.set('#intro_text2', {autoAlpha: 0, opacity: 0}),

      TweenMax.fromTo('#heading', 1, {zIndex: 1, z: 1}, {yPercent: -23.6, autoAlpha: 0, ease: Linear.easeNone}),
      TweenMax.fromTo('#subheading', 1, {zIndex: 1}, {yPercent: -14.5, autoAlpha: 0, ease: Linear.easeNone}),
      TweenMax.to('#slice-left', 1, {yPercent: -38.2, autoAlpha: 0, ease: Linear.easeNone}),
      TweenMax.to('#slice-right', 1, {yPercent: -61.8, autoAlpha: 0, ease: Linear.easeNone})
    ])

    return new ScrollMagic.Scene({
      duration: '61.8%'
    })
      .setTween(tween)
  }

  selfIntro() {
    const tween = new TimelineMax().add([
      // TweenMax.set('#self_intro', { y: -200 }),

      TweenMax.fromTo('#intro_text1', 3, {y: 0}, {y: -100, ease: Linear.easeInOut}),
      TweenMax.to('#intro_text1', 3, {autoAlpha: 0, ease: Linear.easeInOut}),

      TweenMax.fromTo('#intro_text2', 2, {y: 400, autoAlpha: 0}, {y: 100, autoAlpha: 1}),
      TweenMax.fromTo('#intro_text3', 4, {autoAlpha: 0, y: 350}, {y: 250, autoAlpha: 1})
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
      TweenMax.fromTo('#intro_text2', 1, {autoAlpha: 1}, {y: 0, autoAlpha: 0}),
      TweenMax.fromTo('#intro_text3', 1, {autoAlpha: 1}, {y: 100, autoAlpha: 0}),
      TweenMax.fromTo('#globe1', 0.6, {autoAlpha: 0}, {y: 100, autoAlpha: 1}),

      TweenMax.fromTo('#globe-container', .8, {'-webkit-filter': `blur(${blur(window.innerWidth)}px)`}, {
        '-webkit-filter': 'blur(0)',
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('#globe', .5, {scale: Math.max(1000, window.innerWidth) / globe.diameter}, {
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
    tween.fromTo('#experience1', 3, {y: 0, autoAlpha: 0}, {y: -50, autoAlpha: 1})
    tween.fromTo('#experience2', 3, {y: 100, autoAlpha: 0}, {y: 50, autoAlpha: 1}, '+=2')

    return new ScrollMagic.Scene({
      triggerElement: '#experience',
      triggerHook: .5,
      duration: '38.2%',
    })
      .setTween(tween)
  }

  photography_text() {
    const tween = new TimelineMax().add([
      TweenMax.to('#experience2', 1, {yPercent: -30, autoAlpha: 0, ease: Linear.easeNone}),
      TweenMax.fromTo('#photo', 1, {yPercent: 30, autoAlpha: 0}, {
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
      TweenMax.to('#group', 1, {
        rotationX: 6,
        rotationY: 0,
        rotationZ: 4.5,
        xPercent: 18.2,
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('#photo-a', 1, {'-webkit-filter': 'blur(0)'}, {
        '-webkit-filter': `blur(3px)`,
        scale: 1.3,
        xPercent: -38.2,
        yPercent: -38.2,
        ease: Linear.easeIn
      }),
      TweenMax.to('#photo-b', 1, {xPercent: -18.2, yPercent: -18.2, ease: Linear.easeIn}),
      TweenMax.fromTo('#photo-c', 1, {'-webkit-filter': 'blur(0)'}, {
        '-webkit-filter': `blur(3px)`,
        scale: 1.6,
        xPercent: -61.8,
        yPercent: -61.8,
        ease: Linear.easeIn
      }),
      TweenMax.to('#photo-d', 1, {xPercent: -1.8, yPercent: -1.8, ease: Linear.easeIn}),
      TweenMax.fromTo('#photo-e', 1, {'-webkit-filter': 'blur(0)'}, {
        '-webkit-filter': `blur(2px)`,
        xPercent: -38.2,
        yPercent: -38.2,
        ease: Linear.easeIn
      }),
      TweenMax.fromTo('#photo-f', 1, {'-webkit-filter': 'blur(0)'}, {
        '-webkit-filter': `blur(3px)`,
        xPercent: -21.8,
        yPercent: -21.8,
        ease: Linear.easeIn
      }),
      TweenMax.fromTo('#photo-g', 1, {'-webkit-filter': 'blur(0)'}, {
        '-webkit-filter': `blur(1px)`,
        scale: 1.1,
        xPercent: -68.8,
        yPercent: -88.8,
        ease: Linear.easeIn
      }),
      TweenMax.fromTo('#photo-h', 1, {'-webkit-filter': 'blur(0)'}, {
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
    tween.add(TweenMax.fromTo('.programming1', 1, {autoAlpha: 0}, {autoAlpha: 1}))
    tween.add(TweenMax.fromTo('.programming2', 1, {y: 200, autoAlpha: 0}, {y: 100, autoAlpha: 1}, '+=2'))
    tween.add(TweenMax.fromTo('.programming3', 1, {y: 400, autoAlpha: 0}, {y: 250, autoAlpha: 1}, '+=2'))
    tween.add(TweenMax.fromTo('.programming4', 1, {y: 600, autoAlpha: 0}, {y: 400, autoAlpha: 1}, '+=2'))

    return new ScrollMagic.Scene({
      triggerElement: '#programming',
      duration: '70%',
    })
      .setTween(tween)
  }

  design() {
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#text-design', .5, {autoAlpha: 0.5}, {yPercent: -30, autoAlpha: 1, ease: Linear.easeNone}),
      TweenMax.fromTo('.design-pic-left', 1, {rotation: 60, scale: 0.6, autoAlpha: 0, x: -100}, {
        rotation: 0,
        scale: 1.1,
        autoAlpha: 1,
        x: 0,
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('.design-pic-right', 1, {rotation: -60, scale: 0.6, autoAlpha: 0, x: 100}, {
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
    // Wait for SVG to load
    const codeObject = document.getElementById('code');
    
    // Define the three main hub nodes coordinates
    const hubNodes = [
      { cx: 558.78, cy: 388.96, name: 'Web Front End' },  // Javascript hub
      { cx: 1128.45, cy: 527.72, name: 'Python' },        // Python hub
      { cx: 1614.14, cy: 321.65, name: 'Server' }         // Server hub
    ];
    
    const initAnimation = () => {
      const svgDoc = codeObject.contentDocument;
      if (!svgDoc) {
        setTimeout(initAnimation, 100);
        return;
      }
      
      // Hide all elements initially
      const lines = svgDoc.querySelectorAll('.line-animate');
      const circles = svgDoc.querySelectorAll('circle');
      const texts = svgDoc.querySelectorAll('text');
      
      lines.forEach(line => {
        line.style.strokeDashoffset = '1000';
      });
      
      circles.forEach(circle => {
        circle.style.opacity = '0';
        circle.style.transform = 'scale(0)';
        circle.style.transformOrigin = 'center';
      });
      
      texts.forEach(text => {
        text.style.opacity = '0';
      });
      
      // Show hub nodes immediately
      circles.forEach(circle => {
        const cx = parseFloat(circle.getAttribute('cx'));
        const cy = parseFloat(circle.getAttribute('cy'));
        
        // Check if this circle is one of the hub nodes
        const isHub = hubNodes.some(hub =>
          Math.abs(hub.cx - cx) < 1 && Math.abs(hub.cy - cy) < 1
        );
        
        if (isHub) {
          circle.style.opacity = '1';
          circle.style.transform = 'scale(1)';
          circle.setAttribute('data-hub', 'true');
        }
      });
      
      // Show hub node text immediately
      texts.forEach(text => {
        const transform = text.getAttribute('transform');
        if (transform) {
          const match = transform.match(/matrix\([\d\s.]+\s+([\d.]+)\s+([\d.]+)\)/);
          if (match) {
            const x = parseFloat(match[1]);
            const y = parseFloat(match[2]);
            
            const isHubText = hubNodes.some(hub =>
              Math.abs(hub.cx - x + 14) < 20 && Math.abs(hub.cy - y + 5) < 20
            );
            
            if (isHubText) {
              text.style.opacity = '1';
              text.setAttribute('data-hub', 'true');
            }
          }
        }
      });
    };
    
    // Calculate distance from a point to nearest hub
    const getDistanceToNearestHub = (x, y) => {
      let minDist = Infinity;
      hubNodes.forEach(hub => {
        const dist = Math.sqrt(Math.pow(hub.cx - x, 2) + Math.pow(hub.cy - y, 2));
        if (dist < minDist) minDist = dist;
      });
      return minDist;
    };
    
    // Initialize animation when SVG loads
    if (codeObject.contentDocument) {
      initAnimation();
    } else {
      codeObject.addEventListener('load', initAnimation);
    }

    return new ScrollMagic.Scene({
      triggerElement: '#learned',
      triggerHook: .5,
      duration: '180%',
    })
      .on('progress', function(e) {
        const codeObject = document.getElementById('code');
        const svgDoc = codeObject.contentDocument;
        if (!svgDoc) return;
        
        const lines = svgDoc.querySelectorAll('.line-animate');
        const circles = svgDoc.querySelectorAll('circle');
        const texts = svgDoc.querySelectorAll('text');
        const progress = e.progress;
        
        // Animate lines based on distance from hub nodes
        lines.forEach((line, index) => {
          // Get line endpoints
          const points = line.getAttribute('points') || '';
          const x1 = line.getAttribute('x1');
          const y1 = line.getAttribute('y1');
          
          let startX, startY;
          if (points) {
            const coords = points.trim().split(/[\s,]+/);
            startX = parseFloat(coords[0]);
            startY = parseFloat(coords[1]);
          } else if (x1 && y1) {
            startX = parseFloat(x1);
            startY = parseFloat(y1);
          }
          
          if (startX && startY) {
            // Calculate distance from nearest hub
            const distFromHub = getDistanceToNearestHub(startX, startY);
            
            // Lines closer to hubs animate first
            const maxDist = 800; // Maximum distance to consider
            const normalizedDist = Math.min(distFromHub / maxDist, 1);
            
            const lineStart = normalizedDist * 0.25; // Closer lines start earlier
            const lineEnd = lineStart + 0.2;
            const lineProgress = Math.max(0, Math.min(1, (progress - lineStart) / (lineEnd - lineStart)));
            
            const offset = 1000 - (1000 * lineProgress);
            line.style.strokeDashoffset = offset;
          }
        });
        
        // Animate circles based on distance from hubs
        circles.forEach((circle) => {
          if (circle.getAttribute('data-hub') === 'true') return; // Skip hub nodes
          
          const cx = parseFloat(circle.getAttribute('cx'));
          const cy = parseFloat(circle.getAttribute('cy'));
          const distFromHub = getDistanceToNearestHub(cx, cy);
          
          const maxDist = 800;
          const normalizedDist = Math.min(distFromHub / maxDist, 1);
          
          const circleStart = normalizedDist * 0.25 + 0.1;
          const circleEnd = circleStart + 0.1;
          const circleProgress = Math.max(0, Math.min(1, (progress - circleStart) / (circleEnd - circleStart)));
          
          circle.style.opacity = circleProgress;
          circle.style.transform = `scale(${circleProgress})`;
        });
        
        // Animate text based on distance from hubs
        texts.forEach((text) => {
          if (text.getAttribute('data-hub') === 'true') return; // Skip hub text
          
          const transform = text.getAttribute('transform');
          if (transform) {
            const match = transform.match(/matrix\([\d\s.]+\s+([\d.]+)\s+([\d.]+)\)/);
            if (match) {
              const x = parseFloat(match[1]);
              const y = parseFloat(match[2]);
              const distFromHub = getDistanceToNearestHub(x, y);
              
              const maxDist = 800;
              const normalizedDist = Math.min(distFromHub / maxDist, 1);
              
              const textStart = normalizedDist * 0.25 + 0.15;
              const textEnd = textStart + 0.1;
              const textProgress = Math.max(0, Math.min(1, (progress - textStart) / (textEnd - textStart)));
              
              text.style.opacity = textProgress;
            }
          }
        });
      });
  }

  connectProgram() {
    const tween = new TimelineMax().add([
      TweenMax.fromTo('#backdrop', 1, {height: '70%'}, {height: '100%', ease: Linear.easeNone}),
      TweenMax.fromTo('#text-dot-connecting', 1, {y: '-40vh', autoAlpha: 0, color: "#000"}, {
        yPercent: '20vh',
        autoAlpha: 1,
        color: "#fff",
        ease: Linear.easeNone
      })
    ])

    return new ScrollMagic.Scene({
      triggerElement: '#connect',
      triggerHook: .8,
      duration: '80%',
    })
      .setTween(tween)
  }

  connectAnimation() {
    const lottie = this.lottie;
    let lastProgress = 0;
    let velocity = 0;
    let lastFrameTime = Date.now();

    const scene = new ScrollMagic.Scene({
      triggerElement: '#connect',
      triggerHook: 0,
      duration: '250%',
    })
      .on('progress', function(e) {
        const now = Date.now();
        const deltaTime = now - lastFrameTime;
        const deltaProgress = e.progress - lastProgress;

        velocity = deltaProgress / deltaTime * 10;
        lastProgress = e.progress;
        lastFrameTime = now;

        const frame = e.progress * (lottie.totalFrames - 1);
        lottie.goToAndStop(frame, true);
        applyInertia();
      });

    const applyInertia = debounce(function() {
      function inertiaStep() {
        if (Math.abs(velocity) > 0.00025 && lastProgress !== 0 && lastProgress !== 1) {
          lastProgress += velocity;
          lastProgress = Math.max(0, Math.min(1, lastProgress));
          const frame = lastProgress * (lottie.totalFrames - 1);
          lottie.goToAndStop(frame, true);
          velocity *= 0.98;
          requestAnimationFrame(inertiaStep);
        }
      }
      inertiaStep();
    }, 20);

    return scene;
  }

  blog() {
  //   const tween = new TimelineMax().add([
      // TweenMax.fromTo('#blog-text', 1, {y: '-50vh'}, {y: 0, ease: Linear.easeNone}),
      // TweenMax.fromTo('#blog-text', 1, {color: '#404040'}, {color: '#fff', ease: Linear.easeNone}),
  //   ])
  //
  //   return new ScrollMagic.Scene({
  //     triggerElement: '#blog',
  //     triggerHook: 1,
  //     duration: '100%',
  //   })
  //     .setTween(tween)
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
      TweenMax.to('#emoji-showcase-a', 1, {yPercent: -20, ease: Linear.easeNone}),
      TweenMax.to('#emoji-showcase-b', 1, {yPercent: -30, ease: Linear.easeNone})
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
      TweenMax.from('#tiku-showcase-a', 1, {xPercent: 10, ease: Linear.easeNone}),
      TweenMax.from('#tiku-showcase-b', 1, {xPercent: 30, ease: Linear.easeNone}),
      TweenMax.from('#tiku-showcase-c', 1, {xPercent: 60, ease: Linear.easeNone}),
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
      TweenMax.fromTo('#book-showcase-a', 1, {yPercent: '40%', xPercent: '25%'}, {
        yPercent: '0%',
        xPercent: '5%',
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('#book-showcase-b', 1, {yPercent: '40%', xPercent: '-5%'}, {
        yPercent: '0%',
        xPercent: '0%',
        ease: Linear.easeNone
      }),
      TweenMax.fromTo('#book-showcase-c', 1, {yPercent: '40%', xPercent: '-20%'}, {
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
 *  ============================
 *  Back to top
 *  ============================
 */

document.addEventListener('scroll', function () {
  let backToTop = document.querySelector('.back-to-up');
  let threshold = 100; // 设置阈值，当滚动位置超过100px时，显示 "backToTop" 元素

  if (window.pageYOffset > threshold) {
    backToTop.style.opacity = 1;
    backToTop.style.visibility = 'visible';
  } else {
    backToTop.style.opacity = 0;
    backToTop.style.visibility = 'hidden';
  }
});