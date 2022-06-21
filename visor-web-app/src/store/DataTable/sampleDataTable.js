export var defaultDataTable = {
  pagination: {
    numberOfItems: 103,
    pageSizes: [
      {
        value: 5,
        selected: true
      },
      10,
      15,
      20,
      50
    ],
    start: 0,
    pageSize: 5,
    pageSizesLabel: "Pairs on page"
  },
  rowSize: "",
  autoWidth: false,
  sortable: true,
  title: "Connect your Web3 Wallet",
  actionBarAriaLabel: "",
  batchCancelLabel: "Cancel",
  zebra: false,
  overFlowMenu: ["Start", "Stop", "Delete 3", { label: "Overflow menu" }],
  columns: [
    { label: "Hypervisor", sortable: false },
    { label: "Active LP Amount", sortable: false },
    { label: "Strategy", sortable: false },
    {
      label: "Value",
      tip:
        "Your current value will track the value of your share of the entire position and will include fee reinvestment after each rebalance",
      sortable: false
    },
    {
      label: "APR",
      tip:
        "The APR is based on average performance of the pair calculated through Uniswap v3 fee collection between rebalances",
      sortable: false
    },
    { label: "Status", sortable: false },
    { label: "Analytics", sortable: false }
  ],
  data: [],
  use_actions: true,
  use_batchActions: true,
  helperText: "There are multiple wallets to choose from",
  skeletonRows: 5
}