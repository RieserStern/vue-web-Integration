/* eslint-disable prettier/prettier */
<template>
  <cv-header aria-label="Carbon header">
    <cv-header-menu-button aria-label="Header menu" aria-controls="side-nav" />
    <cv-skip-to-content href="#main-content">
      Skip to content
    </cv-skip-to-content>
    <cv-header-name
      href="javascript:void(0)"
      prefix=""
      class="logo-button"
      @click.prevent="goHome()"
    >
      <img
        v-if="isDarkMode"
        src="@/assets/svg/GAMMA.svg"
        class="logo"
        width="56.5px"
      />
      <img v-else src="@/assets/svg/GAMMA.svg" class="logo" width="56.5px" />
    </cv-header-name>
    <cv-header-nav aria-label="Carbon nav">
      <cv-header-menu-item @click="goDash()">
        Provide Active Liquidity
      </cv-header-menu-item>
      <cv-header-menu-item @click="goStakeVISR()">
        Stake GAMMA
      </cv-header-menu-item>
      <cv-header-menu-item @click="goAnalytics()">
        Analytics
      </cv-header-menu-item>
      <!-- <cv-header-menu-item @click="goVaultDetails()">
        Vault Details
      </cv-header-menu-item> -->
      <cv-header-menu-item v-if="!core.publish" @click="goMigrate()">
        Migrate
      </cv-header-menu-item>
    </cv-header-nav>
    <template v-if="true" v-slot:left-panels>
      <cv-side-nav id="side-nav" fixed>
        <cv-side-nav-items>
          <cv-header-side-nav-items>
            <cv-header-menu-item @click="goDash()">
              Active Liquidity
            </cv-header-menu-item>
          </cv-header-side-nav-items>
        </cv-side-nav-items>

        <cv-side-nav-items>
          <cv-header-side-nav-items>
            <cv-header-menu-item @click="goStakeVISR()">
              Stake GAMMA
            </cv-header-menu-item>
          </cv-header-side-nav-items>
        </cv-side-nav-items>

        <cv-side-nav-items>
          <cv-header-side-nav-items>
            <cv-header-menu-item @click="goAnalytics()">
              Analytics
            </cv-header-menu-item>
          </cv-header-side-nav-items>
        </cv-side-nav-items>

        <cv-side-nav-items v-if="!core.publish">
          <cv-header-side-nav-items>
            <cv-header-menu-item @click="goMigrate()">
              Migrate
            </cv-header-menu-item>
          </cv-header-side-nav-items>
        </cv-side-nav-items>
      </cv-side-nav>
    </template>
    <template v-slot:header-global>
      <template v-if="currentRouteName !== 'home'" />
      <div v-show="getIsTableLoaded" class="connected-dropdown">
        <cv-dropdown
          v-show="!core.publish"
          @change="dropdownChain"
          v-model="network"
        >
          <cv-dropdown-item value="mainnet"> Mainnet </cv-dropdown-item>
          <cv-dropdown-item value="arbitrum"> Arbitrum </cv-dropdown-item>
          <cv-dropdown-item value="optimistic"> Optimistic </cv-dropdown-item>
        </cv-dropdown>
      </div>

      <!-- <cv-header-global-action
        v-if="!isConnected && getIsTableLoaded"
        label="To Mainnet"
        style="background : transparent !important; color : white !important; margin-right : 20px;"
        @click="changeNetwork('mainnet')"
        class="change-network-button"
      >
        Mainnet
      </cv-header-global-action>
      <cv-header-global-action
        v-if="!isConnected && getIsTableLoaded"
        label="To Arbitrum"
        style="background : transparent !important; color : white !important; margin-right : 25px;"
        @click="changeNetwork('arbitrum')"
        class="change-network-button"
      >
        Arbitrum
      </cv-header-global-action>
      <cv-header-global-action
        v-if="!isConnected && getIsTableLoaded"
        label="To Optimistic"
        style="background : transparent !important; color : white !important;"
        @click="changeNetwork('optimistic')"
        class="change-network-button"
      >
        Optimistic
      </cv-header-global-action> -->

      <!-- <OneSignalNotificationButton /> -->
      <div class="theme-switcher" @click="switchTheme()">
        <template v-if="isDarkMode">
          <img src="@/assets/svg/light.svg" alt="Light mode" width="16" />
        </template>
        <template v-else>
          <img src="@/assets/svg/moon.svg" alt="Dark mode" width="16" />
        </template>
      </div>
      <cv-header-global-action
        v-show="isConnected == false && core.net.number && !updating"
        class="connect-wallet-header-button normal"
        label="Connect wallet"
        @click.prevent="connect()"
      >
        <div class="connect-wallet-button-wrapper">Connect Wallet</div>
      </cv-header-global-action>
      <div
        v-show="updating"
        class="connect-wallet-header-button loading normal"
      >
        <cv-inline-loading
          state="loading"
          :loading-text="walletConnectingText"
          class="icon-loading"
        >
        </cv-inline-loading>
      </div>
      <div
        v-show="!updating && isConnected == true && getIsTableLoaded"
        class="connected-dropdown wallet"
      >
        <img :src="metamaskSVG" class="metamask-img" />
        <cv-dropdown
          v-model="dropDown"
          :placeholder="abbreviateAddress"
          @change="dropdownWallet"
        >
          <cv-dropdown-item value="changeWallet">
            Change Wallet
          </cv-dropdown-item>
          <cv-dropdown-item value="copyAddress">
            Copy Address
          </cv-dropdown-item>
          <cv-dropdown-item value="viewExplorer">
            View on Explorer
          </cv-dropdown-item>
          <cv-dropdown-item value="disConnect"> Disconnect </cv-dropdown-item>
        </cv-dropdown>
      </div>
      <cv-header-global-action
        class="connect-wallet-side-home-button"
        label="App switcher"
        @click.prevent="goHome()"
      >
        <AppSwitcher32 />
      </cv-header-global-action>
    </template>
  </cv-header>
