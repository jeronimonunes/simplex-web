export interface NativeFraction {
    numerator: string;
    denominator: string;
}

export declare class SimplexNativeModule {

    simplex: (...args: any[]) => any;

}

declare function Module(module: any): {
    then: (callback: (mod: SimplexNativeModule) => void) => void;
};

export default Module;