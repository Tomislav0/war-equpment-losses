import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DayLoss } from '../model/DayLoss';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input()
  data: DayLoss[] = []

  constructor(private ref: ChangeDetectorRef) {
    this.searchDataSource = [{ id: "aircraft", name: "Aircrafts" },
    { id: "helicopter", name: "Helicopters" },
    { id: "tank", name: "Tanks" },
    { id: "APC", name: "APCs" },
    { id: "fieldArtillery", name: "Field Artillery" },
    { id: "MRL", name: "MRLs" },
    { id: "drone", name: "Drones" },
    { id: "antiAircraftWarfare", name: "Anti aircraft warfares" }];

    this.filterDataSource = [{ id: 1, name: "First month", date: new Date(2022, 2, 25) },
    { id: 2, name: "First 3 months", date: new Date(2022, 4, 25) },
    { id: 3, name: "First 6 months", date: new Date(2022, 7, 25) },
    { id: 4, name: "First year", date: new Date(2023, 1, 25) },
    { id: 5, name: "Untill now", date: new Date() }];

    this.selectedEqupment = [this.searchDataSource[0]];
    this.selectedTimePeriod = [this.filterDataSource[1]];
  }

  ngOnInit(): void {
    this.datacopy = Object.assign(this.data)
    this.filterByTimePeriod()
    this.createSvg();
    this.drawChart();
  }

  private datacopy: DayLoss[] = []

  public searchDataSource;
  public filterDataSource;
  public selectedTimePeriod;
  public selectedEqupment;


  public showDots: boolean | null | undefined = true;

  public isEquipmentDropdownOpen: boolean = false;
  public isTimePeriodDropdownOpen: boolean = false;
  public gridColumns: any = ['name'];

  private x!: d3.ScaleLinear<number, number, never>
  private y!: d3.ScaleLinear<number, number, never>
  private svg: any;
  private margin = 50;
  private width = 1000 - (this.margin * 2);
  private height = 600 - (this.margin * 2);

  private createSvg(): void {
    this.svg = d3.select("figure#line")
      .append("svg")
      .attr("width", this.width + 200 + (this.margin * 2))
      .attr("height", this.height + 100 + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawChart(): void {
    this.x = d3.scaleLinear()
      .domain([d3.min(this.data, (d) => d.day)!, d3.max(this.data, (d) => d.day)!])
      .range([0, this.width]);

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.data.length > 60 ? d3.axisBottom(this.x).tickFormat(d3.format("d")) : d3.axisBottom(this.x).ticks(this.data.length))
      .style("color", "#F8F5E4")
      .selectAll("path")
      .style("stroke-width", "3px");

    this.svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", this.height + 40)
      .attr("fill", "#F8F5E4")
      .attr("text-anchor", "middle")
      .text("Days");

    this.y = d3.scaleLinear()
      .domain([0, d3.max(this.data, (d) => d[`${this.selectedEqupment[0].id as keyof DayLoss}`])!])
      .range([this.height, 0]);

    this.svg.append("g")
      .call(d3.axisLeft(this.y))
      .style("color", "#F8F5E4")
      .selectAll("path")
      .style("stroke-width", "3px");

    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - this.height / 2)
      .attr("y", -35)
      .attr("fill", "#F8F5E4")
      .attr("text-anchor", "middle")
      .text("Equipment");

    const line = d3.line()
      .x((d: any) => this.x(d.day))
      .y((d: any) => this.y(d[`${this.selectedEqupment[0].id as keyof DayLoss}`]));

    const path = this.svg.append("path")
      .datum(this.data)
      .attr("class", "line")
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "#F7C04A")
      .style("stroke-width", "2px");

    if (this.showDots)
      this.drawDots()

    const totalLength = path.node().getTotalLength();

    path.attr("d", line)
      .attr("stroke-dasharray", function () {
        return totalLength + " " + totalLength;
      })
      .attr("stroke-dashoffset", function () {
        return totalLength;
      })
      .transition()
      .duration(1500)
      .attr("stroke-dashoffset", 0);
  }

  drawDots() {
    const dots = this.svg.append('g');

    dots.selectAll("dot")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => this.x(d.day))
      .attr("cy", (d: any) => this.y(d[`${this.selectedEqupment[0].id as keyof DayLoss}`]))
      .attr("r", 4)
      .style("fill", "#F8F5E4")
      .on("mouseover", (event: any, d: any) => {
        d3.select(event.currentTarget)
          .attr("r", 8);

        const box = this.svg.append("rect")
          .attr("x", this.x(d.day))
          .attr("y", this.y(d[`${this.selectedEqupment[0].id as keyof DayLoss}`]) + 23)
          .attr("width", 140)
          .attr("height", 110)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("opacity", 0.8)
          .attr("stroke", "#F8F5E4")
          .style("fill", "#F8F5E4")
          .style("filter", "drop-shadow(2px 2px 2px rgba(1, 1, 0, 0.5))")
          .style("opacity", 0)

        box.transition()
          .duration(200)
          .style("opacity", 0.8);

        this.svg.append("text")
          .attr("class", "hover-text")
          .text("Date: " + this.formatDate(d.date))
          .attr("x", this.x(d.day) + 10)
          .attr("y", this.y(d[`${this.selectedEqupment[0].id as keyof DayLoss}`]) + 50).style("opacity", 0)
          .transition()
          .duration(200)
          .style("opacity", 1);

        this.svg.append("text")
          .attr("class", "hover-text")
          .text("Day: " + d.day)
          .attr("x", this.x(d.day) + 10)
          .attr("y", this.y(d[`${this.selectedEqupment[0].id as keyof DayLoss}`]) + 70).style("opacity", 0)
          .transition()
          .duration(200)
          .style("opacity", 1);

        this.svg.append("text")
          .attr("class", "hover-text")
          .text("Loss per day: " + d[`${this.selectedEqupment[0].id + "PD" as keyof DayLoss}`])
          .attr("x", this.x(d.day) + 10)
          .attr("y", this.y(d[`${this.selectedEqupment[0].id as keyof DayLoss}`]) + 90).style("opacity", 0)
          .transition()
          .duration(200)
          .style("opacity", 1);
        this.svg.append("text")
          .attr("class", "hover-text")
          .text("Total loss: " + d[`${this.selectedEqupment[0].id as keyof DayLoss}`])
          .attr("x", this.x(d.day) + 10)
          .attr("y", this.y(d[`${this.selectedEqupment[0].id as keyof DayLoss}`]) + 110)
          .style("opacity", 0)
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mouseout", (event: any) => {
        d3.select(event.currentTarget)
          .attr("r", 4);

        this.svg.selectAll("rect").remove();
        this.svg.selectAll("text.hover-text").remove();
      }).attr("r", 0)
      .style("fill", "#F8F5E4")
      .transition()
      .duration(2500)
      .attr("r", 4);
  }

  onEquipmentOptionChange(e: any) {
    if (e.name === 'value') {
      this.isEquipmentDropdownOpen = false;

      this.ref.detectChanges();
      const svgElement = d3.select("figure#line svg");
      svgElement.remove()
      this.createSvg()
      this.drawChart()
    }
  }

  onTimePeriodOptionChanged(e: any) {
    if (e.name === 'value') {
      this.isTimePeriodDropdownOpen = false;
      this.ref.detectChanges();
      this.filterByTimePeriod()

      const svgElement = d3.select("figure#line svg");
      svgElement.remove()
      this.createSvg()
      this.drawChart()
    }
  }

  toggleShowDots() {
    if (this.showDots) {
      this.drawDots()
    } else {
      const svgElement = d3.selectAll("circle");
      svgElement.remove()
    }
  }

  private formatDate(date: any) {
    let parsedDate = date as Date

    return [parsedDate.getDate(), parsedDate.getMonth() + 1, parsedDate.getFullYear()].join('.')
  }

  filterByTimePeriod() {
    this.data = this.datacopy.filter(s => s.date.getTime() < this.selectedTimePeriod[0].date.getTime())
  }
}
