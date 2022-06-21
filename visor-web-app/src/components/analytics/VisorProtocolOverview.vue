<template>
  <div>
    <cv-row>
      <cv-column :sm="12" :md="12" :lg="8" class="main-column">
        <div class="column-inner-wrapper main left">
          <cv-row>
            <cv-column :sm="12" :md="12" :lg="12">
              <cv-row>
                <div class="chart-wrapper">
                  <div class="chart-title">
                    <cv-row>
                      <cv-column :md="12" :lg="6"> Visor TVL </cv-column>
                      <cv-column :md="12" :lg="6" class="gamma-link">
                        <a href="http://gammastrategies.org/" target="_blank">
                          Managed by Gamma Strategies
                          <Launch16 class="icon-launch" />
                        </a>
                      </cv-column>
                    </cv-row>
                  </div>
                  <div class="chart-description">
                    Visor Returns + Fees on Initial TVL
                  </div>
                  <ccv-stacked-bar-chart
                    class="tvl-chart"
                    :data="chartData"
                    :options="chartOptions"
                  />
                </div>
              </cv-row>
            </cv-column>
          </cv-row>
        </div>
      </cv-column>
      <cv-column :sm="12" :md="12" :lg="4" class="no-mb">
        <cv-row>
          <cv-column :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper">
              <h6 class="title">Uniswap v3 Pairs Under Management</h6>
              <p class="description">Total</p>
              <cv-row>
                <cv-column :sm="12" :md="6" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="Total Value Locked"
                    :num="visorStats.uniswapPairTotalValueLocked"
                  />
                </cv-column>
                <cv-column :sm="12" :md="6" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="Amount of Pairs"
                    :num="visorStats.uniswapPairAmountPairs"
                  />
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
          <cv-column :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper">
              <h6 class="title">Uniswap v3 Generated Fees</h6>
              <p class="description">Total</p>
              <cv-row>
                <cv-column :sm="12" :md="6" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="Fees Generated"
                    :num="visorStats.uniswapFeesGenerated"
                  />
                </cv-column>
                <cv-column :sm="12" :md="6" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="Fee Based APR"
                    :num="visorStats.uniswapFeesBasedApr"
                  />
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
          <cv-column class="meter-column" :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper">
              <h6 class="title">Today's Visor Fee Amount</h6>
              <p class="description">Past 24 hours</p>
              <Meter :value="visorStakingApy" :loading="isLoading" />
            </div>
          </cv-column>
        </cv-row>
      </cv-column>
    </cv-row>
    <cv-row>
      <cv-column :sm="12" :md="12" :lg="8" class="no-mb">
        <cv-row>
          <cv-column :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper left visr-stats">
              <h6 class="title">VISR Staked</h6>
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="VISR staked USD Amount"
                    :num="visorStats.stakedUsdAmount"
                    type="risk"
                  />
                </cv-column>
                <cv-column :sm="12" :md="12" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="VISR staked Amount"
                    :num="visorStats.stakedAmount"
                    type="risk"
                  />
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
          <cv-column :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper left visr-stats">
              <h6 class="title">Visor Fee Stats</h6>
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="Visor fee accrual last 24 hours / Amount of VISR"
                    :num="visorStats.feeStatsFeeAccural"
                    :denominator="visorStats.feeStatsAmountVisr"
                    type="fraction"
                  />
                </cv-column>
                <cv-column :sm="12" :md="12" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="VISR Staking APY / VISR Staking Daily Yield"
                    :num="visorStats.feeStatsStakingApy"
                    :denominator="visorStats.feeStatsStakingDailyYield"
                    type="fraction"
                  />
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
          <cv-column :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper left visr-stats">
              <h6 class="title">Visor Fee Cumulative</h6>
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="VISR Fees USD Value / Annual (based on current TVL)"
                    :num="visorStats.feeCumulativeFeeUsd"
                    :denominator="visorStats.feeCumulativeFeeUsdAnnual"
                    type="fraction"
                  />
                </cv-column>
                <cv-column :sm="12" :md="12" :lg="6">
                  <Stat
                    :loading="isLoading"
                    title="Total Gamma Fees Distributed / Annual (based on current TVL)"
                    :num="visorStats.feeCumulativeFeeDistributed"
                    :denominator="visorStats.feeCumulativeFeeDistributedAnnual"
                    type="fraction"
                  />
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
        </cv-row>
      </cv-column>
      <cv-column :sm="12" :md="12" :lg="4">
        <div class="column-inner-wrapper feeDistributions">
          <ul class="feeDistribution-list">
            <FeeDistributionListItem
              v-for="(item, index) in feeDistributions"
              :key="index"
              v-bind="item"
              :loading="isLoading"
            />
          </ul>
        </div>
      </cv-column>
    </cv-row>
  </div>
</template>
<script>
import Vue from "vue";
import chartsVue from "@carbon/charts-vue";
import "@carbon/charts/styles-g100.css";
import { Launch16 } from "@carbon/icons-vue";
import Stat from "@/components/Stat";
import FeeDistributionListItem from "@/components/FeeDistributionListItem";
import Meter from "@/components/charts/Meter";

