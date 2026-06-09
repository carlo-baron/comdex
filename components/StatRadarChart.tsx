"use client"

import { memo } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PokemonStatType } from "@/types/pokemon"

export const description = "A radar chart"

const chartConfig = {
  value: {
    label: "Base Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig


export const abbreviateStat = (statName: string): string => {
	const map: Record<string, string> = {
		'attack': 'atk',
		'defense': 'def',
		'special-attack': 'sp.atk',
		'special-defense': 'sp.def',
		'speed': 'spd',
		'hp': 'hp',
	};
	return map[statName] ?? statName;
};

type StatRadarChartStatType = {
	name: string,
	value: number
}

function StatRadarChart(
	{
		stats
	}
	:
	{
		stats: StatRadarChartStatType[]
	}
) {

	const chartData = stats.map(statItem => {
		return {
		stat: statItem.name,
		value: statItem.value
	}});

  return (
		<ChartContainer
			config={chartConfig}
			className="w-full h-35 overflow-visible nodrag"
		>
			<RadarChart data={chartData}>
				<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
				<PolarAngleAxis dataKey="stat" />
				<PolarGrid />
				<Radar
					dataKey="value"
					fill="var(--color-desktop)"
					fillOpacity={0.6}
				/>
			</RadarChart>
		</ChartContainer>
  )
}

export default memo(StatRadarChart);
