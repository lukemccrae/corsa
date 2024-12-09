import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { GradientPinkRed } from '@visx/gradient';
import { scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { voronoi } from '@visx/voronoi';
import { localPoint } from '@visx/event';
import { PointMetadata } from './types';

export type DotsProps = {
  width: number;
  height: number;
  showControls?: boolean;
  pointMetadata: PointMetadata[]
};

let tooltipTimeout: number;

export default withTooltip<DotsProps, PointMetadata>(
  ({
    width,
    height,
    showControls = true,
    pointMetadata,
    hideTooltip,
    showTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  }: DotsProps & WithTooltipProvidedProps<PointMetadata>) => {
    if (width < 10) return null;

    const points: PointMetadata[] = pointMetadata

    const x = (d: PointMetadata) => d.grade;
    const y = (d: PointMetadata) => d.pace;

    const svgRef = useRef<SVGSVGElement>(null);
    const xScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [-20, 70],
          range: [0, width],
          clamp: true,
        }),
      [width],
    );

    const yScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [250, 5000], // y data range
          range: [height, 0], // Map to the chart's height (inverted for top-down rendering)
          clamp: true, // Prevent values from exceeding the range
        }),
      [height],
    );
    const voronoiLayout = useMemo(
      () =>
        voronoi<PointMetadata>({
          x: (d) => xScale(x(d)) ?? 0,
          y: (d) => yScale(y(d)) ?? 0,
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
            tooltipLeft: xScale(x(closest.data)),
            tooltipTop: yScale(y(closest.data)),
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
                cx={xScale(x(point))}
                cy={yScale(y(point))}
                r={i % 3 === 0 ? 2 : 3}
                fill={tooltipData === point ? 'white' : '#f6c431'}
              />
            ))}
          </Group>
        </svg>
        {tooltipOpen && tooltipData && tooltipLeft != null && tooltipTop != null && (
          <Tooltip left={tooltipLeft + 10} top={tooltipTop + 10}>
            <div>
              <strong>grade:</strong> {x(tooltipData)}
            </div>
            <div>
              <strong>pace:</strong> {y(tooltipData)}
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