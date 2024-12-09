import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { GradientPinkRed } from '@visx/gradient';
import { scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { voronoi } from '@visx/voronoi';
import { localPoint } from '@visx/event';
import { FeatureProperties, PointMetadata } from './types';
import { toHHMMSS } from './helpers/avgPace.helper';

export type DotsProps = {
  width: number;
  height: number;
  showControls?: boolean;
  properties: FeatureProperties
};

let tooltipTimeout: number;

export default withTooltip<DotsProps, PointMetadata>(
  ({
    width,
    height,
    showControls = true,
    properties,
    hideTooltip,
    showTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  }: DotsProps & WithTooltipProvidedProps<PointMetadata>) => {
    if (width < 10) return null;

    const points: PointMetadata[] = properties.pointMetadata

    const grade = (d: PointMetadata) => d.grade;
    const pace = (d: PointMetadata) => d.pace;
    const distance = (d: PointMetadata) => d.cumulativeDistance;

    const svgRef = useRef<SVGSVGElement>(null);
    const xScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [properties.minGrade - 3, properties.maxGrade + 3],
          range: [0, width],
          clamp: true,
        }),
      [width],
    );

    const yScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [properties.minPace - 100, properties.maxPace + 100], // y data range (pace)
          range: [height, 0], // Map to the chart's height (inverted for top-down rendering)
          clamp: true, // Prevent values from exceeding the range
        }),
      [height],
    );
    const voronoiLayout = useMemo(
      () =>
        voronoi<PointMetadata>({
          x: (d) => xScale(grade(d)) ?? 0,
          y: (d) => yScale(pace(d)) ?? 0,
          width,
          height,
        })(points),
      [width, height, xScale, yScale],
    );

    // event handlers
    const handleMouseMove = useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        if (!svgRef.current) return;

        // find the nearest polygon to the current mouse position
        const point = localPoint(svgRef.current, event);
        if (!point) return;
        const neighborRadius = 100;
        const closest = voronoiLayout.find(point.x, point.y, neighborRadius);
        if (closest) {
          showTooltip({
            tooltipLeft: xScale(grade(closest.data)),
            tooltipTop: yScale(pace(closest.data)),
            tooltipData: closest.data,
          });
        }
      },
      [xScale, yScale, showTooltip, voronoiLayout],
    );

    const handleMouseLeave = useCallback(() => {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, 300);
    }, [hideTooltip]);

    return (
      <div>
        <svg width={width} height={height} ref={svgRef}>
          <GradientPinkRed id="dots-pink" />
          {/** capture all mouse events with a rect */}
          <rect
            width={width}
            height={height}
            rx={14}
            fill="url(#dots-pink)"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseLeave}
          />
          <Group pointerEvents="none">
            {points.map((point, i) => (
              <Circle
                key={`${i}`}
                className="dot"
                cx={xScale(grade(point))}
                cy={yScale(pace(point))}
                r={i % 3 === 0 ? 2 : 3}
                fill={tooltipData === point ? 'white' : '#f6c431'}
              />
            ))}
          </Group>
        </svg>
        {tooltipOpen && tooltipData && tooltipLeft != null && tooltipTop != null && (
          <Tooltip left={tooltipLeft + 10} top={tooltipTop + 10}>
            <div>
              <strong>grade:</strong> {grade(tooltipData)}
            </div>
            <div>
              <strong>pace:</strong> {toHHMMSS(pace(tooltipData))}
            </div>
            <div>
              <strong>distance:</strong> {(distance(tooltipData) / 5280).toFixed(2)}
            </div>
          </Tooltip>
        )}
        {showControls && (
          <div>
            <label style={{ fontSize: 12 }}>
            </label>
          </div>
        )}
      </div>
    );
  },
);