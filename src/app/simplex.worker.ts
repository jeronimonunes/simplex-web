/// <reference lib="webworker" />
import { default as Module, NativeFraction } from '../native/simplex';


addEventListener('message', ({ data }: { data: { a: NativeFraction[][], b: NativeFraction[], c: NativeFraction[] } }) => {
  Module({ locateFile: (path: string) => `native/${path}` }).then(mod => {
    const Alines = data.a.map(line => line.reduce((acc, val) => {
      acc.push_back(val);
      return acc;
    }, new mod.Vector()));

    const A = Alines.reduce((acc, val) => {
      acc.push_back(val);
      return acc;
    }, new mod.Matrix());

    const B = data.b.reduce((acc, val) => {
      acc.push_back(val);
      return acc;
    }, new mod.Vector());

    const C = data.c.reduce((acc, val) => {
      acc.push_back(val);
      return acc;
    }, new mod.Vector());

    const tabloid = new mod.Tabloid(A, B, C);
    const result = mod.runSimplex(tabloid);
    tabloid.delete();
    Alines.forEach(v => v.delete());
    A.delete();
    B.delete();
    C.delete();

    const certificate: NativeFraction[] = [];
    const cert = result.certificate;
    for (let i = 0; i < cert.size(); i++) {
      certificate.push(cert.get(i));
    }
    cert.delete();

    const type = result.type === mod.ResultType.LIMITED ? 'LIMITED' :
      (result.type === mod.ResultType.ILIMITED ? 'ILIMITED' : 'UNFEASEABLE');
    const value = result.value;

    const solution: NativeFraction[] = [];
    const sol = result.solution;
    for (let i = 0; i < sol.size(); i++) {
      solution.push(sol.get(i));
    }
    sol.delete();
    result.delete();
    postMessage({
      type,
      certificate,
      value,
      solution
    });
  });
});
