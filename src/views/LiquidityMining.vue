<template>
  <div class="liquidity-mining">
    <cv-row class="top-header">
      <cv-column :sm="12" :md="12" :lg="12">
        <div class="column-inner-wrapper">
          <div class="top-header-container">
            <span class="top-header-title">
              RARE-ETH Liquidity Mining Program
            </span>
            <span class="top-learn-more">
              Learn more
              <Link16 />
            </span>
          </div>
        </div>
      </cv-column>
    </cv-row>
    <cv-row class="mining-main-conatiner">
      <cv-column :sm="6" :md="6" :lg="6">
        <cv-row class="mining-left-pane">
          <cv-column :sm="6" :md="6" :lg="6">
            <div class="section-column">
              <span class="title">Total Value Locked</span>
              <span class="value">$103,000.00</span>
            </div>
          </cv-column>
          <cv-column :sm="6" :md="6" :lg="6">
            <div class="section-column">
              <span class="title">APY</span>
              <span class="value">136.00%</span>
            </div>
          </cv-column>
        </cv-row>
        <cv-row class="mining-left-pane">
          <cv-column :sm="6" :md="6" :lg="6">
            <div class="section-column">
              <span class="title">Deposit Token</span>
              <span class="value">RARE-ETH-LP</span>
            </div>
          </cv-column>
          <cv-column :sm="6" :md="6" :lg="6">
            <div class="section-column">
              <span class="title">Reward token</span>
              <span class="value">RARE</span>
            </div>
          </cv-column>
        </cv-row>
        <cv-row class="mining-left-pane">
          <cv-column :sm="6" :md="6" :lg="6">
            <div class="section-column">
              <span class="title">Start date</span>
              <span class="value">2 Oct, 2021 (13:00 UTC)</span>
            </div>
          </cv-column>
          <cv-column :sm="6" :md="6" :lg="6">
            <div class="section-column">
              <span class="title">End date</span>
              <span class="value">31 Oct, 2021 (13:00 UTC)</span>
            </div>
          </cv-column>
        </cv-row>
        <cv-row class="mining-left-pane">
          <cv-column :sm="6" :md="6" :lg="6">
            <div class="section-column">
              <span class="title">Contract address</span>
              <span class="value">
                0xE2F8...60Ec
                <Link16 />
              </span>
            </div>
          </cv-column>
          <cv-column :sm="6" :md="6" :lg="6">
            <div class="section-column">
              <span class="title">Max Multiplier</span>
              <span class="value">4x over 30 days</span>
            </div>
          </cv-column>
        </cv-row>
      </cv-column>
      <cv-column :sm="6" :md="6" :lg="6" class="mining-tabs-wrapper">
        <div class="column-inner-wrapper mining-tabs-container">
          <cv-tabs :container="false" aria-label="navigation tab label">
            <cv-tab
              id="tab-1"
              label="Subscribe"
              :selected="true"
              class="subscribe-container"
            >
              <cv-row>
                <cv-column :lg="12">
                  <cv-text-input
                    label="Amount of RARE-ETH LP"
                    type="text"
                    value="14.32 LP"
                    placeholder="0 VISR"
                    helper-text="Balance: 14.32 LP"
                  >
                  </cv-text-input>
                  <a href="#" class="link-get-lp-token">Get LP Token here</a>
                  <cv-button
                    class="max-button"
                    kind="primary"
                    size=""
                    :disabled="false"
                    @click="max()"
                  >
                    Max
                  </cv-button>
                </cv-column>
              </cv-row>
              <cv-row class="deposite-section">
                <cv-column :lg="12">
                  <span class="key">Deposited</span>
                  <div class="dash"></div>
                  <span class="value">00.00 LP</span>
                </cv-column>
                <cv-column :lg="12">
                  <span class="key">Earned Rewards</span>
                  <div class="dash"></div>
                  <span class="value">00.00 RARE</span>
                </cv-column>
              </cv-row>
            </cv-tab>
            <cv-tab id="tab-2" label="Unsubscribe & Claim">
              Sample tab panel content 2
            </cv-tab>
          </cv-tabs>
        </div>
      </cv-column>
    </cv-row>
    <cv-row>
      <cv-column :sm="6" :md="6" :lg="6" class="mining-left-pane no-mb">
        <div class="section-column chart-meter">
          <ccv-meter-chart
            :data="meterChartData"
            :options="meterChartOptions"
          />
          <span class="meter-percentage-value">63%</span>
          <span class="meter-bottom-label">Total Rewards</span>
          <span class="meter-bottom-value">$1000,000.00</span>
        </div>
      </cv-column>
      <cv-column :sm="6" :md="6" :lg="6" class="action-wrapper">
        <cv-row class="action-container">
          <cv-column :sm="2" :lg="6">
            <cv-button class="btn-stake" kind="secondary">Back</cv-button>
          </cv-column>
          <cv-column :sm="2" :lg="6">
            <cv-button class="btn-stake white-button">Subscribe</cv-button>
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
import { Link16 } from "@carbon/icons-vue";

Vue.use(chartsVue);

export default {
  name: "NewVisorProtocolOverview",
  components: {
    Link16,
  },
  data() {
    return {
      meterChartData: [
        {
          group: "Emitted Rewards",
          value: 63,
        },
      ],
      meterChartOptions: {
        meter: {
          peak: 63,
        },
        color: {
          scale: {
            "Emitted Rewards": "#ff0038",
          },
        },
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
