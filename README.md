# 零依赖toast服务

### DEMO
[DEMO](https://codepen.io/xty1992a/pen/bzXBOo)

### 安装
`npm i @redbuck/toast`或者
`yarn add @redbuck/toast`

### 引入
html
```html
  <link rel="stylesheet" href="./lib/toast.css">
  <script type="text/javascript" src="./lib/toast.js"></script>
```
模块
```
import Toast from '@reabuck/toast'
import '@reabuck/toast/lib/toast.css'
```

### 使用
##### 一般用法
```javascript
  const toast = Toast(ToastOption);

  // toast.d.ts
  type ToastOption = string | managerType
 ```
 managerType:

 属性|类型|默认值|描述
 --: | --: | --: | --:
 message|String|''|文字
 type|String|'text'|类型
 duration|Number|2000|延时,0表示永不消失
 mask|Boolean|false|是否有背景浮层
 mountTo|Function|() => body|挂载点
 className|String|''|自定义根标签class

toast:
  ToastManager实例.可通过实例方法clear清除自身

##### 别名
 ```
   Toast.success(option);
   Toast.loading(option);
   Toast.error(option);
 ```
 别名即`Toast({type: 'name'})`的简写方式.

 如Toast.success('message')等价于`Toast({message: 'message', type: 'success'})`

 > 注,`loading`默认duration为0,不关闭,需要指定时间或手动关闭

##### methods
1. Toast.clearAll()
    用于清除所有Toast
2. Toast.clear(seed)
    清除指定toast,seed即toast编号,根元素的id即为'toast'+seed




