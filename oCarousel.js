((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.oCarousel = factory();
    }
})(this, (doc = document) => {
    const CONF = {
        blockClass: 'oCarousel',
        finishClass: 'oCarousel-doit',
        mainClass: 'oCarousel-main',
        itemClass: 'oCarousel-item',
        defaultMethod: 'rollit',
        rollit: {
            intval: 3000,
            duration: .3,
            startPoint: 0,
            autoRollIt: 1,
            attrName: 'rollit',
        },
        rotate: {

        },
    };

    class Carousel {
        constructor() {
            this.setMethod();

            let M = this.Manager.bind(this)
                M.__proto__ = this;
            return M;
        }
        Manager(conf) {
            this.config = TOOL.extend(true, {}, CONF, conf);
            // this.Rollit(this.config.rollit);
            // this.Rotate(this.config.rotate);
            this.initOtherBlock(this.ManagerBlock.METHODS[this.config.defaultMethod]);
            return this.Blocks;
        }
        Rollit() {}
        Rotate() {}

        get Blocks() {
            return this.ManagerBlock.blocks;
        }
        get ManagerBlock() {
            // console.log(Block.name)
            return Block;
        }
        setMethod() {
            let methods = this.ManagerBlock.METHODS;
            for (let i in methods) {
                this[methods[i].name] = function(elem, conf) {
                    if (elem instanceof HTMLElement) {
                        return new methods[i](elem, conf);
                    }
                    conf = TOOL.extend(true, {}, CONF, {[i]: TOOL.extend(true, {}, TOOL[i], elem)});
                    // TODO: console.log(doc.querySelectorAll(`.${CONF.blockClass}[${conf[i].attrName}]`))
                }.bind(this);
            }
        }
        initOtherBlock(method) {
            return this.getNoFinishBlock().map(elem => new method(elem, this.config));
        }
        getNoFinishBlock() {
            return Array.from(doc.querySelectorAll(`.${this.config.blockClass}:not(.${this.config.finishClass})`));
        }
    }

    class Block {
        constructor(elem, config) {
            this.CONFIG = config;
            this.elem = elem;
            this.main = this.elem.querySelector(`.${config.mainClass}`);
            this.items = this.main.querySelectorAll(`.${config.itemClass}`);
            this.addBlocks(this.getName(elem));
        }

        addBlocks(name) {
            (Block.blocks || (Block.blocks = {})) && (Block.blocks[name] = this)
        }
        getName(elem) {
            return elem.getAttribute('name') || `block_${this.xxx}`;
        }
        get xxx() {
            Block.x || (Block.x = 0)
            return ++Block.x
        }
        listener() {
            this.elem.addEventListener('mouseenter', e => this.stopRoll());
            this.elem.addEventListener('mouseleave', e => this.autoRoll());
        }
        stopRoll() {}
        autoRoll() {}
        
        static addMethods(name, classs) {
            (Block.METHODS || (Block.METHODS = {})) && (Block.METHODS[name] = classs)
        }
    }

    class Rollit extends Block {
        constructor(elem, config) {
            super(elem, config)

            this.config = config.rollit
            this.widths = Array.from(this.items).map(v => v.clientWidth);
            this.length = this.widths.length;

            this._intval = 0;
            this._point = 0;

            this.listener();
            this.setPoint(this.config.startPoint);
            this.config.autoRollIt && this.autoRoll();
        }
        autoRoll() {
            this.stopRoll() || (this._intval = setInterval(x => this.next(), this.config.intval));
        }
        stopRoll() {
            this._intval = +!!clearInterval(this._intval);
        }
        getWidth() {
            return this.widths.slice(0, this._point).reduce((c, v) => c + v, 0);
        }
        setPoint(p) {
            this._point = p >= this.length ? 0 : (p < 0 ? this.length - 1 : p);
        }
        next() {
            this.setPoint(++this._point) || this.setIndex();
        }
        prev() {
            this.setPoint(--this._point) || this.setIndex();
        }
        setIndex() {
            this.main.style.transitionDuration = `${this.config.duration}s`;
            this.main.style.transform = `translate3d(-${this.getWidth()}px, 0, 0)`;
        }
    }
    Block.addMethods('rollit', Rollit);


    const TOOL = {
        isArray(param) {
			return this.type(param) === '[object Array]';
        },
        isObject(param) {
			return this.type(param) === '[object Object]';
		},
        isPlainObject(param) {
			return this.isObject(param) && !this.isWindow(param) && Object.getPrototypeOf(param) === Object.prototype;
        },
        isFunction(param) {
			return this.type(param) === '[object Function]';
        },
        isWindow(param) {
			return param != null && param === param.window;
		},
        type(param) {
			return param == null ? String(param) : Object.prototype.toString.call(param)||'object';
		},
        extend() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;
    
            if (typeof target === 'boolean') {
                deep = target;
    
                target = arguments[i] || {};
                i++;
            }
    
            if (typeof target !== 'object' && !this.isFunction(target)) {
                target = {};
            }
    
            if (i === length) {
                target = this;
                i--;
            }
    
            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
    
                        if (target === copy) {
                            continue;
                        }
    
                        if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && this.isArray(src) ? src : [];
    
                            } else {
                                clone = src && this.isPlainObject(src) ? src : {};
                            }
    
                            target[name] = this.extend(deep, clone, copy);
    
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        }
    };

    const oCarousel = new Carousel();
    return oCarousel;
});



oCarousel.Rollit({})