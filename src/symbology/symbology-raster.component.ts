import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {RasterSymbology} from './symbology.model';

@Component({
    selector: 'wave-symbology-raster',
    template: `
     <md-input-container class='md-block' flex-gt-sm>
         <label>Opacity</label>
         <input md-input [(value)]='symbology.opacity' (valueChange)='update()'>
      </md-input-container>
      <md-input-container class='md-block' flex-gt-sm>
          <label>Hue</label>
          <input disabled='true'
            md-input type='number'
            [(value)]='symbology.hue'
            (valueChange)='update()'>
       </md-input-container>
       <md-input-container class='md-block' flex-gt-sm>
           <label>Saturation</label>
           <input disabled='true'
            md-input type='number'
            [(value)]='symbology.saturation'
            (valueChange)='update()'>
        </md-input-container>
      `,
    styles: [``],
    directives: [MATERIAL_DIRECTIVES],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SymbologyRasterComponent implements OnInit {
    @Input() symbology: RasterSymbology;

    @Output('symbologyChanged') symbologyChanged: EventEmitter<RasterSymbology> =
        new EventEmitter<RasterSymbology>();

    update() {
        // console.log('wave-symbology-raster', 'update', this.symbology);
        this.symbologyChanged.emit(this.symbology.clone());
    }

    ngOnInit() {
        // console.log('wave-symbology-raster', this.symbology);
    }
}