const retrydo = require('../')

let r = new retrydo();

r.setfunc((e) => {
    e.error('this is an error')
})

r.conf().mode('uniform').times(8).timeout(1)

r.start()