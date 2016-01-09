"use strict";

var LoxoneAPI = require('loxone-nodejs');
var LoxoneTemperatureSensor = require('./types/TemperatureSensor');

var Service, Characteristic;

module.exports = function(homebridge) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    //console.log(Service);

    homebridge.registerPlatform("homebridge-loxone", "Loxone", LoxonePlatform);
};

function LoxonePlatform(log, config) {
    this.log = log;
    this.debug = log.debug;
    this.accessoriesList = config['accessories'];

    this.loxone = new LoxoneAPI({
        ip: config['ip_address'],
        debug: false,
        username: config['username'],
        password: config['password']
    });
}

LoxonePlatform.prototype = {
    accessories: function(callback) {
        this.log("Fetching LoxonePlatform accessories.");

        var platform = this;

        //create array of accessories
        var myAccessories = [];

        console.log(platform);

        for(var accessory in platform.accessoriesList) {
            console.log(accessory);
        }

        var config = {
            "name": "Temperatuur Keuken",
            "input": "AWI3"
        };

        myAccessories.push(new LoxoneTemperatureSensor(config, platform, Service, Characteristic));

        // if done, return the array to callback function
        callback(myAccessories);
    }
};