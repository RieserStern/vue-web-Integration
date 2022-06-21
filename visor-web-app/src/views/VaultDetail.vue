<template>
  <div
    class="lorem-table-page main-content page-vault-detail"
    :class="{ loading: isLoading }"
  >
    <template v-if="isLoading">
      <div class="lorem-page-loader">
        <cv-inline-loading
          v-if="!progress.loading"
          :ending-text="loading.endingText"
          :error-text="loading.errorText"
          :loading-text="loading.loadingText"
          :loaded-text="loading.loadedText"
          :state="loading.state"
        />
        <cv-inline-loading
          v-if="progress.loading"
          :ending-text="loading.endingText"
          :error-text="loading.errorText"
          :loading-text="loading.loadingText"
          :loaded-text="loading.loadedText"
          :state="loading.state"
          class="progress"
        />
      </div>
    </template>
    <template v-else>
      <cv-grid class="main-content" kind="condensed">
        <cv-row>
          <cv-column :sm="12" :md="12" :lg="8">
            <div class="pair-left-wrapper">
              <!-- TVL detail -->
              <cv-row class="pair-tvl-wrapper">
                <cv-column :lg="6" class="pair-name-container">
                  <div class="pair-svg-container">
                    <div class="pair-svg"></div>
                    <div class="pair-svg"></div>
                  </div>
                  <span class="pair-name">{{ pair }} Pair</span>
                </cv-column>
                <cv-column :lg="6"> </cv-column>
                <cv-column :lg="12" class="chart-meter">
                  <ccv-meter-chart
                    :data="meterChartData"
                    :options="meterChartOptions"
                  />
                  <span class="meter-percentage-value">
                    <template
                      v-if="
                        !core.uniswapv3.hypes ||
                        !core.uniswapv3.hypes[core.translateWETH(pair)]
                      "
                    >
                      <cv-skeleton-text />
                    </template>
                    <template v-else>
                      {{
                        (core.uniswapv3.hypes[core.translateWETH(pair)].tvl /
                          core.uniswapv3.hypes[core.translateWETH(pair)]
                            .maxTotalSupply) *
                        100
                      }}%
                    </template>
                  </span>
                  <span class="meter-bottom-label">Max. Capacity</span>
                  <span class="meter-bottom-value">
                    <template
                      v-if="
                        !core.uniswapv3.hypes ||
                        !core.uniswapv3.hypes[core.translateWETH(pair)]
                      "
                    >
                      <cv-skeleton-text />
                    </template>
                    <template v-else>
                      ${{
                        core.uniswapv3.hypes[core.translateWETH(pair)]
                          .maxTotalSupply
                      }}
                    </template>
                  </span>
                </cv-column>
              </cv-row>
              <!-- Price Grid -->
              <cv-row class="price-grid">
                <cv-column :sm="2" :lg="3">
                  <span>Total Value Locked</span>
                  <template v-if="!pairData">
                    <cv-skeleton-text />
                  </template>
                  <template v-else>
                    <h4>{{ pairData && pairData.tvl }}</h4>
                  </template>
                </cv-column>
                <cv-column :sm="2" :lg="3">
                  <span class="has-icon">Lifetime APR <Warning16 /></span>
                  <template v-if="!pairData">
                    <cv-skeleton-text />
                  </template>
                  <template v-else>
                    <h4>78%</h4>
                    <span>Since 12 May, 2021</span>
                  </template>
                </cv-column>
                <cv-column :sm="2" :lg="3">
                  <span class="has-icon">APR (24h) <Warning16 /></span>
                  <template v-if="!pairData">
                    <cv-skeleton-text />
                  </template>
                  <template v-else>
                    <h4>28.06%</h4>
                    <span>($1.1k Daily Fees)</span>
                  </template>
                </cv-column>
                <cv-column :sm="2" :lg="3">
                  <span>Total Accrued Fees</span>
                  <template v-if="!pairData">
                    <cv-skeleton-text />
                  </template>
                  <template v-else>
                    <h4>{{ pairData && pairData.tvl }}</h4>
                  </template>
                </cv-column>
              </cv-row>
              <!-- Price VS Order page -->
              <cv-row class="price-order-wrapper">
                <span class="section-title">Price VS Order Range</span>
                <cv-column :lg="12">
                  <div class="graph-container">
                    <ccv-area-chart :data="chartData" :options="chartOptions" />
                  </div>
                </cv-column>
              </cv-row>
              <!-- LP VS HODL -->
              <cv-row class="lp-hodl-wrapper">
                <span class="section-title">LP VS HODL</span>
                <cv-column :lg="12">
                  <div class="graph-container">
                    <ccv-line-chart
                      :data="lpChartData"
                      :options="lpChartOptions"
                    />
                  </div>
                </cv-column>
              </cv-row>
            </div>
          </cv-column>
          <cv-column :sm="12" :md="12" :lg="4">
            <div class="pair-right-wrapper">
              <div class="section-content">
                <cv-row class="deposit-withdraw mobile-deposit-withdraw">
                  <cv-column :sm="2" :md="6" :lg="6">
                    <cv-button>
                      Deposit
                      <RowExpand32 class="bx--btn__icon" />
                    </cv-button>
                  </cv-column>
                  <cv-column :sm="2" :md="6" :lg="6">
                    <cv-button class="withdraw-button">
                      Withdraw
                      <RowCollapse32 class="bx--btn__icon" />
                    </cv-button>
                  </cv-column>
                </cv-row>
                <cv-row>
                  <cv-column :lg="12" class="total-section">
                    <span>Your Total Position Value</span>
                    <template
                      v-if="
                        !core.uniswapv3 ||
                        !core.uniswapv3.hypes[core.translateWETH(pair)]
                      "
                    >
                      <cv-skeleton-text />
                    </template>
                    <h3 v-else class="value">
                      ${{
                        core.uniswapv3.hypes[core.translateWETH(pair)].value
                      }}
                    </h3>
                  </cv-column>
                </cv-row>
                <cv-row class="value-section">
                  <cv-column :sm="3" :lg="7">
                    <span class="title">Initial Position Value</span>
                  </cv-column>
                  <cv-column :sm="1" :lg="5">
                    <template v-if="!pairData">
                      <cv-skeleton-text />
                    </template>
                    <span class="value">-</span>
                  </cv-column>
                  <cv-column :sm="3" :lg="7">
                    <span class="title">{{ pair }} Pool Ratio:</span>
                  </cv-column>
                  <cv-column :sm="1" :lg="5">
                    <template
                      v-if="
                        !core.uniswapv3 ||
                        !core.uniswapv3.hypes[core.translateWETH(pair)]
                      "
                    >
                      <cv-skeleton-text />
                    </template>
                    <span class="value">
                      {{ core.getRatio(core.translateWETH(pair)) }}
                    </span>
                  </cv-column>
                </cv-row>
              </div>
              <cv-row class="deposit-withdraw">
                <div class="button-wrapper">
                  <cv-button
                    v-if="
                      (core.states.is_holder && core.depositActive(pair)) ||
                      (core.states.is_holder &&
                        pair == 'vVISR' &&
                        pair != 'VISR')
                    "
                    @click="save()"
                  >
                    {{ pair == "vVISR" ? "Stake VISR" : "Deposit" }}
                  </cv-button>
                  <!-- v-if="pair != 'VISR' && pair != 'ETH-USDT' && pair != 'USDC-ETH' && pair != 'DAI-ETH'" -->
                  <cv-button
                    v-if="
                      (!core.states.is_holder ||
                        !core.depositActive(pair) ||
                        pair == 'VISR') &&
                      pair != 'vVISR'
                    "
                    disabled
                    @click="save()"
                  >
                    {{ pair == "vVISR" ? "Stake VISR" : "Deposit" }}
                  </cv-button>
                  <cv-button
                    v-if="
                      core.states.is_holder &&
                      core.withdrawActive(pair) &&
                      pair != 'VISR'
                    "
                    class="withdraw-button"
                    @click="download()"
                  >
                    {{ pair == "vVISR" ? "Withdraw VISR" : "Withdraw" }}
                  </cv-button>
                  <cv-button
                    v-if="
                      !core.states.is_holder ||
                      !core.withdrawActive(pair) ||
                      pair == 'VISR'
                    "
                    disabled
                    class="withdraw-button"
                    @click="download()"
                  >
                    {{ pair == "vVISR" ? "Withdraw VISR" : "Withdraw" }}
                  </cv-button>
                </div>
                <!-- <div class="insurance">
                  <Security16 /> Get Insurance Coverage
                </div> -->
                <div class="additional-apy">
                  <h4>Earn additional 136% APY</h4>
                  <span>Liquidity Mining Program ends in: 21 days left</span>
                  <cv-button class="btn-subscribe"> Subscribe </cv-button>
                </div>
              </cv-row>
            </div>
          </cv-column>
        </cv-row>
      </cv-grid>
    </template>

    <cv-modal
      ref="modal"
      :size="modal.size"
      :primary-button-disabled="false"
      :visible="false"
      :auto-hide-off="true"
      @primary-click="submit"
      @secondary-click="close"
    >
      <template slot="title">
        <cv-progress
          :initial-step="progress.initialStep"
          :steps="progress.steps"
          :vertical="false"
        />
      </template>
      <template v-if="progress.initialStep === 0" slot="content">
        <h2>Approve {{ pair }}</h2>
        <p>By clicking Submit you approve {{ pair }} for deposit</p>
      </template>
      <template v-if="progress.initialStep === 1" slot="content">
        <h2>Depositing {{ pair }}</h2>
        <p>Choose the amount you wish to deposit in your vault</p>
        <div class="bx--form-item number">
          <cv-text-input
            v-model="modelNumber"
            label="Amount"
            step="1"
            :mobile="false"
            @input="onNumberInput()"
          />
          <cv-button kind="primary" size="" :disabled="false" @click="max()">
            Max
          </cv-button>
          <cv-button kind="primary" size="" class="minus" @click="minus()">
            -
          </cv-button>
          <!-- <div class="v-line" /> -->
          <cv-button kind="primary" size="" class="plus" @click="plus()">
            +
          </cv-button>
        </div>
      </template>
      <!-- <template
        v-if="modal.use_contentWithInput"
        slot="content"
      >
        <div class="bx--form-item">
          <cv-dropdown
            v-model="modelProgram"
            value=""
            label="Select Program"
          >
            <cv-dropdown-item value="10">
              <span>Option with value 10 & 10.0</span>
            </cv-dropdown-item>
            <cv-dropdown-item value="20">
              Option with value 20
            </cv-dropdown-item>
            <cv-dropdown-item value="30">
              Option with value 30
            </cv-dropdown-item>
            <cv-dropdown-item value="40">
              Option with value 40
            </cv-dropdown-item>
            <cv-dropdown-item value="50">
              Option with value 50
            </cv-dropdown-item>
          </cv-dropdown>
        </div>
        <div class="bx--form-item number">
          <cv-number-input
            v-model="modelNumber"
            label="Number"
            step="1"
            :mobile="false"
            @input="onNumberInput()"
          />
          <cv-button
            kind="primary"
            size=""
            :disabled="false"
            @click="max()"
          >
            Max
          </cv-button>
        </div>
      </template> -->
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button"> Submit </template>
    </cv-modal>

    <cv-modal
      ref="modalDownload"
      :size="modal.size"
      :primary-button-disabled="false"
      :visible="false"
      :auto-hide-off="true"
      @primary-click="submitDownload"
      @secondary-click="closeDownload"
    >
      <template slot="title">
        <cv-progress
          :initial-step="downloadProgress.initialStep"
          :steps="downloadProgress.steps"
          :vertical="downloadProgress.vertical"
        >
          <cv-progress-step
            label="Unstake"
            :complete="downloadProgress.step1"
            @click.native="goToDownloadStep(0)"
          />
          <cv-progress-step
            label="Withdraw"
            :complete="downloadProgress.step2"
            @click.native="goToDownloadStep(1)"
          />
        </cv-progress>
      </template>
      <template v-if="downloadProgress.initialStep === 0" slot="content">
        <h2>Unstaking {{ pair }}</h2>
        <p>
          Type in the number below that you want to unstake from the Hypervisor
          contract
        </p>
        <div class="bx--form-item number">
          <cv-text-input
            v-model="modelDownloadNumber"
            label="Number"
            step="1"
            :mobile="false"
          />
          <cv-button
            kind="primary"
            size=""
            :disabled="false"
            @click="downloadMax()"
          >
            Max
          </cv-button>
          <cv-button
            kind="primary"
            size=""
            class="minus"
            @click="downloadMinus()"
          >
            -
          </cv-button>
          <!-- <div class="v-line" /> -->
          <cv-button
            kind="primary"
            size=""
            class="plus"
            @click="downloadPlus()"
          >
            +
          </cv-button>
        </div>
      </template>
      <template v-if="downloadProgress.initialStep === 1" slot="content">
        <h2>Remove Assets from Vault</h2>
        <p>Remove unstaked assets from vault</p>
        <div class="bx--form-item number" />
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button"> Submit </template>
    </cv-modal>

    <cv-modal
      ref="modalStaked"
      :size="modal.size"
      :primary-button-disabled="!(parseFloat(modelStakedNumber) > 0)"
      :visible="false"
      :auto-hide-off="true"
      @primary-click="submitStaked"
      @secondary-click="closeStaked"
    >
      <template slot="title">
        Visor Finance Fee Distribution Withdrawal
      </template>
      <template v-if="downloadProgress.initialStep === 0" slot="content">
        <!-- <h2>Unstaking {{pair}}</h2> -->
        <p>
          Choose the number of {{ pair }} that you want to unstake from Visor
          Finance fee distribution contract. Your withdraw will be your
          proportion of VISR tokens, not {{ pair }} tokens.
        </p>
        <!-- <div class="bx--form-item number">
          <cv-number-input
            v-model="modelStakedNumber"
            label="Number"
            :step="1"
            :min="0"
            :mobile="false"
          >
          </cv-number-input>
          <cv-button
            kind="primary"
            size=""
            :disabled="false"
            @click="stakedMax()"
          >
            Max
          </cv-button>
        </div> -->
        <div class="bx--form-item slider">
          <cv-slider
            v-model="stackedNumberPercentage"
            label="Unstake and claim VISR based on (%)"
            min="0"
            max="100"
            step="1"
            step-multiplier="10"
            min-label="0%"
            max-label="Max"
            @change="onStackedPercentageChanged"
          >
          </cv-slider>
          <cv-text-input
            :value="stackedNumberPercentage + '%'"
            class="slider-percentage-input"
          />
          <cv-link class="slider-max-button" @click="onMaxWithdraw">
            Max
          </cv-link>
        </div>
        <div class="slider-amount">
          <div class="amount-row">
            <span v-if="pair == 'VISR'" class="amount-label"
              >Amount of {{ pair }}</span
            >
            <span v-if="pair == 'vVISR'" class="amount-label"
              >Amount of {{ pair }} you are unstaking</span
            >
            <span class="amount-value">
              {{ modelStakedNumber }} {{ pair }}
            </span>
          </div>
        </div>
      </template>
      <template v-if="downloadProgress.initialStep === 1" slot="content">
        <h2>Remove Assets from Vault</h2>
        <p>Remove unstaked assets from vault</p>
        <div class="bx--form-item number" />
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button"> Unstake and claim VISR </template>
    </cv-modal>

    <cv-modal
      ref="modalLP"
      :size="modal.size"
      :primary-button-disabled="!(parseFloat(modelLPNumber) > 0)"
      :visible="false"
      :auto-hide-off="true"
      @primary-click="submitLP"
      @secondary-click="closeLP"
    >
      <template slot="title"> {{ pair }} Hypervisor Withdrawal </template>
      <template slot="content">
        <!-- <h2>Unstaking {{pair}}</h2> -->
        <p>
          Type in the number of shares that you want to withdraw from
          {{ pair }}
          Hypervisor
        </p>
        <!-- <div class="bx--form-item number">
          <cv-number-input
            v-model="modelLPNumber"
            label="Number"
            :step="1"
            :min="0"
            :mobile="false"
          >
          </cv-number-input>
          <cv-button kind="primary" size="" :disabled="false" @click="lpMax()">
            Max
          </cv-button>
        </div> -->
        <div class="bx--form-item slider">
          <cv-slider
            v-model="lpNumberPercentage"
            label="Withdraw assets based on (%)"
            min="0"
            max="100"
            step="1"
            step-multiplier="10"
            min-label="0"
            max-label="100"
            @change="onLPPercentageChanged"
          >
          </cv-slider>
          <cv-text-input
            :value="lpNumberPercentage + '%'"
            class="slider-percentage-input"
          />
        </div>
        <div class="slider-amount">
          <div class="amount-row">
            <span class="amount-label">Amount of {{ pair.split("-")[0] }}</span>
            <span class="amount-value">
              {{ lpBalance0 }}% {{ pair.split("-")[0] }}
            </span>
          </div>
          <div class="amount-row">
            <span class="amount-label">Amount of {{ pair.split("-")[1] }}</span>
            <span class="amount-value">
              {{ lpBalance1 }}% {{ pair.split("-")[1] }}
            </span>
          </div>
        </div>
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button"> Withdraw </template>
    </cv-modal>
  </div>
