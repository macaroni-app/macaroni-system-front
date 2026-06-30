import {
  Chart as ChartJS,
  type Plugin,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Text,
  Box,
  Card,
  CardBody,
  Divider,
  CardHeader,
  Heading,
} from "@chakra-ui/react";

// custom Hooks
import { useInventories } from "../../hooks/useInventories";
import { getInventoryDisplayName } from "../../utils/variants";
import { IInventoryFullRelated } from "../inventories/types";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const barValueLabelPlugin: Plugin<"bar"> = {
  id: "barValueLabelPlugin",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      data,
      chartArea: { right },
    } = chart;

    ctx.save();
    ctx.font = "600 12px sans-serif";
    ctx.fillStyle = "#2D3748";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const dataset = data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((bar, index) => {
      const rawValue = Number(dataset.data[index] ?? 0);
      const label = compactCurrencyFormatter.format(rawValue);
      const xPosition = Math.min(bar.x + 10, right - 78);
      const yPosition = bar.y;

      ctx.fillText(label, xPosition, yPosition);
    });

    ctx.restore();
  },
};

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
);

const BarChart = () => {
  const queryInventory = useInventories({});
  const inventories = queryInventory.inventories as IInventoryFullRelated[];

  const records = (inventories ?? [])
    .filter((inventory) => inventory.asset?.isActive)
    .map((inventory) => ({
      label: getInventoryDisplayName({
        asset: inventory.asset,
        assetVariant: inventory.assetVariant,
      }),
      totalCost:
        Number(inventory.assetVariant?.costPrice ?? inventory.asset?.costPrice) *
        Number(inventory.quantityAvailable ?? 0),
    }))
    .sort((current, next) => next.totalCost - current.totalCost)
    .slice(0, 10);

  const options = {
    responsive: true,
    indexAxis: "y" as const,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { x: number } }) =>
            `Costo total: ${currencyFormatter.format(context.parsed.x)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value: string | number) =>
            compactCurrencyFormatter.format(Number(value)),
        },
      },
      y: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  const data = {
    labels: records.map((record) => record.label),
    datasets: [
      {
        data: records.map((record) => record.totalCost),
        backgroundColor: records.map((_record, index) =>
          index < 3 ? "#6B46C1" : index < 6 ? "#805AD5" : "#B794F4",
        ),
        borderRadius: 6,
      },
    ],
  };

  if (!queryInventory?.isLoading && records?.length === 0) {
    return (
      <Card variant="outline" mb={3}>
        <CardBody textAlign={"center"}>
          <Text>No hay datos</Text>
        </CardBody>
      </Card>
    );
  }

  if (
    !queryInventory?.isLoading &&
    records?.length !== undefined &&
    records?.length > 0
  ) {
    return (
      <>
        <Card variant="outline" mb={3}>
          <CardHeader textAlign={"center"}>
            <Heading size={"lg"}>Costo del inventario</Heading>
            <Text color="gray.600" fontSize="sm" mt={2}>
              Top 10 inventarios por costo total disponible
            </Text>
          </CardHeader>
          <CardBody>
            <Box h={`${Math.max(320, records.length * 52)}px`} w="100%">
              <Bar options={options} data={data} plugins={[barValueLabelPlugin]} />
            </Box>
          </CardBody>
          <Divider />
        </Card>
      </>
    );
  }
};

export default BarChart;
