# retrydo 失败重试

> npm i -save retrydo


## demo
```javascript
const retrydo = require('../')

let r = new retrydo();

r.setfunc((e) => {
    e.error('this is an error')
})

r.conf().mode('uniform').times(8).timeout(1)

r.start()
```

- Events
    - doerror 每一次执行失败的事件
    - dosuccess 执行成功的事件
    - finish 完成所有操作后的事件

- Methods
    - conf 返回一个retryconfig对象可以配置config
        - times
        - mode
        - timeout
        - c_timeout
        *      @param {Number} times 重试次数 0=forever -1=never
        *      @param {String} mode 重试模式 uniform=匀速重试 custom=自定义时间延迟 immediately='失败立即重试'
        *      @param {Number} timeout 时间延迟（秒）
        *      @param {Array} c_timeout 自定义时间延迟数组（秒） [ 30 , 5*60 , 60*60 ]
    - end 设置结束后的回掉方法
    - setfunc 设置需要重试的方法
    - start 开始执行
    - getResults 获取所有执行结果
    - error 函数失败需要重试处调用
    - success 函数成功时调用 方法返回参数即为success

- note
    > 方法外面包一层方法传入为retrydo对象,再失败需要重试的地方调用对象的error方法,
    在成功的地方调用success方法


     