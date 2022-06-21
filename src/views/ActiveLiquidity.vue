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
        <h2>{{ pageTitle }}</h2>
        <p>{{ pageSubtitle }}</p>
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
        <div
          v-if="!vaultWalletSelected"
          id="deposit-dropdown"
          class="bx--form-item dropdown"
        >
          <cv-dropdown
            v-model="depositMode"
            :value="depositMode"
            label="Deposit Mode"
          >
            <cv-dropdown-item value="Wallet">
              Mint LP tokens to Wallet (For Olympus)
            </cv-dropdown-item>
            <cv-dropdown-item value="Vault">
              Mint LP tokens to Vault
            </cv-dropdown-item>
          </cv-dropdown>
        </div>
        <div
          v-if="submitted == false && !isSpecialPair"
          id="liquidity-type-dropdown"
          class="bx--form-item dropdown"
        >
          <cv-dropdown
            v-model="liquidityType"
            :value="liquidityType"
            label="Liquidity Type"
          >
            <!-- <cv-dropdown-item v-if="isMainnet == true" value="1">
              Single Asset Liquidity
            </cv-dropdown-item> -->
            <cv-dropdown-item value="2">
              Double Asset Liquidity
            </cv-dropdown-item>
          </cv-dropdown>
        </div>

        <div
          v-if="liquidityType == 2 && submitted == true && vaultWalletSelected"
          class="numberInputs"
        >
          <div class="bx--form-item number">
            <cv-number-input
              v-model="token1Amount"
              :label="label1Amount"
              :invalid-message="token1InvalidMsg"
              :step="1"
              :visible="percFeeMessageVisible"
              :helper-text="percFeeMessage"
              :disabled="isWrapPending || !isConnected"
              placeholder="0"
              @input="onToken1Input"
            >
            </cv-number-input>
          </div>

          <div class="bx--form-item number">
            <cv-number-input
              v-model="token0Amount"
              :label="label0Amount"
              :invalid-message="token0InvalidMsg"
              :step="1"
              placeholder="0"
              :disabled="isWrapPending || !isConnected"
              @input="onToken0Input"
            >
            </cv-number-input>
          </div>
        </div>

        <div
          v-if="liquidityType == 1 && submitted == true && vaultWalletSelected"
          class="timeInput"
        >
          <div class="part_section">
            <div class="bx--form-item number">
              <cv-number-input
                v-model="singleAmount"
                :invalid-message="singleAmountInvalidMsg"
                :step="1"
                :min="0"
                placeholder="0"
                :disabled="isWrapPending"
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
        <template v-if="submitted == false">
          <cv-button kind="secondary" @click="cancel()">
            {{ isSpecialPair && vaultWalletSelected ? "Previous" : "Cancel" }}
          </cv-button>
          <cv-button kind="primary" :disabled="!isConnected" @click="next()">
            Next
          </cv-button>
        </template>
        <template v-if="submitted == true">
          <cv-button kind="secondary" @click="cancel()"> Previous </cv-button>
          <cv-button
            kind="primary"
            class="liquidity-process-button"
            :disabled="
              isProcessDisabled ||
              (actionButton === 'Deposit' &&
                (isWrapPending || isApprovePending))
            "
            @click="process()"
          >
            {{ actionButton }}
          </cv-button>
        </template>
      </div>
    </div>
    <cv-modal
      :visible="modalVisible"
      size="10"
      @primary-click="noticeFlowProceed"
      @secondary-click="noticeFlowCancel"
    >
      <template slot="label"> Alert </template>
      <template slot="title">
        {{ gatetitle }}
      </template>
      <template slot="content">
        <p>
          {{ gatemessage }}
        </p>
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button">
        {{ proceedButton }}
      </template>
    </cv-modal>
    <cv-modal
      :visible="specialPairModalVisible"
      size="10"
      @primary-click="goOlympus"
      @secondary-click="goDashboard"
    >
      <template slot="label"> Alert </template>
      <template slot="title"> GAMMA LP Tokens Received </template>
      <template slot="content">
        <p>
          You have successfully deposited FLOAT and ETH and have GAMMA LP tokens
          compatible with Olympus Bro bonds
        </p>
      </template>
      <template slot="secondary-button"> Go to Dashboard </template>
      <template slot="primary-button"> Go to Olympus </template>
    </cv-modal>
    <PendingTransactions
      :is-approve-pending="isApprovePending"
      :is-wrap-pending="isWrapPending"
      :wrap-txn="wrapTxHash"
      :approve-txn="approveTxHash"
    />
  </div>
