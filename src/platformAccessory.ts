import type { CharacteristicValue, PlatformAccessory } from 'homebridge';

import type { ExampleHomebridgePlatform } from './platform.js';

export class ExamplePlatformAccessory {

  constructor(platform: ExampleHomebridgePlatform, accessory: PlatformAccessory) {

    const service = accessory.getService(platform.Service.Thermostat) || accessory.addService(platform.Service.Thermostat);

    let state: CharacteristicValue = 0;
    let temp: CharacteristicValue = 30;

    service.setCharacteristic(platform.Characteristic.Name, accessory.context.device.exampleDisplayName);

    const validValues = [
      platform.Characteristic.CurrentHeatingCoolingState.OFF,
      platform.Characteristic.CurrentHeatingCoolingState.COOL, // !!! Broken with COOL but works with HEAT !!!
    ];

    service.getCharacteristic(platform.Characteristic.CurrentHeatingCoolingState)
      .onGet(async () => state)
      .setProps({ validValues });

    service.getCharacteristic(platform.Characteristic.TargetHeatingCoolingState)
      .onGet(async () => state)
      .onSet(async (value) => {
        state = value;
        service.getCharacteristic(platform.Characteristic.CurrentHeatingCoolingState).updateValue(value);
      })
      .setProps({ validValues });

    service.getCharacteristic(platform.Characteristic.CurrentTemperature)
      .onGet(async () => temp);

    service.getCharacteristic(platform.Characteristic.TargetTemperature)
      .onGet(async () => temp)
      .onSet(async (value) => {
        temp = value;
        service.getCharacteristic(platform.Characteristic.CurrentTemperature).updateValue(value);
      });

    service.getCharacteristic(platform.Characteristic.TemperatureDisplayUnits)
      .onGet(async () => {
        return platform.Characteristic.TemperatureDisplayUnits.CELSIUS;
      });
  }
}
