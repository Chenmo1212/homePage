# 陈默的主页

## 动画库

### TweenMax
官网：https://www.tweenmax.com.cn/api/

**补间动画**

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

**TweenMax.set()**

链接：https://www.tweenmax.com.cn/api/tweenmax/TweenMax.set()

```javascripttriggerHook
// TweenMax.set( target:Object, vars:Object ) : TweenMax
```
- 立即设置目标的属性值而不产生过渡动画，相当于0的动画时间。
- 返回TweenMax对象。

以下两个设置作用相同
```javascript
// TweenMax.set(myObject, {x:100});
// TweenMax.to(myObject, 0, {x:100});
```


### ScrollMagic
官网：https://github.com/janpaepke/ScrollMagic/wiki/Getting-Started-:-How-to-use-ScrollMagic

**Defining the Controller**
```javascript
var controller = new ScrollMagic.Controller();
```

**Defining Scenes**
```javascript
var scene = new ScrollMagic.Scene({
  triggerElement: "#content",  //触发元素
  duration: 400,// 从开始点滚动多少px触发
  offset: 100,  // 效果持续的距离
})
```

**Adding Scenes to Controller**
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
