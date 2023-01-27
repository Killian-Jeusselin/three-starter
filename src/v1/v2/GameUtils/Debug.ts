import * as dat from 'lil-gui'

export class Debug {
    public active: boolean;
    public ui: dat.GUI | undefined; // doc : https://lil-gui.georgealways.com/

    constructor() {
        this.active = false;
        if (import.meta.env.VITE_USER_NODE_ENV === 'dev' || import.meta.env.DEV) {
            this.active = true;
            console.log('Debug mode activated')
        }

        if (this.active) {
            this.ui = new dat.GUI()
        }
    }
}