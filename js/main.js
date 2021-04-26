var globe, scene, node, guestbook

document.onreadystatechange = completeLoading;
//加载状态为complete时移除loading效果
function completeLoading() {
	if (document.readyState === "complete") {
		document.getElementById('loading').style.display = 'none';
	}
}

window.onload = () => {
	globe = new Globe()
	globe.init()

	scene = new Scene()
	scene.init()

	node = new Node()
	guestbook = new Guestbook()
	guestbook.init()
}

const switchLanguage = () => {
	const current = document.getElementsByTagName("html")[0].getAttribute("lang").substr(0, 2)
	document.cookie = "lang=" + (current == "en" ? "zh" : "en")
	location.reload()
}

class Globe {
	constructor() {
		this.canvas = document.getElementById("globe")
		this.planet = planetaryjs.planet()
		this.diameter = 0
	}
	init() {
		this.planet.loadPlugin(this.rotate(10))
		this.planet.loadPlugin(
			planetaryjs.plugins.earth({
				topojson: { file: "data/borderless-world.json" },
				oceans: { fill: "#dddee0" },
				land: { fill: "#f7f7f7" }
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
			color: "#df5f5f", ttl: 2000, angle: 2
		}))

		this.locations()
		this.scale()
		this.planet.draw(this.canvas)
		this.planet.projection.rotate([0, -25, 0]) // Focus on the northern hemisphere
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
		d3.json("data/coordinates.json", (error, data) => {
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
		])

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

			TweenMax.fromTo("#traveling1", 1, {y: 200}, {y: 380, ease: Linear.easeNone}),
			TweenMax.fromTo("#traveling1", .5, {autoAlpha: 0}, {autoAlpha: 1, ease: Linear.easeNone})
		])

		return new ScrollMagic.Scene({
			triggerElement: "#content",
			offset: 500, // 距离触发元素距离为500时开始动画
			duration: "61.8%", // 动画有效范围
		})
			.setTween(tween)
	}
	globe() {
		const blur = d3.scale.linear().domain([375, 2560]).range([3, 6])
		const tween = new TimelineMax().add([
			TweenMax.fromTo("#globe-container", .8, {"-webkit-filter": `blur(${blur(window.innerWidth)}px)`}, {"-webkit-filter": "blur(0)", ease: Linear.easeNone}),
			TweenMax.fromTo("#globe", 1, {scale: Math.max(800, window.innerWidth) / globe.diameter}, {scale: 1, y: 200, ease: Linear.easeNone})
		])

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
			TweenMax.fromTo("#look", 1, {yPercent: 30, autoAlpha: 0}, {yPercent: 0, autoAlpha: 1, ease: Linear.easeNone}),
			TweenMax.fromTo("#photo", 1, {yPercent: 30, autoAlpha: 0}, {yPercent: 0, autoAlpha: 1, ease: Linear.easeNone}),
		])

		return new ScrollMagic.Scene({
			triggerElement: "#go_far",
			triggerHook: .5,
			duration: "38.2%",
		})
			.setTween(tween)
	}
	photo() {
		const tween = new TimelineMax().add([
			TweenMax.to("#group", 1, {rotationX: 6, rotationY: 0, rotationZ: 4.5, ease: Linear.easeNone}),
			TweenMax.fromTo("#photo-a", 1, {"-webkit-filter": "blur(0)"}, {"-webkit-filter": `blur(3px)`, scale: 1.3, xPercent: -38.2, yPercent: -38.2, ease: Linear.easeIn}),
			TweenMax.to("#photo-b", 1, {xPercent: -18.2, yPercent: -18.2, ease: Linear.easeIn}),
			TweenMax.fromTo("#photo-c", 1, {"-webkit-filter": "blur(0)"}, {"-webkit-filter": `blur(6px)`, scale: 1.6, xPercent: -61.8, yPercent: -61.8, ease: Linear.easeIn}),
			TweenMax.to("#photo-d", 1, {xPercent: -1.8, yPercent: -1.8, ease: Linear.easeIn}),
			TweenMax.fromTo("#photo-e", 1, {"-webkit-filter": "blur(0)"}, {"-webkit-filter": `blur(8px)`, xPercent: -38.2, yPercent: -38.2, ease: Linear.easeIn}),
			TweenMax.fromTo("#photo-f", 1, {"-webkit-filter": "blur(0)"}, {"-webkit-filter": `blur(6px)`, xPercent: -21.8, yPercent: -21.8, ease: Linear.easeIn}),
			TweenMax.fromTo("#photo-g", 1, {"-webkit-filter": "blur(0)"}, {"-webkit-filter": `blur(3px)`, scale: 1.4, xPercent: -88.8, yPercent: -88.8, ease: Linear.easeIn}),
			TweenMax.fromTo("#photo-h", 1, {"-webkit-filter": "blur(0)"}, {"-webkit-filter": `blur(2px)`, scale: 1.5, xPercent: -61.8, yPercent: -61.8, ease: Linear.easeIn}),
		])

		return new ScrollMagic.Scene({
			triggerElement: "#photography",
			triggerHook: .1,
			duration: "100%",
		})
			.setTween(tween)
	}
	programming() {
		const tween = new TimelineMax().add([
			TweenMax.fromTo(".text-programming", 1,{autoAlpha: 0}, {yPercent: -30, autoAlpha: 1, ease: Linear.easeNone}),
		])

		return new ScrollMagic.Scene({
			triggerElement: "#programming",
			triggerHook: .5,
			duration: "38.2%",
		})
			.setTween(tween)
	}
	design() {
		const tween = new TimelineMax().add([
			TweenMax.fromTo("#text-design", .5,{autoAlpha: 0.5}, {yPercent: -30, autoAlpha: 1, ease: Linear.easeNone}),
			TweenMax.fromTo(".design-pic-left", 1, {rotation: 60, scale: 0.6, autoAlpha: 0, x:-100}, { rotation: 0, scale: 1.1, autoAlpha: 1,x:0, ease: Linear.easeNone}),
			TweenMax.fromTo(".design-pic-right", 1, {rotation: -60, scale: 0.6, autoAlpha: 0, x:100}, { rotation: 0, scale: 1.1, autoAlpha: 1,x:0, ease: Linear.easeNone})
		])

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
			TweenMax.fromTo("#nodes path", 1, {"stroke-dashoffset": 1200}, {"stroke-dashoffset": 0, ease: Linear.easeIn})
		])

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
			TweenMax.fromTo("#text-dot-connecting", 1, {yPercent: 30, autoAlpha: 0}, {yPercent: 0, autoAlpha: 1, ease: Linear.easeNone})
		])

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
			TweenMax.fromTo("#backdrop", 1, {height: 0}, {height: "100%", ease: Linear.easeNone})
		])

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
			TweenMax.to("#emoji-showcase-a", 1, {yPercent: -10, ease: Linear.easeNone}),
			TweenMax.to("#emoji-showcase-b", 1, {yPercent: -30, ease: Linear.easeNone})
		])

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
		])

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
		const margin = 60
		const predicate = this.container.scrollWidth - this.container.scrollLeft <= window.innerWidth + margin
		this.container.classList = predicate ? "reached" : ""
	}
}