</template>

<script>
import Vue from "vue";
import chartsVue from "@carbon/charts-vue";
import "@carbon/charts/styles-g100.css";
import { PairAnalyticItems, PairContractAddress } from "@/constants";
import {
  RowExpand32,
  RowCollapse32,
  Security16,
  Warning16,
} from "@carbon/icons-vue";

import { mapGetters } from "vuex";

Vue.use(chartsVue);

export default {
  name: "Chart",
  components: {
    RowExpand32,
    RowCollapse32,
    Security16,
    Warning16,
  },
  data() {
    return {
      PairAnalyticItems: PairAnalyticItems,
      chartLoading: true,
      chartData: [],
      core: this.$parent.$root.core,
      pairData: {},
      meterChartData: [
        {
          group: "Current TVL",
          value: 93,
        },
      ],
      meterChartOptions: {
        meter: {
          peak: 93,
        },
        color: {
          scale: {
            "Current TVL": "#ff0038",
          },
        },
      },
      lpChartData: [
        {
          group: "Hypervisor",
          key: "Qty",
          value: 34200,
        },
        {
          group: "Hypervisor",
          key: "More",
          value: 23500,
        },
        {
          group: "Hypervisor",
          key: "Sold",
          value: 53100,
        },
        {
          group: "Hypervisor",
          key: "Restocking",
          value: 42300,
        },
        {
          group: "Hypervisor",
          key: "Misc",
          value: 12300,
        },
        {
          group: "Uniswap V2",
          key: "Qty",
          value: 34200,
        },
        {
          group: "Uniswap V2",
          key: "More",
          value: 53200,
        },
        {
          group: "Uniswap V2",
          key: "Sold",
          value: 42300,
        },
        {
          group: "Uniswap V2",
          key: "Restocking",
          value: 21400,
        },
        {
          group: "Uniswap V2",
          key: "Misc",
          value: 0,
        },
        {
          group: "WETH",
          key: "Qty",
          value: 41200,
        },
        {
          group: "WETH",
          key: "More",
          value: 18400,
        },
        {
          group: "WETH",
          key: "Sold",
          value: 34210,
        },
        {
          group: "WETH",
          key: "Restocking",
          value: 1400,
        },
        {
          group: "WETH",
          key: "Misc",
          value: 42100,
        },
        {
          group: "USDT",
          key: "Qty",
          value: 22000,
        },
        {
          group: "USDT",
          key: "More",
          value: 1200,
        },
        {
          group: "USDT",
          key: "Sold",
          value: 9000,
        },
        {
          group: "USDT",
          key: "Restocking",
          value: 24000,
        },
        {
          group: "USDT",
          key: "Misc",
          value: 3000,
        },
      ],
      lpChartOptions: {
        axes: {
          bottom: {
            title: "2019 Annual Sales Figures",
            mapsTo: "key",
            scaleType: "labels",
          },
          left: {
            mapsTo: "value",
            title: "Conversion rate",
            scaleType: "linear",
          },
        },
        points: {
          enabled: false,
        },
        height: "400px",
      },
      modal: {
        closeAriaLabel: "Close",
        size: "",
      },
      modalDownload: {
        visible: false,
      },
      modalLP: {
        visible: false,
      },
      isLoading: false,
      loading: {
        endingText: "Ending...",
        errorText: "Error.",
        loadingText: "Loading...",
        loadedText: "Complete.",
        state: "loading",
      },
      modelProgram: "",
      modelNumber: "1",
      modelDownloadNumber: "1",
      modelStakedNumber: "0",
      stackedNumberPercentage: "0",
      lpNumberPercentage: "0",
      lpBalance0: "0",
      lpBalance1: "0",
      modelLPNumber: "0",
      progress: {
        initialStep: 0,
        steps: ["Approval", "Deposit"],
        loading: false,
      },
      downloadProgress: {
        initialStep: 0,
        steps: ["First Step", "Second Step"],
        step1: false,
        step2: false,
      },
      errorInfo: {
        visible: false,
        copy: "",
        description: "",
        closeAriaLabel: "Custom close aria label",
      },
      successInfo: {
        visible: false,
        copy: "",
        description: "",
        closeAriaLabel: "Custom close aria label",
      },
    };
  },
  computed: {
    ...mapGetters({
      expandedData: "DataTable/getExpandedData",
      filteredData: "DataTable/getFilteredData",
    }),
    viewType() {
      return this.$route.name;
    },
    pair() {
      // if (!this.$route.query["pair"]) return "PERP-WETH";
      return this.$route.params["pair"].toUpperCase();
    },
    chartOptions() {
      return {
        legend: {
          enabled: true,
        },
        bounds: {
          upperBoundMapsTo: "max",
          lowerBoundMapsTo: "min",
        },
        axes: {
          bottom: {
            title: "Active Liquidity Range Time Series",
            mapsTo: "date",
            scaleType: "time",
          },
          left: {
            mapsTo: "value",
            scaleType: "linear",
            includeZero: false,
          },
        },
        color: {
          scale: {
            [this.pair]: "#c4c4c4",
          },
        },
        tooltip: {
          customHTML: this.getToolTip,
        },
        data: {
          loading: this.chartLoading,
        },
        curve: "curveNatural",
        height: "400px",
      };
    },
  },
  watch: {
    "$store.state.DataTable.isTableLoaded": {
      immediate: true,
      deep: true,
      handler() {
        if (!this.expandedData[this.pair]) return;
        this.pairData = this.expandedData[this.pair];
        this.meterChartData[0].value =
          (this.core.uniswapv3.hypes[this.core.translateWETH(this.pair)].tvl /
            this.core.uniswapv3.hypes[this.core.translateWETH(this.pair)]
              .maxTotalSupply) *
          100;
      },
    },
  },
  mounted() {
    this.pairData = this.expandedData[this.pair];
    this.fetchChartData();
  },
  methods: {
    onViewChange(view) {
      this.$router.push({ name: view });
    },
    async fetchChartData() {
      await fetch(
        "https://visordata-o9v9w.ondigitalocean.app/charts/baseRange/all"
      )
        .then((response) => response.json())
        .then((pairs) => {
          this.chartLoading = false;
          let name = this.core.translateWETH(this.pair);
          this.chartData = pairs[PairContractAddress[name]];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async download() {
      if (this.pair == "VISR") {
        this.$refs.modalStaked.show();
      } else if (this.pair == "vVISR") {
        this.$refs.modalStaked.show();
      } else if (this.core.isLP(this.pair)) {
        this.lpMax();
        this.$refs.modalLP.show();
      } else {
        this.downloadProgress.initialStep = 0;
        this.downloadProgress.step1 = false;
        await this.core.initializeAludel(this.pair);
        await this.core.initializeStakingToken(this.pair);

        let unlockedBalance = await this.getBalanceUnlocked(this.pair);
        if (unlockedBalance > 0) {
          this.downloadProgress.initialStep = 1;
          this.downloadProgress.step1 = true;
        }
        this.$refs.modalDownload.show();
      }
    },
    async save() {
      if (this.pair == "vVISR") {
        this.$router.push({ name: "Visr" });
        return;
      }
      if (this.core.isLP(this.pair)) {
        this.core.currentPair = this.core.translateWETH(this.pair, false);
        this.$router.push({ name: "ActiveLiquidity" });
        return;
      }

      this.progress.initialStep = 0;
      await this.core.initializeAludel(this.pair);
      await this.core.initializeStakingToken(this.pair);

      //decide whether to show approve
      let allowance = await this.core.tokens[this.pair].methods
        .allowance(this.core.accounts[0], this.core.transmuter._address)
        .call();
      if (allowance > this.core.web3.utils.toBN(0)) {
        this.progress.initialStep = 1;
      }
      this.$refs.modal.show();
    },
    async onLPPercentageChanged() {
      if (!this.core.states.is_connected) {
        return;
      }
      const maxLPNumber = await this.core.uniswapv3.hypes[
        this.core.translateWETH(this.pair)
      ].hype.methods
        .balanceOf(this.core.crucible._address)
        .call();

      this.modelLPNumber = (
        maxLPNumber *
        (this.lpNumberPercentage / 100)
      ).toString();

      if (this.expandedData[this.pair]) {
        this.lpBalance0 = this.expandedData[this.pair].balance0;
        this.lpBalance1 = this.expandedData[this.pair].balance1;
      }
    },
    submit() {
      this.isLoading = true;
      this.loading.loadingText = "Submitting...";
      this.loading.state = "loading";
      this.progress.loading = true;
      if (this.progress.initialStep == 0) {
        this.approve();
      } else {
        this.signLock();
      }
    },
    close() {
      this.isLoading = false;
      //this.loading.state = "loading"
      this.progress.loading = false;
      this.$refs.modal.hide();
      this.$refs.modalDownload.hide();
      this.$refs.modalStaked.hide();
      this.$refs.modalLP.hide();
    },

    async signLock() {
      this.loading.loadingText = "Staking...";
      let unitAmount = await this.getUnitAmount(this.modelNumber);

      const permission = await this.core.signPermissionLock(
        this.core.crucible._address,
        this.core.signer,
        this.core.aludels[this.pair]._address,
        this.core.tokens[this.pair]._address,
        unitAmount
      );
      const gasPrice = await this.core.gasPrice();
      this.core.transmuter.methods
        .stake(
          this.core.aludels[this.pair]._address,
          this.core.crucible._address,
          unitAmount,
          permission
        )
        .send(
          { from: this.core.accounts[0], gasPrice: gasPrice },
          (err, txHash) => {
            this.core.pollTx(
              txHash,
              "lock",
              async (block) => {
                this.isLoading = false;
                this.progress.loading = false;
                this.progress.initialStep++;
                this.successInfo.copy = "Success ";
                this.successInfo.description =
                  "Staked to " + this.pair + " Hypervisor in " + block;
                this.successInfo.visible = true;
                this.close();

                await this.updateRow(this.pair);
                setTimeout(() => {
                  this.successInfo.visible = false;
                }, 4000);
              },
              () => {
                this.clearMessages();
                this.close();
              }
            );
          }
        )
        .on("error", (err) => {
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          this.close();
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["mint"]);
        });
    },
    async signUnlock() {
      this.loading.loadingText = "Unstaking...";
      let unitAmount = await this.getUnitAmount(this.modelDownloadNumber);

      const permission = await this.core.signPermissionUnlock(
        this.core.crucible._address,
        this.core.signer,
        this.core.aludels[this.pair]._address,
        this.core.tokens[this.pair]._address,
        unitAmount
      );

      const gasPrice = await this.core.gasPrice();
      this.core.aludels[this.pair].methods
        .unstakeAndClaim(this.core.crucible._address, unitAmount, permission)
        .send(
          { from: this.core.accounts[0], gasPrice: gasPrice },
          (err, txHash) => {
            this.core.pollTx(
              txHash,
              "unlock",
              async (block) => {
                this.isLoading = false;
                this.progress.loading = false;
                this.progress.initialStep++;
                this.successInfo.copy = "Success ";
                this.successInfo.description =
                  "Unstaked from " + this.pair + " Hypervisor in " + block;
                this.successInfo.visible = true;
                this.downloadProgress.initialStep++;
                this.downloadProgress.step1 = true;
                await this.updateRow(this.pair);
                setTimeout(() => {
                  this.successInfo.visible = false;
                }, 4000);
              },
              () => {
                this.clearMessages();
                this.close();
              }
            );
          }
        )
        .on("error", (err) => {
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          this.close();
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["unlock"]);
        });
    },
    async withdrawVVISR() {
      let balUnlocked = await this.getUnitAmount(this.modelStakedNumber);
      // console.log(balUnlocked.toString());
      const gasPrice = await this.core.gasPrice();
      await this.core.rewards.methods
        .withdraw(
          balUnlocked,
          this.core.accounts[0],
          this.core.crucible._address
        )
        .send(
          { from: this.core.accounts[0], gasPrice: gasPrice },
          (err, txHash) => {
            this.core.pollTx(
              txHash,
              "withdrawVVISR",
              async (block) => {
                this.isLoading = false;
                this.progress.loading = false;
                this.progress.initialStep++;
                this.successInfo.copy = "Success ";
                let formattedBalance = await this.prettyPrintAmount(
                  this.pair,
                  balUnlocked
                );
                this.successInfo.description =
                  "Retrieved " +
                  formattedBalance +
                  " " +
                  this.pair +
                  " in " +
                  block;
                this.successInfo.visible = true;
                this.close();
                setTimeout(() => {
                  this.successInfo.visible = false;
                }, 4000);
                await this.updateRow(this.pair);
              },
              () => {
                this.clearMessages();
                this.close();
              }
            );
          }
        )
        .on("error", (err) => {
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          this.close();
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["withdrawVVISR"]);
        });
    },
    async withdrawLP() {
      let units = this.core.BN(this.modelLPNumber.toString());
      units = this.core
        .BN(units)
        .div(this.core.BN("1.000001"))
        .toFixed(0)
        .toString();
      this.loading.loadingText = "Withdrawing...";
      const gasPrice = await this.core.gasPrice();
      this.core.uniswapv3.hypes[this.core.translateWETH(this.pair)].hype.methods
        .withdraw(units, this.core.accounts[0], this.core.crucible._address)
        .send(
          { from: this.core.accounts[0], gasPrice: gasPrice },
          async (err, txHash) => {
            this.isLoading = true;
            this.core.pollTx(
              txHash,
              "withdraw",
              async (block) => {
                this.isLoading = false;
                this.successInfo.copy = "Success ";
                this.successInfo.description =
                  "Redeemed " + this.modelLPNumber + " shares in " + block;
                this.successInfo.visible = true;
                this.close();

                await this.core.updateUserLP(
                  this.core.translateWETH(this.pair)
                );
                await this.updateRow(this.pair);
                setTimeout(() => {
                  this.successInfo.visible = false;
                }, 4000);
              },

              () => {}
            );
          }
        )
        .on("error", (err) => {
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          this.close();
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["withdraw"]);
        });
    },

    submitStaked() {
      this.isLoading = true;
      this.loading.loadingText = "Submitting...";
      this.loading.state = "loading";
      this.progress.loading = true;
      if (this.pair == "VISR") {
        this.transferERC20();
      }
      if (this.pair == "vVISR") {
        this.withdrawVVISR();
      }
    },

    submitDownload() {
      this.isLoading = true;
      this.loading.loadingText = "Submitting...";
      this.loading.state = "loading";
      this.progress.loading = true;
      if (this.downloadProgress.initialStep == 0) {
        this.signUnlock();
      } else {
        this.transferERC20();
      }
    },

    submitLP() {
      this.isLoading = true;
      this.loading.loadingText = "Submitting...";
      this.loading.state = "loading";
      this.progress.loading = true;
      this.withdrawLP();
    },

    closeStaked() {
      this.stackedNumberPercentage = "0";
      this.lpNumberPercentage = "0";
      this.$refs.modalStaked.hide();
    },

    closeDownload() {
      this.$refs.modalDownload.hide();
    },
    closeLP() {
      this.$refs.modalLP.hide();
    },

    goToDownloadStep(i) {
      this.isLoading = true;
      this.loading.loadingText = "Submiting...";
      this.loading.state = "loading";
      this.progress.loading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.progress.loading = false;
        this.downloadProgress.initialStep = i;
        if (i === 0) this.downloadProgress.step1 = false;
        else this.downloadProgress.step1 = true;
      }, 1000);
    },

    async max() {
      let userBalance = await this.core.tokens[this.pair].methods
        .balanceOf(this.core.accounts[0])
        .call();
      let formattedBalance = await this.prettyPrintAmount(
        this.pair,
        userBalance
      );

      this.modelNumber = formattedBalance; //this.core.maxStake.toString();
    },
    async downloadMax() {
      let balLocked = await this.core.crucible.methods
        .getBalanceLocked(this.core.tokens[this.pair]._address)
        .call();

      let formattedBalance = await this.prettyPrintAmount(this.pair, balLocked);

      this.modelDownloadNumber = formattedBalance;
    },
    async stakedMax() {
      let balLocked;
      if (this.pair == "vVISR")
        balLocked = this.core.tokens["vVISR"].methods.balanceOf(
          this.core.crucible.address
        );
      else balLocked = await this.getBalanceUnlocked(this.pair);
      let formattedBalance = await this.prettyPrintAmount(
        this.activewAludel,
        balLocked
      );
      this.modelStakedNumber = formattedBalance;
    },
    async lpMax() {
      this.modelLPNumber = await this.core.uniswapv3.hypes[
        this.core.translateWETH(this.pair)
      ].hype.methods
        .balanceOf(this.core.crucible._address)
        .call();
    },
    async onStackedPercentageChanged() {
      if (!this.core.states.is_connected) {
        return;
      }
      const balLocked = await this.getBalanceUnlocked(this.pair);
      const stakedAmount = await this.prettyPrintAmount(this.pair, balLocked);

      this.modelStakedNumber = (
        stakedAmount *
        (this.stackedNumberPercentage / 100)
      )
        .toFixed(2)
        .toString();
    },
    onMaxWithdraw() {
      this.stackedNumberPercentage = "100";
    },
    plus() {
      this.modelNumber = `${++this.modelNumber}`;
    },
    downloadPlus() {
      this.modelDownloadNumber = `${++this.modelDownloadNumber}`;
    },
    stakedPlus() {
      this.modelStakedNumber = `${++this.modelStakedNumber}`;
    },
    lpPlus() {
      this.modelLPNumber = `${++this.modelLPNumber}`;
    },
    minus() {
      this.modelNumber = `${--this.modelNumber}`;
    },
    downloadMinus() {
      this.modelDownloadNumber = `${--this.modelDownloadNumber}`;
    },
    stakedMinus() {
      this.modelStakedNumber = `${--this.modelStakedNumber}`;
    },
    lpMinus() {
      if (parseFloat(this.modelLPNumber) - 1 > 0) {
        this.modelLPNumber = `${--this.modelLPNumber}`;
      } else {
        this.modelLPNumber = "0";
      }
    },
    clearMessages() {
      this.errorInfo.copy = "";
      this.errorInfo.description = "";
      this.errorInfo.visible = false;
      this.successInfo.copy = "";
      this.successInfo.description = "";
      this.successInfo.visible = false;
      this.header = "";
      this.subHeader = "";
      this.visible = false;
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";

.cv-overflow-menu-item .bx--overflow-menu-options__btn {
  background: $hover-secondary;
  color: #fff;
  &:hover {
    background: $active-secondary;
    color: #fff;
  }
  &:focus {
    outline: 2px solid transparent;
  }
}

.table-cell-tooltip {
  color: inherit !important;
  font-size: inherit !important;
}
// move analystic button on mobile view
@media screen and (max-width: 42rem) {
  .bx--overflow-menu-options__content {
    margin-left: -70px;
  }
}
</style>
