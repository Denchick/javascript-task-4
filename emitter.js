'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    let events = new Map();

    const getEventsForEmit = event => {
        var result = [event];
        var tempEvent = event;
        var index = tempEvent.lastIndexOf('.');
        while (index >= 0) {
            tempEvent = tempEvent.slice(0, index);
            result.push(tempEvent);
            index = tempEvent.lastIndexOf('.');
        }

        return result;
    };

    const subscribeOnEvent = (event, context, handler, emitCondition = count => count || true) => {
        if (!events.has(event)) {
            events.set(event, []);
        }
        let eventObj = {
            context: context,
            handler: handler,
            counter: 0,
            condition: emitCondition
        };
        events.get(event).push(eventObj);
    };

    const getEventsForOff = event => {
        return [...events.keys()]
            .filter(x => x === event || x.startsWith(event + '.'));
    };

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} emitter
         */
        on: function (event, context, handler) {
            // console.info(event, context, handler);
            if (this.subscribersCount === undefined) {
                this.subscribersCount = 0;
            }
            subscribeOnEvent(event, context, handler);

            return this;
        },


        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} emitter
         */
        off: function (event, context) {
            // console.info(event, context);
            getEventsForOff(event).forEach(element => {
                if (events.has(element)) {
                    events.set(element, events.get(element)
                        .filter(current => current.context !== context));
                }
            });

            return this;
        },


        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} emitter
         */
        emit: function (event) {
            // console.info(event);
            getEventsForEmit(event).forEach(eventForEmit => {
                var items = events.get(eventForEmit);
                if (items !== undefined) {
                    items.forEach(i => {
                        const { context, handler, counter, condition } = i;
                        if (condition(counter)) {
                            handler.call(context);
                        }
                        i.counter += 1;
                    });
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} emitter
         */
        several: function (event, context, handler, times) {
            // console.info(event, context, handler, times);
            subscribeOnEvent(event, context, handler, count => count < times);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} emitter
         */
        through: function (event, context, handler, frequency) {
            // console.info(event, context, handler, frequency);
            subscribeOnEvent(event, context, handler, count => count % frequency === 0);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
