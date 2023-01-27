import {SourceInterface} from "../../experience/sources";
import {ResourceLoader} from "../GameUtils/ResourceLoader";

export interface LevelPropsInterface {
    resources: SourceInterface[];
    onLoaded: () => void
}

export class Level {

    public isLoaded: boolean = false;
    public onLoaded: () => void;

    constructor(props: LevelPropsInterface) {
        this.onLoaded = props.onLoaded
        // Should make sure every needed resource should be loaded
        this.toLoad(props.resources)
    }

    private toLoad(resources: SourceInterface[]) {
        const loadLength: number = resources.length;
        let loaded: number = 0;
        resources.map((resource) => {
            new ResourceLoader(resource, () => {
                loaded++;
            })
        })

        if (loadLength === loaded) {
            this.isLoaded = true;
            this.onLoaded()
        }
    }
}