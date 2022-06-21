<template>
  <div class="liquidity-page main-content">
    <div class="liquidity-body">
      <div v-if="isLoading" class="liquidity-loading">
        <cv-loading overlay description="Approving" />
        <p class="liquidity-loading text">
          {{ loadingMessage }}
        </p>
      </div>
      <div class="liquidity-header">
        <h2>Active Liquidity Management</h2>
        <p>Providing liquidity for Uniswap v3 active management</p>
        <p v-if="submitted">
          <!-- {{ feesMessage }} -->
        </p>
        <p v-if="feesVisible">
          <!-- {{ percFeeMessage }} -->
        </p>
      </div>
      <div class="liquidity-content">
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
        <div v-if="submitted == false" class="bx--form-item dropdown">
          <cv-dropdown v-model="liquidityType" value="" label="Liquidity Type">
            <cv-dropdown-item value="1">
              Single Asset Liquidity
            </cv-dropdown-item>
            <cv-dropdown-item value="2">
              Double Asset Liquidity
            </cv-dropdown-item>
          </cv-dropdown>
        </div>

        <div
          v-if="liquidityType == 2 && submitted == true"
          class="numberInputs"
        >
          <div class="bx--form-item number">
            <cv-number-input
              v-model="token1Amount"
              :label="label1Amount"
              :invalid-message="token1InvalidMsg"
              :step="1"
              :min="0"
              :visible="percFeeMessageVisible"
              :helper-text="percFeeMessage"
              @change="restartCalc"
            >
            </cv-number-input>
          </div>

          <div class="bx--form-item number">
            <cv-number-input
              v-model="token0Amount"
              :label="label0Amount"
              :invalid-message="token0InvalidMsg"
              :step="1"
              :min="0"
              @change="restartCalc"
            >
            </cv-number-input>
          </div>
        </div>

        <div v-if="liquidityType == 1 && submitted == true" class="timeInput">
          <div class="part_section">
            <div class="bx--form-item number">
              <cv-number-input
                v-model="singleAmount"
                :invalid-message="singleAmountInvalidMsg"
                :step="1"
                :min="0"
              >
              </cv-number-input>
            </div>
          </div>
          <div class="part_section">
            <cv-dropdown
              v-model="singleType"
              value="1"
              @change="onSingleTypeChange"
            >
              <cv-dropdown-item value="1">
                {{ v3.hypes[this.pair].label1 }}
              </cv-dropdown-item>
              <cv-dropdown-item value="0">
                {{ v3.hypes[this.pair].label0 }}
              </cv-dropdown-item>
            </cv-dropdown>
          </div>
        </div>
      </div>

      <div class="liquidity-footer">
        <cv-button v-if="submitted == false" kind="secondary" @click="cancel()">
          Cancel
        </cv-button>
        <cv-button v-if="submitted == false" kind="primary" @click="next()">
          Next
        </cv-button>
        <cv-button v-if="submitted == true" kind="secondary" @click="cancel()">
          Previous
        </cv-button>
        <cv-button
          v-if="submitted == true"
          kind="primary"
          class="liquidity-process-button"
          :disabled="isProcessDisabled"
          @click="process()"
        >
          {{ actionButton }}
        </cv-button>
      </div>
    </div>
    <cv-modal :visible="modalVisible" size="10">
      <template slot="label">
        Alert
      </template>
      <template slot="title">
        {{ gatetitle }}
      </template>
      <template slot="content">
        <p>
          {{ gatemessage }}
        </p>
      </template>
      <template slot="secondary-button" @click="noticeFlowCancel()">
        Cancel
      </template>
      <template slot="primary-button" @click="noticeFlowProceed()">
        Proceed
      </template>
    </cv-modal>
  </div>
</template>

