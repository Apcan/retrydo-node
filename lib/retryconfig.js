/**
 * 重试计划参数类
 */
class retryconfig {

    /**
     * @param {Object} conf 定义重试计划配置
     *      @param {Number} times 重试次数 0=forever -1=never
     *      @param {String} mode 重试模式 uniform=匀速重试 custom=自定义时间延迟 immediately='失败立即重试'
     *      @param {Number} timeout 时间延迟（秒）
     *      @param {Array} c_timeout 自定义时间延迟数组（秒） [ 30 , 5*60 , 60*60 ]
     */
    constructor(conf) {
        this.conf(conf)
    }

    /**
     * 
     * @param {Number} times 重试次数 0=forever -1=never
     */
    times(t) {
        this._times = t;
        return this;
    }

    /**
     * 
     * @param {String} mode 重试模式 uniform=匀速重试 custom=自定义时间延迟 immediately='失败立即重试'
     */
    mode(m) {
        this._mode = m;
        return this;
    }

    /**
     * 
     * @param {Number} timeout 时间延迟（秒）
     */
    timeout(t) {
        this._timeout = t * 1000;
        return this;
    }

    /**
     * 
     * @param {Array} c_timeout 自定义时间延迟数组（秒） [ 30 , 5*60 , 60*60 ]
     */
    c_timeout(c) {
        this._c_timeout = c.map(t => t * 1000);
        return this;
    }

    conf(c = {}) {
        let { times = 0, mode = 'uniform', timeout = 5, c_timeout = [] } = c;
        this.times(times);
        this.mode(mode);
        this.timeout(timeout);
        this.c_timeout(c_timeout);
    }

}


module.exports = retryconfig;