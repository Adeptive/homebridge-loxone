var Service, Characteristic;

function LoxoneTemperature(config, platform, hap) {
    this.log = platform.log;
    this.type = "TemperatureSensor";
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;

    this._service = new Service.TemperatureSensor(this.name);
    this._service.getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this._getValue.bind(this));
}

LoxoneTemperature.prototype._getValue = function(callback) {
    this.loxone.getValue(this.input, function(value) {
        callback(null, value * 1);
    });
};

LoxoneTemperature.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneTemperature;