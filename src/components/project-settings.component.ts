import {Component, ChangeDetectionStrategy, Input, OnInit} from "angular2/core";
import {COMMON_DIRECTIVES} from "angular2/common";
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {MdDialogRef, MdDialogConfig} from "ng2-material/components/dialog/dialog";

import {ProjectService} from "../services/project.service";

import {Project} from "../models/project.model";
import {Projection, Projections} from "../models/projection.model";

import moment from "moment";

@Component({
    selector: "wave-project-settings",
    template: `
    <h2 class="md-title">Project Settings</h2>
    <br>
    <form>
        <md-input-container class="md-block">
            <label>Name</label>
            <input md-input [(value)]="projectName">
        </md-input-container>
        <p>Set the projection for reviewing and exporting:</p>
        <md-input-container class="md-block md-input-has-value">
            <label>Working Projection</label>
            <select [(ngModel)]="workingProjection">
                <option *ngFor="#projection of Projections.ALL_PROJECTIONS" [ngValue]="projection">
                    {{projection}}
                </option>
            </select>
            <input md-input type="hidden" value="0"><!-- HACK -->
        </md-input-container>
        <p>Set the projection for showing the data on the map:</p>
        <md-input-container class="md-block md-input-has-value">
            <label>Map Projection</label>
            <select [(ngModel)]="mapProjection">
                <option *ngFor="#projection of Projections.ALL_PROJECTIONS" [ngValue]="projection">
                    {{projection}}
                </option>
            </select>
            <input md-input type="hidden" value="0"><!-- HACK -->
        </md-input-container>
        <md-input-container class="md-block md-input-has-value">
            <label>Date/Time</label>
            <input md-input [(value)]="time">
        </md-input-container>
        <md-dialog-actions>
            <button md-button type="button" (click)="dialog.close()">
                <span>Cancel</span>
            </button>
            <button md-button class="md-primary" type="button" (click)="save()">
                <span>Save</span>
            </button>
        </md-dialog-actions>
    </form>
    `,
    styles: [`

    `],
    providers: [],
    directives: [COMMON_DIRECTIVES, MATERIAL_DIRECTIVES],
    pipes: [],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSettingsComponent implements OnInit {
    @Input() projectService: ProjectService;

    private Projections = Projections; // make it available for template

    private project: Project;

    private projectName: string;
    private workingProjection: Projection;
    private mapProjection: Projection;
    private time: string;

    constructor(private dialog: MdDialogRef) {}

    ngOnInit() {
        this.project = this.projectService.getProjectOnce();
        this.workingProjection = this.project.workingProjection;
        this.mapProjection = this.project.mapProjection;
        this.projectName = this.project.name;
        this.time = this.project.time.toISOString();
    }

    save() {
        let newTime = moment(this.time);

        if (this.project.name !== this.projectName ||
            this.project.workingProjection !== this.workingProjection ||
            this.project.mapProjection !== this.mapProjection ||
            !this.project.time.isSame(newTime)) {
            this.projectService.changeProjectConfig({
                name: this.projectName,
                workingProjection: this.workingProjection,
                mapProjection: this.mapProjection,
                time: newTime
            });
        }
        this.dialog.close();
    }

}

export class ProjectSettingsDialogConfig extends MdDialogConfig {
    projectService(projectService: ProjectService): ProjectSettingsDialogConfig {
        this.context.projectService = projectService;
        return this;
    }
}
