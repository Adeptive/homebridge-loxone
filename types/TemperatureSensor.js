function LoxoneTemperature(config, platform, Service, Characteristic, uuid) {
    this.log = platform.log;
    this.type = "TemperatureSensor";
    this.platform = platform;
    this.loxone = platform.loxone;

    this.name = config.name;
    this.input = config.input;

    var sensorUUID = uuid.generate('hap-nodejs:loxone-accessories:temperature-badkamer');

    this._service = new Service.TemperatureSensor(this.name, sensorUUID);
    this._service.getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this._getValue.bind(this));
}

LoxoneTemperature.prototype._getValue = function(callback) {
    this.loxone.getValue(this.input, function(value) {
        callback(null, value * 1);
    });
};

LoxoneTemperature.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this.name)];
};

module.exports = LoxoneTemperature;