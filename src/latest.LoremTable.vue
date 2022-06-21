<template>
  <div class="lorem-table-page" :class="{ loading: isLoading }">
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
      <div class="lorem-table-page-inner">
        <cv-toast-notification
          v-if="errorInfo.visible"
          kind="info"
          class="error"
          :title="errorInfo.copy"
          :sub-title="errorInfo.description"
          :close-aria-label="errorInfo.closeAriaLabel"
          :low-contrast="false"
          @close="doCloseNotification"
        />
        <cv-toast-notification
          v-if="successInfo.visible"
          kind="success"
          class="success"
          :title="successInfo.copy"
          :sub-title="successInfo.description"
          :close-aria-label="successInfo.closeAriaLabel"
          :low-contrast="false"
          @close="doCloseNotification"
        />
        <Notification
          :type="type"
          :header="header"
          :sub-header="subHeader"
          :visible="visible"
          class="notification-container"
        />
        <cv-data-table
          v-if="dataTable.data.length > 0 && !updating"
          ref="table"
          v-model="rowSelects"
          :row-size="dataTable.rowSize"
          :auto-width="dataTable.autoWidth"
          :sortable="dataTable.sortable"
          :title="dataTable.title"
          :action-bar-aria-label="dataTable.actionBarAriaLabel"
          :batch-cancel-label="dataTable.batchCancelLabel"
          :zebra="dataTable.zebra"
          :columns="dataTable.columns"
          :pagination="false"
          :overflow-menu="dataTable.overflowMenu"
          :helper-text="dataTable.helperText"
          :data="filteredData"
          @row-select-change="actionRowSelectChange"
          @sort="onSort"
          @overflow-menu-click="onOverflowMenuClick"
        >
          <template v-if="dataTable.use_actions" slot="actions">
            <div
              @click="connect()"
              v-if="!core.states.is_connected"
              class="gray-button"
            >
              Connect Wallet
              <b-icon-plus />
            </div>
            <div v-if="core.states.is_connected" class="active-column">
              <div @click="switchVault" class="green-circle" />

              <a
                :href="etherscanVisorLink"
                target="_blank"
                style="text-decoration: none; color: white"
              >
                {{ abbreviateAddress }}
              </a>
            </div>
            <div
              @click="mintNFT()"
              v-if="core.states.is_connected && core.states.is_pending"
              class="regular-button"
            >
              Loading
              <b-icon-plus />
            </div>
            <div
              @click="mintNFT()"
              v-if="
                core.states.is_connected &&
                !core.states.is_holder &&
                !core.states.is_pending
              "
              class="regular-button"
            >
              Mint NFT Vault
              <b-icon-plus />
            </div>

            <div
              v-if="
                core.states.is_connected &&
                core.states.is_holder &&
                !core.states.redeem &&
                core.states.legacy
              "
              class="regular-button"
              @click="migrate"
            >
              Upgrade NFT Vault
              <b-icon-check />
            </div>
            <div
              v-if="
                core.states.is_connected &&
                core.states.is_holder &&
                !core.states.redeem &&
                !core.states.legacy
              "
              class="regular-button"
            >
              NFT Vault Minted
              <b-icon-check />
            </div>
            <div
              @click="redeemGas()"
              v-if="
                core.states.is_connected &&
                core.states.is_holder &&
                core.states.redeem
              "
              class="regular-button"
            >
              Redeem Gas Subsidy
              <b-icon-plus />
            </div>
          </template>
          <template slot="data">
            <cv-data-table-row
              v-for="(row, rowIndex) in filteredData"
              :key="`${rowIndex}`"
              :value="`${rowIndex}`"
            >
              <cv-data-table-cell>
                <div @click="selectRow($event, rowIndex)">
                  <cv-checkbox
                    :checked="selects[rowIndex]"
                    :hide-label="true"
                    :value="`value-${rowIndex}`"
                  />
                </div>
              </cv-data-table-cell>
              <cv-data-table-cell>
                <div @click="selectRow($event, rowIndex)">
                  {{ row[0] }}
                </div>
              </cv-data-table-cell>
              <cv-data-table-cell>
                <div @click="selectRow($event, rowIndex)">
                  {{ row[1] }}
                </div>
              </cv-data-table-cell>
              <cv-data-table-cell>
                <div @click="selectRow($event, rowIndex)">
                  {{ row[2] }}
                </div>
              </cv-data-table-cell>
              <cv-data-table-cell>
                <div @click="selectRow($event, rowIndex)">
                  {{ row[3] }}
                </div>
              </cv-data-table-cell>
              <cv-data-table-cell>
                <div @click="selectRow($event, rowIndex)">
                  {{ row[4] }}
                  <div />
                </div>
              </cv-data-table-cell>
              <cv-data-table-cell>
                <div
                  v-if="row[5] === 'Active'"
                  class="active-column"
                  @click="selectRow($event, rowIndex)"
                >
                  <div class="green-circle" />
                  <span>{{ row[5] }}</span>
                </div>
                <div
                  v-else
                  class="active-column"
                  @click="selectRow($event, rowIndex)"
                >
                  <div class="empty-circle" />
                  <span>{{ row[5] }}</span>
                </div>
              </cv-data-table-cell>
            </cv-data-table-row>
          </template>
          <template v-if="dataTable.use_actions && isLogin" slot="actions">
            <div class="active-column">
              <div class="green-circle" />
              {{ abbreviateAddress(core.accounts[0]) }}
            </div>
            <div class="regular-button">
              NFT Vault Minted
              <b-icon-plus />
            </div>
          </template>
          <template v-if="dataTable.use_batchActions" slot="batch-actions">
            <!-- <cv-button @click="onDeleteRow">
              Delete
              <TrashCan16 class="bx--btn__icon" />
            </cv-button> -->
            <cv-button @click="save()">
              Vault Deposit
              <RowExpand32 class="bx--btn__icon" />
            </cv-button>
            <cv-button @click="download()">
              Vault Withdraw
              <RowCollapse32 class="bx--btn__icon" />
            </cv-button>
          </template>
        </cv-data-table>

        <cv-data-table-skeleton
          v-if="dataTable.data.length < 1 || updating"
          :columns="dataTable.columns"
          :rows="skeletonRows"
          :title="dataTable.title"
          :helper-text="dataTable.helperText"
        >
          <template v-if="dataTable.use_actions" slot="actions">
            <div
              @click="connect()"
              v-if="!core.states.is_connected"
              class="gray-button"
            >
              Connect Wallet
              <b-icon-plus />
            </div>
            <div v-if="core.states.is_connected" class="active-column">
              <div class="green-circle" />
              <a
                :href="etherscanVisorLink"
                target="_blank"
                style="text-decoration: none; color: white"
              >
                {{ abbreviateAddress }}
              </a>
            </div>
            <div
              @click="mintNFT()"
              v-if="core.states.is_connected && !core.states.is_holder"
              class="regular-button"
            >
              Mint NFT Vault
              <b-icon-plus />
            </div>
            <div
              v-if="core.states.is_connected && core.states.is_holder"
              class="regular-button"
            >
              NFT Vault Minted
              <b-icon-check />
            </div>
          </template>
        </cv-data-table-skeleton>
      </div>
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
        <h2>Approve {{ activeAludel }}</h2>
        <p>
          By clicking Submit you approve {{ this.activeAludel }} for deposit
        </p>
      </template>
      <template v-if="progress.initialStep === 1" slot="content">
        <h2>Depositing {{ activeAludel }}</h2>
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
        <h2>Unstaking {{ activeAludel }}</h2>
        <p>
          Type in the number below that you want to unstake from the Rewards
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
        <div class="bx--form-item number">
          <!-- 
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
           <div class="v-line" />
          <cv-button
            kind="primary"
            size=""
            class="plus"
            @click="downloadPlus()"
          >
            +
          </cv-button>
          -->
        </div>
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button"> Submit </template>
    </cv-modal>
    <cv-modal
      ref="modalMigrate"
      :size="modal.size"
      :primary-button-disabled="false"
      :visible="false"
      :auto-hide-off="true"
      @primary-click="submitMigrate"
      @secondary-click="closeMigrate"
    >
      <template slot="title">
        <cv-progress
          :initial-step="modalProgress.initialStep"
          :steps="modalProgress.steps"
          :vertical="modalProgress.vertical"
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
        <h2>Unstaking {{ activeAludel }}</h2>
        <p>
          Type in the number below that you want to unstake from the Rewards
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
        <div class="bx--form-item number">
          <!-- 
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
           <div class="v-line" />
          <cv-button
            kind="primary"
            size=""
            class="plus"
            @click="downloadPlus()"
          >
            +
          </cv-button>
          -->
        </div>
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button"> Submit </template>
    </cv-modal>
  </div>
