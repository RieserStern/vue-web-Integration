<template>
  <div class="staked-stats">
    <div v-if="isLoading" class="liquidity-loading">
      <cv-loading overlay description="Approving" />
      <p class="liquidity-loading text">{{ loadingCopy }}</p>
    </div>

    <div class="top-header">
      <h4>Staking Stats</h4>
      <cv-grid>
        <cv-row>
          <cv-column :md="2" :sm="2" :lg="3">
            <div class="stat-container">
              <span class="sub-title">Total Value Locked</span>
              <span class="title">
                <template v-if="isGammaStatsLoading">
                  <cv-skeleton-text />
                </template>
                <template v-else>
                  {{ gammaStats.uniswapPairTotalValueLocked }}
                </template>
              </span>
              <!-- <span class="helper">
                <template v-if="isGammaStatsLoading">
                  <cv-skeleton-text />
                </template>
                <template v-else> (45.39% circulating supply staked) </template>
              </span> -->
            </div>
          </cv-column>
          <cv-column :md="2" :sm="2" :lg="3">
            <div class="stat-container">
              <span class="sub-title">Total Fees Accrued</span>
              <span class="title">
                <template v-if="isGammaStatsLoading">
                  <cv-skeleton-text />
                </template>
                <template v-else>
                  {{ gammaStats.uniswapFeesGenerated }}
                </template>
              </span>
              <!-- <span class="helper">
                <template v-if="isGammaStatsLoading">
                  <cv-skeleton-text />
                </template>
                <template v-else> (4.1k GAMMA last distributed) </template>
              </span> -->
            </div>
          </cv-column>
          <cv-column :md="2" :sm="2" :lg="3">
            <div class="stat-container">
              <span class="sub-title">Fee-Based APR</span>
              <span class="title">
                <template v-if="isGammaStatsLoading">
                  <cv-skeleton-text />
                </template>
                <template v-else>
                  {{ gammaStats.uniswapFeesBasedApr }}
                </template>
              </span>
              <!-- <span class="helper">
                <template v-if="isGammaStatsLoading">
                  <cv-skeleton-text />
                </template>
              </span> -->
            </div>
          </cv-column>
          <cv-column :md="2" :sm="2" :lg="3">
            <div class="stat-container">
              <span class="sub-title">GAMMA Staking APY</span>
              <span class="title">
                <template v-if="isGammaStatsLoading">
                  <cv-skeleton-text />
                </template>
                <template v-else> {{ gammaStakingApy }}% </template>
              </span>
              <!-- <span class="helper">
                <template v-if="isGammaStatsLoading">
                  <cv-skeleton-text />
                </template>
                <template v-else> (3.9M GAMMA distributed) </template>
              </span> -->
            </div>
          </cv-column>
        </cv-row>
      </cv-grid>
    </div>
    <cv-row class="mining-main-conatiner">
      <cv-column :sm="6" :md="6" :lg="6">
        <div class="bar-chart-container">
          <ccv-simple-bar-chart :data="chartData" :options="chartOptions" />
        </div>
      </cv-column>
      <cv-column :sm="6" :md="6" :lg="6" class="mining-tabs-wrapper">
        <div class="column-inner-wrapper mining-tabs-container">
          <cv-tabs
            :container="false"
            aria-label="navigation tab label"
            @tab-selected="onTabSelected"
          >
            <cv-tab
              id="tab-1"
              label="Stake GAMMA"
              :selected="selectedTabIndex === 0"
              class="subscribe-container"
            >
              <GammaStatsComponent
                :global-gamma="globalGamma"
                :staked-amount="stakedAmount"
                :staked-amount-value="stakedAmountValue"
                :percentage="percentage"
              />
              <cv-row class="action-container">
                <cv-column :sm="4" :lg="8" class="input-container">
                  <cv-text-input
                    v-model="stakingAmountModel"
                    type="text"
                    placeholder="0 GAMMA"
                    :disabled="!isConnected"
                    @input="onChangeStakingValue()"
                    @focus="() => (stakingAmountModel = '')"
                  >
                  </cv-text-input>
                  <cv-button
                    class="max-button"
                    kind="primary"
                    size=""
                    :disabled="!isConnected"
                    @click="onStakeMax()"
                  >
                    Max
                  </cv-button>
                </cv-column>
                <cv-column :sm="4" :lg="4">
                  <template v-if="(!isConnected && getUpdating) || isTxPending">
                    <cv-button class="btn-stake">
                      <cv-inline-loading
                        state="loading"
                        :loading-text="loadingCopy"
                        class="icon-loading"
                      >
                      </cv-inline-loading>
                    </cv-button>
                  </template>
                  <template v-else>
                    <cv-button
                      v-if="!isConnected && !getUpdating"
                      class="btn-stake"
                      @click="onConnectWallet()"
                    >
                      Connect Wallet
                    </cv-button>
                    <cv-button
                      v-if="isConnected"
                      class="btn-stake"
                      :disabled="
                        stakingAmountModel == '0' ||
                        stakingAmountModel == '' ||
                        stakeBtnFrozen
                      "
                      @click="onClickStakeAction()"
                    >
                      {{ stakeActionButton }}
                    </cv-button>
                  </template>
                </cv-column>
              </cv-row>
            </cv-tab>
            <cv-tab
              id="tab-2"
              label="Unstake & Claim Fees"
              class="subscribe-container unstake-container"
              :selected="selectedTabIndex === 1"
            >
              <GammaStatsComponent
                :global-gamma="globalGamma"
                :staked-amount="stakedAmount"
                :staked-amount-value="stakedAmountValue"
                :percentage="percentage"
              />
              <cv-row class="action-container">
                <cv-column :sm="4" :lg="8" class="input-container">
                  <cv-text-input
                    v-model="modelStakedNumber"
                    label="a"
                    type="text"
                    placeholder="0 xGAMMA"
                    :disabled="!isConnected"
                    @input="onChangeUnstakingValue()"
                    @focus="() => (modelStakedNumber = '')"
                  >
                  </cv-text-input>
                  <cv-button
                    class="max-button"
                    kind="primary"
                    size=""
                    :disabled="!isConnected"
                    @click="onUnstakeMax()"
                  >
                    Max
                  </cv-button>
                </cv-column>
                <cv-column :sm="4" :lg="4">
                  <template v-if="!isConnected && getUpdating">
                    <cv-button class="btn-stake">
                      <cv-inline-loading
                        state="loading"
                        loading-text="Loading..."
                        class="icon-loading"
                      >
                      </cv-inline-loading>
                    </cv-button>
                  </template>
                  <template v-else>
                    <cv-button
                      v-if="!isConnected && !getUpdating"
                      class="btn-stake"
                      @click="onConnectWallet()"
                    >
                      Connect Wallet
                    </cv-button>
                    <cv-button
                      v-if="isConnected"
                      class="btn-stake"
                      :disabled="!isConnected || modelStakedNumber === '0'"
                      @click="withdrawXGamma()"
                    >
                      Unstake
                    </cv-button>
                  </template>
                </cv-column>
              </cv-row>
            </cv-tab>
          </cv-tabs>
        </div>
      </cv-column>
    </cv-row>
    <div class="table-container">
      <template v-if="isFeeDistributionsLoading">
        <cv-data-table-skeleton
          title="Historical Fees"
          :columns="columns"
          :rows="5"
        ></cv-data-table-skeleton>
      </template>
      <template v-else>
        <cv-data-table
          ref="table"
          title="Historical Fees"
          :columns="columns"
          :data="tableData"
        ></cv-data-table>
      </template>
    </div>
    <cv-toast-notification
      v-if="errorNotice.visible"
      kind="info"
      class="error"
      :title="errorNotice.copy"
      :sub-title="errorNotice.description"
      :close-aria-label="errorNotice.closeAriaLabel"
      :low-contrast="false"
      @close="doCloseNotification"
    />
    <cv-toast-notification
      v-if="successNotice.visible"
      kind="success"
      class="success"
      :title="successNotice.copy"
      :sub-title="successNotice.description"
      :close-aria-label="successNotice.closeAriaLabel"
      :low-contrast="false"
      @close="doCloseNotification"
    />
  </div>
