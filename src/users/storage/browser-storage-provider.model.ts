import {StorageProvider} from './storage-provider.model';

import {LayoutDict} from '../../app/layout.service';
import {Layer, LayerDict} from '../../layers/layer.model';
import {Project} from '../../models/project.model';
import {Plot, PlotDict} from '../../plots/plot.model';
import {Symbology} from '../../symbology/symbology.model';

import {LayerService} from '../../services/layer.service';
import {PlotService} from '../../plots/plot.service';

/**
 * StorageProvider implementation that uses the brower's localStorage
 */
export class BrowserStorageProvider implements StorageProvider {

    loadProject(): Project {
        const projectJSON = localStorage.getItem('project');
        if (projectJSON === null) { // tslint:disable-line:no-null-keyword
            return undefined;
        } else {
            const project = Project.fromJSON(projectJSON);
            return project;
        }
    }

    saveProject(project: Project) {
        localStorage.setItem('project', project.toJSON());
    }

    loadLayers(layerService: LayerService): Array<Layer<Symbology>> {
        const layersJSON = localStorage.getItem('layers');
        if (layersJSON === null) { // tslint:disable-line:no-null-keyword
            return undefined;
        } else {
            const layers: Array<Layer<Symbology>> = [];
            const layerDicts: Array<LayerDict> = JSON.parse(layersJSON);

            for (const layerDict of layerDicts) {
                layers.push(
                    layerService.createLayerFromDict(layerDict)
                );
            }

            return layers;
        }
    }

    saveLayers(layers: Array<Layer<Symbology>>) {
        const layerDicts: Array<LayerDict> = [];

        for (const layer of layers) {
            layerDicts.push(layer.toDict());
        }

        localStorage.setItem('layers', JSON.stringify(layerDicts));
    }

    loadPlots(plotService: PlotService): Array<Plot> {
        const plotsJSON = localStorage.getItem('plots');
        if (plotsJSON === null) { // tslint:disable-line:no-null-keyword
            return undefined;
        } else {
            const plots: Array<Plot> = [];
            const plotDicts: Array<PlotDict> = JSON.parse(plotsJSON);

            for (const plotDict of plotDicts) {
                plots.push(
                    plotService.createPlotFromDict(plotDict)
                );
            }

            return plots;
        }
    }

    savePlots(plots: Array<Plot>) {
        const plotDicts: Array<PlotDict> = [];

        for (const plot of plots) {
            plotDicts.push(plot.toDict());
        }

        localStorage.setItem('plots', JSON.stringify(plotDicts));
    }

    loadLayoutSettings(): LayoutDict {
        const layoutSettings = localStorage.getItem('layoutSettings');
        if (layoutSettings === null) { // tslint:disable-line:no-null-keyword
            return undefined;
        } else {
            return JSON.parse(layoutSettings);
        }
    };

    saveLayoutSettings(dict: LayoutDict): void {
        localStorage.setItem('layoutSettings', JSON.stringify(dict));
    };

}