</template>

<script>
import { AppSwitcher32 } from "@carbon/icons-vue";
import OneSignalNotificationButton from "@/components/OneSignalNotificationButton";
import METAMASK_SVG from "../../assets/svg/metamask.svg";
import WALLET_SVG from "../../assets/svg/wallet.svg";
import COPY_SVG from "../../assets/svg/copy.svg";
import LAUNCH_SVG from "../../assets/svg/launch-secondary.svg";
import { mapActions, mapGetters } from "vuex";
import { networkInfos } from "../../constants";

const MILLION = 1;
const THOUSAND = 2;
const PERCENT = 3;

export default {
  name: "Header",
  components: {
    AppSwitcher32,
    OneSignalNotificationButton,
  },
  props: {
    isDarkMode: { type: Boolean },
    onThemeSwitch: { type: Function, default: () => {} },
  },
  data() {
    return {
      isConnect: true,
      isConnected: false,
      isUnreadNotifications: false,
      walletConnectingText: "Loading...",
      connectBtnLabel: "Connet Wallet",
      networkBtnLabel: "",
      network: "",
      core: this.$parent.$root.core,
      net: this.$parent.$root.net,
      utils: this.$parent.$root.core.web3.utils,
      dataTable: {},
      dropDown: "Connet Wallet",
      metamaskSVG: METAMASK_SVG,
      walletSVG: WALLET_SVG,
      copySVG: COPY_SVG,
      launchSVG: LAUNCH_SVG,
    };
  },
  watch: {},
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    // Current address abbreviation func
    abbreviateAddress() {
      if (this.core.accounts.length == 0) return "Connecting";
      /* return 'test'; */
      let address = this.core.accounts[0];
      return (
        address.substring(0, 5) +
        "..." +
        address.substring(
          address.length - (address.length - 38),
          address.length
        )
      );
    },
    ...mapGetters({
      getDataTable: "DataTable/getDataTable",
      getLoading: "DataTable/getLoading",
      updating: "DataTable/getUpdating",
      getIsTableLoaded: "DataTable/getIsTableLoaded",
      getIsConnected: "DataTable/getIsConnected",
      getIsInitializedPresigined: "DataTable/getIsInitializedPresigined",
    }),
  },
  async mounted() {
    if (window.ethereum) {
      window.ethereum.on("networkChanged", async (networkId) => {
        // whenever network has changed.
        let net = {};
        Object.assign(
          net,
          networkInfos[networkId] ? networkInfos[networkId] : {}
        );
        // console.log(net.name, this.network);
        if (net.name == this.network) return;

        // update vuex & core
        // Initialize the network value on store as current selected one
        if (net.name) {
          // console.log("network is changing to", net.name);
          // console.log(this.net.name, net.name);
          this.setUpdating(true);
          if (this.getIsConnected) await this.disConnect();
          await this.changeNetwork(net.name, false);
        } else {
          // console.log(net);
          if (this.getIsConnected) await this.disConnect();
          this.setNetwork({ ...net });
          this.core.net = {};
          // Object.assign(this.core.net, net);
          this.net = {};
          // Object.assign(this.net, net);
          this.network = net.name;

          // console.log("we are here for unavailable network");
          // Set store flag values as false since it's not initialized
          this.setIsInitialLoaded(false);
          this.setIsTableLoaded(false);

          this.setLoading({
            endingText: "Ending...",
            errorText: "Error.",
            loadingText: "Sorry, we do not support current network",
            loadedText: "",
            state: "loading",
            progress: true,
          });
        }
      });
    }

    // Set network state value with current selected network.
    window.addEventListener("click", this.removeBlurEffect);

    await this.fetchVisorStatsData();
    // this.core.visorStatsData = await this.core.fetchSummary();
    // this.core.apy_percent = (
    //   parseFloat(this.core.visorStatsData.feeStatsStakingApy) * 100
    // ).toFixed(0);

    await this.initialData();
  },
  methods: {
    // Using set functions on Vuex
    ...mapActions({
      setErrorInfo: "NotificationInfo/setErrorInfo",
      setSuccessInfo: "NotificationInfo/setSuccessInfo",
      setDataTable: "DataTable/setDataTable",
      setDataTableByDefault: "DataTable/setDataTableByDefault",
      setFilteredData: "DataTable/setFilteredData",
      setExpandedData: "DataTable/setExpandedData",
      setLoading: "DataTable/setLoading",
      setUpdating: "DataTable/setUpdating",
      setToggleButton: "DataTable/setToggleButton",
      setMultipleVisors: "DataTable/setMultipleVisors",
      setIsLoading: "DataTable/setIsLoading",
      setIsInitialLoaded: "DataTable/setIsInitialLoaded",
      setEtherscanVisorLink: "DataTable/setEtherscanVisorLink",
      setNetwork: "Network/setNetwork",
      setIsTableLoaded: "DataTable/setIsTableLoaded",
      setIsConnected: "DataTable/setIsConnected",
      setGammaStats: "GammaState/setGammaStats",
      setGammaStakingApy: "GammaState/setGammaStakingApy",
      setIsVisorStatsLoading: "GammaState/setIsVisorStatsLoading",
      setIsInitializedPresigined: "DataTable/setIsInitializedPresigined",
    }),
    async initialData() {
      switch (this.core.net.number) {
        case 1:
          this.network = "mainnet";
          break;
        case 42161:
          this.network = "arbitrum";
          break;
        case 10:
          this.network = "optimistic";
          break;
      }

      // Initialize the network value on store as current selected one
      this.setNetwork({ ...this.core.net });

      // Set store flag values as false since it's not initialized
      this.setIsInitialLoaded(false);
      this.setIsTableLoaded(false);

      // Connect network on header
      if (this.core.net.name) {
        await this.connectNetwork();
      } else {
        this.setLoading({
          endingText: "Ending...",
          errorText: "Error.",
          loadingText: "Sorry, we do not support current network",
          loadedText: "",
          state: "loading",
          progress: true,
        });
      }
    },
    removeBlurEffect() {
      if (
        !document.querySelector(".bn-onboard-custom.bn-onboard-modal-content")
      ) {
        document.querySelector("#app").classList.remove("blur");
      }
    },

    // Watch network is changed or not
    networkCheck() {
      console.log(this.core.web4);
      if (
        this.updating == true &&
        (this.getIsConnected || this.getIsTableLoaded)
      ) {
        console.log("we can now change the network");
      } else {
        console.log("we can not now change the network");
      }
    },
    // Connect Network function
    async connectNetwork() {
      this.setUpdating(false);

      // Datatable initialization on vuex store.
      let dataTable = {};
      Object.assign(dataTable, this.getDataTable);

      this.$set(dataTable, "data", this.core.tableData);
      dataTable.pagination.numberOfItems = dataTable.data.length;

      this.setDataTable(dataTable);
      // When the app is not connected to any wallet.
      if (!this.core.states.is_connected) {
        // Get previous selected wallet name
        let previousSelectedWallet = window.localStorage.getItem(
          "visorSelectedWallet"
        );
        // Connect with storage variable
        if (previousSelectedWallet && this.core.keepSignin) {
          this.setErrorInfo({
            visible: true,
            copy: "Connecting Wallet",
            description: "Connecting with the previous wallet",
          });

          if (!this.core.nonUser) await this.core.preSignin();

          // Connect Wallet
          await this.connect(previousSelectedWallet);
        } else {
          // this.setErrorInfo({
          //   visible: true,
          //   copy: "Connect Your Wallet",
          //   description: "",
          // });
        }
      }
      // Table Data is initialized.
      this.setIsInitialLoaded(true);
      await this.loadTableData();
    },
    // Reload the table data on initializing
    async loadTableData() {
      // this.isLoading = false;
      this.setIsLoading(false);

      let dataTable = {};
      Object.assign(dataTable, this.getDataTable);
      this.$set(dataTable, "data", this.core.tableData);
      dataTable.pagination.numberOfItems = dataTable.data.length;

      this.setUpdating(true);

      await this.updateNonLPRows();
      await this.updateLPRows();

      let amount = await this.core.getUserVaultBalance();
      this.setFilteredData({
        filterValue: this.filterValue,
        sortBy: this.sortBy,
        amount: amount,
      });

      // dataTable.title = "Mint your NFT Vault";
      // dataTable.helperText = "Click on ‘Mint NFT Vault’ to get started";

      // check messages
      if (this.core.msg.type != "empty") {
        this.core.msg.type = "empty";
        if (this.core.msg.type == "success")
          this.setSuccessInfo({
            copy: this.core.msg.copy,
            description: this.core.msg.description,
            visible: true,
          });
        else
          this.setErrorInfo({
            copy: this.core.msg.copy,
            description: this.core.msg.description,
            visible: true,
          });
      }

      if (this.$route.query.vault) this.override = this.$route.query.vault;

      let initialize = this.$router.currentRoute.fullPath.indexOf("staking");
      await this.core.preSignin(initialize == -1);
      this.setIsInitializedPresigined(initialize == -1);
      await this.updateLPRows();

      // Set filteredData & expandedData onto store with current state
      let expandedDataTemp = await this.core.getExpandedData(dataTable);
      this.setDataTable(dataTable);
      this.setExpandedData(expandedDataTemp);

      this.setUpdating(false);
      this.setIsTableLoaded(true);

      // console.log("the Table Data is ready");
    },

    // When we change another network to connect
    async changeNetwork(netname = "mainnet", force = true) {
      let net = {};
      let original = this.net.name;

      // Abort when app is loading data or connecting to network
      if (netname == original) return;
      // Set net value with netname
      switch (netname) {
        case "mainnet":
          Object.assign(net, networkInfos[1]);
          this.network = "mainnet";
          break;
        case "arbitrum":
          Object.assign(net, networkInfos[42161]);
          this.network = "arbitrum";
          break;
        case "optimistic":
          Object.assign(net, networkInfos[10]);
          this.network = "optimistic";
          break;
      }

      // Set both net values as new net inform
      // Object.assign(this.core.net, net);
      Object.assign(this.net, net);

      // Core change Network function call
      let result = null;
      if (force) result = await this.core.changeNetwork();

      if (result || !force) {
        this.isConnected = false;
        this.setLoading({
          endingText: "Ending...",
          errorText: "Error.",
          loadingText: "Loading...",
          loadedText: "Complete.",
          state: "loading",
          progress: true,
        });
        this.setSuccessInfo({
          visible: true,
          copy: `Changing the network to ${this.network}`,
          description: this.network,
        });
        Object.assign(this.core.net, net);
        Object.assign(this.net, net);
        // If network is changed
        this.core.onBoardInitialize();

        // Set Vuex store variables with change states
        this.setNetwork({ ...net });
        this.setIsInitialLoaded(false);

        // Initialize the core data with original
        this.core.initializeCoreData();

        // Re presignin with new network
        await this.core.preSignin();
        // Set Vuex Store DataTable, FilteredData, ExpandedData initialize
        this.setDataTableByDefault();
        this.setFilteredData([]);
        this.setExpandedData({});
        this.setUpdating(false);
        this.setIsLoading(true);
        this.setToggleButton("Loading");
        this.setMultipleVisors(false);

        this.setIsInitialLoaded(true);
        this.setSuccessInfo({
          visible: true,
          copy: `Successfully Changed to `,
          description: this.network,
        });
        // Connect network with new network values
        await this.connectNetwork();
      } else {
        this.setErrorInfo({
          visible: true,
          copy: `Error on Changed to `,
          description: this.network,
        });
        this.network = original;
      }
    },
    login() {
      this.$store.commit("login");
    },

    // Clear all msg
    clearMessages() {
      this.setSuccessInfo({
        visible: false,
        copy: "",
        description: "",
      });
      this.setErrorInfo({
        visible: false,
        copy: "",
        description: "",
      });
      this.header = "";
      this.subHeader = "";
      this.visible = false;
    },

    // Connect the wallet
    async connect(previousSelectedWallet = null) {
      this.walletConnectingText = "Connecting...";
      this.isConnect = true;
      if (this.isConnected == true) return;
      this.clearMessages();

      this.setUpdating(true);
      this.isConnected = true;
      this.connectBtnLabel = "Connecting...";
      this.core.states.is_pending = true;
      setTimeout(this.styleConnectWalletModal, 400);

      if (!this.getIsInitializedPresigined) {
        console.log("presigning");
        let dataTable = {};
        Object.assign(dataTable, this.getDataTable);
        this.$set(dataTable, "data", this.core.tableData);
        dataTable.pagination.numberOfItems = dataTable.data.length;

        this.setIsTableLoaded(false);
        await this.core.initializingDashboard(true);
        this.setIsInitializedPresigined(true);
        await this.updateLPRows();

        // Set filteredData & expandedData onto store with current state
        let expandedDataTemp = await this.core.getExpandedData(dataTable);
        this.setDataTable(dataTable);
        this.setExpandedData(expandedDataTemp);
        this.setIsTableLoaded(true);
      }

      console.log("!!!! Connect wallet !!!!");

      // Core connect with null previousSelectedWallet

      this.setEtherscanVisorLink(
        "https://etherscan.io/address/" + this.core.crucible._address
      );

      let connected = await this.core.connect(
        this.override,
        previousSelectedWallet,
        true
      );

      console.log("the core connect is done");
      // Connected
      if (connected) {
        this.removeBlurEffect();
        this.isConnected = true;
        this.setErrorInfo({
          visible: false,
          copy: "",
          desscription: "",
        });
        this.setSuccessInfo({
          visible: true,
          copy: "Wallet Connected",
          description: "loading data",
        });

        setTimeout(() => {
          // this.successInfo.visible = false;
          this.setSuccessInfo({
            visible: false,
            copy: "",
            description: "",
          });
        }, 4500);

        this.connectBtnLabel = this.abbreviateAddress;

        // The case that user has vault
        if (this.core.states.is_holder) {
          console.log(
            "since you are holder so plz wait for a while for initializing"
          );
          this.setEtherscanVisorLink(
            "https://etherscan.io/address/" + this.core.crucible._address
          );

          this.setDataTable({
            ...this.getDataTable,
            data: this.core.tableData,
            title: "Uniswap Hypervisors",
            helperText:
              "Below are all the pending or active pools and rewards programs",
          });
          this.setLoading({
            ...this.getLoading,
            state: "loaded",
          });
          if (this.core.net.name != "arbitrum") {
            await this.updateNonLPRows();
            await this.updateLPRows();
          }

          let amount = await this.core.getUserVaultBalance();
          this.setFilteredData({
            filterValue: this.filterValue,
            sortBy: this.sortBy,
            amount: amount,
          });

          this.setLoading({
            ...this.getLoading,
            updating: true,
          });
          // this.setToggleButton("Loading");
          // this.toggleButton = "Loading";
          // this.updating = false;
          this.setLoading({
            ...this.getLoading,
            updating: false,
          });

          let redeemStatus = 1; //await this.core.redeem.methods.redeemed(this.core.accounts[0]).call();

          if (
            redeemStatus == 0 &&
            !localStorage.getItem("7674986315390430016243974230")
          ) {
            this.core.states.redeem = false; //true;
          }
          // if (this.core.states.legacy) {
          // }
          if (this.core.crucibles.length > 1) {
            // this.multiple_visors = true;
            this.setMultipleVisors(true);
          }
          // this.toggleButton = "Stake VISR";
          // this.setToggleButton("Stake VISR");
          console.log("Holder thing is done");
        } else {
          //   "Click on ‘Mint NFT Vault’ to get started";
          this.setDataTable({
            ...this.getDataTable,
            data: this.core.tableData,
            title: "View list of Positions",
            helperText: "",
          });
          if (this.core.net.name != "arbitrum") {
            await this.updateNonLPRows();
            await this.updateLPRows();
          }

          let amount = await this.core.getUserVaultBalance();
          this.setFilteredData({
            filterValue: this.filterValue,
            sortBy: this.sortBy,
            amount: amount,
          });

          await this.updateAPYs();
          // this.updating = false;
          this.setLoading({
            ...this.getLoading,
            updating: false,
          });
        }
        this.setIsConnected(true);
      } else {
        // Error
        this.setLoading({
          ...this.getLoading,
          updating: false,
        });
        this.setErrorInfo({
          visible: true,
          copy: "Connect Your Wallet",
          description: "There was an error connecting your wallet",
        });
        this.isConnected = false;
        this.connectBtnLabel = "Connect Wallet";
        this.setIsConnected(false);
      }
      this.setUpdating(false);
      console.log("Loading Completion");
    },
    async updateNonLPRows() {
      const arraysOfPromises = this.core.tableData.map(async (row) => {
        if (row && !this.core.isLP(row[0])) {
          await this.updateRow(row[0]);
          await this.updateAPY(row[0]);
        }
      });
      await Promise.all(arraysOfPromises);
    },
    async updateLPRows() {
      for (let i = 0; i < this.core.uniswapv3.pairs.length; i++) {
        await this.updateRow(
          this.core.translateWETH(this.core.uniswapv3.pairs[i], true)
        );
        await this.updateAPY(
          this.core.translateWETH(this.core.uniswapv3.pairs[i], true)
        );
      }
    },
    async updateRow(aludel) {
      if (!this.core.tokens[aludel]) return;
      let dec = this.core.tokens[aludel]._address
        ? await this.core.tokens[aludel].methods.decimals().call()
        : 18;

      if (aludel == "GAMMA" || aludel == "xGAMMA") {
        //id not lp or visr-eth
        let balLocked = await this.core.tokens[aludel].methods
          .balanceOf(this.core.accounts[0])
          .call();

        if (aludel == "GAMMA") {
          if (this.core.BN(balLocked).gt(this.core.BN("1000000000000000000")))
            this.toggleButton = "Migrate GAMMA";
          else this.toggleButton = "Stake GAMMA";
        }
        this.setToggleButton(this.toggleButton);

        let depositString = this.core.amountFormatter(balLocked, dec);
        this.core.updateTable(aludel, "deposit", depositString); //fake decimals

        if (aludel == "xGAMMA") {
          //update current value
          if (balLocked.toString() != "0") {
            // console.log("balLocked ", balLocked.toString());
            // console.log("ratio ", this.core.rewardsRatio.toString());
            let reward = this.core
              .BN(balLocked)
              .times(this.core.BN(this.core.rewardsRatio))
              .toFixed(0);
            // console.log(reward, reward.toString());

            // console.log(rewardFormattedDex, rewardFormattedDex.toString());
            let rewardString = this.core.amountFormatter(reward, dec);
            this.core.updateTable(aludel, "reward", rewardString);
          }
        }

        return "-";
      }
      if (this.core.isLP(aludel)) {
        // lp
        let bal = 0;
        let pairInWeth = this.core.translateWETH(aludel);
        if (!this.core.states.is_holder) {
          if (
            // pairInWeth == SPECIAL_PAIR &&
            this.core.accounts[0]
          ) {
            let hype = this.core.uniswapv3.hypes[pairInWeth].hype;
            bal = await hype.methods.balanceOf(this.core.accounts[0]).call();
          } else return;
        } else {
          // if (pairInWeth == SPECIAL_PAIR) {
          let hype = this.core.uniswapv3.hypes[pairInWeth].hype;
          //bal = await hype.methods.balanceOf(this.core.accounts[0]).call();
          bal = this.core.uniswapv3.hypes[pairInWeth].shares;
          // } else {
          //   bal = await this.core.uniswapv3.hypes[
          //     this.core.translateWETH(aludel)
          //   ].hype.methods
          //     .balanceOf(this.core.crucible._address)
          //     .call();
          // }
          // console.log(bal, aludel, this.core.uniswapv3.hypes[pairInWeth]);
        }
        bal = bal ? bal : 0;
        console.log(bal, pairInWeth);

        let amountFormatted = this.core
          .BN(bal.toString())
          .div(
            this.core
              .BN(10)
              .pow(
                this.core.BN(
                  this.core.uniswapv3.hypes[this.core.translateWETH(aludel)]
                    .decimals1
                )
              )
          )
          .toFixed(2);

        this.core.updateTable(aludel, "deposit", amountFormatted);
        await this.core.updateUserLP(this.core.translateWETH(aludel));
        this.core.updateTable(
          aludel,
          "reward",
          "$" +
            this.core.uniswapv3.hypes[this.core.translateWETH(aludel)]["value"]
        );

        return "-";
      }

      if (!this.core.crucible.methods) return;
      let balLocked = await this.core.crucible.methods
        .getBalanceLocked(this.core.tokens[aludel]._address)
        .call();

      let depositString = this.core.amountFormatter(balLocked, dec);
      this.core.updateTable(aludel, "deposit", depositString);

      let currentReward = await this.core.aludels[aludel].methods
        .getCurrentVaultReward(this.core.crucible._address)
        .call();
      let formattedReward = parseFloat(
        this.core.ethers.utils.formatEther(currentReward, { commify: true })
      ).toFixed(2);
      this.core.updateTable(aludel, "reward", formattedReward);
    },
    async updateAPY(aludel) {
      this.core.updateTable(aludel, "apy", "-");
    },
    async updateAPYs() {
      for (let i = 0; i < this.core.tableData.length; i++) {
        let aludel = this.core.tableData[i][0];
        if (
          aludel == "VISR-ETH" ||
          aludel == "DAI" ||
          aludel == "USDT" ||
          aludel == "USDC"
        ) {
          await this.updateAPY(aludel);
        }
      }
    },
    addCommas(nStr) {
      nStr += "";
      var x = nStr.split(".");
      var x1 = x[0];
      var x2 = x.length > 1 ? "." + x[1] : "";
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
      return x1 + x2;
    },
    actionUserAvatar() {},
    actionAppSwitcher() {},
    goHome() {
      if (this.currentRouteName !== "") {
        this.$router.push({ name: "Homepage" }).catch(() => {});
      }
    },
    goDash() {
      if (this.currentRouteName !== "LoremTable") {
        this.$router.push({ name: "Dashboard" }).catch(() => {});
      }
    },
    goStakeVISR() {
      this.$router.push({ name: "Visr" }).catch(() => {});
    },
    gpStrategies() {
      this.$router.push({ name: "Strategy" }).catch(() => {});
    },
    goHowItWorks() {
      window.open("https://medium.com/visorfinance", "_blank");
    },
    goAnalytics() {
      this.$router
        .push({
          // name: "VisorProtocolOverview"
          name: "PERP-ETH",
        })
        .catch(() => {});
    },
    goMigrate() {
      this.$router
        .push({
          name: "Migrate",
        })
        .catch(() => {});
    },
    goVaultDetails() {
      this.$router
        .push({
          name: "VaultDetail",
        })
        .catch(() => {});
    },
    goBackTest() {
      this.$router
        .push({
          name: "Backtest",
        })
        .catch(() => {});
    },
    readNotification() {},
    switchTheme() {
      this.onThemeSwitch(!this.isDarkMode);
    },

    // Handle the chain change state
    async dropdownChain(value) {
      switch (value) {
        case "mainnet":
          await this.changeNetwork("mainnet");
          return;
        case "arbitrum":
          await this.changeNetwork("arbitrum");
          return;
        case "optimistic":
          await this.changeNetwork("optimistic");
          return;
      }
    },
    // Handle the dropdown change state
    async dropdownWallet(value) {
      switch (value) {
        case "changeWallet":
          await this.changeWallet();
          break;
        case "copyAddress":
          await this.copyAddress();
          break;
        case "viewExplorer":
          this.viewExplorer();
          break;
        case "disConnect":
          await this.disConnect();
          break;
      }

      this.dropDown = this.abbreviateAddress;
    },

    // Change thw wallet
    async changeWallet() {
      this.dropDown = this.abbreviateAddress;
      let previousSelectedWallet = window.localStorage.getItem(
        "visorSelectedWallet"
      );
      setTimeout(() => this.styleConnectWalletModal(true), 400);
      await this.core.connect(true, previousSelectedWallet, true);
    },

    // Copy the user wallet address
    copyAddress() {
      const clipboardData = window.clipboardData || navigator.clipboard;
      clipboardData.writeText(this.core.accounts[0]);
    },

    // View explorer for individual network
    viewExplorer() {
      this.dropDown = this.abbreviateAddress;
      setTimeout(
        () =>
          window.open(
            `${this.core.net.explorer}/address/${this.core.accounts[0]}`,
            "_blank"
          ),
        500
      );
    },

    // Disconnect function
    async disConnect() {
      this.walletConnectingText = "Disconnecting...";
      this.isConnect = false;
      this.setIsInitialLoaded(false);
      this.setIsTableLoaded(false);
      this.setIsConnected(false);
      let net = this.core.net;
      this.setErrorInfo({
        visible: true,
        copy: `Disconnect the wallet`,
        description: this.network,
      });

      this.setLoading({
        endingText: "Ending...",
        errorText: "Error.",
        loadingText: "Loading...",
        loadedText: "Complete.",
        state: "loading",
        progress: true,
      });

      this.core.onBoardInitialize();
      this.setNetwork({ ...net });
      this.setIsInitialLoaded(false);
      this.core.initializeCoreData();
      // await this.core.preSignin();

      this.setDataTableByDefault();
      this.setFilteredData([]);
      this.setExpandedData({});
      this.setUpdating(false);
      this.setIsLoading(true);
      this.setToggleButton("Loading");
      this.setMultipleVisors(false);

      this.setIsInitialLoaded(true);
      this.setSuccessInfo({
        visible: true,
        copy: `Successfully Disconnected`,
        description: "",
      });

      await this.connectNetwork();

      this.isConnected = false;
    },

    //Visor State Data
    async fetchVisorStatsData() {
      this.setIsVisorStatsLoading(true);
      await fetch("https://visordata-o9v9w.ondigitalocean.app/dashboard")
        .then((response) => response.json())
        .then((visorStats) => {
          this.setGammaStats(this.core.formatVisorStats(visorStats));
          this.setGammaStakingApy(
            Math.round(visorStats.feeStatsStakingApy * 100 * 100) / 100
          );

          this.core.visorStatsData = visorStats;
          this.core.apy_percent = (
            parseFloat(this.core.visorStatsData.feeStatsStakingApy) * 100
          ).toFixed(0);

          this.isVisorStatsLoading = false;
          this.setIsVisorStatsLoading(false);

          // console.log("visor state data is ready");
        })
        .catch((err) => {
          this.setIsVisorStatsLoading(false);
          // console.log(err);
        });
    },

    // Format Visor state
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
    styleConnectWalletModal(isChangeWallet = false) {
      const walletExplanation = document.querySelector(
        ".bn-onboard-custom.bn-onboard-select-wallet-info"
      );
      walletExplanation.click();
      document.querySelector(
        ".bn-onboard-custom.bn-onboard-select-info-container"
      ).style.display = "none";

      if (isChangeWallet) {
        const addressBar = `
          <div class="wallet-address-bar">
            <img src="${this.walletSVG}" alt="wallet icon" class="wallet-icon" />
            ${this.abbreviateAddress}
            <button class="icon copy">
              <img src="${this.copySVG}" alt="copy icon" />
              <span class="tooltiptext">Copy Address</span>
            </button>
            <a href="https://etherscan.io/address/${this.core.accounts[0]}" target="_blank" class="icon">
              <img src="${this.launchSVG}" alt="launch icon" />
              <span class="tooltiptext">View Etherscan</span>
            </a>
          </div>`;

        const placeholder = document.createElement("div");
        placeholder.innerHTML = addressBar;
        const addressBarHTML = placeholder.firstElementChild;

        document
          .querySelector(".bn-onboard-custom.bn-onboard-modal-content-header")
          .after(addressBarHTML);

        document
          .querySelector(".wallet-address-bar button.copy")
          .addEventListener("click", this.copyAddress);
      }

      if (
        document.querySelector(
          ".bn-onboard-custom.bn-onboard-modal-select-wallets button.bn-onboard-selected-wallet"
        )
      ) {
        const selectItem = document.querySelector(
          ".bn-onboard-custom.bn-onboard-modal-select-wallets button.bn-onboard-selected-wallet"
        ).parentElement;
        // console.log(".");

        selectItem.classList.add("selected-wallet-item");
      }
      document.querySelector("#app").classList.add("blur");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/assets/css/layout.scss";
@import "@/assets/css/main-theme.scss";

.navbar {
  .connect-wallet-button {
    margin-right: 10px !important;
    padding-right: 10px !important;
    padding-left: 15px !important;
    width: 150px !important;
    display: flex;
    align-items: center;

    .connet-btn-icon {
      width: 20px;
      height: 20px;
      margin-left: 10px;
    }
  }

  .green-circle {
    height: 8px;
    width: 8px;
    background-color: #ff0038;
    border-radius: 4px;
    margin-right: 12px;
    margin-bottom: 3px;
  }
  .red-circle {
    height: 8px;
    width: 8px;
    background-color: #fa4d56;
    border-radius: 4px;
    margin-right: 12px;
  }
}

.bn-onboard-custom.bn-onboard-dark-mode {
  background: $ui-05 !important;
  color: #ffffff;
}

.bn-onboard-custom.bn-onboard-modal-content {
  font-family: "IBM Plex Sans";
  background: $ui-05 !important;
  width: 400px;
}
.bn-onboard-custom.bn-onboard-modal-header {
  background: $ui-05 !important;
}
.bn-onboard-custom.bn-onboard-modal-content-header-heading {
  background: $ui-05 !important;
}
.bn-onboard-custom.bn-onboard-select-description {
  background: $ui-05 !important;
}
.bn-onboard-custom.bn-onboard-modal-select-wallets {
  margin: 0 !important;
  background: $ui-05 !important;
  li {
    width: 46%;
    margin: 0 0.5rem 15px 0.5rem;

    &.selected-wallet-item {
      .bn-onboard-custom.bn-onboard-icon-button {
        background: $interactive-02 !important;
      }
    }

    span {
      width: auto;
      margin: 10px 0;
      i {
        display: none;
      }
    }
  }
}

.bn-onboard-custom.bn-onboard-icon-button {
  background: #262626 !important;
  border-radius: 0;
  width: 100%;
  padding: 40px 15px;
  margin: 0;
  flex-direction: column;
  &:hover {
    background: $interactive-02 !important;
  }
}
.bn-onboard-custom.bn-onboard-modal-selected-wallet {
  background: $ui-05 !important;
}
.bn-onboard-custom.bn-onboard-prepare-button {
  background: $ui-05 !important;
}
.bn-onboard-custom.bn-onboard-dark-mode-background {
  background: #161616 !important;
  display: none;
}
.onboard-dark-mode-background {
  background: #161616 !important;
}
.bn-onboard-custom.bn-onboard-select-wallet-definition {
  margin: 0 !important;
  a {
    color: #ff0038;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.wallet-address-bar {
  margin: 0 12px;
  padding: 0.5rem 1rem;
  background: #262626;
  display: flex;
  align-items: center;

  .wallet-icon {
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  .icon {
    border-radius: 50%;
    min-height: auto;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &:hover {
      background: $interactive-02;
      cursor: pointer;
    }

    .tooltiptext {
      visibility: hidden;
      width: 120px;
      background-color: $interactive-02;
      color: #fff;
      text-align: center;
      border-radius: 10px;
      padding: 5px 0;

      /* Position the tooltip */
      position: absolute;
      z-index: 1;
      top: 36px;
      font-size: 13.3333px;
      line-height: normal;
    }

    &:hover .tooltiptext {
      visibility: visible;
    }

    &.copy {
      margin-left: 1rem;
    }
  }
}
</style>
