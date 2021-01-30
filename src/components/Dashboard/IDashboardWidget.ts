
export interface IDashboardWidget {
  /**
   * The type of dashboard item. Refer to {@link DashboardItem}.
   */
  type: string;

  /**
   * The number of columns that this dashboard item should span. As the dashboard is based on Material UI's grid, there are 12 columns available.
   */
  cols?: boolean | 1 | "auto" | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;

  rows?: 1 | 2 | 3 | undefined;

  /**
   * Whether to render a raised frame around the widget. Defaults to true.
   */
  frame?: boolean;
}

export const DefaultConfiguration: IDashboardWidget  = {
  type: "none",
  cols: 12,
  rows: 1,
  frame: true
}
