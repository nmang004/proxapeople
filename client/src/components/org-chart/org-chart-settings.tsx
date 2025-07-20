import { Dispatch, SetStateAction } from "react";

interface OrgChartSettingsProps {
  onClose: () => void;
  chartLayout: "vertical" | "horizontal";
  setChartLayout: Dispatch<SetStateAction<"vertical" | "horizontal">>;
}

// Placeholder org chart settings component
export default function OrgChartSettings({ onClose, chartLayout, setChartLayout }: OrgChartSettingsProps) {
  return (
    <div>
      <h3>Organization Chart Settings</h3>
      <p>Org chart settings to be implemented.</p>
      <p>Current layout: {chartLayout}</p>
      <button onClick={onClose}>Close</button>
      <button onClick={() => setChartLayout(chartLayout === "vertical" ? "horizontal" : "vertical")}>
        Toggle Layout
      </button>
    </div>
  );
}