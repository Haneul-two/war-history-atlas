import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('public/maps/land.geojson', 'utf8'));
const project = ([lon, lat]) => [
  ((lon + 180) * 1000) / 360,
  ((90 - lat) * 500) / 180,
];
const paths = data.features
  .flatMap((f) =>
    f.geometry.type === 'Polygon'
      ? [f.geometry.coordinates]
      : f.geometry.coordinates,
  )
  .map((poly) =>
    poly
      .map(
        (r) =>
          r
            .map((p, i) => {
              const [x, y] = project(p);
              return `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`;
            })
            .join('') + 'Z',
      )
      .join(''),
  );
fs.writeFileSync('lib/land-paths.json', JSON.stringify(paths));
console.log(`Generated ${paths.length} Natural Earth land polygons`);
