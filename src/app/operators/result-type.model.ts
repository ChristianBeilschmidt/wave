/**
 * Represents the result of an operator.
 */
export abstract class ResultType {
    /**
     * Get the mapping representtion.
     */
    abstract getCode(): string;

    /**
     * Human-readable form of the result type.
     */
    toString(): string {
        const code = this.getCode();
        return code.charAt(0).toUpperCase() + code.substring(1);
    }
}

class Raster extends ResultType {
    getCode(): string {
        return 'raster';
    }
}

class Points extends ResultType {
    getCode(): string {
        return 'points';
    }
}

class Lines extends ResultType {
    getCode(): string {
        return 'lines';
    }
}

class Polygons extends ResultType {
    getCode(): string {
        return 'polygons';
    }
}

class Plot extends ResultType {
    getCode(): string {
        return 'plot';
    }
}

class Text extends ResultType {
    getCode(): string {
        return 'text';
    }
}

class ResultTypeCollection {
    RASTER: ResultType =  new Raster();
    POINTS: ResultType =  new Points();
    LINES: ResultType =  new Lines();
    POLYGONS: ResultType =  new Polygons();
    PLOT: ResultType =  new Plot();
    TEXT: ResultType =  new Text();

    ALL_TYPES: Array<ResultType>;
    INPUT_TYPES: Array<ResultType>;
    VECTOR_TYPES: Array<ResultType>;
    LAYER_TYPES: Array<ResultType>;
    PLOT_TYPES: Array<ResultType>;

    constructor() {
        this.ALL_TYPES = [
            this.RASTER,
            this.POINTS,
            this.LINES,
            this.POLYGONS,
            this.PLOT,
            this.TEXT,
        ];

        this.INPUT_TYPES = [
            this.RASTER,
            this.POINTS,
            this.LINES,
            this.POLYGONS,
        ];

        this.VECTOR_TYPES = [
            this.POINTS,
            this.LINES,
            this.POLYGONS,
        ];

        this.LAYER_TYPES = [
            this.RASTER,
            this.POINTS,
            this.LINES,
            this.POLYGONS,
        ];

        this.PLOT_TYPES = [
            this.PLOT,
            this.TEXT,
        ];
    }

    fromCode(type: string) {
        switch (type) {
            case this.RASTER.getCode():
                return this.RASTER;
            case this.POINTS.getCode():
                return this.POINTS;
            case this.LINES.getCode():
                return this.LINES;
            case this.POLYGONS.getCode():
                return this.POLYGONS;
            case this.PLOT.getCode():
                return this.PLOT;
            case this.TEXT.getCode():
                return this.TEXT;
            default:
                throw new Error('Invalid Result Type');
        }
    }
}

export const ResultTypes = new ResultTypeCollection(); // tslint:disable-line:variable-name
