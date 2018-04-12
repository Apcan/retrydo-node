var EventEmitter = require('events');
const retryconfig = require('./retryconfig');
/**
 * 重试执行类
 */
class retrydo extends EventEmitter {
    /**
     * 
     * @param {Function} func方法 
     * @param {Object} config 定义重试计划配置
     *      @param {Number} times 重试次数 0=forever -1=never
     *      @param {String} mode 重试模式 uniform=匀速重试 custom=自定义时间延迟 immediately='失败立即重试'
     *      @param {Number} timeout 时间延迟（秒）
     *      @param {Array} c_timeout 自定义时间延迟数组（秒） [ 30 , 5*60 , 60*60 ]
     */
    constructor(func = () => { }, config = {}) {
        super();
        this.config = new retryconfig(config);
        this.func = func;
        this.results = [];
        this.retryindex = 0;
        this.on('doerror', err => {
            this.retryindex++;
            if (this.config._times < 0 || ((this.retryindex > this.config._times) && this.config._times > 0))
                this.finish();
            else retry.call(this);
        })
        this.on('dosuccess', result => {
            this.finish()
        })
    }

    error(err) {
        this.results.push(err);
        this.emit('doerror', err)
    }

    success(result = {}) {
        this.results.push(result);
        this.emit('dosuccess', result)
    }



    /**
     * 
     * @param {Object} conf 定义重试计划配置
     *      @param {Number} times 重试次数 0=forever -1=never
     *      @param {String} mode 重试模式 uniform=匀速重试 custom=自定义时间延迟 immediately='失败立即重试'
     *      @param {Number} timeout 时间延迟（秒）
     *      @param {Array} c_timeout 自定义时间延迟数组（秒） [ 30 , 5*60 , 60*60 ]
     * 
     * @returns {retryconfig} 重试计划配置对象
     */
    conf(conf) {
        if (conf)
            this.config.conf(conf);
        return this.config;
    }

    /**
     * 
     * @param {Function} func 需要重试的方法
     */
    setfunc(func) {
        this.func = func;
        return this;
    }

    /**
     * 开始运行
     */
    start() {
        if (this.retryindex === 0) {
            try {
                if (this.func(this))
                    this.success()
            } catch (err) {
                this.error(err)
            }

        }
        return this;
    }

    /**
     * 结束所有操作
     */
    finish() {
        this.emit('finish')
        if (this.endfunc)
            this.endfunc(this)
    }


    /**
     * 
     * @param {Function} func 设置结束回调方法
     */
    end(func) {
        this.endfunc = func;
        return this;
    }

    /**
     * 获取运行结果数组
     */
    getResults() {
        return this.results;
    }

}


function retry() {
    let time = 500;
    switch (this.config._mode) {
        case 'uniform':
            time = this.config._timeout;
            break;
        case 'custom':
            let c_timeout = this.config._c_timeout
            time = c_timeout[(this.retryindex > c_timeout.length) ? (c_timeout.length - 1) : (this.retryindex - 1)] || time
            break;
        case 'immediately':
            time = 0;
            break;
    }
    setTimeout(() => {
        this.func(this);
    }, time);
}




module.exports = retrydo;