</template>

<script>
// @ is an alias to /src

import sampleData from "../assets/sampleData";
import { mapState } from "vuex";
import Notification from "@/components/shared/notification";
import RowExpand32 from "@carbon/icons-vue/es/row--expand/32";
import RowCollapse32 from "@carbon/icons-vue/es/row--collapse/32";

export default {
  name: "LoremTable",
  components: {
    Notification,
    RowExpand32,
    RowCollapse32,
  },
  data() {
    return {
      core: this.$parent.$root.core,
      utils: this.$parent.$root.core.web3.utils,
      isLoading: false,
      loading: {
        endingText: "Ending...",
        errorText: "Error.",
        loadingText: "Loading...",
        loadedText: "Complete.",
        state: "loading",
      },
      dataTable: {
        rowSize: "",
        autoWidth: false,
        sortable: false,
        title: "Connect your Web3 Wallet",
        actionBarAriaLabel: "",
        batchCancelLabel: "Cancel",
        zebra: false,
        overFlowMenu: ["Start", "Stop", "Delete 3", { label: "Overflow menu" }],
        columns: [
          "Asset Name",
          "Your Deposit",
          "Max Deposit",
          "VISR Earned",
          "Current Pool APY",
          "Status",
        ],
        data: [],
        use_actions: true,
        use_batchActions: true,
        helperText: "There are multiple wallets to choose from",
        skeletonRows: 4,
      },
      skeletonRows: 4,
      rowSelects: [],
      modal: {
        closeAriaLabel: "Close",
        size: "",
      },
      modalDownload: {
        visible: false,
      },
      modelProgram: "",
      modelNumber: "1",
      modelDownloadNumber: "1",
      modalMigrate: {
        visible: false,
      },
      type: "loading",
      header: "Loading notification",
      subHeader: "Roius abnta mod tempor",
      visible: false,
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
      selects: [],
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
      header: "Loading notification",
      subHeader: "Roius abnta mod tempor",
      visible: false,
      type: "loading",
      contains: "text",
      link: "",
      permitSig: false,
      permissionLockSig: false,
      permissionUnlockSig: false,
      deadline: 0,
      nonce: 0,
      activeAludel: false,
      updating: false,
      etherscanVisor: false,
      etherscanVisorLink: "",
      visorSelect: "",
      override: false,
    };
  },
  computed: {
    ...mapState(["isLogin"]),
    abbreviateAddress() {
      if (this.core.accounts.length == 0) return "";
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
    filteredData() {
      let filteredData;
      if (this.filterValue) {
        const regex = new RegExp(this.filterValue, "i");
        filteredData = this.internalData.filter((item) => {
          return item.join("|").search(regex) >= 0;
        });
      } else {
        filteredData = this.dataTable.data;
      }
      return filteredData;
    },
  },
  mounted() {
    this.isLoading = false;
    this.dataTable.data = this.core.tableData;
    if (!this.core.states.is_connected) {
      this.errorInfo.copy = "Connect Your Wallet";
      this.errorInfo.visible = true;
    } else {
      if (this.core.states.is_holder) {
        this.dataTable.data = this.core.tableData;
        this.loading.state = "loaded";
        this.dataTable.title = "Rewards Programs";
        this.dataTable.helperText =
          "Below are all the pending or active rewards programs";
      } else {
        this.dataTable.title = "Mint your NFT Vault";
        this.dataTable.helperText = "Click on ‘Mint NFT Vault’ to get started";
      }
    }
    if (this.$route.query.vault) {
      this.override = this.$route.query.vault;
    }
  },
  methods: {
    onSort() {},
    async connect() {
      this.clearMessages();
      let connected = await this.core.connect(this.override);
      if (connected) {
        //console.log('connected');
        this.errorInfo.visible = false;
        this.successInfo.copy = "Wallet Connected";
        this.successInfo.description = "loading data";
        this.successInfo.visible = true;
        setTimeout(() => {
          this.successInfo.visible = false;
        }, 4500);
        if (this.core.states.is_holder) {
          this.etherscanVisorLink =
            "https://etherscan.io/address/" + this.core.crucible._address;
          this.dataTable.data = this.core.tableData;
          this.loading.state = "loaded";
          this.dataTable.title = "Rewards Programs";
          this.dataTable.helperText =
            "Below are all the pending or active reward’s programs";
          this.updating = true;
          await this.updateAll();
          this.updating = false;
          setInterval(async () => {
            await this.updateAll();
          }, 60000);
          let redeemStatus = await this.core.redeem.methods
            .redeemed(this.core.accounts[0])
            .call();
          //console.log(redeemStatus);
          if (this.core.states.legacy) {
            this.dataTable.title = "Migrate to Visor 2.0";
            this.dataTable.helperText = "Click on ‘Migrate’ to get started";
          }

          if (
            redeemStatus == 0 &&
            !localStorage.getItem("7674986315390430016243974230")
          ) {
            this.core.states.redeem = false; //true;
          }
        } else {
          this.dataTable.title = "Mint your NFT Vault";
          this.dataTable.helperText =
            "Click on ‘Mint NFT Vault’ to get started";
          await this.updateAPYs();
        }
      } else {
        this.errorInfo.copy = "Connect Your Wallet";
        this.errorInfo.description =
          "There was an error connecting your wallet";
        this.errorInfo.visible = true;
      }
    },
    async migrate() {
      await this.core.tallyBalances();
      for (let i = 0; i < this.core.tallies.length; i++) {
        if (parseInt(this.core.tallies[i].balance) > 0) {
          if (this.core.tallies[i].locked > 0) {
            console.log(this.core.tallies[i]);
            //show unstake for this asset
            this.activeAludel = this.core.tallies[i].asset;
            this.$refs.modalMigrate.show();
            return;
          }
        }
      }
    },
    async submitMigrate() {},
    async closeMigrate() {
      this.$refs.modalMigrate.hide();
    },
    async switchVault() {
      if (this.core.crucibles.length > 1) {
        //console.log('switchVault');
        await this.core.nextNFT();
        this.updating = true;
        await this.updateAll();
        this.updating = false;
      }
    },
    redeemGas() {
      this.clearMessages();
      this.core.redeem.methods
        .redeem()
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.header = "Redeeming your AMPL gas subsidy ";
          this.subHeader = txHash;
          this.type = "loading";
          this.link = "https://etherscan.io/tx/" + txHash;
          this.contains = "link";
          this.visible = true;

          this.core.pollTx(
            txHash,
            "redeem",
            (block) => {
              this.header = "Success ";
              this.subHeader = "AMPL subsidy redeemed  " + block;
              this.type = "success";
              localStorage.setItem("7674986315390430016243974230", "1434523");
              setTimeout(() => {
                this.visible = false;
              }, 4000);
              this.core.states.redeem = false;
            },
            (err) => {
              this.clearMessages();
              this.errorInfo.copy = err.message;
              this.errorInfo.visible = true;
              //console.log(err);
            }
          );
        })
        .on("error", (err) => {
          //console.log("ERROR ", err);
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["redeem"]);
        });
    },
    mintNFT() {
      this.clearMessages();
      this.core.crucibleFactory.methods
        .create()
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.header = "Minting your NFT Vault ";
          this.subHeader = txHash;
          this.type = "loading";
          this.link = "https://etherscan.io/tx/" + txHash;
          this.contains = "link";
          this.visible = true;
          this.core.pollTx(
            txHash,
            "mint",
            (block) => {
              this.header = "Success ";
              this.subHeader = "NFT Vault minted in block " + block;
              this.type = "success";
              setTimeout(() => {
                this.visible = false;
              }, 4000);
              this.core.getNFT().then((nft) => {
                this.core.initializeNFT(nft).then(() => {
                  this.core.states.is_holder = true;
                  this.dataTable.data = this.core.tableData;
                  this.loading.state = "loaded";
                  this.dataTable.title = "Rewards Programs";
                  this.dataTable.helperText =
                    "Below are all the pending or active reward’s programs";
                });
              });
            },
            (err) => {
              this.clearMessages();
              //console.log(err);
            }
          );
        })
        .on("error", (err) => {
          //console.log("ERROR ", err);
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["mint"]);
        });
    },
    approve() {
      this.clearMessages();
      this.loading.loadingText = "Approving...";
      this.core.tokens[this.activeAludel].methods
        .approve(this.core.transmuter._address, this.core.max)
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.core.pollTx(
            txHash,
            "approve",
            (block) => {
              this.isLoading = false;
              this.progress.loading = false;
              this.progress.initialStep++;
            },
            (err) => {
              this.clearMessages();
              this.errorInfo.copy = err.message;
              this.errorInfo.visible = true;
              //console.log(err);
              this.close();
            }
          );
        })
        .on("error", (err) => {
          //console.log("ERROR ", err);
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          this.close();
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["approve"]);
        });
    },
    async signLock() {
      this.loading.loadingText = "Staking...";
      let unitAmount = await this.getUnitAmount(this.modelNumber);

      const permission = await this.core.signPermissionLock(
        this.core.crucible._address,
        this.core.signer,
        this.core.aludels[this.activeAludel]._address,
        this.core.tokens[this.activeAludel]._address,
        unitAmount
      );

      this.core.transmuter.methods
        .stake(
          this.core.aludels[this.activeAludel]._address,
          this.core.crucible._address,
          unitAmount,
          permission
        )
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.core.pollTx(
            txHash,
            "lock",
            async (block) => {
              this.isLoading = false;
              this.progress.loading = false;
              this.progress.initialStep++;
              this.successInfo.copy = "Success ";
              this.successInfo.description =
                "Staked to " + this.activeAludel + " Hypervisor in " + block;
              this.successInfo.visible = true;
              this.close();

              await this.updateRow(this.activeAludel);
              setTimeout(() => {
                this.successInfo.visible = false;
              }, 4000);
            },
            (err) => {
              this.clearMessages();
              //console.log(err);
              this.close();
            }
          );
        })
        .on("error", (err) => {
          //console.log("ERROR ", err);
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
        this.core.aludels[this.activeAludel]._address,
        this.core.tokens[this.activeAludel]._address,
        unitAmount
      );

      this.core.aludels[this.activeAludel].methods
        .unstakeAndClaim(this.core.crucible._address, unitAmount, permission)
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.core.pollTx(
            txHash,
            "unlock",
            async (block) => {
              this.isLoading = false;
              this.progress.loading = false;
              this.progress.initialStep++;
              this.successInfo.copy = "Success ";
              this.successInfo.description =
                "Unstaked from " +
                this.activeAludel +
                " Hypervisor in " +
                block;
              this.successInfo.visible = true;
              this.downloadProgress.initialStep++;
              this.downloadProgress.step1 = true;
              await this.updateRow(this.activeAludel);
              setTimeout(() => {
                this.successInfo.visible = false;
              }, 4000);
            },
            (err) => {
              this.clearMessages();
              //console.log(err);
              this.close();
            }
          );
        })
        .on("error", (err) => {
          //console.log("ERROR ", err);
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
    async transferERC20() {
      this.loading.loadingText = "Transfering...";

      let balUnlocked = await this.getBalanceUnlocked(this.activeAludel);
      //console.log(balUnlocked, balUnlocked.toString());

      await this.core.crucible.methods
        .transferERC20(
          this.core.tokens[this.activeAludel]._address,
          this.core.accounts[0],
          balUnlocked
        )
        .send({ from: this.core.accounts[0] }, (err, txHash) => {
          //console.log(txHash);
          this.core.pollTx(
            txHash,
            "transfer",
            async (block) => {
              this.isLoading = false;
              this.progress.loading = false;
              this.progress.initialStep++;
              //console.log('transfer success');
              this.successInfo.copy = "Success ";

              let formattedBalance = await this.prettyPrintAmount(
                this.activeAludel,
                balUnlocked
              );
              this.successInfo.description =
                "Retrieved " +
                formattedBalance +
                " " +
                this.activeAludel +
                " in " +
                block;
              this.successInfo.visible = true;
              this.close();

              setTimeout(() => {
                this.successInfo.visible = false;
              }, 4000);

              //console.log('transfer success');
            },
            (err) => {
              this.clearMessages();
              //console.log(err);
              this.close();
            }
          );
        })
        .on("error", (err) => {
          //console.log("ERROR ", err);
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          this.close();
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["transfer"]);
        });
    },
    async getBalanceUnlocked(aludel) {
      let balLocked = await this.core.crucible.methods
        .getBalanceLocked(this.core.tokens[aludel]._address)
        .call();
      //console.log('bal locked ', balLocked.toString(), balLocked);
      let totalBalance = await this.core.tokens[aludel].methods
        .balanceOf(this.core.crucible._address)
        .call();
      //console.log('total bal ', totalBalance.toString(), totalBalance);
      let balUnlocked = this.core.web3.utils
        .toBN(totalBalance)
        .sub(this.core.web3.utils.toBN(balLocked));
      return balUnlocked;
    },
    async updateAll() {
      for (let i = 0; i < this.core.tableData.length; i++) {
        let aludel = this.core.tableData[i][0];
        //console.log('checking ',aludel);
        await this.updateRow(aludel);
        await this.updateAPY(aludel);
      }
    },
    async updateAPYs() {
      for (let i = 0; i < this.core.tableData.length; i++) {
        let aludel = this.core.tableData[i][0];
        await this.updateAPY(aludel);
      }
    },
    async updateAPY(aludel) {
      let visrPerc = this.core.web3.utils.toBN(
        Math.round(this.core.visrPrice * 100)
      );
      let dec = await this.core.tokens[aludel].methods.decimals().call();
      //let futureReward = await this.core.aludels[aludel].methods.getFutureVaultReward("0x675ACde86DffE354e175E7dCb95E71f9902477D7",1619354994).call();
      let futureReward = await this.core.aludels[aludel].methods
        .getFutureVaultReward(
          "0x675ACde86DffE354e175E7dCb95E71f9902477D7",
          1620597600
        )
        .call();
      let futureRewardDec;
      if (aludel == "USDC" || aludel == "USDT") {
        futureRewardDec = this.core.web3.utils
          .toBN(futureReward)
          .div(
            this.core.web3.utils.toBN(10).pow(this.core.web3.utils.toBN(18))
          );
        futureRewardDec = futureRewardDec
          .mul(this.core.web3.utils.toBN(visrPerc))
          .div(this.core.web3.utils.toBN(10));
      } else if (aludel == "DAI") {
        futureRewardDec = this.core.web3.utils
          .toBN(futureReward)
          .div(
            this.core.web3.utils.toBN(10).pow(this.core.web3.utils.toBN(dec))
          );
        futureRewardDec = futureRewardDec
          .mul(this.core.web3.utils.toBN(visrPerc))
          .div(this.core.web3.utils.toBN(10));
      } else {
        futureRewardDec = this.core.web3.utils
          .toBN(futureReward)
          .div(
            this.core.web3.utils.toBN(10).pow(this.core.web3.utils.toBN(dec))
          );
        futureRewardDec = futureRewardDec.div(this.core.web3.utils.toBN(7));
        //        futureRewardDec = futureRewardDec.mul(this.core.web3.utils.toBN(61)).div(this.core.web3.utils.toBN(100));
      }
      futureRewardDec = futureRewardDec.mul(this.core.web3.utils.toBN(12));
      //    console.log(aludel, balLockedFormatted.toString(), futureRewardDec.toString());

      this.core.updateTable(
        aludel,
        "apy",
        this.addCommas(futureRewardDec.toString())
      );
    },
    async updateRow(aludel) {
      let balLocked = await this.core.crucible.methods
        .getBalanceLocked(this.core.tokens[aludel]._address)
        .call();
      let dec = await this.core.tokens[aludel].methods.decimals().call();
      let balLockedFormatted = this.core.web3.utils
        .toBN(balLocked)
        .div(this.core.web3.utils.toBN(10).pow(this.core.web3.utils.toBN(dec)));

      this.core.updateTable(
        aludel,
        "deposit",
        balLockedFormatted.toString() + ".00"
      ); //fake decimals
      let currentReward = await this.core.aludels[aludel].methods
        .getCurrentVaultReward(this.core.crucible._address)
        .call();
      let formattedReward = parseFloat(
        this.core.ethers.utils.formatEther(currentReward, { commify: true })
      ).toFixed(2);
      //console.log('currentReward', currentReward, currentReward.tosTRINg(), formattedReward);
      this.core.updateTable(aludel, "reward", formattedReward);
    },
    async prettyPrintAmount(aludel, amount) {
      let dec = await this.core.tokens[aludel].methods.decimals().call();
      let amountFormatted = this.core.web3.utils
        .toBN(amount)
        .div(this.core.web3.utils.toBN(10).pow(this.core.web3.utils.toBN(dec)));
      return amountFormatted.toString();
    },
    async getUnitAmount(amount) {
      let decimals = await this.core.tokens[this.activeAludel].methods
        .decimals()
        .call();
      //console.log('decimals ', decimals, decimals.toString());
      let unitAmount = this.core.ethers.utils.parseUnits(amount, decimals);
      //console.log('unit amount ', unitAmount, unitAmount.toString());
      return unitAmount;
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
    async save() {
      if (this.activeAludel != "VISR-ETH") {
        return;
      }
      this.progress.initialStep = 0;
      await this.core.initializeAludel(this.activeAludel);
      await this.core.initializeStakingToken(this.activeAludel);

      //decide whether to show approve
      let allowance = await this.core.tokens[this.activeAludel].methods
        .allowance(this.core.accounts[0], this.core.transmuter._address)
        .call();
      if (allowance > this.core.web3.utils.toBN(0)) {
        this.progress.initialStep = 1;
        //console.log('already allowance ', allowance.toString());
      }
      this.$refs.modal.show();
    },
    async download() {
      this.downloadProgress.initialStep = 0;
      this.downloadProgress.step1 = false;
      await this.core.initializeAludel(this.activeAludel);
      await this.core.initializeStakingToken(this.activeAludel);

      let unlockedBalance = await this.getBalanceUnlocked(this.activeAludel);
      if (unlockedBalance > 0) {
        this.downloadProgress.initialStep = 1;
        this.downloadProgress.step1 = true;
      }
      this.$refs.modalDownload.show();
    },
    onBatchAction3() {},
    onOverflowMenuClick() {},
    actionRowSelectChange() {},
    doCloseNotification() {
      this.successInfo.visible = false;
      this.errorInfo.visible = false;
    },
    onNumberInput() {},
    async max() {
      let userBalance = await this.core.tokens[this.activeAludel].methods
        .balanceOf(this.core.accounts[0])
        .call();
      let formattedBalance = await this.prettyPrintAmount(
        this.activeAludel,
        userBalance
      );
      //console.log('balance ', userBalance, formattedBalance);

      this.modelNumber = formattedBalance; //this.core.maxStake.toString();
    },
    async downloadMax() {
      let balLocked = await this.core.crucible.methods
        .getBalanceLocked(this.core.tokens[this.activeAludel]._address)
        .call();

      let formattedBalance = await this.prettyPrintAmount(
        this.activeAludel,
        balLocked
      );

      this.modelDownloadNumber = formattedBalance;
    },
    plus() {
      this.modelNumber = `${++this.modelNumber}`;
    },
    downloadPlus() {
      this.modelDownloadNumber = `${++this.modelDownloadNumber}`;
    },
    minus() {
      this.modelNumber = `${--this.modelNumber}`;
    },
    downloadMinus() {
      this.modelDownloadNumber = `${--this.modelDownloadNumber}`;
    },
    selectRow(e, v) {
      this.activeAludel = this.dataTable.data[v][0];
      //console.log('index selected ', v, this.activeAludel);
      const i = this.rowSelects.indexOf(`${v}`);
      if (i > -1) {
        this.rowSelects = [];
        // this.rowSelects.splice(i, 1)
        for (let i = 0; i < this.dataTable.data.length; i++) {
          this.selects[i] = false;
        }
      } else {
        this.rowSelects = [];
        this.rowSelects.push(`${v}`);
        for (let i = 0; i < this.dataTable.data.length; i++) {
          this.selects[i] = false;
        }
        this.selects[v] = true;
      }
      e.preventDefault();
      e.stopPropagation();
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
      /*
      this.isLoading = true
      this.loading.loadingText = "Submiting..."
      this.loading.state = "loading"
      this.progress.loading = true
      setTimeout(() => {
        this.isLoading = false
        this.progress.loading = false
        if (this.downloadProgress.initialStep === 1) {
          this.$refs.modalDownload.hide()
        } else {
          this.downloadProgress.initialStep++
          this.downloadProgress.step1 = true
        }
      }, 1000)
*/
    },
    closeDownload() {
      this.$refs.modalDownload.hide();
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
  },
};
</script>

<style lang="scss">
.lorem-table-page {
  width: 100%;
  min-height: calc(100% - 81px);
  display: flex;
  align-items: center;
  &.loading {
    display: flex;
    align-items: center;
  }
  .lorem-page-loader {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 150px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9001;
    background-color: rgba(27, 27, 27, 0.6);
    .bx--inline-loading {
      &.progress {
        flex-direction: column;
        .bx--inline-loading__animation {
          width: 6.5rem;
          height: 6.5rem;
          .bx--loading {
            width: 6.5rem;
            height: 6.5rem;
          }
        }
      }
    }
    .bx--inline-loading__checkmark-container {
      fill: #ff0038;
    }
    .bx--inline-loading__text {
      color: #c6c6c6;
    }
  }
  .lorem-table-page-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .notification-container {
      width: 80%;
    }
    .cv-data-table {
      width: 80% !important;
      max-width: 1000px;
      @media screen and (max-width: 42rem) {
        width: 95% !important;
      }
      thead {
        tr {
          th.bx--table-column-checkbox {
            div {
              visibility: hidden;
            }
          }
        }
      }
      tbody {
        tr:hover {
          cursor: pointer;
        }
      }
    }
    .bx--data-table.bx--skeleton tbody tr {
      pointer-events: none;
    }
    .bx--data-table.bx--skeleton td {
      span {
        background: #353535;
        &::before {
          background: rgb(57, 57, 57);
        }
      }
    }
    .bx--batch-actions,
    .bx--batch-actions--active,
    .bx--action-list button,
    .bx--batch-summary__para span {
      background-color: #ff0038;
      color: #161616;
    }
    .bx--data-table-container {
      width: auto;
      overflow: auto;
      display: flex;
      flex-flow: column;
      flex-wrap: wrap;

      .bx--data-table-header {
        background: rgb(38 38 38);
        h4 {
          color: rgb(244 244 244);
        }
        p {
          color: rgb(197 197 197);
        }
      }
      .bx--table-toolbar {
        width: auto;
      }
    }
    .bx--table-toolbar {
      background: rgb(38 38 38);
    }
    .bx--data-table th {
      color: rgb(244 244 244);
      background-color: rgb(57 57 57);
    }
    .bx--data-table td,
    .bx--data-table tbody th {
      color: rgb(244 244 244);
      background: rgb(38 38 38);
      border: none;
    }
    .bx--data-table {
      td.bx--table-column-checkbox {
        display: none;
      }
    }
    .bx--checkbox-label::before {
      background-color: white;
      border: none;
    }
    .bx--checkbox-label::after {
      border-bottom: 2px solid black;
      border-left: 2px solid black;
    }
    .bx--checkbox:focus + .bx--checkbox-label::before,
    .bx--checkbox-label__focus::before,
    .bx--checkbox:checked:focus + .bx--checkbox-label::before,
    .bx--checkbox-label[data-contained-checkbox-state="true"].bx--checkbox-label__focus::before,
    .bx--checkbox:indeterminate:focus + .bx--checkbox-label::before,
    .bx--checkbox-label[data-contained-checkbox-state="mixed"].bx--checkbox-label__focus::before {
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 2px #fff;
    }
  }
  .cv-notifiation {
    width: 80%;
    margin-right: unset;
    // position: absolute;
    .bx--toast-notification__details {
      display: flex;
      align-items: center;
      h3,
      p {
        margin: 0;
      }
      h3 {
        margin-right: 10px;
      }
    }
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
}
.active-column {
  display: flex;
  align-items: center;
  color: #f4f4f4;
  padding-right: 8px;
  div {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin-right: 8px;
  }
  .green-circle {
    background-color: #ff0038;
  }
  .empty-circle {
    background-color: #ccc;
  }
}
.bx--modal {
  &.is-visible {
    background-color: rgba(22, 22, 22, 0.8);
    backdrop-filter: blur(2px);
  }
  .bx--modal-container {
    background-color: rgb(38, 38, 38);
    max-width: 500px;
    .bx--modal-header {
      margin-right: 0 !important;
      padding-right: 1rem !important;
      .bx--modal-header__heading {
        padding-top: 20px;
        color: rgb(244, 244, 244);
        .cv-progress {
          .cv-progress-step {
            flex: 1;
            svg {
              fill: #ff0038;
            }
            .bx--progress-line {
              width: 100%;
            }
            p {
              color: rgb(244, 244, 244);
              box-shadow: none;
            }
            &.bx--progress-step--incomplete {
              svg {
                fill: rgb(244, 244, 244);
              }
              .bx--progress-line {
                background-color: #e0e0e0;
              }
            }
            &.bx--progress-step--complete {
              .bx--progress-line {
                background-color: #ff0038;
              }
            }
            &.bx--progress-step--current {
              .bx--progress-line {
                background-color: #ff0038;
              }
            }
          }
        }
      }
      button {
        display: none;
      }
    }
    .bx--modal-content {
      overflow-y: unset;
      @media screen and (min-width: 42rem) {
        padding-right: 1rem;
      }
      color: rgb(244, 244, 244);
      h2 {
        font-size: 20px;
        margin: 10px 0;
      }
      p {
        font-size: 16px;
      }
      &:focus {
        outline: none;
      }
      .bx--form-item {
        position: relative;
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
            right: 55px;
            top: 45px;
            background-color: #393939 !important;
            color: #ff0038 !important;
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
            }
            &.minus {
              right: 28px;
            }
            &.plus {
              right: 0px;
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
          background-color: rgb(57, 57, 57);
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
              border-top: 1px solid rgb(57, 57, 57);
            }
            &:hover {
              background-color: rgb(53, 53, 53);
              a {
                color: rgb(244, 244, 244);
                border-bottom-color: rgb(53, 53, 53);
              }
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
    .bx--modal-footer {
      button {
        border: solid 1px transparent !important;
        box-shadow: unset !important;
      }
    }
  }
}

.bn-onboard-custom.bn-onboard-dark-mode {
  background: #2b2b2b !important;
  color: #ffffff;
}

.bn-onboard-custom.bn-onboard-modal-content {
  background: #2b2b2b !important;
}
.bn-onboard-custom.bn-onboard-modal-header {
  background: #2b2b2b !important;
}
.bn-onboard-custom.bn-onboard-modal-content-header-heading {
  background: #2b2b2b !important;
}
.bn-onboard-custom.bn-onboard-select-description {
  background: #2b2b2b !important;
}
.bn-onboard-custom.bn-onboard-modal-select-wallets {
  background: #2b2b2b !important;
}
.bn-onboard-custom.bn-onboard-icon-button {
  background: #2b2b2b !important;
}
.bn-onboard-custom.bn-onboard-modal-selected-wallet {
  background: #2b2b2b !important;
}
.bn-onboard-custom.bn-onboard-prepare-button {
  background: #2b2b2b !important;
}
.bn-onboard-custom.bn-onboard-dark-mode-background {
  background: #161616 !important;
}
.onboard-dark-mode-background {
  background: #161616 !important;
}

.bx--loading__stroke {
  stroke: #ff0038 !important;
  stroke-dashoffset: 40;
}
.page-header {
  width: 80%;
  max-width: 1000px;
  color: white;
  text-align: left;
  font-size: 25px;
  word-break: break-word;
  margin-top: 100px;
  margin-bottom: 30px;
}
</style>
