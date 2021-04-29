## 陈默的主页
春招快结束了，打算在结束之前换一个自己的个人主页，之前是使用的landingPage登录页做的个人主页。后来觉得实在不妥，便决定重新再设计一个。

当然想法有很多，执行起来总是会遇到各种各样的问题，比如样式设计，开发框架，响应式等等问题。因此尽管自己设计了很多版本，也有开始开发，但最后都选择了放弃。

所幸在最后无意间发现了大佬[Dandy Weng](https://www.dandyweng.com/)的个人主页，无论是风格，动画，还是内容，都深入我心，于是决定仿照大佬的写一个自己的主页。大佬的主页代码并未开源，因此都由本人仿照开发。但由于闲余时间有限，所以并未做太多更改。

大佬不愧是大佬，在学习大佬的个人主页时，学到了非常多实用性很高的东西，因此在此处作为记录。

## 个人主页
在线演示：[新主页](https://www.chenmo1212.cn/)

旧版主页：[Landing Page版旧主页](https://www.chenmo1212.cn/oldVersion/landingPage)

## 技术栈
**HTML部分**：`HTML` / `Canvas` / `SVG`

**CSS部分**：`CSS3` /  `Flex` / `Grid` / `CSS变量` /  `引用字体`  /  `TweenMax.js` / `ScrollMagic.js`

**JavaSript部分**：`面向对象` / `Ajax`

### 特点
**响应式布局** / **黑暗模式** / **图片懒加载** / **可交互式动画** / **留言功能**

## 笔记

### HTML标签

`Html`中有许多很实用的标签的属性并不熟悉，在这里做一个记录。

#### Meta标签

更详细内容请见: [Meta标签常用属性值的写法和作用](https://blog.csdn.net/xustart7720/article/details/79649896)

##### `charset`

`charset`是声明文档使用的字符编码，解决乱码问题主要用的就是它，值得一提的是，这个`charset`一定要写第一行，不然就可能会产生乱码了。

```html
<!--charset有两种写法-->

<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
```

##### 设置页面不缓存

```html
<!-- 禁止浏览器从本地计算机的缓存中访问页面内容 -->
<meta http-equiv=”pragma” content=”no-cache”>
<!-- 禁止浏览器缓存 -->
<meta http-equiv=”cache-control” content=”no-cache”>
<!-- 网页的缓存过期时间 -->
<meta http-equiv="expires" content="60"><!-- 表示网页在60秒后过期 -->
<!-- 这是特殊的用法，表示网页在任何时候都不能被Cache存储 -->
<meta http-equiv="expires" content="-1">
<meta http-equiv=”expires” content=”0″>

<!--页面重定向和刷新 -->
<meta http-equiv="refresh" content="0;url=" />
```

##### SEO优化

```html
<!-- 页面关键词 keywords -->
<meta name="keywords" content="your keywords">
<!-- 页面描述内容 description -->
<meta name="description" content="your description">
<!-- 定义网页作者 author -->
<meta name="author" content="author,email address">

<meta name="robots" content="index,follow">
```

> 定义网页搜索引擎索引方式，robotterms 是一组使用英文逗号「,」分割的值
> 通常有如下几种取值：
>
> 1. all：文件将被检索，且页面上的链接可以被查询；
> 2. none：文件将不被检索，且页面上的链接不可以被查询；
> 3. index：文件将被检索；
> 4. follow：页面上的链接可以被查询；
> 5. noindex：文件将不被检索；
> 6. nofollow：页面上的链接不可以被查询。

##### `viewport`

`viewport`主要是影响**移动端页面布局**的，例如：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

> 1. content 参数： 
> 2. width： `viewport` 宽度(数值/device-width)
> 3. height： `viewport` 高度(数值/device-height)
> 4. initial-scale： 初始缩放比例
> 5. maximum-scale： 最大缩放比例
> 6. minimum-scale： 最小缩放比例
> 7. user-scalable： 是否允许用户缩放(yes/no)

##### App Links

用于用户分享链接时呈现的内容，效果如下：

![Screenshot_20210429_173405](https://gitee.com/chenmo1212/img/raw/master/appLink.jpg)

```html
<!-- iOS -->
<meta property="al:ios:url" content="applinks://docs">
<meta property="al:ios:app_store_id" content="12345">
<meta property="al:ios:app_name" content="App Links">
<!-- Android -->
<meta property="al:android:url" content="applinks://docs">
<meta property="al:android:app_name" content="App Links">
<meta property="al:android:package" content="org.applinks">
<!-- Web Fallback -->
<meta property="al:web:url" content="http://applinks.org/documentation">
<!-- More info: http://applinks.org/documentation/ -->
```

### 动画库

主页的动画主要是基于`TweenMax.js`和`ScrollMagic.js`来实现的。起初将两者分开来学习，但最后发现，主页的交互式效果是两者结合才可以产生的。TweenMax库用得不是很熟练，目前仅是达到了自己想要的动画目标，但代码应该可以更加精简，以后有时间会进行重构。由于这部分是动画，这也就是我把它归在`CSS部分`里的原因。

以下笔记仅对主页使用过的技术作为记录。

#### TweenMax

中文官网：https://www.tweenmax.com.cn/api/

##### **补间动画TweenLite.fromTo()**

链接：https://www.tweenmax.com.cn/api/tweenmax/

```javascript
TweenLite.fromTo('div', 5, {opacity:1}, {opacity:0});
```
- 动画目标：div
- 补间：5秒完成状态改变
- 起始状态：opacity:1
- 终点状态：opacity:0
- 起点状态经常可以省略，例如div以当前位置为起点，向右移动300px：
```javascript
TweenLite.to('div', 5, {x:300});
```

##### **TweenMax.set()**

链接：[TweenMax中文文档/TweenLite中文文档](https://www.tweenmax.com.cn/api/tweenmax/TweenMax.set())

```javascript
// TweenMax.set( target:Object, vars:Object ) : TweenMax
```
- 立即设置目标的属性值而不产生过渡动画，相当于0的动画时间。
- 返回TweenMax对象。

以下两个设置作用相同
```javascript
TweenMax.set(myObject, {x:100});
TweenMax.to(myObject, 0, {x:100});
```

##### **时间轴TimelineMax()**

基本介绍

> **TimelineLite/TimelineMax**是GreenSock 动画平台中的动画组织、排序、管理工具，可创建时间轴（timeline）作为动画或其他时间轴的容器，这使得整个动画控制和精确管理时间变得简单。
>
> 试想一下，如果不使用**TimelineLite/TimelineMax**创建时间轴，那么构建复杂的动画序列将会非常麻烦，因为你需要用delay为每个动画设置开始时间。

链接：[TimelineMax中文手册_TweenMax中文网](https://www.tweenmax.com.cn/api/timelinemax/)

```javascript
// 没有使用时间轴
TweenLite.to(element, 1, {left:100});
TweenLite.to(element, 1, {top:50, delay:1});//延迟1秒，接续前一个动画
TweenLite.to(element, 1, {opacity:0, delay:2});//延迟2秒，接续前一个动画

// 使用了时间轴
var tl = new TimelineLite();
tl.add( TweenLite.to(element, 1, {left:100}) );//将一个动画添加到时间轴
tl.add( TweenLite.to(element, 1, {top:50}) );//将一个动画添加到时间轴末端，即与前一个动画接续
tl.add( TweenLite.to(element, 1, {opacity:0}) ); //将一个动画添加到时间轴末端，即与前一个动画接续
 
// 使用简单的to()方法和链式调用更加简洁：
var tl = new TimelineLite();
tl.to(element, 1, {left:100}).to(element, 1, {top:50}).to(element, 1, {opacity:0});
```
- 现在，你可以随意调整任何动画，而不必担心延迟时间会发生混乱。增加第一个动画的持续时间，一切都会自动调整。

控制时间轴

```javascript
var tl = new TimelineLite();

//控制时间轴
tl.pause();
tl.resume();
tl.seek(1.5);
tl.reverse();
...
```

#### ScrollMagic

##### 概述

[scrollmagic](https://links.jianshu.com/go?to=http%3A%2F%2FScrollMagic.io)插件可用于让元素在页面滚动时可以固定在某个位置，用于制作页面视察效果。

官网：https://github.com/janpaepke/ScrollMagic/wiki/Getting-Started-:-How-to-use-ScrollMagic

##### 优点

- 体积小 6kb
- 兼容性强
- 响应式设计
- 面向对象

##### 使用

1. 创建控制器对象
2. 创建场景对象（对元素进行设置，添加到对象中）
3. 为创造器对象添加场景对象

###### **Defining the Controller**

```javascript
var controller = new ScrollMagic.Controller();
```

###### **Defining Scenes**

```javascript
var scene = new ScrollMagic.Scene({
  triggerElement: "#content",  //触发元素
  triggerHook:"onEnter",//设置触发元素进入或者离开视口开始触发事件。onCenter onLeave
  duration: 400,// 从开始点滚动多少px触发
  offset: 100,  // 效果持续的距离
  reverse:false,//当元素滚动后返回时依然固定在当前位置。
})
```

###### **Adding Scenes to Controller**

```javascript
var scene = new ScrollMagic.Scene({
  triggerElement: '#pinned-trigger1', // starting scene, when reaching this element
  duration: 400 // pin the element for a total of 400px
})
.setPin('#pinned-element1'); // the element we want to pin

// Add Scene to ScrollMagic Controller
controller.addScene(scene);
```
添加多个场景
```javascript
// Add Scene to ScrollMagic Controller
controller.addScene([
  scene1,
  scene2,
  scene3
]);
```

##### 配合GASP使用

该动画进度会跟随滚动的距离变化而变化
 1、引入TweenMax文件
 2、为场景设置动画scene.setTween(动画配置)

```javascript
let controller=new ScrollMagic.Controller();
let scene=new ScrollMagic.Scene({
        offset:100,
        duration:200,
    });
controller.addScene(scene);
    /*
let tm=TweenMax.to("p",3,{
        width:150,
        height:150
    });
scene.setTween(tm);
    */
scene.setTween("p",3,{
    width:150,
    height:150
});
scene.setPin(".section1");
```

### 暗黑模式

#### 思路

使用`CSS变量`，在样式表的Root部分设置了全局的颜色变量，其余部分使用到相关样式时直接调用全局变量。更换主题时，在`JS`代码中更换全局变量的值即可。

参考文献：[CSS 变量 (w3school.com.cn)](https://www.w3school.com.cn/css/css3_variables.asp)

#### 代码

```css
/* style.css */
:root {
    --color-font: #fdfdfd;
    --color-background: #404040;
}
body {
    background: var(--color-background);
    color: var(--color-font);
}
```

```js
// main.js

// 白天模式
document.documentElement.style.setProperty('--color-font', '#fdfdfd');
document.documentElement.style.setProperty('--color-background', '#404040');

// 黑夜模式
document.documentElement.style.setProperty('--color-font', '#404040');
document.documentElement.style.setProperty('--color-background', '#fdfdfd');
```



### 引入外部字体

网站想要美观，光结构和色彩搭配美观可是不够的，学平面设计的时候也深刻体会到字体的重要性。因此，设计网页的时候，也可以选择一些更好看的字体。

#### 代码

```css
/* style.css */
@font-face {
    font-family: "Source Han Serif";
    src: url("fonts/SemiBold.woff") format("woff"),
    url("fonts/SemiBold.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
}
```

需要说明的是，字体有着不同的后缀：

> 字体后缀和浏览器有关，如下所示
> * .TTF或.OTF，适用于Firefox 3.5、Safari、Opera 
> * .EOT，适用于Internet Explorer 4.0+ 
> * .SVG，适用于Chrome、IPhone

```css
/* style.css */

@font-face {
    font-family: 'HansHandItalic';
    src: url('fonts/hanshand-webfont.eot');
    src: url('fonts/hanshand-webfont.eot?#iefix') format('embedded-opentype'),
         url('fonts/hanshand-webfont.woff') format('woff'),
         url('fonts/hanshand-webfont.ttf') format('truetype'),
         url('fonts/hanshand-webfont.svg#webfont34M5alKg') format('svg');
    font-weight: normal;
    font-style: normal;
}
```

当然，字体的体积通常都很大，有的甚至是几百M，这无疑给网页的加载带来了非常严重的弊端。因此需要采取方式进行处理字体，这里选用的是字体压缩。

原理为：在原来的字体包中，提取html文件中使用到的字体，将这些字体单独打包生成字体文件，最后仅引用这些字体文件。

#### 字体压缩

使用到的工具是：`font-spider`

使用流程：

```cmd
# cmd # 

# 全局安装
npm install font-spider -g
```

在`CSS`文件中引用font文件：

```css
/* style.css */
@font-face {
    font-family: "Source Han Serif";
    src: url("fonts/SemiBold.woff") format("woff"),
    url("fonts/SemiBold.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
}
```

复制`html`文件所在目录，使用 `font-spider` 压缩字体：

```cmd
# cmd #

font-spider ./demo/*.html
```

这样，字体文件就被压缩了，而原来的文件也会被保留。

- **注意1：**如果`html`中的文字有增加或者修改，需要重新压缩一次;

- **注意2:**以`.ttf`结尾的字体文件是必须存在的，否则不会被压缩;
  - [在线字体格式转换](https://aconvert.com)
- **注意3:** 如果压缩出现报错或者字体文件不存在，可以先把`CSS`文件中除了引用font的地方，其余的全部删除，再进行压缩，压缩成功后再恢复其余样式即可。
  - 这是最快的解决办法；
  - 未找到的原因有很多种，其中一种可能是`CSS`文件里使用了伪类，其中存在`content: ''`，因此未找到字体



### 图片懒加载

由于本人使用的是阿里云的学生机服务器，因此无法流畅运行中大型网页，只有从提高网页应用的性能入手。而网页最耗性能的，莫过于`图片`、`音频`、`视频`这些了。对于个人主页来说，用图片来呈现自己的作品是不可或缺的一部分，因此在没办法减少媒体资源的情况下，只能使用`懒加载`来减少网页打开时的加载时间了。

#### 概述

<u>什么是懒加载？</u>

`懒加载`是一种在页面加载时**延迟加载**一些非关键资源的技术，换句话说就是**按需加载**。

我们之前看到的懒加载一般是这样的形式：

- 浏览一个网页，准备往下拖动滚动条
- 拖动一个占位图片到视窗
- 占位图片被瞬间替换成最终的图片

<u>为什么使用懒加载而不直接加载？</u>

- 浪费流量。在不计流量收费的网络，这可能不重要；在按流量收费的网络中，毫无疑问，一次性加载大量图片就是在浪费用户的钱。
- 消耗额外的电量和其他的系统资源，并且延长了浏览器解析的时间。因为媒体资源在被下载完成后，浏览器必须对它进行解码，然后渲染在视窗上，这些操作都需要一定的时间。

<u>原理</u>

解释懒加载的原理之前，需要先说一下浏览器窗口。我个人把网页在浏览器窗口的显示分为两个部分：`显示区`与`隐藏区`。
- **显示区**： 显示区就是用户当前可以看到的部分；
- **隐藏区**： 隐藏区就是除了当前可见部分的其余部分；

**懒加载**，也可称为**按需加载**，顾名思义，就是按照需要来进行加载。当用户在浏览为网页时，可以仅加载当前可见区域的内容，等待用户有浏览其它区域的意图时，再进行加载其它区域内容。

其中对于在浏览器浏览网页而言，*有浏览其它区域的意图*可以体现为：**点击**、**获取焦点**、**滚动条滚动**等。对于这个个人主页而言，**滚动条滚动**的意图更频繁。

#### 代码

##### 思路

1. 所有的`Img标签`增加自定义属性:`data-src`，用于存放图片的`src`，在`src`属性中，都设置为默认图片路径。
2. 使用DOM-API（`getElementsByTagName`） 获取所有图片标签；
3. 获取显示区域高度（`document.documentElement.clientHeight`）
4. 获取滚动条高度（`document.documentElement.scrollTop || document.body.scrollTop`)
5. 遍历所有图片标签，获取每一个图片标签距离顶部位置；
6. 当图片**离顶部位置 < 显示区高度 + 滚动条高度**时，将该图片的`data-src`属性值赋值给`src`

##### 代码

```html
<!-- index.html -->

<img id="blog-c" data-src="1.png" src="default.png" alt=""/>
<img id="blog-b" data-src="2.png" src="default.png" alt=""/>
<img id="blog-a" data-src="3.png" src="default.png" alt=""/>
```

```js
// main.js

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
            console.log(i, '----', offsetTop)
            if (img[i].getAttribute("src") === "default.png") {
                img[i].src = img[i].getAttribute("data-src");
            }
            n = i + 1;
        }
    }
}

```



### 页面加载完成前显示Loading

由于服务器带宽较小，在网络状况不好的时候，会出现很长时间的白屏情况，用户体验不是很好，因此需要在页面加载完成之前显示loading提示用户进行等待。

#### 代码

```html
<!--index.html-->

<section id="loading">
    <div class="loader">
        <div class="loading-content"></div>
    </div>
</section>
```

```css

/*************
	Loading
**************/
#loading {
    background-color: rgba(0, 0, 0, .3);
    height: 100vh;
    width: 100%;
    overflow: hidden;
    position: fixed;
    z-index: 999;
}

.loader {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.loading-content {
    width: 50px;
    height: 50px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.loading-content:before {
    content: '';
    width: 50px;
    height: 5px;
    background: #000;
    opacity: 0.1;
    position: absolute;
    top: 59px;
    left: 0;
    border-radius: 50%;
    animation: shadow 0.5s linear infinite;
}
.loading-content:after {
    content: '';
    width: 50px;
    height: 50px;
    background: #fff;
    animation: animate 0.5s linear infinite;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 3px;
}
@keyframes animate {
    17% {border-bottom-right-radius: 3px;}
    25% {transform: translateY(9px) rotate(22.5deg);}
    50% {transform: translateY(18px) scale(1, 0.9) rotate(45deg);border-bottom-right-radius: 40px;}
    75% {transform: translateY(9px) rotate(67.5deg);}
    100% {transform: translateY(0) rotate(90deg);}
}
@keyframes shadow {
    0%,100% {transform: scale(1, 1);}
    50% {transform: scale(1.2, 1);}
}
```

```js
// main.js

document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState === "complete") {
        document.getElementById('loading').style.display = 'none';
    }
}
```



### 类Class

大二时期学习C++面向对象的时候，类，可算是把当时的我整了个半死不活。好在后期将学习了前端将编程应用到了实际生活中，再回过头去看当初学习的东西时，才有一种新的体验。

`JavaScript`，严格意义上来说，这是一种基于对象的语言，学习的时候，网课的老师时刻在强调："**万物皆对象**"。但是，它并不是一种面向对象的语言，`JavaScript`的语法里，压根就没有`Class（类）`的定义。但是这并不代表就不能使用`JS`来进行面向对象的编程，一直以来，开发人员都是使用函数`function`和原型`prototype`来模拟`类class`，以此达到模拟`类Class`实现面向对象的编程。

但是`ES6`已经成功的给`JS`带来了`类Class`的概念，尽管，这个名义上的类，本质上还是由函数`function`原型`prototype`封装来实现的。

主页里也将一些地方使用类来进行编程处理，使代码的易读性更高。简单对主页里使用到的面向对象的编程进行一个记录。

##### 类的声明

```js
// main.js

// 定义一个叫Animal的类
class Animal {
    // 构造函数constructor
    constructor(color){
        // color为属性
    	this.color = color;
    }
}
```

`Constructor`为构造方法，构造方法里面的this，指向的是该类实例化后的对象。

需要提醒的是**构造方法Constructor是一个类必须要有的方法**也是唯一的，**一个类体不能含有多个Constructor构造方法**，默认返回实例对象；创建类的实例对象的时候，会调用此方法来初始化实例对象。但即使没有编写**Constructor**方法，执行的时候也会加上一个默认为空得到**Constructor**方法。

##### 类的属性和方法

其实上面声明的代码里已经添加了一个`属性`color。

```js
// main.js

class Animal {
    //构造方法
    constructor(color, name){
        // 属性color与name
        this.color = color;
        this.name = name;
    }

    //自定义方法getColor
    getColor(){
        return this.color;
    }
}
```

这里自定义了一个`getColor( )`方法，它属于类的实例方法，实例化后对象可以调用此方法。

##### 类的实例化

程序员经常开玩笑调侃道：**没有对象吗？没有就New一个啊**。说的其实也就是`类的实例化`。

基于上述代码，进行实例化。

```js
// main.js

class Animal {
    //构造方法
    constructor(color, name){
        // 属性color与name
        this.color = color;
        this.name = name;
    }

    // 自定义方法getName
    getName(){
        return 'This is a' + this.name;
    }
}

// 创建一个Animal实例对象dog
let dog = new Animal('dog');
dog.name; // 结果：dog
dog.getName(); // 结果：This is a dog
```

这里通过`New`来创建了实例对象dog，构造方法会把传进去的参数“dog”通过`this.name`赋值给对象的name属性，所以dog的`name属性`为“dog”，对象dog还可以调用自己的实例方法`getName( )`，结果返回：“This is a dog”。

实例对象的创建有几个要注意的事项：

- **必须使用new创建字来创建类的实例对象**
- **先声明定义类，再创建实例，否则会报错**



### Ajax 实现留言板功能

只会前端，还不会后端的我，想实现用户与我的交互，实在是难。之前使用的是Server酱，可以使用微信公众号的模板消息进行通知，但现在由于腾讯取消掉了微信的模板消息，导致Server酱不可用了。不得已选择换别的渠道，发现了一个新的服务，`WxPusher`，使用非常简单，就不过多介绍。把`Ajax`在此进行记录吧。

`WxPusher`官网：[微信推送服务](https://wxpusher.dingliqc.com/docs/#/)

##### Ajax

`Ajax`，久闻大名，尽管文档内容并不是很多，但也一直没有沉下心好好看看这部分的内容。即使学了`Vue`，在与后端交互的时候，也都是使用的`Axios`，发送请求的时候，用的也是Promise，虽然并不太懂，但感觉和`Ajax`的`XMLHttpRequest` 应该是两个东西。

作为异步更新的大佬，**AJAX 可以在无需重新加载整个网页的情况下，能够更新部分网页。**因此也就可以在后台与服务器进行少量的数据交换。

个人主页这里用的倒也不是异步更新，仅仅是使用了Ajax的`XMLHttpRequest `罢了。

##### 代码

```js
// main.js

function request(path, method, payload, callback) {
    let url = 'YOUR URL';
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && callback)
            callback(xhr)
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(payload)  // 需要传到服务器的参数
}

function GET(callback) {
    this.request("get", "GET", null, callback)
}

function POST(payload, callback) {
    this.request("post", "POST", payload, callback)
}

// 发送post请求给服务器,数据为data
let data = {}
POST(JSON.stringify(data), xhr => {
    if (xhr.status === 200 || xhr.status === 201){
        // do something
        alert("Success~")
    } else {
        alert("Please try again later")
    }
})
```



## 参考文献

- [Meta标签常用属性值的写法和作用](https://blog.csdn.net/xustart7720/article/details/79649896)
- [翁天信的个人主页](https://www.dandyweng.com/)
- [TweenMax中文手册_TweenMax中文网](https://www.tweenmax.com.cn/api/tweenmax/)
- [Get Started Setup · janpaepke/ScrollMagic Wiki (github.com)](https://github.com/janpaepke/ScrollMagic/wiki/Get-Started-Setup)
- [07-Scrollmagic - 简书 (jianshu.com)](https://www.jianshu.com/p/4e146711e607)
- [css引入外部字体_荆轲刺秦王-CSDN博客_](https://blog.csdn.net/qq_20757489/article/details/85059783)
- [使用字蛛压缩字体文件_帆酱的博客-CSDN博客](https://blog.csdn.net/weixin_41187842/article/details/80526653)
- [前端网页的懒加载 - 前端一点红 - 博客园 (cnblogs.com)](https://www.cnblogs.com/ypppt/p/13324159.html)
- [终于，JavaScript也有了类（class）的概念 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/137056910)
- [AJAX 简介 (w3school.com.cn)](https://www.w3school.com.cn/ajax/ajax_intro.asp)

