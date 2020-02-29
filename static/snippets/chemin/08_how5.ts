/**
 const r = num=>Array(num).fill(null).map((v,i)=>i);
 const res = r(10).map(count=> count === 0 ? (`function createChemin(): Chemin<{}>;`) : (`function createChemin<${r(count).map(i=>`P${i} extends In`).join(', ')}>(${r(count).map(i=>`p${i}: P${i}`).join(', ')}): Chemin<${r(count).map(i=>`Params<P${i}>`).join(' & ')}>;`)).map(v=>`// prettier-ignore\n${v}`).join('\n'); 

 */
