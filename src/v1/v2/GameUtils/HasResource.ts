import {SourceInterface} from "../../experience/sources";
import {ResourceLoader} from "./ResourceLoader";

export interface HasResourcePropsInterface {
    resources: SourceInterface[];
    onLoaded: () => void
}

export class HasResource {

    public isLoaded: boolean = false;
    public onLoaded: () => void;
    public items: any[] = [];
    constructor(props: HasResourcePropsInterface) {
        this.onLoaded = props.onLoaded
        // Should make sure every needed resource should be loaded
        this.toLoad(props.resources)
    }

    private toLoad(resources: SourceInterface[]) {
        const loadLength: number = resources.length;
        let loaded: number = 0;
        resources.map((resource) => {
            this.items.push( new ResourceLoader(resource, () => {
                loaded++;
            }))
        })

        if (loadLength === loaded) {
            this.isLoaded = true;
            this.onLoaded()
            this.onReady()
        }
    }
    public onReady() {

    }
}