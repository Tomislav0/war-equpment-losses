import { DayLoss } from "./DayLoss";
import { EquipmentBar } from "./EquipmentBar";

export class EquipmentBars {
  equipmentBar: EquipmentBar[] = []
  constructor(day: DayLoss) {
    this.equipmentBar.push(new EquipmentBar("aircraft","Aircrafts", day.aircraft));
    this.equipmentBar.push(new EquipmentBar("helicopter","Helicopters", day.helicopter));
    this.equipmentBar.push(new EquipmentBar("tank","Tanks", day.tank));
    this.equipmentBar.push(new EquipmentBar("APC","APCs", day.APC));
    this.equipmentBar.push(new EquipmentBar("fieldArtillery","Field artilleries", day.fieldArtillery));
    this.equipmentBar.push(new EquipmentBar("MRL","MRLs", day.MRL));
    this.equipmentBar.push(new EquipmentBar("drone","Drones", day.drone))
    this.equipmentBar.push(new EquipmentBar("antiAircraftWarfare","Anti aircraft warfares", day.antiAircraftWarfare));
    this.equipmentBar = this.equipmentBar.sort((a, b) => b.quantity - a.quantity);
  }
}
