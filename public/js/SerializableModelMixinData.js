if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define([
    'require',
    'backbone',
    'underscore'
], function(require) {
    var Model = require('backbone')['Model'];
    var Collection = require('backbone')['Collection'];

    var underscore = require('underscore');
    var SerializableModelMixinData = {};

    SerializableModelMixinData['xport'] = function (opt) {
        var result = {},
        settings = underscore({
            recurse: true
        }).extend(opt || {});

        function process(targetObj, source) {
            targetObj.id = source.id || null;
            targetObj.cid = source.cid || null;
            targetObj.attrs = source.toJSON();
            underscore.each(source, function (value, key) {
                // since models store a reference to their collection
                // we need to make sure we don't create a circular refrence
                if (settings.recurse) {
                    if (key !== 'collection' && source[key] instanceof Collection) {
                        targetObj.collections = targetObj.collections || {};
                        targetObj.collections[key] = {};
                        targetObj.collections[key].models = [];
                        targetObj.collections[key].id = source[key].id || null;
                        underscore.each(source[key].models, function (value, index) {
                            process(targetObj.collections[key].models[index] = {}, value);
                        });
                    } else if (source[key] instanceof Model) {
                        targetObj.models = targetObj.models || {};
                        process(targetObj.models[key] = {}, value);
                    }
                }
            });
        }
        process(result, this);
        return result;
    };

    // rebuild the nested objects/collections from data created by the xport method
    SerializableModelMixinData['mport'] = function (data, silent) {
        function process(targetObj, data) {
            targetObj.id = data.id || null;
            targetObj.set(data.attrs, {
                silent: silent
            });
            // loop through each collection
            if (data.collections) {
                underscore.each(data.collections, function (collection, name) {
                    targetObj[name].id = collection.id;
                    Skeleton.models[collection.id] = targetObj[name];
                    underscore.each(collection.models, function (modelData, index) {
                        var newObj = targetObj[name]._add({}, {
                            silent: silent
                        });
                        process(newObj, modelData);
                    });
                });
            }


            if (data.models) {
                underscore.each(data.models, function (modelData, name) {
                    process(targetObj[name], modelData);
                });
            }
        }
        process(this, data);
        return this;
    };
    
    return {
        'mix': function(prototype) {
            for (var key in SerializableModelMixinData) {
                prototype[key] = SerializableModelMixinData[key];
            }
        },
        'prototype': SerializableModelMixinData
    };
});