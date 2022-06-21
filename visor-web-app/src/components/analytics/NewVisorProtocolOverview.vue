<template>
  <div class="visor-protocol-overview">
    <h4 class="page-section-title">Visor Protocol Overview</h4>
    <cv-row class="graph-section">
      <cv-column :sm="12" :md="12" :lg="9" class="main-column">
        <div class="column-inner-wrapper main left">
          <cv-row>
            <cv-column :sm="12" :md="12" :lg="12">
              <cv-row>
                <div class="chart-wrapper">
                  <div class="chart-title">
                    <cv-row>
                      <cv-column :md="12" :lg="6"> Protocol TVL </cv-column>
                      <cv-column :md="12" :lg="6" class="gamma-link">
                        <a href="http://gammastrategies.org/" target="_blank">
                          Managed by Gamma Strategies
                          <Launch16 class="icon-launch" />
                        </a>
                      </cv-column>
                    </cv-row>
                  </div>
                  <ccv-stacked-area-chart
                    :data="chartData"
                    :options="chartOptions"
                  >
                  </ccv-stacked-area-chart>
                </div>
              </cv-row>
            </cv-column>
          </cv-row>
        </div>
      </cv-column>
      <cv-column :sm="12" :md="12" :lg="3" class="no-mb protocol-right">
        <cv-row>
          <cv-column :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper">
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="12">
                  <Stat
                    :loading="isLoading"
                    title="Total Value Locked"
                    :num="visorStats.uniswapPairTotalValueLocked"
                  />
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
          <cv-column :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper">
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="12">
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
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="12">
                  <Stat
                    :loading="isLoading"
                    title="Total Fees Accrued"
                    :num="visorStats.uniswapFeesGenerated"
                  />
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
          <cv-column :sm="12" :md="12" :lg="12">
            <div class="column-inner-wrapper">
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="12">
                  <Stat
                    :loading="isLoading"
                    title="Fee Based APR"
                    :num="visorStats.uniswapFeesBasedApr"
                  />
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
        </cv-row>
      </cv-column>
    </cv-row>

    <h4 class="page-section-title">Maximizing...</h4>
    <cv-row>
      <cv-column :sm="12" :md="12" :lg="12">
        <cv-row>
          <cv-column :sm="12" :md="12" :lg="5" class="no-mb">
            <div class="column-inner-wrapper overview-description">
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="12">
                  <div class="title">Maximise returns by staking VISR</div>
                </cv-column>
              </cv-row>
              <cv-row>
                <cv-column :sm="12" :md="12" :lg="12">
                  <div class="sub-description">
                    10% of the fees accrued from our Uniswap supervisors are
                    used to purchase VISR and distributed to VISR stakers each
                    week
                  </div>
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
          <cv-column :sm="12" :md="12" :lg="7" class="staking-tabs-container">
            <cv-row>
              <cv-column :sm="6" :md="6" :lg="6">
                <div class="column-inner-wrapper">
                  <cv-tabs :container="false" aria-label="navigation tab label">
                    <cv-tab id="tab-1" label="Stake" :selected="true">
                      <cv-row>
                        <cv-column :lg="6">
                          <cv-text-input
                            label="Available to Stake"
                            type="text"
                            placeholder="0 VISR"
                            helper-text="Balance: 3405 VISR"
                          >
                          </cv-text-input>
                        </cv-column>
                        <cv-column :lg="6">
                          <cv-button class="btn-stake"> Stake </cv-button>
                        </cv-column>
                      </cv-row>
                    </cv-tab>
                    <cv-tab id="tab-2" label="Unstake">
                      Sample tab panel content 2
                    </cv-tab>
                    <cv-tab id="tab-3" label="Claim">
                      Sample tab panel content 3
                    </cv-tab>
                  </cv-tabs>
                </div>
              </cv-column>
              <cv-column :sm="6" :md="6" :lg="6">
                <div
                  class="column-inner-wrapper no-mr total-staked-value-container"
                >
                  <span class="title"> Total VISR Staked </span>
                  <span class="value"> {{ visorStats.stakedAmount }} </span>
                  <span class="sub-value">
                    {{ "(" + visorStats.stakedUsdAmount + ")" }}
                  </span>
                </div>
              </cv-column>
            </cv-row>
          </cv-column>
        </cv-row>
      </cv-column>
    </cv-row>
    <cv-row>
      <cv-column :sm="12" :md="12" :lg="12">
        <cv-row>
          <cv-column :sm="12" :md="12" :lg="5" class="no-mb">
            <div class="column-inner-wrapper visr-staked-container-left">
              <cv-row>
                <!-- <cv-column
                  :sm="12"
                  :md="12"
                  :lg="12"
                  class="total-staked-value-container"
                >
                  <span class="title"> Total VISR Staked </span>
                  <span class="value"> {{ visorStats.stakedAmount }} </span>
                  <span class="sub-value">
                    {{ "(" + visorStats.stakedUsdAmount + ")" }}
                  </span>
                </cv-column> -->
                <cv-column
                  :sm="12"
                  :md="12"
                  :lg="12"
                  class="initial-staked-container"
                >
                  <div class="initial-staked-value">
                    <span class="title"> Initial VISR Staked </span>
                    <span class="value"> 8200 VISR </span>
                  </div>
                  <div class="initial-staked-value">
                    <span class="title"> Fees Earned </span>
                    <span class="value"> 328 VISR </span>
                  </div>
                  <div class="initial-staked-value">
                    <span class="title"> Network share </span>
                    <span class="value"> 0.0015% </span>
                  </div>
                </cv-column>
              </cv-row>
            </div>
          </cv-column>

          <cv-column
            :sm="12"
            :md="12"
            :lg="7"
            class="no-mb visr-staked-container-right"
          >
            <cv-row class="first-section">
              <cv-column :sm="6" :md="6" :lg="6">
                <div class="section-column">
                  <span class="title"> Price VISR </span>
                  <span class="value">
                    ${{ visorStats.visrPrice.toFixed(2) }}
                  </span>
                </div>
              </cv-column>
              <cv-column :sm="6" :md="6" :lg="6">
                <div class="section-column no-mr">
                  <span class="title"> Current APY (24H) </span>
                  <span class="value"> {{ visorStakingApy }}% </span>
                  <span class="title"> (4.1k VISR last distributed) </span>
                </div>
              </cv-column>
            </cv-row>
            <cv-row class="second-section">
              <cv-column :sm="6" :md="6" :lg="6" class="no-mb">
                <div class="section-column">
                  <span class="title">
                    Amount of Circulating Supply Staked
                  </span>
                  <span class="value"> {{ visorStakingApy }}% </span>
                  <span class="title"> (13.53M Staked) </span>
                </div>
              </cv-column>
              <cv-column :sm="6" :md="6" :lg="6" class="no-mb">
                <div class="section-column no-mr">
                  <span class="title"> Total Gamma Fees </span>
                  <span class="value">
                    {{ visorStats.feeCumulativeFeeUsd }}
                  </span>
                  <span class="title"> (3.9M VISR distributed) </span>
                </div>
              </cv-column>
            </cv-row>
          </cv-column>
        </cv-row>
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
  name: "NewVisorProtocolOverview",
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
          group: "Visor Fee",
          date: "2019-01-01T07:00:00.000Z",
          value: 10000,
        },
        {
          group: "Visor Fee",
          date: "2019-02-05T07:00:00.000Z",
          value: 65000,
        },
        {
          group: "Visor Fee",
          date: "2019-03-08T07:00:00.000Z",
          value: 10000,
        },
        {
          group: "Visor Fee",
          date: "2019-04-13T07:00:00.000Z",
          value: 49213,
        },
        {
          group: "Visor Fee",
          date: "2019-05-17T07:00:00.000Z",
          value: 51213,
        },
        {
          group: "Re-invested Uniswap Fees",
          date: "2019-01-01T07:00:00.000Z",
          value: 20000,
        },
        {
          group: "Re-invested Uniswap Fees",
          date: "2019-02-05T07:00:00.000Z",
          value: 25000,
        },
        {
          group: "Re-invested Uniswap Fees",
          date: "2019-03-08T07:00:00.000Z",
          value: 60000,
        },
        {
          group: "Re-invested Uniswap Fees",
          date: "2019-04-13T07:00:00.000Z",
          value: 30213,
        },
        {
          group: "Re-invested Uniswap Fees",
          date: "2019-05-17T07:00:00.000Z",
          value: 55213,
        },
        {
          group: "Active LP Deposit (TVL)",
          date: "2019-01-01T07:00:00.000Z",
          value: 30000,
        },
        {
          group: "Active LP Deposit (TVL)",
          date: "2019-02-05T07:00:00.000Z",
          value: 20000,
        },
        {
          group: "Active LP Deposit (TVL)",
          date: "2019-03-08T07:00:00.000Z",
          value: 40000,
        },
        {
          group: "Active LP Deposit (TVL)",
          date: "2019-04-13T07:00:00.000Z",
          value: 60213,
        },
        {
          group: "Active LP Deposit (TVL)",
          date: "2019-05-17T07:00:00.000Z",
          value: 25213,
        },
      ],
      chartOptions: {
        axes: {
          left: {
            stacked: true,
            scaleType: "linear",
            mapsTo: "value",
            title: "Cumulative Protocol TVL",
            ticks: {
              formatter: this.leftTickFormatter,
            },
          },
          bottom: {
            scaleType: "time",
            mapsTo: "date",
          },
        },
        color: {
          scale: {
            "Visor Fee": "#ff0038",
            "Re-invested Uniswap Fees": "#FF007A",
            "Active LP Deposit (TVL)": "#FFFFFF",
          },
          gradient: {
            enabled: true,
          },
        },
        curve: "curveMonotoneX",
        tooltip: {
          customHTML: this.getToolTip,
        },
        zoomBar: {
          top: {
            enabled: true,
            data: [
              {
                date: "2019-01-01T07:00:00.000Z",
                value: 10000,
              },
              {
                date: "2019-02-02T07:00:00.000Z",
                value: 10,
              },
              {
                date: "2019-03-03T07:00:00.000Z",
                value: 75000,
              },
              {
                date: "2019-04-05T07:00:00.000Z",
                value: 65000,
              },
              {
                date: "2019-05-06T07:00:00.000Z",
                value: 57312,
              },
            ],
          },
        },
        height: "400px",
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
