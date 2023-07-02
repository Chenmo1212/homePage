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
        this.baseURL = "https://api.chenmo1212.cn"
        this.avatarURL = "https://api.dicebear.com/6.x/initials/svg"
    }

    init() {
        if (!this.messages) return

        this.GET()
            .then(data => {
                let resData = data.data
                for (let i = 0; i < resData.length; i++) {
                    resData[i].date = this.changeTimeStyle(resData[i])
                }
                this.render(resData)
                this.messages.parentNode.classList += 'fetched'
            })
            .catch(error => {
                console.error('Failed to load messages', error);
            });
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
                this.sleep(10)
            }
        )
    }

    template(item) {
        // let avatar = `${this.avatarURL}?seed=${item.name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
        return `<div class="message">
    				<header>
    					<img title="" src="https://cdn.chenmo1212.cn/img/default.png" alt="user-avatar"/>
    					<h3>${item.name || '匿名'}</h3>
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
        this.container.className = 'second-step'
    }

    submit(button) {
        let content = this.contentField.value
        let name = this.nameField.value
        let email = this.emailField.value
        let website = this.URLField.value

        const re = /\S+@\S+\.\S+/
        if (name.length <= 0) {
            alert('Please enter your nickname.')
            return
        }
        if (email.length <= 0) {
            alert('Tip: Please enter your email address.')
            return
        } else if (!re.test(email)) {
            alert('Tip: Your email format is incorrect.')
            return
        }

        // this.postWx(content, name, email, website)
        this.postBackend(button, content, name, email, website)
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

        let backendUrl = this.baseURL + '/messages'
        this.POST(backendUrl, JSON.stringify(data))
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    this.messageDidPost();
                } else {
                    alert('Please try again later');
                }
            })
            .catch(error => {
                console.error('Failed to post message', error);
                alert('Please try again later');
            });
    }

    // change time format
    changeTimeStyle(item) {
        const d = new Date(item.create_time)
        let timeStamp = d.getTime() / 1000 - 28800
        return this.getDateDiff(timeStamp, new Date(item.create_time))
    }

    // A function to change the time format to a few days ago
    getDateDiff(dateTimeStamp, d) {
        let minute = 60
        let hour = minute * 60
        let day = hour * 24
        // let halfamonth = day * 15
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
            result = '' + parseInt(monthC) + ' month' + (monthC === 1 ? '' : 's') + ' ago'
        } else if (weekC >= 1) {
            result = '' + parseInt(weekC) + ' week' + (weekC === 1 ? '' : 's') + ' ago'
        } else if (dayC >= 1) {
            result = '' + parseInt(dayC) + ' day' + (dayC === 1 ? '' : 's') + ' ago'
        } else if (hourC >= 1) {
            result = '' + parseInt(hourC) + ' hour' + (hourC === 1 ? '' : 's') + ' ago'
        } else if (minC >= 1) {
            result = '' + parseInt(minC) + ' min' + (minC === 1 ? '' : 's') + ' ago'
        } else
            result = 'Just'
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
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(payload)
    }

    GET() {
        let url = this.baseURL + '/messages';
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.ok) {
                throw new Error('Network response was not OK');
            }
            return res.json();
        }).catch(err=>{
            console.log(err)
        });
    }

    POST(url, payload) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        });
    }
}