Vue.use(chartsVue);

const MILLION = 1;
const THOUSAND = 2;
const PERCENT = 3;

export default {
  name: "VisorProtocolOverview",
  components: {
    Stat,
    Meter,
    FeeDistributionListItem,
    Launch16,
  },
  data() {
    return {
      visorStats: {},
      visorStakingApy: 0,
      chartData: [
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$1M",
          value: 1000000,
          label: "$1M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$2M",
          value: 2000000,
          label: "$2M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$3M",
          value: 3000000,
          label: "$3M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$4M",
          value: 4000000,
          label: "$4M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$5M",
          value: 5000000,
          label: "$5M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$6M",
          value: 6000000,
          label: "$6M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$7M",
          value: 7000000,
          label: "$7M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$8M",
          value: 8000000,
          label: "$8M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$9M",
          value: 9000000,
          label: "$9M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$10M",
          value: 10000000,
          label: "$10M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$11M",
          value: 11000000,
          label: "$11M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$12M",
          value: 12000000,
          label: "$12M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$13M",
          value: 13000000,
          label: "$13M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$14M",
          value: 14000000,
          label: "$14M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$15M",
          value: 15000000,
          label: "$15M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$16M",
          value: 16000000,
          label: "$16M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$17M",
          value: 17000000,
          label: "$17M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$18M",
          value: 18000000,
          label: "$18M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$19M",
          value: 19000000,
          label: "$19M",
        },
        {
          group: "Active LP Deposit (TVL)",
          TVL: "$20M",
          value: 20000000,
          label: "$20M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$1M",
          value: 2700000,
          label: "$2M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$2M",
          value: 5400000,
          label: "$5M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$3M",
          value: 8100000,
          label: "$8M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$4M",
          value: 10800000,
          label: "$10M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$5M",
          value: 13500000,
          label: "$13M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$6M",
          value: 16200000,
          label: "$16M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$7M",
          value: 18900000,
          label: "$18M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$8M",
          value: 21600000,
          label: "$21M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$9M",
          value: 24300000,
          label: "$24M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$10M",
          value: 27000000,
          label: "$27M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$11M",
          value: 29700000,
          label: "$29M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$12M",
          value: 32400000,
          label: "$32M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$13M",
          value: 35100000,
          label: "$35M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$14M",
          value: 37800000,
          label: "$37M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$15M",
          value: 40500000,
          label: "$40M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$16M",
          value: 43200000,
          label: "$43M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$17M",
          value: 45900000,
          label: "$45M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$18M",
          value: 48600000,
          label: "$48M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$19M",
          value: 51300000,
          label: "$51M",
        },
        {
          group: "Re-invested Uniswap Fees",
          TVL: "$20M",
          value: 54000000,
          label: "$54M",
        },
        {
          group: "Visor Fee",
          TVL: "$1M",
          value: 300000,
          label: "$M",
        },
        {
          group: "Visor Fee",
          TVL: "$2M",
          value: 600000,
          label: "$M",
        },
        {
          group: "Visor Fee",
          TVL: "$3M",
          value: 900000,
          label: "$M",
        },
        {
          group: "Visor Fee",
          TVL: "$4M",
          value: 1200000,
          label: "$1M",
        },
        {
          group: "Visor Fee",
          TVL: "$5M",
          value: 1500000,
          label: "$1M",
        },
        {
          group: "Visor Fee",
          TVL: "$6M",
          value: 1800000,
          label: "$1M",
        },
        {
          group: "Visor Fee",
          TVL: "$7M",
          value: 2100000,
          label: "$2M",
        },
        {
          group: "Visor Fee",
          TVL: "$8M",
          value: 2400000,
          label: "$2M",
        },
        {
          group: "Visor Fee",
          TVL: "$9M",
          value: 2700000,
          label: "$2M",
        },
        {
          group: "Visor Fee",
          TVL: "$10M",
          value: 3000000,
          label: "$3M",
        },
        {
          group: "Visor Fee",
          TVL: "$11M",
          value: 3300000,
          label: "$3M",
        },
        {
          group: "Visor Fee",
          TVL: "$12M",
          value: 3600000,
          label: "$3M",
        },
        {
          group: "Visor Fee",
          TVL: "$13M",
          value: 3900000,
          label: "$3M",
        },
        {
          group: "Visor Fee",
          TVL: "$14M",
          value: 4200000,
          label: "$4M",
        },
        {
          group: "Visor Fee",
          TVL: "$15M",
          value: 4500000,
          label: "$4M",
        },
        {
          group: "Visor Fee",
          TVL: "$16M",
          value: 4800000,
          label: "$4M",
        },
        {
          group: "Visor Fee",
          TVL: "$17M",
          value: 5100000,
          label: "$5M",
        },
        {
          group: "Visor Fee",
          TVL: "$18M",
          value: 5400000,
          label: "$5M",
        },
        {
          group: "Visor Fee",
          TVL: "$19M",
          value: 5700000,
          label: "$5M",
        },
        {
          group: "Visor Fee",
          TVL: "$20M",
          value: 6000000,
          label: "$6M",
        },
      ],
      chartOptions: {
        bars: {
          width: 10,
        },
        axes: {
          left: {
            mapsTo: "value",
            ticks: {
              formatter: this.leftTickFormatter,
            },
            stacked: true,
            title: "Cumulative Protocol TVL",
          },
          bottom: {
            mapsTo: "TVL",
            scaleType: "labels",
            title: "Initial TVL on Visor",
          },
        },
        color: {
          scale: {
            "Visor Fee": "#ff0038",
            "Re-invested Uniswap Fees": "#FF007A",
            "Active LP Deposit (TVL)": "#FFFFFF",
          },
        },
        legend: {
          truncation: {
            numCharacter: 30,
          },
        },
        height: "400px",
        tooltip: {
          customHTML: this.getToolTip,
        },
        data: {
          // loading: true
        },
      },
      feeDistributions: [
        {
          title: "VISR Distributions",
          desc: "Latest Fee Distributions",
          id: 1,
        },
      ],
      isFeeDistributionsLoading: true,
      isVisorStatsLoading: true,
    };
  },
  computed: {
    isLoading() {
      return this.isVisorStatsLoading || this.isFeeDistributionsLoading;
    },
  },
  mounted() {
    this.fetchVisorStatsData();
    this.fetchFeeDistributions();
  },
  methods: {
    async fetchVisorStatsData() {
      await fetch("https://visordata-o9v9w.ondigitalocean.app/dashboard")
        .then((response) => response.json())
        .then((visorStats) => {
          this.visorStats = this.formatVisorStats(visorStats);
          this.visorStakingApy =
            Math.round(visorStats.feeStatsStakingApy * 100 * 100) / 100;

          this.isVisorStatsLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async fetchFeeDistributions() {
      await fetch(
        "https://visordata-o9v9w.ondigitalocean.app/visr/dailyDistribution?days=6"
      )
        .then((response) => response.json())
        .then(({ feeDistribution: feeDistribution }) => {
          this.feeDistributions = [
            ...this.feeDistributions,
            ...feeDistribution,
          ];

          this.isFeeDistributionsLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatVisorStats(stats) {
      return {
        ...stats,
        stakedUsdAmount: this.formatStat(stats.stakedUsdAmount),
        stakedAmount: this.formatStat(stats.stakedAmount, false, ""),
        feeStatsStakingApy: this.formatStat(stats.feeStatsStakingApy, true),
        feeStatsStakingDailyYield: this.formatStat(
          stats.feeStatsStakingDailyYield,
          true
        ),
        // uniswapFeesBasedApr: `${stats.uniswapFeesBasedApr * 100}%`,
        feeStatsFeeAccural: this.formatStat(stats.feeStatsFeeAccural),
        feeStatsAmountVisr: this.formatStat(
          stats.feeStatsAmountVisr,
          false,
          ""
        ),
        feeCumulativeFeeUsd: this.formatStat(stats.feeCumulativeFeeUsd),
        feeCumulativeFeeUsdAnnual: this.formatStat(
          stats.feeCumulativeFeeUsdAnnual
        ),
        feeCumulativeFeeDistributed: this.formatStat(
          stats.feeCumulativeFeeDistributed,
          false,
          ""
        ),
        feeCumulativeFeeDistributedAnnual: this.formatStat(
          stats.feeCumulativeFeeDistributedAnnual,
          false,
          ""
        ),
        uniswapPairTotalValueLocked: this.formatStat(
          stats.uniswapPairTotalValueLocked,
          false
        ),
        uniswapFeesGenerated: this.formatStat(stats.uniswapFeesGenerated),
      };
    },
    getToolTip({ 0: { group, TVL, value } }) {
      let groupColor = "";
      let valueLabel = "";

      switch (group) {
        case "Visor Fee":
          groupColor = "#ff0038";
          valueLabel = "Fees";
          break;
        case "Re-invested Uniswap Fees":
          groupColor = "#FF007A";
          valueLabel = "Uniswap Returns";
          break;
        case "Active LP Deposit (TVL)":
          groupColor = "#FFFFFF";
          valueLabel = "Deposits";
          break;
        default:
          break;
      }

      return `
        <div class='chart-tooltip'>
          <p style="border-left: 5px solid ${groupColor};">${group}</p>
          <p>Initial TVL <span>${TVL}</span></p>
          <p>${valueLabel} <span>$${value.toLocaleString("en-US")}</span></p>
        </div>
      `;
    },
    leftTickFormatter(value) {
      return `$${value / 1000000}M`;
    },
    formatStat(value, isPercent = false, currency = "$") {
      let type = isPercent ? PERCENT : -1;
      if (!isPercent) {
        if (value > 999999) {
          type = MILLION;
        } else if (value > 99) {
          type = THOUSAND;
        }
      }

      switch (type) {
        case MILLION:
          return `${currency}${Math.round((value / 1000000) * 10) / 10}M`;
        case THOUSAND:
          return `${currency}${Math.round((value * 10) / 1000) / 10}K`;
        case PERCENT:
          return `${Math.round(value * 100 * 100) / 100}%`;
        default:
          return `${currency}${Math.round((value * 100) / 100)}`;
      }
    },
  },
};
</script>
