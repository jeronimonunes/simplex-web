/// <reference lib="webworker" />
import { default as Module, NativeFraction } from '../native/simplex';


addEventListener('message', ({ data: { a, b, c } }: { data: { a: NativeFraction[][], b: NativeFraction[], c: NativeFraction[] } }) => {
  Module({ locateFile: (path: string) => `native/${path}` }).then(mod => {
    postMessage(mod.simplex(a, b, c));
  });
});
