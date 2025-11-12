"use client"

import * as React from "react"
import {Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis} from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

type DataType = {
    date: string,
    enrollments: number
}

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--color-primary)"
  }
} satisfies ChartConfig

export function ChartAreaInteractive({data} : {data: DataType[]}) {
    const totalEnrollmentsNumber = React.useMemo(
        () => data.reduce((acc, current) => acc + current.enrollments, 0),
        [data]
    )

  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])


  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total enrollments for the last 30 days: {totalEnrollmentsNumber}
          </span>
          <span className="@[540px]/card:hidden">Last 30 days</span>
        </CardDescription>
      </CardHeader>

        <CardContent className={"px-2 pt-4 sm:px-6 sm:pt-6"}>
            <ChartContainer config={chartConfig} className={"aspect-auto h-[250px] w-full"}>
                <BarChart
                    data={data}
                    margin={{
                        left: 12,
                        right: 12
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        interval={"preserveStartEnd"}
                        tickFormatter={v => {
                            const date = new Date(v)
                            return date.toLocaleDateString("ru-Ru", {
                                month: "short",
                                day: "numeric",
                            })
                        }}
                    />

                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                className={"w-[150px]"}
                                labelFormatter={
                                    v => {
                                        const date = new Date(v)
                                        return date.toLocaleDateString("ru-Ru", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                }
                            />
                        }
                    />

                    <Bar dataKey={"enrollments"} fill={"var(--color-enrollments)"} />
                </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