</template>
<script>
import Vue from "vue";
import chartsVue from "@carbon/charts-vue";
import "@carbon/charts/styles-g100.css";
import { mapGetters, mapActions } from "vuex";
import GammaStatsComponent from "@/components/stakedstats/GammaStats";

Vue.use(chartsVue);

export default {
  name: "StakedStats",
  components: {
    GammaStatsComponent,
  },
  data() {
    return {
      core: this.$parent.$root.core,
      migratePercentage: "0",
      selectedTabIndex: 0,
      chartData: [],
      columns: [
        "Date",
        "GAMMA Distributed",
        "Fees Earned",
        "Trading Vol.",
        "Staking APR",
      ],
      tableData: [],
      feeDistributions: [
        {
          title: "GAMMA Distributions",
          desc: "Latest Fee Distributions",
        },
      ],
      isFeeDistributionsLoading: true,
      stakeActionButton: "Stake",
      stakeBtnFrozen: true,
      buttonLoadingText: "Loading...",
      activeAludel: "xGAMMA",
      isTxPending: false,
      globalGamma: {
        globalStakedGamma: 0,
        globalXGamma: 0,
        globalStakedValue: 0,
        xGammaPerGamma: 0,
        globalPercentage: 0,
      },
      percentage: 0,

      modelStakedNumber: "",
      stakedAmount: "0",
      stakedAmountValue: "0",
      gammaAmount: "0",
      stakingAmountModel: "",
      oneGammaAmount: "0",

      errorNotice: {
        visible: false,
        copy: "",
        description: "",
        closeAriaLabel: "Custom close aria label",
      },
      successNotice: {
        visible: false,
        copy: "",
        description: "",
        closeAriaLabel: "Custom close aria label",
      },
      isLoading: false,
      loadingCopy: "Loading...",
      // isGammaStatsLoading: true
    };
  },
  computed: {
    chartOptions() {
      return {
        title: "Daily distributed GAMMA fees VS time",
        axes: {
          left: {
            mapsTo: "value",
          },
          bottom: {
            mapsTo: "date",
            scaleType: "time",
          },
        },
        color: {
          scale: {
            "Distributed Fees": "#C6C6C6",
          },
          gradient: {
            enabled: true,
          },
        },
        timeScale: {
          localeObject: {
            code: "tr",
            formatLong: {},
            localize: {},
            match: {},
            options: {
              weekStartsOn: 1,
              firstWeekContainsDate: 1,
            },
          },
        },
        // bars: {
        //   maxWidth: 50,
        // },
        legend: {
          enabled: false,
        },
        data: {
          loading: this.isGammaStatsLoading,
        },
        tooltip: {
          customHTML: this.getToolTip,
        },
        height: this.selectedTabIndex === 0 ? "300px" : "300px",
      };
    },
    ...mapGetters({
      gammaStats: "GammaState/getGammaStats",
      isGammaStatsLoading: "GammaState/getIsGammaStatsLoading",
      expandedData: "DataTable/getExpandedData",
      isConnected: "DataTable/getIsConnected",
      gammaStakingApy: "GammaState/getGammaStakingApy",
      getIsTableLoaded: "DataTable/getIsTableLoaded",
      getUpdating: "DataTable/getUpdating",
    }),
  },
  watch: {
    async isConnected() {
      if (this.isConnected) {
        // const balLocked = await this.getBalanceUnlocked(this.activeAludel);
        this.updateUserWalletState();
      } else {
        this.stakeActionButton = "Stake";
      }
    },
    async stakedAmount() {
      let dec = this.core.tokens[this.activeAludel]._address
        ? await this.core.tokens[this.activeAludel].methods.decimals().call()
        : 18;
      let balLocked = await this.core.tokens[this.activeAludel].methods
        .balanceOf(this.core.accounts[0])
        .call();
      let reward = this.core
        .BN(balLocked)
        .times(this.core.BN(this.core.rewardsRatio))
        .toFixed(0);
      let rewardString = this.core.amountFormatter(reward, dec);
      this.stakedAmountValue = this.core
        .BN(rewardString)
        .multipliedBy(this.core.BN(this.core.visorStatsData.visrPrice))
        .toFixed(2);
      this.oneGammaAmount = this.core
        .BN(this.core.rewardsRatio)
        .multipliedBy(this.core.BN(this.core.visorStatsData.visrPrice))
        .toFixed(2);
    },
    "$store.state.DataTable.updating": {
      immediate: true,
      async handler() {
        if (this.core.visorStatsData) {
          this.globalGamma.globalStakedGamma = this.gammaStats.stakedAmount;
          this.globalGamma.globalXGamma = this.gammaStats.stakedAmount;
          this.globalGamma.globalStakedValue = this.gammaStats.stakedUsdAmount;

          if (this.core.tokens["GAMMA"]) {
            let xGammaBal = await this.core.tokens["GAMMA"].methods
              .balanceOf(this.core.rewards._address)
              .call();
            let totalSupplyGamma = await this.core.tokens["GAMMA"].methods
              .totalSupply()
              .call();
            this.globalGamma.globalPercentage = this.core
              .BN(xGammaBal)
              .div(this.core.BN("26000000000000000000000000"))
              .multipliedBy(100)
              .toString();
          }

          this.globalGamma.xGammaPerGamma =
            this.core.visorStatsData.visrPerVvisr.toLocaleString("en-US", {
              maximumFractionDigits: 5,
              minimumFractionDigits: 5,
            });

          console.log(
            "xGamma Price",
            this.core.visorStatsData.visrPerVvisr,
            this.globalGamma.xGammaPerGamma
          );
        }
      },
    },
  },
  async mounted() {
    this.core.currentPair = this.activeAludel;
    this.fetchFeeDistributions();

    if (this.isConnected) {
      // const balLocked = await this.getBalanceUnlocked(this.activeAludel);
      // const balLocked = await this.core.tokens[this.activeAludel].methods
      //   .balanceOf(this.core.accounts[0])
      //   .call();

      // this.stakedAmount = await this.prettyPrintAmount(
      //   this.activeAludel,
      //   balLocked
      // );
      await this.updateUserWalletState();
    }
  },
  methods: {
    ...mapActions({
      setGammaStats: "GammaState/setGammaStats",
      setGammaStakingApy: "GammaState/setGammaStakingApy",
      setIsVisorStatsLoading: "GammaState/setIsVisorStatsLoading",
    }),
    getToolTip({ 0: { group, date, value } }) {
      const month = date.toLocaleString("default", { month: "long" });

      return `
        <div class='chart-tooltip'>
          <p>Data <span>${group}</span></p>
          <p>Date <span>${month} ${date.getDate()}</span></p>
          <p>Fee Amount <span>${value}</span></p>
        </div>
      `;
    },
    onMaxMigrate() {
      this.migratePercentage = "100";
    },
    onConnectWallet() {
      this.loadingCopy = "Connecting...";
      this.$parent.$children[0].connect();
    },
    async fetchFeeDistributions() {
      await fetch(
        "https://visordata-o9v9w.ondigitalocean.app/gamma/dailyDistribution?days=10"
      )
        .then((response) => response.json())
        .then(({ feeDistribution: feeDistribution }) => {
          this.tableData = feeDistribution.reduce((cur, item) => {
            return [...cur, [item.title, item.desc, "--", "--", "--"]];
          }, []);
          this.chartData = feeDistribution.map((item) => {
            return {
              group: "Distributed Fees",
              date: item.title,
              value: parseInt(item.desc.replace(",", "")),
            };
          });

          console.log(feeDistribution);
          this.isFeeDistributionsLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // Notification management methods
    doCloseNotification() {
      this.errorNotice.visible = false;
      this.successNotice.visible = false;
    },
    async getBalanceUnlocked(aludel) {
      let balLocked = await this.core.crucible.methods
        .getBalanceLocked(this.core.tokens[aludel]._address)
        .call();
      let totalBalance = await this.core.tokens[aludel].methods
        .balanceOf(this.core.crucible._address)
        .call();
      let balUnlocked = this.core.web3.utils
        .toBN(totalBalance)
        .sub(this.core.web3.utils.toBN(balLocked));
      return balUnlocked;
    },
    async prettyPrintAmount(aludel, amount) {
      let dec = await this.core.tokens[aludel].methods.decimals().call();
      let amountFormatted = this.core
        .BN(amount)
        .div(this.core.BN(10).pow(this.core.BN(dec)));
      return amountFormatted.toString();
    },
    onTabSelected(index) {
      this.selectedTabIndex = index;
    },
    async onClickStakeAction() {
      if (this.stakeActionButton === "Stake") {
        // await this.approveWallet();
        await this.depositFromWallet();
      } else if (this.stakeActionButton == "Approve") {
        await this.approveWallet();
      } else if (this.stakeActionButton === "Stake GAMMA") {
        // Go to uniswap to get VISR
        window.open(
          "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xf938424f7210f31df2aee3011291b658f872e91e",
          "_blank"
        );
      } else {
        // Do nothing yet
      }
    },
    async onStakeMax() {
      if (this.gammaAmount == 0) {
        this.stakeActionButton = "Stake GAMMA";
        this.stakingAmountModel = 0;
        return;
      }

      this.stakingAmountModel = this.gammaAmount;

      this.stakeBtnFrozen = true;
      if (parseInt(this.stakingAmountModel) > parseInt(this.gammaAmount)) {
        this.stakingAmountModel = this.gammaAmount;
      }

      let curAllowance = await this.core.tokens["GAMMA"].methods
        .allowance(this.core.accounts[0], this.core.rewards._address)
        .call();

      let unitAmount = this.core.ethers.utils.parseUnits(
        this.stakingAmountModel,
        "18"
      );
      this.stakeActionButton = this.core
        .BN(curAllowance)
        .gt(this.core.BN(unitAmount.toString()))
        ? "Stake"
        : "Approve";
      this.stakeBtnFrozen = false;
    },
    onUnstakeMax() {
      if (!this.core.states.is_connected) return;

      this.modelStakedNumber = this.stakedAmount.toString();
    },
    async onChangeStakingValue() {
      if (this.gammaAmount == 0) {
        this.stakeActionButton = "Stake GAMMA";
        this.stakingAmountModel = 0;
        return;
      }
      this.stakeBtnFrozen = true;
      if (parseInt(this.stakingAmountModel) > parseInt(this.gammaAmount)) {
        this.stakingAmountModel = this.gammaAmount;
      }

      let curAllowance = await this.core.tokens["GAMMA"].methods
        .allowance(this.core.accounts[0], this.core.rewards._address)
        .call();

      let unitAmount = this.core.ethers.utils.parseUnits(
        this.stakingAmountModel,
        "18"
      );
      this.stakeActionButton = this.core
        .BN(curAllowance)
        .gt(this.core.BN(unitAmount.toString()))
        ? "Stake"
        : "Approve";
      this.stakeBtnFrozen = false;
    },
    async onChangeUnstakingValue() {
      if (this.modelStakedNumber > this.stakedAmount)
        this.modelStakedNumber = this.stakedAmount;
    },
    async approveWallet() {
      let balance = await this.core.tokens["GAMMA"].methods
        .balanceOf(this.core.accounts[0])
        .call();
      if (parseFloat(this.stakingAmountModel) <= 0) return;
      let unitAmount = this.core.ethers.utils.parseUnits(
        this.stakingAmountModel,
        "18"
      );

      if (this.core.BN(balance).gte(this.core.BN(unitAmount.toString()))) {
        this.isLoading = true;
        this.loadingCopy = "Approving...";
        // Approving the particular amount on hypervisor address
        let units = "100000000000000000000000000";
        const gasPrice = await this.core.gasPrice();

        await this.core.tokens["GAMMA"].methods
          .approve(this.core.rewards._address, units)
          .send({ from: this.core.accounts[0] }, (err, txHash) => {
            if (txHash) {
              this.isLoading = false;
              this.isTxPending = true;
            }
            this.core.pollTx(
              txHash,
              "transfer",
              async () => {
                this.handleSuccess("Successfully Approved");
                this.stakeActionButton = "Stake";
              },
              () => {
                this.handleError("Something went wrong on approving.");
              }
            );
          })
          .on("error", () => {
            this.handleError("Something went wrong on approving.");
          });
      } else {
        this.handleError("Insufficient Wallet Balance");
      }
    },
    async depositFromWallet() {
      let unitAmount = this.core.ethers.utils.parseUnits(
        this.stakingAmountModel,
        "18"
      );
      this.isLoading = true;
      this.loadingCopy = "Staking...";
      const gasPrice = await this.core.gasPrice();
      await this.core.rewards.methods
        .enter(unitAmount)
        .send(
          { from: this.core.accounts[0], gasPrice: gasPrice },
          (err, txHash) => {
            if (txHash) {
              this.isLoading = false;
              this.isTxPending = true;
            }
            this.core.pollTx(
              txHash,
              "transfer",
              async () => {
                this.handleSuccess("Successfully Deposited");
                await this.updateUserWalletState();
              },
              () => {
                this.handleError("Something went wrong on depositing.");
              }
            );
          }
        )
        .on("error", () => {
          this.handleError("Something went wrong on depositing.");
        });
    },
    async getUnitAmount(amount) {
      let decimals = await this.core.tokens[this.activeAludel].methods
        .decimals()
        .call();
      let unitAmount = this.core.ethers.utils.parseUnits(amount, decimals);
      return unitAmount;
    },
    async withdrawXGamma() {
      this.isLoading = true;
      this.loadingCopy = "Withdrawing...";

      let balUnlocked;
      // if (this.migratePercentage == 100) {
      //   balUnlocked = await this.core.tokens["xGAMMA"].methods
      //     .balanceOf(this.core.accounts[0])
      //     .call();
      // } else
      balUnlocked = await this.getUnitAmount(this.modelStakedNumber);

      const gasPrice = await this.core.gasPrice();
      await this.core.rewards.methods
        .leave(balUnlocked)
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
          if (txHash) {
            this.isLoading = false;
            this.isTxPending = true;
          }
          this.core.pollTx(
            txHash,
            "withdrawVVISR",
            async () => {
              await this.updateUserWalletState();
              this.handleSuccess("Successfully unstaked and claimed");
            },
            () => {
              this.handleError("Something went wrong on unstaking");
            }
          );
        })
        .on("error", (err) => {
          this.handleError("Something went wrong on unstaking");
        });
    },
    async updateUserWalletState() {
      await this.fetchVisorStatsData();
      const balLocked = await this.core.tokens["xGAMMA"].methods
        .balanceOf(this.core.accounts[0])
        .call();
      this.stakedAmount = await this.prettyPrintAmount(
        this.activeAludel,
        balLocked
      );

      const balUnLocked = await this.core.tokens["GAMMA"].methods
        .balanceOf(this.core.accounts[0])
        .call();
      this.gammaAmount = await this.prettyPrintAmount(
        this.activeAludel,
        balUnLocked
      );

      // Update the totalSupply after updating
      this.core.visorStatsData.stakedAmount = await this.core.rewards.methods
        .totalSupply()
        .call();

      this.percentage = (
        (100 * this.stakedAmount) /
        this.core.visorStatsData.stakedAmount
      ).toLocaleString("en-US", {
        maximumFractionDigits: 3,
        minimumFractionDigits: 3,
      });

      if (parseFloat(this.gammaAmount) === 0) {
        this.stakeActionButton = "Stake GAMMA";
      } else {
        this.stakeActionButton = "Stake";
      }
      this.stakingAmountModel = "0";
      this.modelStakedNumber = "0";
    },

    //Visor State Data
    async fetchVisorStatsData() {
      this.setIsVisorStatsLoading(true);
      await fetch("https://visordata-o9v9w.ondigitalocean.app/dashboard")
        .then((response) => response.json())
        .then((visorStats) => {
          this.core.visorStatsData = visorStats;
          this.core.apy_percent = (
            parseFloat(this.core.visorStatsData.feeStatsStakingApy) * 100
          ).toFixed(0);

          this.setGammaStats(this.formatVisorStats(visorStats));
          this.setGammaStakingApy(
            Math.round(visorStats.feeStatsStakingApy * 100 * 100) / 100
          );

          this.isVisorStatsLoading = false;
          this.setIsVisorStatsLoading(false);

          // console.log("visor state data is ready");
        })
        .catch((err) => {
          this.setIsVisorStatsLoading(false);
          // console.log(err);
        });
    },

    handleError(msg, timeout = true) {
      this.errorNotice.copy = msg;
      this.errorNotice.visible = true;
      this.isLoading = false;
      if (timeout) {
        setTimeout(() => {
          this.errorNotice.visible = false;
        }, 5000);
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    handleSuccess(msg) {
      console.log(msg);
      this.successNotice.copy = msg;
      this.successNotice.visible = true;
      setTimeout(() => {
        this.successNotice.visible = false;
      }, 5000);
      setTimeout(() => {
        this.isTxPending = false;
      }, 1000);
    },
  },
};
</script>
