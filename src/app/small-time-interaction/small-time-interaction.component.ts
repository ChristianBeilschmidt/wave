import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../project/project.service";
import {LayoutService} from "../layout.service";
import {TimeConfigComponent} from "../time-config/time-config.component";

@Component({
  selector: 'wave-small-time-interaction',
  templateUrl: './small-time-interaction.component.html',
  styleUrls: ['./small-time-interaction.component.scss']
})
export class SmallTimeInteractionComponent implements OnInit {

  private timeRepresentation: string;
  private timeIsPlaying = false;

  constructor(
      private projectService: ProjectService,
      private layoutService: LayoutService
  ) {

  }

  ngOnInit() {
      this.projectService.getTimeStream().subscribe(t => {
         this.timeRepresentation = t.toISOString();
      });
  }

  timeFwd(){
      let nt = this.projectService.getTime().clone().add(1, "month");
      console.log("timeFwd", nt);
      this.projectService.setTime(nt);
  }

  timeRwd(){
      console.log("timeRwd");
      this.projectService.setTime(this.projectService.getTime().clone().subtract(1, "month"));
  }

  timePlay(){
      console.log("timePlay");
      this.timeIsPlaying = true;
  }

  timeStop(){
      console.log("timeStop");
      this.timeIsPlaying = false;
  }

  openTimeConfig() {
    console.log("open time config");
    this.layoutService.setSidenavContentComponent(TimeConfigComponent);
  }
}