"use client"

import * as React from "react"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Label } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Route } from "@/lib/types"
import { parseDuration } from "@/lib/utils"

interface ResultsChartProps {
  results: Route[]
}

const chartConfig = {
  price: {
    label: "Route",
    color: "hsl(var(--primary))",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"]

export default function ResultsChart({ results }: ResultsChartProps) {
  const chartData = React.useMemo(() => {
    return results.map(route => ({
      duration: parseFloat((parseDuration(route.totalDuration) / 60).toFixed(1)), // in hours
      price: route.price,
      modes: route.legs.map(l => l.mode).join(', ')
    }))
  }, [results])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price vs. Duration Overview</CardTitle>
        <CardDescription>Each point represents a travel option. Hover to see details.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-video h-[300px] w-full">
            <ScatterChart
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    type="number" 
                    dataKey="duration" 
                    name="Duration" 
                    unit="h" 
                    domain={['dataMin - 1', 'dataMax + 1']}
                >
                     <Label value="Duration (hours)" offset={-15} position="insideBottom" />
                </XAxis>
                <YAxis 
                    type="number" 
                    dataKey="price" 
                    name="Price" 
                    unit="₹" 
                    tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                    width={80}
                >
                    <Label value="Price (INR)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                </YAxis>
                <ChartTooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    content={
                        <ChartTooltipContent 
                            hideLabel 
                            formatter={(value, name, props) => (
                                <div className="space-y-1 p-1">
                                    <p className="font-bold">₹{props.payload?.price.toLocaleString('en-IN')}</p>
                                    <p className="text-muted-foreground">{props.payload?.duration} hours</p>
                                    <p className="text-muted-foreground capitalize">{props.payload?.modes}</p>
                                </div>
                            )}
                        />
                    } 
                />
                <Scatter dataKey="price" data={chartData} fill="var(--color-price)" />
            </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