class Guestbook {
	constructor() {
		this.messages = this.element("recent-messages")
		this.container = this.element("new-message")
		this.nextButton = this.element("next-step-button")
		this.contentField = this.element("message-content")
		this.nameField = this.element("message-name")
		this.emailField = this.element("message-email")
		this.URLField = this.element("message-url")
	}
	init() {
		if (!this.messages) return

		// this.GET(xhr => {
		// 	if (xhr.status == 200 || xhr.status == 201) {
		// 		this.render(JSON.parse(xhr.responseText))
		// 		this.messages.parentNode.classList += " fetched"
		// 	} else
		// 		console.error("Failed to load messages")
		// })
	}
	render(items) {
		items.forEach(item => this.messages.insertAdjacentHTML("beforeend", this.template(item)))
	}
	template(item) {
		return `<div class="message">
					<header>
						<img src="${ item.avatar || "?" }" />
						<h3>${ item.name }</h3>
					</header>
					<div class="message-content">
						<p>${ item.content }</p>
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
		const data = {
			title: '主页留言',
			desp: {
				post: 1008,
				content: this.contentField.value,
				author_name: this.nameField.value,
				author_email: this.emailField.value,
				author_url: this.URLField.value,
				author_user_agent: navigator.userAgent + " DWAPI/7.0"
			}
		}

		const re = /\S+@\S+\.\S+/;
		if (data.desp.author_email.length > 0 && !re.test(data.desp.author_email)) {
			console.info("Todo: handle invalid email address")
			return
		}

		button.className = "posting"
		button.innerHTML = "";

		this.POST(data, xhr => {
			if (xhr.status == 200 || xhr.status == 201)
				this.messageDidPost()
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
	request(path, method, payload, callback) {
		let SCKEY = 'SCT25268TK4j67c5FaUBd7RVWlNas3kcN';
		let url = 'https://sctapi.ftqq.com/' + SCKEY + '.send';
		const xhr = new XMLHttpRequest()
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && callback)
				callback(xhr)
		}
		xhr.open(method, url, true);
		xhr.setRequestHeader("Content-Type", "application/json")
		xhr.send(payload)
	}
	// GET(callback) {
	// 	this.request("homepage-comment", "GET", null, callback)
	// }
	POST(payload, callback) {
		this.request("comments", "POST", payload, callback)
	}
}