</template>

<script>
import { SPECIAL_PAIRS } from "../constants";
import { mapGetters } from "vuex";
import PendingTransactions from "@/components/PendingTransactions";
export default {
  name: "New",
  components: { PendingTransactions },
  data() {
    return {
      modalVisible: false,
      isApprovePending: false,
      isWrapPending: false,
      wrapTxHash: "",
      approveTxHash: "",
      isEthWrapped: true,
      isAsset0Approved: false,
      isAsset1Approved: false,
      specialPairModalVisible: false,
      core: this.$parent.$root.core,
      v3: this.$parent.$root.core.uniswapv3,
      pair: this.$parent.$root.core.currentPair,
      label0: "",
      label1: "",
      placeholder0: "",
      placeholder1: "",
      label0Amount: "",
      label1Amount: "",
      liquidityType: "2",
      depositMode: "Wallet",
      submitted: false,
      isLoading: false,
      // udsc, token0 amount
      token1Amount: "",
      token1InvalidMsg: "",
      token0Amount: "",
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
      proceedButton: "Proceed",
      pageSubtitle: "Providing liquidity for Uniswap v3 active management",
      pageTitle: "Active Liquidity Management",
      whitelistTitle: "Cap Reached",
      whitelistMessage:
        "This hypervisor has reached its current deposit cap. Try another hypervisor or check back later",
      warningTitle: "Proceed with caution",
      //      warningMessage: "DeFi is bleeding edge technology. While this hypervisor has been audited, out of an abundance of caution you should not deposit more than you are willing to lose.",
      warningMessage:
        "Visor is migrating to a new dual deposit mechanism which will allow much higher deposits in a single transaction. New deposits will be suspended until the new deposit flow is completed. Withdraws function as normal.",
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
      vaultWalletSelected: false,
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
      contract: {},
    };
  },
  computed: {
    successNoticeVisible() {
      return this.successNotice.visible;
    },
    errorNoticeVisible() {
      return this.errorNotice.visible;
    },
    isProcessDisabled() {
      return !this.isConnected || this.liquidityType == "1"
        ? this.singleAmount == ""
        : this.token1Amount == "" || this.token0Amount == "";
    },
    isMainnet() {
      return this.core.net.name === "mainnet";
    },
    isSpecialPair() {
      return SPECIAL_PAIRS.includes(this.pair);
    },
    ...mapGetters({
      isConnected: "DataTable/getIsConnected",
    }),
  },
  watch: {
    successNoticeVisible() {
      this.errorNotice.visible = this.successNotice.visible
        ? false
        : this.errorNotice.visible;
    },
    errorNoticeVisible() {
      this.successNotice.visible = this.errorNotice.visible
        ? false
        : this.successNotice.visible;
    },
    isConnected() {
      if (!this.isConnected) {
        this.handleError("Connect Your Wallet", false);
      } else {
        this.handleSuccess("Wallet Connected");
        this.initActiveLiquidity();
      }
    },
  },
  async setup() {},
  async mounted() {
    if (this.$route.query.pair) {
      this.pair = this.core.translateWETH(
        this.$route.query.pair.toUpperCase(),
        false
      );
    }
    console.log("active pair", this.pair);

    this.label0 = this.pair.split("-")[0];
    this.label1 = this.pair.split("-")[1];
    this.label0Amount = "Amount of " + this.label0;
    this.label1Amount = "Amount of " + this.label1;
    this.placeholder0 = "0 " + this.label0;
    this.placeholder1 = "0 " + this.label1;
    if (this.label0 === "WETH" || this.label1 === "WETH") {
      this.isEthWrapped = false;
    }
    // this.isLoading = true;
    if (
      !this.core.states.is_connected ||
      (!this.core.states.is_holder && !this.isSpecialPair)
    ) {
      //await this.core.connect();
      if (this.isSpecialPair) {
        this.handleError("Connect Your Wallet", false);
        this.initLabels();
      } else {
        this.handleError("Connect Your Wallet", false);
        this.vaultWalletSelected = true;
        this.submitted = true;
      }
    } else {
      if (!this.isSpecialPair && this.core.crucible._address === undefined) {
        this.changeView("Loading...");
      }
      this.initActiveLiquidity();
    }
  },
  methods: {
    initLabels() {
      this.gatemessage = `This UI will take you through the deposit process to receive GAMMA LP tokens of the ${this.pair.replace(
        "WETH",
        "ETH"
      )} Pair that you can use in the Olympus Pro bond`;
      this.gatetitle = "Olympus Pro Bond: GAMMA LP Tokens";
      this.proceedButton = "Get LP Tokens";
      this.pageTitle = `Olympus Pro Bond (${this.pair.replace("WETH", "ETH")})`;
      this.pageSubtitle =
        "Getting GAMMA LP tokens to deposit into the Olympus Pro bond";
    },
    async initActiveLiquidity() {
      this.isLoading = true;

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
        if (this.isSpecialPair) {
          this.initLabels();
        } else this.gatemessage = this.warningMessage;
        this.noticeState = "proceed";
      } else {
        this.noticeState = "ineligible";
        this.changeView("Loading...");
      }

      this.openWarningModal();

      if (!this.isSpecialPair) {
        this.vaultWalletSelected = true;
        this.submitted = true;
        this.depositMode = "Vault";
        this.liquidityType = "2";
        this.mode = this.liquidityType == "1" ? "single" : "double";
      } else {
        if (this.core.crucible._address === undefined) {
          this.vaultWalletSelected = true;
          this.submitted = true;
          this.liquidityType = "2";
          this.mode = this.liquidityType == "1" ? "single" : "double";
        }
      }

      this.isLoading = false;

      this.actions.push({
        type: "calc",
        name: "Next",
      });

      this.isLoading = false;
      if (this.v3.hypes[this.pair].proxy) {
        this.contract = this.v3.hypes[this.pair].proxy;
      } else {
        this.contract = this.v3.hypes[this.pair].hype;
      }
    },
    goDashboard() {
      this.specialPairModalVisible = false;
      this.changeView("Loading...");
    },
    goOlympus() {
      this.specialPairModalVisible = false;
      window.open("https://pro.olympusdao.finance", "_blank");
    },
    noticeFlowCancel() {
      this.modalVisible = false;
      this.changeView("Loading...");
    },
    noticeFlowProceed() {
      this.modalVisible = false;
      /*
      if (!this.isSpecialPair) {
        this.changeView("Loading...");
        // if (this.noticeState != "eligible") {
        //   this.changeView("Loading...");
      }
*/
    },
    openSpecialPairModal() {
      this.specialPairModalVisible = true;
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
      const depositMax =
        this.v3.hypes[this.pair][`deposit${this.singleType}Max`];
      const currentBalance =
        (await this.v3.hypes[this.pair]["token" + this.singleType].methods
          .balanceOf(this.core.accounts[0])
          .call()) /
        Math.pow(10, this.v3.hypes[this.pair]["decimals" + this.singleType]);

      this.singleAmount = Math.min(currentBalance, depositMax);
    },
    next() {
      if (this.isSpecialPair) {
        this.vaultWalletSelected = true;
        this.liquidityType = "2";
        this.submitted = true;
      } else {
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
      }
      this.mode = this.liquidityType == 1 ? "single" : "double";
    },
    cancel() {
      if (this.isSpecialPair) {
        this.vaultWalletSelected = false;
        if (!this.submitted) this.$router.push({ name: "Homepage" });
        this.submitted = false;
      } else {
        // if (this.submitted == true) this.submitted = false;
        this.$router.push({ name: "Homepage" });
      }
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
      }, 10000);
    },
    handleNotice(msg) {
      // this.successNotice.description = msg;
      this.errorNotice.description = msg;
      this.errorNotice.copy = "Notice";
      this.errorNotice.visible = true;
      this.isLoading = false;
    },
    handleError(msg, timeout = true) {
      // this.successNotice.description = msg;
      this.errorNotice.description = msg;
      this.errorNotice.copy = "Error";
      this.errorNotice.visible = true;
      this.isLoading = false;
      if (timeout) {
        setTimeout(() => {
          this.errorNotice.visible = false;
        }, 10000);
      }
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
      }, 3000);
    },
    getPairTokenRatio(isToken0 = true) {
      const token0InToken1 = this.core
        .BN(this.v3.hypes[this.pair].totals.total0)
        .times(this.core.BN(this.v3.hypes[this.pair].price))
        .div(
          this.core.BN(10).pow(this.core.BN(this.v3.hypes[this.pair].decimals0))
        );

      const token0Percent = this.core.BN(token0InToken1).div(
        this.core
          .BN(token0InToken1)
          .plus(this.v3.hypes[this.pair].totals.total1)
          .div(
            this.core
              .BN(10)
              .pow(this.core.BN(this.v3.hypes[this.pair].decimals1))
          )
      );
      const token1Percent = this.core
        .BN(this.v3.hypes[this.pair].totals.total1)
        .div(
          this.core
            .BN(token0InToken1)
            .plus(this.v3.hypes[this.pair].totals.total1)
            .div(
              this.core
                .BN(10)
                .pow(this.core.BN(this.v3.hypes[this.pair].decimals1))
            )
        )
        .div(
          this.core.BN(10).pow(this.core.BN(this.v3.hypes[this.pair].decimals1))
        );
      if (isToken0) return this.core.BN(token0Percent).div(token1Percent);
      else return this.core.BN(token1Percent).div(token0Percent);
    },
    async onToken0Input() {
      console.log(
        this.contract._address,
        this.core
          .BN(this.token0Amount)
          .times(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals1))
          .toString()
      );
      console.log("token0Amount", this.token0Amount);
      let depositAmount;
      console.log(this.isSpecialPair);
      if (this.isSpecialPair) {
/*
  console.log(
  'PARAMS: ',
  this.v3.hypes[this.pair].hype._address,
  this.v3.hypes[this.pair].token0Address,
  this.core.BN(this.token0Amount).times(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals0)).toFixed()
  );
*/
        depositAmount = await this.contract.methods
          .getDepositAmount(
            this.v3.hypes[this.pair].hype._address,
            this.v3.hypes[this.pair].token0Address,
            this.core
              .BN(this.token0Amount)
              .times(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals0))
              .toFixed()
          )
          .call();
        console.log(depositAmount);
      } else {
        depositAmount = await this.contract.methods
          .getDepositAmount(
            this.v3.hypes[this.pair].hype._address,
            this.v3.hypes[this.pair].token0Address,
            this.core
              .BN(this.token0Amount)
              .times(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals0))
              .toFixed()
          )
          .call();
      }

      console.log(this.token1Amount, depositAmount);
      let a = this.core.BN(depositAmount.amountStart);
      let b = this.core.BN(depositAmount.amountEnd);
      let diff;
      let midpoint;
      if (a.gt(b)) {
        diff = a.minus(b);
        midpoint = diff.div(this.core.BN(2)).plus(b);
      } else {
        diff = b.minus(a);
        midpoint = diff.div(this.core.BN(2)).plus(a);
      }

      this.token1Amount = midpoint
        .div(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals1))
        .toFixed(5);

      this.restartCalc();
    },
    async onToken1Input() {
      //console.log(this.contract._address,this.core.BN(this.token1Amount).times(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals1)).toString())
      console.log("token1Amount", this.token1Amount);
      let depositAmount;
      if (this.isSpecialPair) {
        depositAmount = await this.contract.methods
          .getDepositAmount(
            this.v3.hypes[this.pair].hype._address,
            this.v3.hypes[this.pair].token1Address,
            this.core
              .BN(this.token1Amount)
              .times(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals1))
              .toFixed()
          )
          .call();
        console.log(depositAmount, "token1 input");
      } else {
        depositAmount = await this.contract.methods
          .getDepositAmount(
            this.v3.hypes[this.pair].hype._address,
            this.v3.hypes[this.pair].token1Address,
            this.core
              .BN(this.token1Amount)
              .times(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals1))
              .toFixed()
          )
          .call();
      }

      console.log(this.token0Amount, depositAmount);
      let a = this.core.BN(depositAmount.amountStart);
      let b = this.core.BN(depositAmount.amountEnd);
      let diff;
      let midpoint;
      if (a.gt(b)) {
        diff = a.minus(b);
        midpoint = diff.div(this.core.BN(2)).plus(b);
      } else {
        diff = b.minus(a);
        midpoint = diff.div(this.core.BN(2)).plus(a);
      }

      this.token0Amount = midpoint
        .div(this.core.BN(10).pow(this.v3.hypes[this.pair].decimals1))
        .toFixed(5);

      this.restartCalc();
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
        name: "Next",
      });
      this.isEthWrapped = false;
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
      if (!(await this.validateTokenAmounts())) return;

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
                  units: units,
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
              .allowance(this.core.accounts[0], this.contract._address)
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
            this.token0Amount.toString(),
            this.v3.hypes[this.pair]["decimals0"]
          );
          //console.log(deposit0.toString(), this.token0Amount);

          let label0 = this.v3.hypes[this.pair]["label0"];
          let bal0 = await this.v3.hypes[this.pair]["token0"].methods
            .balanceOf(this.core.accounts[0])
            .call();

          if (label0 === "WETH") {
            const ethBalance = await this.core.web3.eth.getBalance(
              this.core.accounts[0]
            );
            console.log("Eth Balance: ", this.v3.balanceETH);
            console.log("WEth Balance: ", bal0);
          }

          if (this.BN(bal0).lt(this.BN(deposit0)) && !this.isEthWrapped) {
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
              .allowance(this.core.accounts[0], this.contract._address)
              .call();
            //console.log('allow0 ', allow0.toString());

            if (
              this.BN(allow0).lt(this.BN(deposit0)) &&
              !this.isAsset0Approved
            ) {
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
            this.token1Amount.toString(),
            this.v3.hypes[this.pair]["decimals1"]
          );
          let label1 = this.v3.hypes[this.pair]["label1"];
          let bal1 = await this.v3.hypes[this.pair]["token1"].methods
            .balanceOf(this.core.accounts[0])
            .call();

          if (label1 === "WETH") {
            const ethBalance = await this.core.web3.eth.getBalance(
              this.core.accounts[0]
            );
            console.log("Eth Balance: ", ethBalance);
            console.log("Eth Balance: ", this.v3.balanceETH);
            console.log("WEth Balance: ", bal1);
          }

          if (this.BN(bal1).lt(this.BN(deposit1)) && !this.isEthWrapped) {
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
              .allowance(this.core.accounts[0], this.contract._address)
              .call();
            //console.log('allow1 ', allow1.toString());

            if (
              this.BN(allow1).lt(this.BN(deposit1)) &&
              !this.isAsset1Approved
            ) {
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
            this.isWrapPending = false;
            this.wrapTxHash = "";
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
            this.handleSuccess("Transaction Confirmed");
            await this.core.updateUserLP(this.pair);
            await this.core.initializeV3PoolUserBackup(this.pair);
            await this.core.getUserPosition(this.pair);
            this.isLoading = false;
            clearInterval(this.core.polls["deposit"]);
            if (this.isSpecialPair) {
              this.openSpecialPairModal();
            } else {
              this.changeView("Loading...");
            }
          }
        );
      } else {
        this.loadingMessage = "Approving";

        this.isLoading = true;
        await this.approve(
          this.action.asset,
          this.action.units.toString(),
          async (block) => {
            // this.handleSuccess(`Transaction Submitted.`);
            this.isApprovePending = false;
            this.approveTxHash = "";

            clearInterval(this.core.polls["approve"]);
          }
        );
      }
    },
    async wrap(asset, units, success) {
      //console.log(this.v3.hypes[this.pair]['token'+asset], asset, units);
      const gasPrice = await this.core.gasPrice();

      this.core.web3.eth
        .sendTransaction(
          {
            from: this.core.accounts[0],
            to: this.v3.hypes[this.pair]["token" + asset]._address,
            value: units,
            gasPrice,
          },
          (err, txHash) => {
            console.log("wrap eth txHash: ", txHash);
            if (txHash) {
              this.handleSuccess(`Transaction Submitted.`);
              this.actionButton = "Next";
              this.isLoading = false;
              this.isEthWrapped = true;
              this.isWrapPending = true;
              this.wrapTxHash = txHash;
            }

            this.core.pollTx(txHash, "wrap", success, (err) => {
              //console.log(err, err.message);
              this.handleError(err.message);
            });
          }
        )
        .on("error", (err) => {
          //console.log("show error", err);
          this.handleError(err.message);
          // clearInterval(this.core.polls["wrap"]);
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
      const gasPrice = await this.core.gasPrice();
      this.v3.hypes[this.pair]["token" + asset].methods
        .approve(this.contract._address, units)
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
          console.log("approve txHash", txHash);
          if (txHash) {
            this.handleSuccess(`Transaction Submitted.`);
            this.isApprovePending = true;
            this.approveTxHash = txHash;
            this.isLoading = false;
            this.actionButton = "Next";
            if (asset == "0") this.isAsset0Approved = true;
            else {
              this.isAsset1Approved = true;
            }
          }

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
      const gasPrice = await this.core.gasPrice();

      let depositAddress = this.core.crucible._address;

      if (this.isSpecialPair) {
        depositAddress =
          this.depositMode == "Wallet"
            ? this.core.accounts[0]
            : this.core.crucible._address;
        this.contract.methods
          .deposit(
            deposit0, deposit1, depositAddress,
           this.v3.hypes[this.pair].hype._address
          )
          .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
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
      } else {
        console.log(
          this.contract._address,
          deposit0.toString(),
          deposit1.toString(),
          depositAddress,
          this.core.accounts[0],
          this.v3.hypes[this.pair].hype._address
        );

        this.contract.methods
          .deposit(
            deposit0,
            deposit1,
            this.core.accounts[0],
            this.v3.hypes[this.pair].hype._address
          )
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
      }
    },
    async validateAmount(asset) {
      const currentPair = this.v3.hypes[this.pair];

      if (!currentPair[`deposit${asset}Max`]) {
        currentPair[`deposit${asset}Max`] =
          (await eval(`currentPair.hype.methods.deposit${asset}Max().call()`)) /
            Math.pow(10, eval(`currentPair.decimals${asset}`)) -
          (currentPair[`label${asset}`] === "WBTC" ? 0.00000001 : 0);
      }

      return {
        limit: currentPair[`deposit${asset}Max`],
        msg: `${currentPair[`deposit${asset}Max`]} ${
          currentPair[`label${asset}`]
        }`,
      };
    },
    async validateTokenAmounts() {
      let valid = true;
      if (this.mode == "single") {
        // console.log(this.singleType);
        let validate = await this.validateAmount(this.singleType);
        if (this.singleAmount > validate.limit) {
          this.singleAmountInvalidMsg = "Cannot exceed " + validate.msg;
          valid = false;
        } else {
          this.singleAmountInvalidMsg = "";
        }
      } else {
        let validate0 = await this.validateAmount("0");
        if (this.token0Amount > validate0.limit) {
          this.token0InvalidMsg = "Cannot exceed " + validate0.msg;
          valid = false;
        } else {
          this.token0InvalidMsg = "";
        }

        let validate1 = await this.validateAmount("1");
        if (this.token1Amount > validate1.limit) {
          this.token1InvalidMsg = "Cannot exceed " + validate1.msg;
          valid = false;
        } else {
          this.token1InvalidMsg = "";
        }
      }
      return valid;
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
