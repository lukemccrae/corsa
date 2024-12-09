import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from '@visx/vendor/d3-array';
import { timeFormat } from '@visx/vendor/d3-time-format';
import { FeatureProperties, PointMetadata } from './types';
import { toHHMMSS } from './helpers/avgPace.helper';
import { calcElapsed } from './helpers/time.helper';

type TooltipData = {
  time: string;
  elevation: number;
};

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

// accessors
const getDate = (d: PointMetadata) => new Date(d.time);
const getElevation = (d: PointMetadata) => d.elevation;
const bisectDate = bisector<PointMetadata, Date>((d) => new Date(d.time)).left;


export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  properties: FeatureProperties;
  hoveredPoint: number;
  handleSetHoveredPoint: Function;
};

export default withTooltip<AreaProps, PointMetadata>(
  ({
    width,
    height,
    properties,
    hoveredPoint,
    handleSetHoveredPoint,
    margin = { top: -10, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<PointMetadata>) => {
    if (width < 10) return null;
    const stock = properties.pointMetadata;

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(stock, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left],
    );
    const stockValueScale = useMemo(() => {
      const minValue = Math.min(...stock.map(getElevation)); // Minimum value in the data
      const maxValue = Math.max(...stock.map(getElevation)); // Maximum value in the data
      const padding = (maxValue - minValue) * 0.1; // 10% padding

      return scaleLinear({
        range: [innerHeight + margin.top, margin.top], // Invert for top-down rendering
        domain: [minValue - padding, maxValue + padding], // Adjust domain with padding
        nice: true, // Make the ticks look nicer
      });
    }, [stock, margin.top, innerHeight]);

    // tooltip handler
    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(stock, x0, 1);
        const d0 = stock[index - 1];
        const d1 = stock[index];
        let d = d0;
        handleSetHoveredPoint(x)
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getElevation(d)),
        });
      },
      [showTooltip, stockValueScale, dateScale],
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed<PointMetadata>
            data={stock}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockValueScale(getElevation(d)) ?? 0}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`${Math.round(getElevation(tooltipData) * 3.28084)} ft.`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              <div>{toHHMMSS(properties.pointMetadata[hoveredPoint].pace) + "/mi."}</div>
              {/* {properties.pointMetadata[hoveredPoint].cumulativeDistance} */}
              {/* <div>{calcElapsed(properties.pointMetadata[0].time, properties.pointMetadata[hoveredPoint].time)}</div> */}
              <div>{Math.round(properties.pointMetadata[hoveredPoint].grade)}% grade</div>
              <div>{(properties.pointMetadata[hoveredPoint].cumulativeDistance / 5280).toFixed(2)} mi.</div>

            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);