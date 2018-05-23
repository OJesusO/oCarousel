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
        mainClass: 'oCarousel',
        finishClass: 'oCarousel-doit',
        defaultMethod: 'rollit',
        rollit: {
            intval: 3000,
            duration: .3,
            startPoint: 0,
            autoRollIt: 1,
            mainClass: 'oCarousel-main',
            itemClass: 'oCarousel-item',
        },
        rotate: {

        },
    };
    const Carousel = (config = CONF) => {
        Carousel.Rollit(config.rollit);
        Carousel.Rotate(config.rotate);
        Carousel.initOtherBlock(METHODS[CONF.defaultMethod], config[CONF.defaultMethod]);
    };
    Carousel.Rollit = ({

    } = {}) => {

    };
    Carousel.Rotate = conf => {};

    Carousel.initOtherBlock = (method, config) => Carousel.getNoFinishBlock().map(block => method(block, config));
    Carousel.getNoFinishBlock = x => Array.from(doc.querySelectorAll(`.${CONF.mainClass}:not(.${CONF.finishClass})`));

    const METHODS = {};
    METHODS.rollit = (block, {
        intval, duration, startPoint, autoRollIt, mainClass, itemClass
    } = CONF.rollit) => {
        let main = block.querySelector(`.${mainClass}`);
        let items = main.querySelectorAll(`.${itemClass}`);
        let widths = Array.from(items).map(v => v.clientWidth);
        let length = widths.length;
        let _intval = 0;
        let _point = 0;
        function autoRoll() {
            stopRoll() || (_intval = setInterval(next, intval));
        }
        function stopRoll() {
            _intval = +!!clearInterval(_intval);
        }
        function getWidth() {
            return widths.slice(0, _point).reduce((c, v) => c + v, 0);
        }
        function setPoint(p = startPoint) {
            _point = p >= length ? 0 : (p < 0 ? length - 1 : p);
        }
        function next() {
            setPoint(++_point) || setIndex();
        }
        function prev() {
            setPoint(--_point) || setIndex();
        }
        function setIndex() {
            main.style.transitionDuration = `${duration}s`;
            main.style.transform = `translate3d(-${getWidth()}px, 0, 0)`;
        }
        setPoint();
        autoRollIt && autoRoll();
        block.addEventListener('mouseenter', e => stopRoll());
        block.addEventListener('mouseleave', e => autoRoll());
    }

    return Carousel;
});



oCarousel({})