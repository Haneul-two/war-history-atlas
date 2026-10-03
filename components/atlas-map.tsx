'use client';
import { useEffect, useRef, useState } from 'react';
import { Plus, Minus, RotateCcw, MapPin } from 'lucide-react';
import paths from '@/lib/land-paths.json';
export type MapPoint = {
  id: string;
  lon: number;
  lat: number;
  label: string;
  sub?: string;
  accessibleLabel?: string;
};
const project = (lon: number, lat: number) => [
  ((lon + 180) * 1000) / 360,
  ((90 - lat) * 500) / 180,
];
export function AtlasMap({
  points,
  active,
  onSelect,
  detail = false,
  focus = false,
  showPicker = true,
  region = '세계 지도',
}: {
  points: MapPoint[];
  active?: string;
  onSelect: (id: string) => void;
  detail?: boolean;
  focus?: boolean;
  showPicker?: boolean;
  region?: string;
}) {
  const [zoom, setZoom] = useState(1);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [surfaceWidth, setSurfaceWidth] = useState(1000);
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const observer = new ResizeObserver(([entry]) =>
      setSurfaceWidth(entry.contentRect.width),
    );
    observer.observe(surface);
    return () => observer.disconnect();
  }, []);
  const [world, setWorld] = useState(false);
  const p = points.find((p) => p.id === active);
  const centered = (detail || focus) && p && !world;
  const baseWidth = centered ? (p.lon > 120 && p.lon < 135 ? 68 : 260) : 1000;
  const w = baseWidth / zoom;
  const h = w * 0.54;
  const [cx, cy] =
    p && (centered || (zoom > 1 && !world))
      ? project(p.lon, p.lat)
      : [500, 230];
  const x = Math.max(0, Math.min(1000 - w, cx - w / 2)),
    y = Math.max(0, Math.min(500 - h, cy - h / 2));
  const scale = w / Math.max(320, surfaceWidth);
  useEffect(() => {
    setWorld(false);
    setZoom(1);
  }, [active]);
  return (
    <div
      ref={surfaceRef}
      className={'map-surface ' + (detail ? 'detail-map' : '')}
    >
      <div className="map-heading">
        <span className="map-kicker">
          {centered ? '사건의 장소' : '세계 속의 전쟁'}
        </span>
        <span>{region}</span>
      </div>
      <svg
        className="world-map"
        viewBox={`${x} ${y} ${w} ${h}`}
        aria-label={`${region}: ${points.map((p) => p.label).join(', ')}`}
        role="group"
      >
        <title>
          해안선과 대표 사건 위치. 당시 국경과 전선을 재현한 지도가 아닙니다.
        </title>
        <defs>
          <pattern
            id={detail ? 'grid-detail' : 'grid-home'}
            width="83.333"
            height="83.333"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 83.333 0 L 0 0 0 83.333"
              fill="none"
              stroke="#aec1c9"
              strokeOpacity=".14"
              strokeWidth=".6"
            />
          </pattern>
        </defs>
        <rect
          x="0"
          y="0"
          width="1000"
          height="500"
          fill={`url(#${detail ? 'grid-detail' : 'grid-home'})`}
        />
        <g className="land">
          {paths.map((d, i) => (
            <path d={d} key={i} fillRule="evenodd" />
          ))}
        </g>
        {!centered && (
          <g className="continent-labels">
            <text x="230" y="160">
              북아메리카
            </text>
            <text x="340" y="360">
              남아메리카
            </text>
            <text x="532" y="160">
              유럽
            </text>
            <text x="548" y="280">
              아프리카
            </text>
            <text x="745" y="165">
              아시아
            </text>
            <text x="865" y="367">
              오세아니아
            </text>
            <text className="ocean-label" x="105" y="280">
              태 평 양
            </text>
            <text className="ocean-label" x="420" y="230">
              대 서 양
            </text>
          </g>
        )}
        {[...points]
          .sort((a, b) => Number(a.id === active) - Number(b.id === active))
          .map((point) => {
            const [px, py] = project(point.lon, point.lat);
            const selected = point.id === active;
            const rawLabel = detail
              ? selected
                ? point.label
                : ''
              : selected && surfaceWidth >= 600
                ? point.label
                : '';
            const label =
              detail && rawLabel.length > 16
                ? rawLabel.slice(0, 15) + '…'
                : rawLabel;
            const labelWidth = Math.max(110, label.length * 15 + 24);
            const lx = detail
              ? -labelWidth / 2
              : point.id === 'ww1'
                ? -labelWidth - 18
                : 20;
            const ly = !detail && point.id === 'ww2' ? 20 : -46;
            const minX = Math.min(-22, lx - 6),
              minY = Math.min(-22, ly - 6);
            const maxX = label ? Math.max(22, lx + labelWidth + 6) : 22;
            const maxY = label ? Math.max(22, ly + 38) : 22;
            return (
              <g
                key={point.id}
                role="button"
                tabIndex={0}
                aria-label={
                  point.accessibleLabel ||
                  `${point.label || point.sub}${point.sub ? ' · ' + point.sub : ''}`
                }
                aria-pressed={selected}
                onClick={() => {
                  onSelect(point.id);
                  setWorld(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(point.id);
                    setWorld(false);
                  }
                }}
                className={'map-marker ' + (selected ? 'selected' : '')}
                transform={`translate(${px} ${py})`}
              >
                <rect
                  x={minX * scale}
                  y={minY * scale}
                  width={(maxX - minX) * scale}
                  height={(maxY - minY) * scale}
                  fill="transparent"
                  pointerEvents="all"
                />
                {label && (
                  <>
                    <path
                      d={`M 0 0 L ${lx * scale} ${(ly + 18) * scale}`}
                      className="marker-connector"
                    />
                    <rect
                      x={lx * scale}
                      y={ly * scale}
                      width={labelWidth * scale}
                      height={32 * scale}
                      rx={5 * scale}
                      className="marker-label-box"
                    />
                  </>
                )}
                <circle
                  r={(selected ? 14 : 10) * scale}
                  className="marker-halo"
                />
                <circle r={5 * scale} className="marker-dot" />
                <text
                  x={(lx + 10) * scale}
                  y={(ly + 21) * scale}
                  fontSize={15 * scale}
                  className="marker-label"
                >
                  {label}
                </text>
              </g>
            );
          })}
      </svg>
      {!detail && showPicker && points.length > 0 && (
        <div className="map-picker" aria-label="전쟁 선택">
          {points.map((point) => (
            <button
              key={point.id}
              aria-pressed={point.id === active}
              onClick={() => onSelect(point.id)}
            >
              {point.label}
            </button>
          ))}
        </div>
      )}
      <div className="map-tools">
        <button
          aria-label="지도 확대"
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.5))}
          disabled={zoom >= 2.5}
        >
          <Plus size={18} />
        </button>
        <button
          aria-label="지도 축소"
          onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
          disabled={zoom <= 1}
        >
          <Minus size={18} />
        </button>
        <button
          aria-label="세계 지도 보기"
          onClick={() => {
            setWorld(true);
            setZoom(1);
          }}
        >
          <RotateCcw size={17} />
        </button>
      </div>
      <div className="map-foot">
        <span>
          <i /> {detail ? '현재 사건' : '선택한 전쟁'}{' '}
          <span className="legend-other">○ 주요 장소</span>
        </span>
        <span>대표 위치 · 국경/전선 생략</span>
      </div>
      {detail && p && (
        <div className="location-label">
          <MapPin size={16} />
          <div>
            {p.sub || p.label}
            <small>
              {Math.abs(p.lat).toFixed(2)}° {p.lat < 0 ? 'S' : 'N'} ·{' '}
              {Math.abs(p.lon).toFixed(2)}° {p.lon < 0 ? 'W' : 'E'}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
