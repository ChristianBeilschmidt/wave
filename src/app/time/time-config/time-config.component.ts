import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../../project/project.service';
import {Observable, Subscription} from 'rxjs/Rx';
import {Time, TimeInterval, TimePoint, TimeStepDuration} from '../time.model';
import {Moment} from 'moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Config} from '../../config.service';

const startBeforeEndValidator = () => (control: FormGroup) => {
    let start = control.controls.start.value as Moment;
    let end = control.controls.end.value as Moment;
    let timeAsPoint = control.controls.timeAsPoint.value as boolean;

    if (start && end && (timeAsPoint || start.isBefore(end) )) {
        return null;
    } else {
        return {valid: false};
    }
};


@Component({
    selector: 'wave-time-config',
    templateUrl: './time-config.component.html',
    styleUrls: ['./time-config.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeConfigComponent implements OnInit, OnDestroy, AfterViewInit {

    private timeAsPoint: boolean;
    private time: Time;
    private subscriptions: Array<Subscription> = [];
    timeForm: FormGroup;
    start: Moment;
    end: Moment;

    timeStepDuration$: Observable<TimeStepDuration>;
    timeStepDurations: Array<TimeStepDuration> = [
        {durationAmount: 15, durationUnit: 'minutes'},
        {durationAmount: 1, durationUnit: 'hour'},
        {durationAmount: 1, durationUnit: 'day'},
        {durationAmount: 1, durationUnit: 'month'},
        {durationAmount: 6, durationUnit: 'months'},
        {durationAmount: 1, durationUnit: 'year'}
    ];
    timeStepComparator = (option: TimeStepDuration, selectedElement: TimeStepDuration) => {
        const equalAmount = option.durationAmount === selectedElement.durationAmount;
        const equalUnit = option.durationUnit === selectedElement.durationUnit;
        return equalAmount && equalUnit;
    };

    constructor(private projectService: ProjectService,
                private changeDetectorRef: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                public config: Config) {

        if (!this.config.TIME.ALLOW_RANGES) {
            this.timeAsPoint = false;
        }

        this.timeForm = this.formBuilder.group({
            start: [this.start, Validators.required],
            timeAsPoint: [this.timeAsPoint, Validators.required],
            end: [{value: this.end, disabled: this.timeAsPoint}, Validators.required],
        });

        this.timeForm.setValidators(startBeforeEndValidator());

        this.timeStepDuration$ = this.projectService.getTimeStepDurationStream();
    }


    ngOnInit() {
        let sub = this.projectService.getTimeStream().subscribe(time => {
            this.time = time.clone();
            this.reset();
        });

        this.subscriptions.push(sub);
    }

    ngAfterViewInit() {
        setTimeout(() => this.changeDetectorRef.markForCheck());
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    applyTime() {
        if (this.timeForm.valid) {
            const start = this.timeForm.controls['start'].value;
            if (this.timeForm.controls['timeAsPoint'].value) {
                this.push(new TimePoint(start));
            } else {
                const end = this.timeForm.controls['end'].value;
                this.push(this.time = new TimeInterval(start, end));
            }
        }
    }

    reset() {
        this.timeForm.controls['timeAsPoint'].setValue(this.time.getType() === 'TimePoint');
        this.start = this.time.getStart().clone();
        this.timeForm.controls['start'].setValue(this.start);
        this.end = this.time.getEnd().clone();
        this.timeForm.controls['end'].setValue(this.end);
    }

    updateTimeStepDuration(timeStep: TimeStepDuration) {
        // console.log('updateTimeStepDuration()', event, this.selectedtimeStepDuration);
        this.projectService.setTimeStepDuration(timeStep); // FIXME: this.selectedtimeStepDuration ?
    }

    private push(time: Time) {
        if (!!time && time.isValid()) {
            this.projectService.setTime(time);
        }
    }
}
