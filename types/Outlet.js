var Service, Characteristic;

function LoxoneOutlet(config, platform, hap) {
    this.log = platform.log;
    this.type = "Outlet";
    this.platform = platform;
    this.loxone = platform.loxone;

    Service = hap.Service;
    Characteristic = hap.Characteristic;

    this.name = config.name;
    this.input = config.input;
    this.output = config.output;

    this._service = new Service.Outlet(this.name);
    this._service.getCharacteristic(Characteristic.On)
        .on('get', this._getValue.bind(this));

    this._service.getCharacteristic(Characteristic.On)
        .on('set', this._setValue.bind(this));

}

LoxoneOutlet.prototype._getValue = function(callback) {
    this.loxone.getValue(this.output, function(value) {
        callback(null, value * 1);
    });
};

LoxoneOutlet.prototype._setValue = function(on, callback) {
    var loxone = this.loxone;
    var input = this.input;
    var output = this.output;
    loxone.getValue(output, function(value) {
        var isOn = (value != 0);
        if (isOn != on) {
            loxone.set(input, "Pulse", function(value) {
                callback();
            });
        }

    });
};

LoxoneOutlet.prototype.getServices = function() {
    return [this._service, this.platform.getInformationService(this)];
};

module.exports = LoxoneOutlet;