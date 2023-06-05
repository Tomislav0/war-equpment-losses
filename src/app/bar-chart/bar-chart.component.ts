import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DayLoss } from '../model/DayLoss';
import { EquipmentBars } from '../model/EquipmentBars';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})


export class BarChartComponent implements OnInit {
  @Input()
  data: DayLoss[] = []

  constructor(private ref: ChangeDetectorRef) {
    this.selectDataSource = [{ id: "aircraft", name: "Aircrafts" },
    { id: "helicopter", name: "Helicopters" },
    { id: "tank", name: "Tanks" },
    { id: "APC", name: "APCs" },
    { id: "fieldArtillery", name: "Field Artillery" },
    { id: "MRL", name: "MRLs" },
    { id: "drone", name: "Drones" },
    { id: "antiAircraftWarfare", name: "Anti aircraft warfares" }];
    this.selectedValues = this.selectDataSource;

    this.selectedDay = this.data[this.data.length - 1];
  }

  ngOnInit(): void {
    this.ref.detectChanges()
    this.dataToShow = new EquipmentBars(this.data[this.data.length - 1]);
    this.date = this.data[this.data.length - 1].date
    this.createSvg();
    this.drawBars();
  }

  public selectDataSource;
  public selectedValues;
  public selectedDay: DayLoss;

  public date: Date = new Date();
  public gridColumns: any = ['name'];

  private dataToShow: EquipmentBars | null = null;

  private svg: any;
  private margin = 50;
  private width = 1000 - (this.margin * 2);
  private height = 600 - (this.margin * 2);

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(): void {
    let selectedValuesIds = this.selectedValues.map(s => s.id)
    let data = this.dataToShow?.equipmentBar.filter(s => selectedValuesIds.includes(s.id));

    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data!.map(d => d.name))
      .padding(0.2);

    const xElement = this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .style("color", "#F8F5E4");

    xElement.selectAll("path")
      .style("stroke-width", "3px");

    xElement.selectAll("text")
      .style("font-size", 14)

    const y = d3.scaleLinear()
      .domain([0, d3.max(data!, (d) => d.quantity)!])
      .range([this.height, 0]);

    this.svg.append("g")
      .call(d3.axisLeft(y))
      .style("color", "#F8F5E4")
      .selectAll("path")
      .style("stroke-width", "3px");

    if (!this.selectedValues.length) {
      this.svg.append("text")
        .attr("x", (d: any) => this.width / 2)
        .attr("y", (d: any) => this.height / 2)
        .text("no data")
        .attr("fill", "white");
      return
    }

    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.name))
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "#F7C04A")
      .transition()
      .duration(1000)
      .delay((d: any, i: any) => i * 100)
      .attr("y", (d: any) => y(d.quantity))
      .attr("height", (d: any) => this.height - y(d.quantity));

    this.svg.selectAll("info")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d: any) => x(d.name))
      .attr("y", (d: any) => y(d.quantity) - 3)
      .text((d: any) => d.quantity)
      .attr("fill", "white")
      .attr("opacity", 0)
      .transition()
      .duration(2000)
      .delay((d: any, i: any) => i * 100)
      .attr("opacity", 1);
  }

  onGridBoxOptionChanged(e: any) {
    if (e.name === 'value') {
      this.ref.detectChanges();
      const svgElement = d3.select("figure#bar svg");
      svgElement.remove()
      this.createSvg()
      this.drawBars()

    }
  }

  disableDates(args: any) {
    return args.date < new Date(2022, 1, 25) || args.date > new Date(2023, 3, 30)
  }

  onDateChange(data: any) {
    this.date = data.value

    let dayLoss = this.data.filter(day => this.date.getDate() == day.date.getDate()
      && this.date.getMonth() == day.date.getMonth()
      && this.date.getFullYear() == day.date.getFullYear());
    this.selectedDay = dayLoss[0]
    this.dataToShow = new EquipmentBars(dayLoss[0]);
    const svgElement = d3.select("figure#bar svg");
    svgElement.remove()
    this.createSvg()
    this.drawBars()
  }
}