<script>
export default {
  name: "New",
  components: {},
  data() {
    return {
      modalVisible: false,
      core: this.$parent.$root.core,
      v3: this.$parent.$root.core.uniswapv3,
      pair: this.$parent.$root.core.currentPair,
      label0: "",
      label1: "",
      placeholder0: "",
      placeholder1: "",
      label0Amount: "",
      label1Amount: "",
      liquidityType: "",
      submitted: false,
      isLoading: false,
      // udsc, token0 amount
      token1Amount: 0,
      token1InvalidMsg: "",
      token0Amount: 0,
      token0InvalidMsg: "",
      // time default data
      light: false,
      label: "Select Amount",
      time: "0",
      ampm: "AM",
      timezone: "timezone2",
      mode: "single",
      singleType: "1",
      singleAmount: 0,
      singleAmountInvalidMsg: "",
      loadingMessage: "",
      actionButton: "Next",
      shares: 0,
      percFee: 0,
      percFeeMessage: "",
      percFeeMessageVisible: false,
      feesVisible: false,
      feesMessage: "",
      gatemessage:
        "DeFi is bleeding edge technology. While this hypervisor has been audited, out of an abundance of caution you should not deposit more than you are willing to lose.",
      gatetitle: "Proceed with caution",
      whitelistTitle: "Cap Reached",
      whitelistMessage:
        "This hypervisor has reached its current deposit cap. Try another hypervisor or check back later",
      warningTitle: "Proceed with caution",
      warningMessage:
        "DeFi is bleeding edge technology. While this hypervisor has been audited, out of an abundance of caution you should not deposit more than you are willing to lose.",
      feesMessageVisible: false,
      noticeState: "capped",
      successNotice: {
        visible: false,
        copy: "",
        description: "",
        closeAriaLabel: "Custom close aria label"
      },
      errorNotice: {
        visible: false,
        copy: "",
        description: "",
        closeAriaLabel: "Custom close aria label"
      },
      vault: false,
      timezones: [
        {
          label: "Timezone-1",
          value: "timezone1"
        },
        {
          label: "Timezone-2",
          value: "timezone2"
        }
      ],
      actions: []
    };
  },
  computed: {
    isProcessDisabled() {
      return this.liquidityType == "1"
        ? this.singleAmount == ""
        : this.token1Amount == "" || this.token0Amount == "";
    }
  },
  async setup() {},
  async mounted() {
    this.label0 = this.pair.split("-")[0];
    this.label1 = this.pair.split("-")[1];
    this.label0Amount = "Amount of " + this.label0;
    this.label1Amount = "Amount of " + this.label1;
    this.placeholder0 = "0 " + this.label0;
    this.placeholder1 = "0 " + this.label1;

    // this.isLoading = true;
    if (!this.core.states.is_connected || !this.core.states.is_holder) {
      //await this.core.connect();
      this.changeView("Loading...");
    } else {
      this.isLoading = true;
      this.openWarningModal();
      this.vault = this.core.accounts[0];
      if (!this.core.uniswapv3.uniswapV3Factory) {
        await this.core.initializeV3();
      }

      if (!this.core.uniswapv3.hypes[this.pair]) {
        await this.core.initializeV3Pool(this.pair);
      }
      let capReached = await this.core.isCapReached(this.pair);
      if (capReached === true) {
        this.gatetitle = this.whitelistTitle;
        this.gatemessage = this.whitelistMessage;
        this.noticeState = "ineligible";
        this.changeView("Loading...");
      } else if (capReached === false) {
        this.gatetitle = this.warningTitle;
        this.gatemessage = this.warningMessage;
        this.noticeState = "proceed";
      } else {
        this.noticeState = "ineligible";
        this.changeView("Loading...");
      }

      this.isLoading = false;

      this.actions.push({
        type: "calc",
        name: "Next"
      });

      this.isLoading = false;
    }
  },
  methods: {
    noticeFlowCancel() {
      this.changeView("Loading...");
    },
    noticeFlowProceed() {
      if (this.noticeState != "eligible") {
        this.changeView("Loading...");
      }
    },
    openWarningModal() {
      this.modalVisible = true;
    },
    singleAmount1Minus() {
      this.singleAmount = `${--this.singleAmount}`;
    },
    singleAmount1Plus() {
      this.singleAmount = `${++this.singleAmount}`;
    },
    token1AmountInput() {},
    token0AmountInput() {},
    token1Minus() {
      // let temp = this.token1Amount.slice(0, this.token1Amount.length - 5)
      // temp = parseInt(temp) - 1;
      // this.token1Amount = `${temp} USDT`
      if (parseInt(this.token1Amount) > 0)
        this.token1Amount = `${--this.token1Amount}`;
    },
    token1Plus() {
      // let temp = this.token1Amount.slice(0, this.token1Amount.length - 5)
      // temp = parseInt(temp) + 1;
      // this.token1Amount = `${temp} USDT`
      this.token1Amount = `${++this.token1Amount}`;
    },
    token0Minus() {
      // let temp = this.token0Amount.slice(0, this.token0Amount.length - 4)
      // temp = parseInt(temp) - 1
      // this.token0Amount = `${temp} ETH`
      if (parseInt(this.token0Amount) > 0)
        this.token0Amount = `${--this.token0Amount}`;
    },
    token0Plus() {
      // let temp = this.token0Amount.slice(0, this.token0Amount.length - 4)
      // temp = parseInt(temp) + 1
      // this.token0Amount = `${temp} ETH`
      this.token0Amount = `${++this.token0Amount}`;
    },
    async setDefaultSingleAmountMax() {
      const depositMax = this.v3.hypes[this.pair][
        `deposit${this.singleType}Max`
      ];
      const currentBalance =
        (await this.v3.hypes[this.pair]["token" + this.singleType].methods
          .balanceOf(this.core.accounts[0])
          .call()) /
        Math.pow(10, this.v3.hypes[this.pair]["decimals" + this.singleType]);

      this.singleAmount = Math.min(currentBalance, depositMax);
    },
    next() {
      this.mode = this.liquidityType == 1 ? "single" : "double";
      if (this.liquidityType == 1) {
        this.setDefaultSingleAmountMax();
      }
      if (this.liquidityType) this.submitted = true;
      this.feesMessage =
        "Pool is " +
        this.v3.hypes[this.pair]["percImb"] +
        "% heavy on " +
        this.v3.hypes[this.pair]["tokenFee"];
      this.feesMessageVisible = false;
    },
    cancel() {
      if (this.submitted == true) this.submitted = false;
      else this.$router.push({ name: "Homepage" });
    },
    BN(num) {
      return this.core.web3.utils.toBN(num);
    },
    handleSuccess(msg) {
      // this.successNotice.description = msg;
      this.successNotice.description = msg;
      this.successNotice.copy = "Success";
      this.successNotice.visible = true;
      //       this.isLoading = false;
      setTimeout(() => {
        this.successNotice.visible = false;
      }, 5000);
    },
    handleNotice(msg) {
      // this.successNotice.description = msg;
      this.errorNotice.description = msg;
      this.errorNotice.copy = "Notice";
      this.errorNotice.visible = true;
      this.isLoading = false;
    },
    handleError(msg) {
      // this.successNotice.description = msg;
      this.errorNotice.description = msg;
      this.errorNotice.copy = "Error";
      this.errorNotice.visible = true;
      this.isLoading = false;
      setTimeout(() => {
        this.errorNotice.visible = false;
      }, 5000);
      this.restartCalc();
    },
    doCloseNotification() {
      this.errorNotice.visible = false;
      this.successNotice.visible = false;
    },
    clearError() {
      this.errorNotice = "";
    },
    clearSuccess() {
      this.successNotice = "";
    },
    changeView(copy) {
      this.loadingCopy = copy;
      this.isLoading = true;
      setTimeout(() => {
        this.$router.push({ name: "Dashboard" });
      }, 5000);
    },
    restartCalc() {
      this.singleAmountInvalidMsg = "";
      this.token0InvalidMsg = "";
      this.token1InvalidMsg = "";
      this.feesMessageVisible = false;
      this.percFeeMessageVisible = false;
      this.actions = [];
      this.actions.push({
        type: "calc",
        name: "Next"
      });
      this.actionButton = this.actions[0].name;
    },
    onSingleTypeChange() {
      this.restartCalc();
      this.setDefaultSingleAmountMax();
    },
    async txCleanup(name, block) {
      this.handleSuccess("Transaction confirmed");
      this.actions = [];
      await this.prepareNext();
      this.actionButton = this.actions[0].name;

      this.isLoading = false;
      clearInterval(this.core.polls[name]);
    },

    async process() {
      this.errorNotice.visible = false;
      if (!this.validateTokenAmounts()) return;

      this.loadingMessage = "Processing";
      if (this.actionButton == "Next") {
        if (this.mode == "single") {
          let units = this.core.ethers.utils.parseUnits(
            this.singleAmount.toString(),
            this.v3.hypes[this.pair]["decimals" + this.singleType]
          );

          let label = this.v3.hypes[this.pair]["label" + this.singleType];
          let balSingle = await this.v3.hypes[this.pair][
            "token" + this.singleType
          ].methods
            .balanceOf(this.core.accounts[0])
            .call();
          if (this.BN(balSingle).lt(this.BN(units))) {
            //console.log(this.singleType, "bal insufficient");
            if (label == "WETH") {
              // console.log("label = weth");
              if (this.BN(this.v3.balanceETH).gte(this.BN(units))) {
                //console.log("enough eth to wrap", units.toString());
                this.actionButton = "Wrap ETH";
                this.action = {
                  asset: this.singleType,
                  units: units
                };
                return;
              } else {
                this.handleError("Insufficient " + label + " Balance");
                this.actionButton = "Next";
                return;
              }
            } else {
              this.handleError("Insufficient " + label + " Balance");
              this.actionButton = "Next";
              return;
            }
          } else {
            let allowSingle = await this.v3.hypes[this.pair][
              "token" + this.singleType
            ].methods
              .allowance(
                this.core.accounts[0],
                this.v3.hypes[this.pair].hype._address
              )
              .call();
            //console.log('allow', allowSingle.toString());

            if (this.BN(allowSingle).lt(this.BN(units))) {
              //console.log('Insufficient ', label, ' allowance');
              this.actionButton = "Approve " + label;
              this.action = {
                asset: this.singleType,
                units: units
              };
              return;
            } else {
              //console.log('enough ', label, ' allowance to deposit');
              this.actionButton = "Deposit";
              let deposit0 = this.singleType == "0" ? units : "0";
              let deposit1 = this.singleType == "0" ? "0" : units;
              this.action = {
                deposit0: deposit0,
                deposit1: deposit1
              };
              return;
            }
          }
        } else {
          let deposit0 = this.core.ethers.utils.parseUnits(
            this.token0Amount.toString(),
            this.v3.hypes[this.pair]["decimals0"]
          );

          let label0 = this.v3.hypes[this.pair]["label0"];
          let bal0 = await this.v3.hypes[this.pair]["token0"].methods
            .balanceOf(this.core.accounts[0])
            .call();
          if (this.BN(bal0).lt(this.BN(deposit0))) {
            //console.log("bal0 insufficient");
            if (label0 == "WETH") {
              //console.log("label = weth");
              if (this.BN(this.v3.balanceETH).gte(this.BN(deposit0))) {
                //console.log("enough eth to wrap");
                this.actionButton = "Wrap ETH";
                this.action = {
                  asset: "0",
                  units: deposit0
                };
                return;
              } else {
                this.handleError("Insufficient " + label0 + " Balance");
                this.actionButton = "Next";
                return;
              }
            } else {
              this.handleError("Insufficient " + label0 + " Balance");
              this.actionButton = "Next";
              return;
            }
          } else {
            let allow0 = await this.v3.hypes[this.pair]["token0"].methods
              .allowance(
                this.core.accounts[0],
                this.v3.hypes[this.pair].hype._address
              )
              .call();
            //console.log('allow0 ', allow0.toString());

            if (this.BN(allow0).lt(this.BN(deposit0))) {
              //console.log('insufficient ', label0, ' allowance');
              this.actionButton = "Approve " + label0;
              this.action = {
                asset: "0",
                units: deposit0
              };
              return;
            } else {
              //console.log('enough ', label0, ' allowance to deposit');
            }
          }

          let deposit1 = this.core.ethers.utils.parseUnits(
            this.token1Amount.toString(),
            this.v3.hypes[this.pair]["decimals1"]
          );
          let label1 = this.v3.hypes[this.pair]["label1"];
          let bal1 = await this.v3.hypes[this.pair]["token1"].methods
            .balanceOf(this.core.accounts[0])
            .call();

          if (this.BN(bal1).lt(this.BN(deposit1))) {
            //console.log("bal1 insufficient");
            if (label1 == "WETH") {
              //console.log("label = weth");
              if (this.BN(this.v3.balanceETH).gte(this.BN(deposit1))) {
                //console.log("enough eth to wrap");
                this.actionButton = "Wrap ETH";
                this.action = {
                  asset: "1",
                  units: deposit1
                };
                return;
              } else {
                this.handleError("Insufficient " + label1 + " Balance");
                return;
              }
            } else {
              this.handleError("Insufficient " + label1 + " Balance");
              return;
            }
          } else {
            let allow1 = await this.v3.hypes[this.pair]["token1"].methods
              .allowance(
                this.core.accounts[0],
                this.v3.hypes[this.pair].hype._address
              )
              .call();
            //console.log('allow1 ', allow1.toString());

            if (this.BN(allow1).lt(this.BN(deposit1))) {
              //console.log('insufficient ', label1, ' allowance');
              this.actionButton = "Approve " + label1;
              this.action = {
                asset: "1",
                units: deposit1
              };
              return;
            } else {
              //console.log('enough ', label1, ' allowance to deposit');
              this.actionButton = "Deposit";
              this.action = {
                deposit0: deposit0,
                deposit1: deposit1
              };
              return;
            }
          }
        }
      } else if (this.actionButton == "Wrap ETH") {
        this.loadingMessage = "Wrapping ETH";
        this.isLoading = true;
        await this.wrap(
          this.action.asset,
          this.action.units.toString(),
          async block => {
            this.handleSuccess("Transaction Confirmed");
            this.actionButton = "Next";
            this.isLoading = false;
            clearInterval(this.core.polls["wrap"]);
          }
        );
      } else if (this.actionButton == "Deposit") {
        this.loadingMessage = "Depositing";
        this.isLoading = true;
        await this.deposit(
          this.action.deposit0,
          this.action.deposit1,
          this.vault,
          async block => {
            this.handleSuccess("Transaction Confirmed");
            await this.core.updateUserLP(this.pair);
            this.isLoading = false;
            clearInterval(this.core.polls["deposit"]);
            this.changeView("Loading...");
          }
        );
      } else {
        this.loadingMessage = "Approving";
        this.isLoading = true;
        await this.approve(
          this.action.asset,
          this.action.units.toString(),
          async block => {
            this.handleSuccess("Transaction Confirmed");
            this.isLoading = false;
            clearInterval(this.core.polls["approve"]);
            this.actionButton = "Next";
          }
        );
      }
    },
    async wrap(asset, units, success) {
      //console.log(this.v3.hypes[this.pair]['token'+asset], asset, units);
      this.core.web3.eth
        .sendTransaction(
          {
            from: this.core.accounts[0],
            to: this.v3.hypes[this.pair]["token" + asset]._address,
            value: units
          },
          (err, txHash) => {
            //console.log(txHash);
            this.isLoading = true;
            this.core.pollTx(txHash, "wrap", success, err => {
              //console.log(err, err.message);
              this.handleError(err.message);
            });
          }
        )
        .on("error", err => {
          //console.log("show error", err);
          this.handleError(err.message);
          clearInterval(this.core.polls["wrap"]);
        });
    },
    async approve(asset, units, success) {
      //console.log('to approve units ', units.toString(),this.v3.hypes[this.pair].hype._address);
      //TODO remove USDT
      if (asset == "1") {
        units = "100000000000000000000000000";
        // units = '0';
      }
      units = "100000000000000000000000000";
      this.v3.hypes[this.pair]["token" + asset].methods
        .approve(this.v3.hypes[this.pair].hype._address, units)
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.isLoading = true;
          this.core.pollTx(txHash, "approve", success, err => {
            //console.log(err, err.message);
            this.handleError(err.message);
          });
        })
        .on("error", err => {
          this.handleError(err.message);
          clearInterval(this.core.polls["approve"]);
        });
    },
    async deposit(deposit0, deposit1, to, success) {
      this.v3.hypes[this.pair].hype.methods
        .deposit(deposit0, deposit1, this.core.crucible._address)
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.isLoading = true;
          this.core.pollTx(txHash, "deposit", success, err => {
            //console.log(err, err.message);
            this.handleError(err.message);
          });
        })
        .on("error", err => {
          this.handleError(err.message);
          clearInterval(this.core.polls["deposit"]);
        });
    },
    validateAmount(asset) {
      return {
        limit: this.v3.hypes[this.pair][`deposit${asset}Max`],
        msg: `${this.v3.hypes[this.pair][`deposit${asset}Max`]} ${
          this.v3.hypes[this.pair][`label${asset}`]
        }`
      };
    },
    validateTokenAmounts() {
      let valid = true;
      if (this.mode == "single") {
        // console.log(this.singleType);
        let validate = this.validateAmount(this.singleType);
        if (this.singleAmount > validate.limit) {
          this.singleAmountInvalidMsg = "Cannot exceed " + validate.msg;
          valid = false;
        } else {
          this.singleAmountInvalidMsg = "";
        }
      } else {
        let validate0 = this.validateAmount("0");
        if (this.token0Amount > validate0.limit) {
          this.token0InvalidMsg = "Cannot exceed " + validate0.msg;
          valid = false;
        } else {
          this.token0InvalidMsg = "";
        }

        let validate1 = this.validateAmount("1");
        if (this.token1Amount > validate1.limit) {
          this.token1InvalidMsg = "Cannot exceed " + validate1.msg;
          valid = false;
        } else {
          this.token1InvalidMsg = "";
        }
      }
      return valid;
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
