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
            <cv-text-input
              v-model="token1Amount"
              placeholder="0 USDT"
              label="Amount of USDT"
              step="1"
              :mobile="false"
              :fdisabled="true"
              :visible="percFeeMessageVisible"
              :helper-text="percFeeMessage"
              @input="token1AmountInput()"
              @change="restartCalc"
            />
            <cv-button
              kind="primary"
              size=""
              class="minus"
              @click="token1Minus()"
            >
              -
            </cv-button>
            <cv-button
              kind="primary"
              size=""
              class="plus"
              @click="token1Plus()"
            >
              +
            </cv-button>
          </div>

          <div class="bx--form-item number">
            <cv-text-input
              v-model="token0Amount"
              placeholder="0 ETH"
              label="Amount of ETH"
              step="1"
              :mobile="false"
              helper-text=""
              @input="token0AmountInput()"
              @change="restartCalc"
            />
            <cv-button
              kind="primary"
              size=""
              class="minus"
              @click="token0Minus()"
            >
              -
            </cv-button>
            <cv-button
              kind="primary"
              size=""
              class="plus"
              @click="token0Plus()"
            >
              +
            </cv-button>
          </div>
        </div>

        <div v-if="liquidityType == 1 && submitted == true" class="timeInput">
          <div class="part_section">
            <div class="bx--form-item number">
              <cv-text-input
                v-model="singleAmount"
                placeholder="0"
                @change="restartCalc"
              />
              <cv-button
                kind="primary"
                size=""
                class="minus"
                @click="singleAmount1Minus()"
              >
                -
              </cv-button>
              <cv-button
                kind="primary"
                size=""
                class="plus"
                @click="singleAmount1Plus()"
              >
                +
              </cv-button>
            </div>
          </div>
          <div class="part_section">
            <cv-dropdown v-model="singleType" value="1" @change="restartCalc">
              <cv-dropdown-item value="1"> USDT </cv-dropdown-item>
              <cv-dropdown-item value="0"> ETH </cv-dropdown-item>
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
        <cv-button v-if="submitted == true" kind="primary" @click="process()">
          {{ actionButton }}
        </cv-button>
      </div>
    </div>
    <cv-modal :visible="modalVisible" size="10">
      <template slot="label"> Alert </template>
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
      pair: "WETH-USDT",
      liquidityType: "",
      submitted: false,
      isLoading: false,
      // udsc, token0 amount
      token1Amount: "",
      token0Amount: "",
      // time default data
      light: false,
      label: "Select Amount",
      time: "0",
      ampm: "AM",
      timezone: "timezone2",
      mode: "single",
      singleType: "1",
      singleAmount: "",
      loadingMessage: "",
      actionButton: "Next",
      shares: 0,
      percFee: 0,
      percFeeMessage: "",
      percFeeMessageVisible: false,
      feesVisible: false,
      feesMessage: "",
      gatemessage:
        "This hypervisor has not completed the audit process yet, out of an abundance of caution you should not deposit more than you are willing to lose.",
      gatetitle: "Proceed with caution",
      whitelistTitle: "Closed Beta",
      whitelistMessage:
        "You currently do not have a whitelisted vault address. Please wait until more deposit slots open up.",
      warningTitle: "Proceed with caution",
      warningMessage:
        "This hypervisor has not completed the audit process yet, out of an abundance of caution you should not deposit more than you are willing to lose.",
      feesMessageVisible: false,
      noticeState: "capped",
      successNotice: {
        visible: false,
        copy: "",
        description: "",
        closeAriaLabel: "Custom close aria label",
      },
      errorNotice: {
        visible: false,
        copy: "",
        description: "",
        closeAriaLabel: "Custom close aria label",
      },
      vault: false,
      timezones: [
        {
          label: "Timezone-1",
          value: "timezone1",
        },
        {
          label: "Timezone-2",
          value: "timezone2",
        },
      ],
      actions: [],
    };
  },
  computed: {},

  async setup() {},
  async mounted() {
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
      if (!this.v3.hypes[this.pair].eligible) {
        this.gatetitle = this.whitelistTitle;
        this.gatemessage = this.whitelistMessage;
        this.noticeState = "ineligible";
        this.changeView("Loading...");
      } else {
        this.gatetitle = this.warningTitle;
        this.gatemessage = this.warningMessage;
        this.noticeState = "proceed";
      }

      this.isLoading = false;

      this.actions.push({
        type: "calc",
        name: "Next",
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
    next() {
      //console.log(this.liquidityType);
      this.mode = this.liquidityType == 1 ? "single" : "double";
      if (this.liquidityType == 1) {
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
      this.feesMessageVisible = false;
      this.percFeeMessageVisible = false;
      this.actions = [];
      this.actions.push({
        type: "calc",
        name: "Next",
      });
      this.actionButton = this.actions[0].name;
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
      this.loadingMessage = "Processing";
      if (this.actionButton == "Next") {
        if (this.mode == "single") {
          let units = this.core.ethers.utils.parseUnits(
            this.singleAmount,
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
                //  console.log("enough eth to wrap");
                this.actionButton = "Wrap ETH";
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
                units: units,
              };
              return;
            } else {
              //console.log('enough ', label, ' allowance to deposit');
              this.actionButton = "Deposit";
              let deposit0 = this.singleType == "0" ? units : "0";
              let deposit1 = this.singleType == "0" ? "0" : units;
              this.action = {
                deposit0: deposit0,
                deposit1: deposit1,
              };
              return;
            }
          }
        } else {
          let deposit0 = this.core.ethers.utils.parseUnits(
            this.token0Amount,
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
                  units: deposit0,
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
                units: deposit0,
              };
              return;
            } else {
              //console.log('enough ', label0, ' allowance to deposit');
            }
          }

          let deposit1 = this.core.ethers.utils.parseUnits(
            this.token1Amount,
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
                  units: deposit1,
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
                units: deposit1,
              };
              return;
            } else {
              //console.log('enough ', label1, ' allowance to deposit');
              this.actionButton = "Deposit";
              this.action = {
                deposit0: deposit0,
                deposit1: deposit1,
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
          async (block) => {
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
          async (block) => {
            await this.core.updateUserLP();
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
          async (block) => {
            this.isLoading = false;
            clearInterval(this.core.polls["approve"]);
            this.actionButton = "Next";
          }
        );
      }
    },
    async wrap(asset, units, success) {
      //console.log(this.v3.hypes[this.pair]['token'+asset], asset, units);
      web3.eth
        .sendTransaction(
          {
            from: this.core.accounts[0],
            to: this.v3.hypes[this.pair]["token" + asset]._address,
            value: units,
          },
          (err, txHash) => {
            //console.log(txHash);
            this.isLoading = true;
            this.core.pollTx(txHash, "wrap", success, (err) => {
              // console.log(err, err.message);
              this.handleError(err.message);
            });
          }
        )
        .on("error", (err) => {
          // console.log("show error", err);
          this.handleError(err.message);
          clearInterval(this.core.polls["wrap"]);
        });
    },
    async approve(asset, units, success) {
      //console.log('to approve units ', units.toString(),this.v3.hypes[this.pair].hype._address);
      //TODO remove USDT
      if (asset == "1") {
        units = "1000000000000000";
        // units = '0';
      }
      this.v3.hypes[this.pair]["token" + asset].methods
        .approve(this.v3.hypes[this.pair].hype._address, units)
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.isLoading = true;
          this.core.pollTx(txHash, "approve", success, (err) => {
            //console.log(err, err.message);
            this.handleError(err.message);
          });
        })
        .on("error", (err) => {
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
          this.core.pollTx(txHash, "deposit", success, (err) => {
            //console.log(err, err.message);
            this.handleError(err.message);
          });
        })
        .on("error", (err) => {
          this.handleError(err.message);
          clearInterval(this.core.polls["deposit"]);
        });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/liquidity-page-carbon-override.scss";

.liquidity-page {
  font-family: "IBM Plex Sans" !important;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #161616;
  &.loading {
    display: flex;
    align-items: center;
  }
  .bx--form__helper-text {
    color: #c6c6c6;
    position: absolute;
    bottom: -20px;
  }
  // .cv-button.minus,
  // .cv-button.plus {
  //   height: 37px;
  // }
  .liquidity-loading {
    .cv-loading {
      top: -80px;
      background-color: rgba(22, 22, 22, 0.4);
      .bx--loading__stroke {
        stroke: #ff0038;
      }
      .bx--loading__svg {
        circle {
          stroke-dasharray: 140;
        }
      }
    }
    &.text {
      color: white;
      position: fixed;
      top: 60px;
      left: 0;
      z-index: 6000;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  }
  .liquidity-body {
    max-width: 390px;
    margin: auto;
    .liquidity-header {
      h2 {
        font-size: 29px;
        color: white;
        font-family: "IBM Plex Sans";
        margin: 10px 0;
      }
      p {
        font-family: "IBM Plex Sans";
        font-size: 16px;
        color: white;
        white-space: nowrap;
      }
    }
    .liquidity-content {
      .cv-notifiation {
        margin-right: unset;
        width: 300px;
        top: 50px;
        right: 20px;
        position: absolute;
        &.bx--toast-notification--success {
          &.success {
            border-left: 3px solid #ff0038;
            .bx--toast-notification__icon {
              fill: #ff0038 !important;
            }
          }
          &.error {
            border-left: 3px solid #ef3e88;
            .bx--toast-notification__icon {
              fill: #ef3e88 !important;
            }
          }
        }
      }
      .timeInput {
        display: flex;
        margin-top: 40px;
        input:focus {
          outline: none;
        }
        .bx--form-item:nth-child(1) {
          flex-direction: unset;
        }
        .part_section:nth-child(1) {
          margin-right: 1px;
          width: 50%;
        }
        .part_section:nth-child(2) {
          padding-left: 1px;
          padding-right: 1px;
          width: 50%;
        }

        .part_section {
          .bx--form-item {
            margin-top: 0px;
            button {
              top: 0px !important;
            }
          }
        }
        svg {
          fill: white;
        }
        .bx--time-picker {
          .bx--time-picker__select:nth-child(3) {
            .bx--select-input {
              width: 213px;
            }
          }
        }
        .bx--select-input {
          background-color: #262626;
          color: white;
          option {
            color: white;
          }
        }
      }
      .numberInputs {
        display: flex;
        .number:nth-child(1) {
          margin-right: 10px;
        }
        .number:nth-child(2) {
          margin-left: 10px;
        }
      }
      .bx--dropdown {
        outline: none;
      }
      .bx--list-box__menu {
        outline: none;
      }
      .bx--form-item {
        position: relative;
        &.textinputs {
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          align-items: flex-end;
          .cv-text-input {
            input:focus {
              outline: solid 2px white !important;
            }
          }
          .cv-text-input:nth-child(1) {
            padding-right: 10px;
          }
          .cv-text-input:nth-child(2) {
            padding-left: 10px;
          }
        }
        &.dropdown {
          margin-top: 20px;
          .bx--form-item {
            width: 100%;
          }
        }
        &.number {
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          align-items: flex-end;
          .cv-text-input {
            input:focus {
              outline: solid 2px white !important;
            }
          }
          .cv-button {
            position: absolute;
            right: 76px;
            top: 46px;
            bottom: 2px;
            background: rgba(38, 38, 38, 1) !important;
            color: white !important;
            min-height: 2rem;
            padding: 10px !important;
            border-width: 0 !important;
            box-shadow: unset !important;
            &:focus {
              border-width: 0 !important;
              box-shadow: unset !important;
            }
            &:hover {
              background-color: #333030 !important;
            }
            &.minus,
            &.plus {
              color: white !important;
              min-width: 35px;
              display: inline-block;
              text-align: center;
            }
            &.minus {
              right: 38px;
            }
            &.plus {
              right: 2px;
            }
          }
        }
        .v-line {
          width: 1px;
          height: 15px;
          background: #8d8d8d;
          position: absolute;
          right: 30px;
          bottom: 10px;
        }
        margin-top: 20px;
        label,
        .bx--label {
          color: rgb(198, 198, 198);
        }
        input {
          background: rgba(38, 38, 38, 1);
          color: rgb(244, 244, 244);
        }
        .bx--dropdown,
        ul {
          background-color: rgb(38, 38, 38);
          color: rgb(244, 244, 244);
        }
        ul {
          &:focus {
            outline-color: white;
          }
          li {
            width: 100%;
            display: block;
            a {
              color: rgb(198, 198, 198);
              // border-top: 1px solid rgb(57, 57, 57);
            }
            &:hover {
              background-color: rgba(38, 38, 38, 1);
              // background-color: rgb(53, 53, 53);
              a {
                color: rgb(244, 244, 244);
                border-bottom-color: rgb(53, 53, 53);
              }
            }
            a:focus {
              outline-width: 0;
            }
            &.bx--dropdown--selected {
              background-color: rgb(53, 53, 53);
            }
          }
        }
        .bx--dropdown {
          button:focus {
            outline: none;
          }
          button {
            .bx--list-box__menu-icon {
              svg {
                fill: rgb(244, 244, 244);
              }
            }
            span {
              color: rgb(244, 244, 244);
            }
          }
        }
        .bx--dropdown--open {
          outline-color: white;
        }
        .bx--number__controls {
          button {
            &:focus {
              outline: none;
            }
          }
        }
      }
    }
    .liquidity-footer {
      margin-top: 40px;
      display: flex;
      grid-row: -1/-1;
      grid-column: 1/-1;
      justify-content: flex-end;
      height: 4rem;
      button {
        border: solid 1px transparent !important;
        box-shadow: unset !important;
        flex: 0 1 50%;
        max-width: none;
        height: 4rem;
        margin: 0;
        padding-top: 1rem;
        padding-bottom: 2rem;
      }
    }
  }
}
</style>
