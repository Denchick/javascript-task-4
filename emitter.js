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
    const events = new Map();
    const getEventsForEmit = event => {
        let result = [event];
        let tempEvent = event;
        let index = tempEvent.lastIndexOf('.');
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
        return [...events.keys()].filter(x => x === event || x.startsWith(event + '.'));
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
            getEventsForEmit(event).forEach(eventForEmit => {
                let items = events.get(eventForEmit);
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
            subscribeOnEvent(event, context, handler, count => count % frequency === 0);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
