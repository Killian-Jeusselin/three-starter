export const sources = [
    // Environment textures
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
            [
                'static/textures/environmentMap/px.jpg',
                'static/textures/environmentMap/nx.jpg',
                'static/textures/environmentMap/py.jpg',
                'static/textures/environmentMap/ny.jpg',
                'static/textures/environmentMap/pz.jpg',
                'static/textures/environmentMap/nz.jpg'
            ]
    },
    // Floor Textures
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'static/textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'static/textures/dirt/normal.jpg'
    },
    //Characters
    {
        name: 'dummy',
        type: 'gltfModel',
        path: 'static/models/dummy_animated/dummy_animated.glb'
    }
]

export interface SourceInterface {
    name: string;
    type: 'texture' | 'cubeTexture' | 'gltfModel';
    path: string[] | string
}