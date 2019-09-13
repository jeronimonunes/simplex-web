declare const Type: FunctionConstructor;

declare interface Type<T> extends Function {
    new(...args: any[]): T;
}

declare class NativeClass {
    delete: () => void;
}

declare class StdVector<T> extends NativeClass {
    constructor();
    push_back: (v: T) => void;
    size: () => number;
    get: (i: number) => T;
    set: (idx: number, v: T) => void;
    resize: (size: number, v: T) => void;
}

export interface NativeFraction {
    numerator: string;
    denominator: string;
}

export declare class Vector extends StdVector<NativeFraction> {

}

export declare class Matrix extends StdVector<Vector> {

}

export declare class Tabloid extends NativeClass {

}

export class EnumConstant {
    
}

declare class ResultType {
    LIMITED: EnumConstant;
    UNFEASIBLE: EnumConstant;
    ILIMITED: EnumConstant;
}

export declare class Result extends NativeClass {
    type: ResultType;
    certificate: Vector;
    value: NativeFraction;
    solution: Vector;
}

export declare class SimplexNativeModule {

    Vector: Type<Vector>;
    Matrix: Type<Matrix>;
    Tabloid: Type<Tabloid>;
    ResultType: ResultType;

    runSimplex: (tabloid: Tabloid) => Result;

}

declare function Module(module: any): {
    then: (callback: (mod: SimplexNativeModule) => void) => void;
};

export default Module;