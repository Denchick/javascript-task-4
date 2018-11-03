'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;


var events = new Map();
const getEventsForUnsubscribe(event) => {
    
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {


        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);
            events.set(event, { context: context, handler: handler });
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            console.info(event, context);
            getEventsForUnsubscribe(event).forEach(item => {
                if (events.get(item) !== undefined) {
                    events.delete(item);
                }
            })
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            console.info(event);
            getEventsForEmit(event).forEach(item => {
                const { context, handler } = events(item);
                handler.call(context);
            });
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
