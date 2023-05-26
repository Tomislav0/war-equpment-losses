export class DayLoss {
  date: Date
  day: number
  aircraft: number
  helicopter: number
  tank: number
  APC: number
  fieldArtillery: number
  MRL: number
  drone: number
  antiAircraftWarfare: number
  aircraftPD: number
  helicopterPD: number
  tankPD: number
  APCPD: number
  fieldArtilleryPD: number
  MRLPD: number
  dronePD: number
  antiAircraftWarfarePD: number

  constructor(day: any) {
    let date = day.date.split('/')
    this.date = new Date(Number(date[2]),Number(date[0])-1,Number(date[1]));
    this.day = day.day
    this.aircraft = day.aircraft
    this.helicopter = day.helicopter
    this.tank = day.tank;
    this.APC = day.APC
    this.fieldArtillery = day.fieldArtillery
    this.MRL = day.MRL
    this.drone = day.drone
    this.antiAircraftWarfare = day.antiAircraftWarfare
    this.aircraftPD = day.aircraftPD
    this.helicopterPD = day.helicopterPD
    this.tankPD = day.tankPD
    this.APCPD = day.APCPD
    this.fieldArtilleryPD = day.fieldArtilleryPD
    this.MRLPD = day.MRLPD
    this.dronePD = day.dronePD
    this.antiAircraftWarfarePD = day.antiAircraftWarfarePD
  }
}
