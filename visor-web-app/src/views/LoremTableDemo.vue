<template>
  <div class="lorem-table-page main-content" :class="{ loading: isLoading }">
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
        <div class="lorem-protocol-stats">
          <h4>Protocol Stats</h4>
          <cv-grid>
            <cv-row>
              <cv-column :md="2" :sm="2" :lg="3">
                <div class="stat-container">
                  <span class="sub-title">Total Value Locked</span>
                  <span class="title">
                    <template v-if="isGammaStatsLoading">
                      <cv-skeleton-text />
                    </template>
                    {{ gammaStats.uniswapPairTotalValueLocked }}
                  </span>
                </div>
              </cv-column>
              <cv-column :md="2" :sm="2" :lg="3">
                <div class="stat-container">
                  <span class="sub-title">Total Fees Accrued</span>
                  <span class="title">
                    <template v-if="isGammaStatsLoading">
                      <cv-skeleton-text />
                    </template>
                    {{ gammaStats.uniswapFeesGenerated }}
                  </span>
                </div>
              </cv-column>
              <cv-column :md="2" :sm="2" :lg="3">
                <div class="stat-container">
                  <span class="sub-title">Fee-Based APR</span>
                  <span class="title">
                    <template v-if="isGammaStatsLoading">
                      <cv-skeleton-text />
                    </template>
                    {{ gammaStats.uniswapFeesBasedApr }}
                  </span>
                </div>
              </cv-column>
              <cv-column :md="2" :sm="2" :lg="3">
                <div class="stat-container">
                  <span class="sub-title">Protocol Fees APY</span>
                  <span class="title">
                    <template v-if="isGammaStatsLoading">
                      <cv-skeleton-text />
                    </template>
                    <template v-else> {{ gammaStakingApy }}% </template>
                  </span>
                </div>
              </cv-column>
            </cv-row>
          </cv-grid>
        </div>

        <cv-toast-notification
          v-if="errorInfo.visible && !updating"
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
          search-label="Filter"
          search-placeholder="Search for a token symbol"
          search-clear-label="Clear filter"
          :expanding-search="false"
          :row-size="dataTable.rowSize"
          :auto-width="dataTable.autoWidth"
          :sortable="dataTable.sortable"
          :title="dataTable.title"
          :action-bar-aria-label="dataTable.actionBarAriaLabel"
          :batch-cancel-label="dataTable.batchCancelLabel"
          :zebra="dataTable.zebra"
          :overflow-menu="dataTable.overflowMenu"
          :helper-text="dataTable.helperText"
          :data="filteredData"
          :pagination="dataTable.pagination"
          @pagination="actionOnPagination"
          @row-select-change="actionRowSelectChange"
          @sort="onSort"
          @overflow-menu-click="onOverflowMenuClick"
          @search="actionOnFilter"
        >
          <template v-if="dataTable.use_actions" slot="actions">
            <!-- <div
              v-if="!core.states.is_connected && !updating"
              class="gray-button"
              @click="connect()"
            >
              Connect Wallet
              <b-icon-plus />
            </div>  -->
            <cv-data-table-action
              v-if="core.crucibles.length > 1"
              @click="switchVault"
            >
              <svg
                id="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <polygon
                  points="11.41 26.59 7.83 23 28 23 28 21 7.83 21 11.41 17.41 10 16 4 22 10 28 11.41 26.59"
                />
                <polygon
                  points="28 10 22 4 20.59 5.41 24.17 9 4 9 4 11 24.17 11 20.59 14.59 22 16 28 10"
                />
              </svg>
            </cv-data-table-action>
            <div
              v-if="core.states.is_connected"
              class="active-column temporary-hidden"
            >
              {{ core.version }}
            </div>
            <div v-if="core.states.is_connected" class="active-column">
              <div class="green-circle" @click="switchVault" />

              <a
                :href="etherscanVisorLink"
                target="_blank"
                class="active-column-visor-link"
              >
                {{ abbreviateAddressFunc(this.core.crucible._address) }}
              </a>
            </div>
            <div
              v-if="core.states.is_connected && core.states.is_pending"
              class="regular-button disabled"
              @click="mintNFT()"
            >
              Loading
              <Renew32 />
            </div>
            <!-- <div -->
            <!--   v-if=" -->
            <!--     core.states.is_connected && -->
            <!--     !core.states.is_holder && -->
            <!--     !core.states.is_pending -->
            <!--   " -->
            <!--   class="regular-button" -->
            <!--   @click="mintNFT()" -->
            <!-- > -->
            <!--   Mint NFT Vault -->
            <!--   <NewTab32 /> -->
            <!-- </div> -->
            <!-- <div -->
            <!--   v-if=" -->
            <!--     core.states.is_connected && -->
            <!--     core.states.is_holder && -->
            <!--     !core.states.redeem && -->
            <!--     core.states.legacy && -->
            <!--     !core.states.is_current -->
            <!--   " -->
            <!--   class="regular-button" -->
            <!--   @click="mintNFT()" -->
            <!-- > -->
            <!--   Upgrade NFT Vault -->
            <!--   <b-icon-plus /> -->
            <!-- </div> -->
            <div
              v-if="core.states.is_connected"
              class="regular-button"
              :class="{ disabled: toggleButton == 'Loading' }"
              @click="goStake()"
            >
              Stake Gamma
              <Renew32 v-if="toggleButton == 'Loading'" />
              <Growth32 v-if="toggleButton != 'Loading'" />
            </div>
            <!-- <div -->
            <!--   v-if=" -->
            <!--     core.states.is_connected && -->
            <!--     core.states.is_holder && -->
            <!--     core.states.redeem -->
            <!--   " -->
            <!--   class="regular-button" -->
            <!--   @click="redeemGas()" -->
            <!-- > -->
            <!--   Redeem Gas Subsidy -->
            <!--   <b-icon-plus /> -->
            <!-- </div> -->
          </template>

          <template slot="headings">
            <cv-data-table-heading
              v-for="(column, columnIndex) in dataTable.columns"
              :key="`${columnIndex}`"
              :sortable="column.sortable"
            >
              <template v-if="column.tip">
                <cv-tooltip
                  class="header-tooltip"
                  direction="top"
                  :tip="column.tip"
                >
                  {{ column.label }}
                </cv-tooltip>
              </template>
              <template v-else>
                {{ column.label }}
              </template>
            </cv-data-table-heading>
          </template>
          <template slot="data">
            <cv-data-table-row
              v-for="(row, rowIndex) in getFilteredData"
              v-show="
                core.net.name == 'mainnet' ||
                (row[0] != 'xGAMMA' && row[0] != 'GAMMA')
              "
              :key="`${rowIndex}`"
              :value="`${rowIndex}`"
            >
              <template v-if="row">
                <cv-data-table-cell>
                  <div @click="selectRow($event, rowIndex, row[0])">
                    <cv-radio-button
                      :checked="
                        selects[rowIndex + dataTable.pagination.start - 1]
                      "
                      :hide-label="true"
                      :value="`value-${rowIndex}`"
                    />
                  </div>
                </cv-data-table-cell>
                <cv-data-table-cell>
                  <div @click="selectRow($event, rowIndex, row[0])">
                    <img
                      v-if="
                        Boolean(
                          core.pairs[core.net.name][core.translateWETH(row[0])]
                        )
                      "
                      :src="
                        core.pairs[core.net.name][core.translateWETH(row[0])]
                          .icon
                      "
                    />
                    <img
                      v-if="row[0] === 'xGAMMA'"
                      src="@/assets/svg/xgamma.svg"
                    />
                    {{ formatVISR(row[0]) }}
                  </div>
                </cv-data-table-cell>
                <cv-data-table-cell>
                  <div @click="selectRow($event, rowIndex, row[0])">
                    {{ row[1] }}
                  </div>
                </cv-data-table-cell>
                <cv-data-table-cell>
                  <div @click="selectRow($event, rowIndex, row[0])">
                    <cv-tag :label="row[2]" />
                  </div>
                </cv-data-table-cell>
                <cv-data-table-cell>
                  <div @click="selectRow($event, rowIndex, row[0])">
                    {{ isConnected ? formatVISR(row[0]) == "ETH-ENS" ? '-' : row[3] : row[3] }}
                  </div>
                </cv-data-table-cell>
                <cv-data-table-cell>
                  <div @click="selectRow($event, rowIndex, row[0])">
                    <template v-if="isGammaStatsLoading && row[0] === 'xGAMMA'">
                      -
                    </template>
                    <template v-else>
                      {{ row[0] === "xGAMMA" ? `${gammaStakingApy}%` : row[4] }}
                    </template>
                  </div>
                </cv-data-table-cell>
                <cv-data-table-cell>
                  <div class="status-cell-inner-wrapper">
                    <div
                      v-if="
                        row[5] === 'Active' ||
                        row[5] == 'Whitelist' ||
                        row[5] == 'Open Beta' ||
                        row[5] == 'Fee Migration' ||
                        row[5] == 'Olympus Bond'
                      "
                      class="active-column"
                      @click="selectRow($event, rowIndex, row[0])"
                    >
                      <div class="green-circle" />
                      <span>{{ row[5] }}</span>
                    </div>
                    <div
                      v-if="row[5] === 'v1 Migration'"
                      class="active-column"
                      @click="selectRow($event, rowIndex, row[0])"
                    >
                      <div class="blue-circle" />
                      <span>{{ row[5] }}</span>
                    </div>
                    <div
                      v-if="row[5] === 'Private Beta'"
                      class="active-column"
                      @click="selectRow($event, rowIndex, row[0])"
                    >
                      <div class="green-circle" />
                      <span>{{ row[5] }}</span>
                    </div>
                    <div
                      v-if="row[5] === 'Inactive'"
                      class="active-column"
                      @click="selectRow($event, rowIndex, row[0])"
                    >
                      <div class="empty-circle" />
                      <span>{{ row[5] }}</span>
                    </div>
                  </div>
                </cv-data-table-cell>
                <cv-data-table-cell>
                  <div
                    class="chart-link"
                    :class="{ disabled: !hasAnalyticView(row[0]) }"
                    @click="analyticsViewClick(row[0])"
                  >
                    <ChartAverage24 />
                  </div>
                </cv-data-table-cell>
                <template slot="expandedContent">
                  <cv-grid v-if="expandedData[row[0]] && row[0] === 'xGAMMA'">
                    <cv-row>
                      <cv-column :sm="2">
                        <cv-grid>
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong> GAMMA per xGAMMA </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>
                                {{ expandedData[row[0]].visrPervVisr }}
                              </div>
                            </cv-column>
                          </cv-row>
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong> Total GAMMA Fees </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>
                                <!-- {{ expandedData[row[0]].feeCumulativeFeeUsd }} -->
                                -
                              </div>
                            </cv-column>
                          </cv-row>
                        </cv-grid>
                      </cv-column>
                      <cv-column :sm="2">
                        <cv-grid>
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong> Total GAMMA Staked </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>
                                {{
                                  isConnected
                                    ? row[1]
                                    : expandedData[row[0]].stakedAmount
                                }}
                              </div>
                            </cv-column>
                          </cv-row>
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong> Total GAMMA Staked USD </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>
                                {{
                                  isConnected
                                    ? row[3]
                                    : expandedData[row[0]].stakedUsdAmount
                                }}
                              </div>
                            </cv-column>
                          </cv-row>
                        </cv-grid>
                      </cv-column>
                    </cv-row>
                  </cv-grid>
                  <cv-grid v-if="expandedData[row[0]] && row[0] !== 'xGAMMA'">
                    <cv-row>
                      <cv-column :sm="2">
                        <cv-grid>
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong> TVL USD </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>
                                {{ expandedData[row[0]].tvl }}
                              </div>
                            </cv-column>
                          </cv-row>
                          <!-- <cv-row -->
                          <!--   v-if="row[0] != 'FLOAT-ETH'" -->
                          <!--   class="expand-content-item" -->
                          <!-- > -->
                          <!--   <cv-column :sm="2"> -->
                          <!--     <strong> Progressive Cap </strong> -->
                          <!--   </cv-column> -->
                          <!--   <cv-column :sm="2"> -->
                          <!--     <div>{{ expandedData[row[0]].perc }}%</div> -->
                          <!--   </cv-column> -->
                          <!-- </cv-row> -->
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong> Uni v3 Fee Tier </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>{{ expandedData[row[0]].fee }}%</div>
                            </cv-column>
                          </cv-row>

                          <!-- <cv-row v-if="row[0] != 'FLOAT-ETH'" class="expand-content-item" > -->
                          <!--   <cv-column :sm="2"> -->
                          <!--     <strong> -->
                          <!--       Max {{ expandedData[row[0]].label0 }} -->
                          <!--       Deposit -->
                          <!--     </strong> -->
                          <!--   </cv-column> -->
                          <!--   <cv-column :sm="2"> -->
                          <!--     <div> -->
                          <!--       {{ expandedData[row[0]].deposit0Max }} -->
                          <!--     </div> -->
                          <!--   </cv-column> -->
                          <!-- </cv-row> -->
                          <cv-row
                            v-if="row[0] != 'FLOAT-ETH'"
                            class="expand-content-item"
                          >
                            <cv-column :sm="2">
                              <strong> Max Deposit </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>$100,000</div>
                            </cv-column>
                          </cv-row>
                        </cv-grid>
                      </cv-column>
                      <cv-column :sm="2">
                        <cv-grid>
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong> Active LP Tokens </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>
                                {{
                                  core.uniswapv3.hypes[
                                    core.translateWETH(row[0])
                                  ]
                                    ? core.uniswapv3.hypes[
                                        core.translateWETH(row[0])
                                      ].shares
                                    : 0
                                }}
                              </div>
                            </cv-column>
                          </cv-row>
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong>
                                {{ expandedData[row[0]].label0 }}
                              </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>{{ expandedData[row[0]].balance0 }}%</div>
                            </cv-column>
                          </cv-row>
                          <cv-row class="expand-content-item">
                            <cv-column :sm="2">
                              <strong>
                                {{ expandedData[row[0]].label1 }}
                              </strong>
                            </cv-column>
                            <cv-column :sm="2">
                              <div>{{ expandedData[row[0]].balance1 }}%</div>
                            </cv-column>
                          </cv-row>
                          <!-- The Vault page link -->
                          <cv-row
                            v-show="!core.publish"
                            class="expand-content-item"
                          >
                            <cv-column :sm="2">
                              <a
                                style="text-decoration: underline"
                                @click="valutDetailClick(row[0])"
                              >
                                To Vault Details
                              </a>
                            </cv-column>
                          </cv-row>
                        </cv-grid>
                      </cv-column>
                    </cv-row>
                  </cv-grid>
                </template>
              </template>
            </cv-data-table-row>
          </template>

          <template v-if="dataTable.use_actions && isLogin" slot="actions">
            <div class="active-column">
              <div class="green-circle" />
              {{ abbreviateAddress(core.accounts[0]) }}
            </div>
            <div class="regular-button">
              NFT Vault Minted
              <b-icon-check />
            </div>
          </template>

          <template v-if="dataTable.use_batchActions" slot="batch-actions">
            <template v-if="core.states.is_connected">
              <!-- v-if="activeAludel == 'VISR' || activeAludel == 'ETH-USDT' || activeAludel == 'USDC-ETH' || activeAludel == 'DAI-ETH'" -->
              <cv-button
                v-if="
                  (core.states.is_holder && core.depositActive(activeAludel)) ||
                  (activeAludel == 'xGAMMA' && activeAludel != 'GAMMA') ||
                  (core.states.is_connected && isSpecialPair) ||
                  (core.states.is_connected && activeAludel == 'GAMMA-ETH')
                "
                class="normal"
                @click="save()"
              >
                {{
                  activeAludel == "xGAMMA"
                    ? "Stake GAMMA"
                    : isSpecialPair
                    ? "Get LP tokens"
                    : "Vault Deposit"
                }}
                <!-- <RowExpand32 class="bx--btn__icon" /> -->
              </cv-button>
              <!-- v-if="activeAludel != 'VISR' && activeAludel != 'ETH-USDT' && activeAludel != 'USDC-ETH' && activeAludel != 'DAI-ETH'" -->
              <cv-button
                v-if="
                  (((!core.states.is_holder && !isSpecialPair) ||
                    !core.depositActive(activeAludel) ||
                    activeAludel == 'GAMMA') &&
                    activeAludel != 'xGAMMA') ||
                  !core.states.is_connected
                "
                class="normal"
                disabled
                @click="save()"
              >
                {{
                  activeAludel == "xGAMMA"
                    ? "Stake GAMMA"
                    : isSpecialPair
                    ? "Get LP tokens"
                    : "Vault Deposit"
                }}
                <!-- <RowExpand32 class="bx--btn__icon" /> -->
              </cv-button>
              <cv-button
                v-if="
                  (core.states.is_holder &&
                    core.withdrawActive(activeAludel) &&
                    activeAludel != 'GAMMA') ||
                  (core.states.is_connected &&
                    (isSpecialPair || activeAludel === 'xGAMMA'))
                "
                class="normal"
                @click="download()"
              >
                {{
                  activeAludel == "xGAMMA"
                    ? "Withdraw GAMMA"
                    : isSpecialPair
                    ? "Redeem LP tokens"
                    : "Vault Withdraw"
                }}
                <!-- <RowCollapse32 class="bx--btn__icon" /> -->
              </cv-button>
              <cv-button
                v-if="
                  (!core.states.is_holder &&
                    !(isSpecialPair || activeAludel === 'xGAMMA')) ||
                  !core.withdrawActive(activeAludel) ||
                  activeAludel == 'GAMMA' ||
                  !core.states.is_connected
                "
                class="normal"
                disabled
                @click="download()"
              >
                {{
                  activeAludel == "xGAMMA"
                    ? "Withdraw GAMMA"
                    : isSpecialPair
                    ? "Redeem LP tokens"
                    : "Vault Withdraw"
                }}
                <!-- <RowCollapse32 class="bx--btn__icon" /> -->
              </cv-button>
            </template>
            <template v-else>
              <cv-button class="normal" @click="onConnectWallet()">
                Connect Wallet
              </cv-button>
            </template>
          </template>

          <template v-slot:items-selected="{}">
            {{ formatVISR(activeAludel) }} is selected
          </template>

          <template slot="range-text">
            {{ dataTable.pagination.start }}-{{
              dataTable.pagination.start + dataTable.pagination.pageSize - 1
            }}
            of {{ dataTable.pagination.numberOfItems }} pairs
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
            <!-- <div
              v-if="!core.states.is_connected && !updating"
              class="gray-button"
              @click="connect()"
            >
              Connect Wallet
              <b-icon-plus />
            </div> -->

            <div v-if="core.states.is_connected" class="active-column">
              GAMMA
            </div>

            <div v-if="core.states.is_connected" class="active-column">
              <div class="green-circle" />
              <a
                :href="etherscanVisorLink"
                target="_blank"
                class="active-column-visor-link"
              >
                {{ abbreviateAddress }}
              </a>
            </div>
            <!--
            <div
              v-if="core.states.is_connected && !core.states.is_holder && !core.states.is_pending"
              class="regular-button"
              @click="mintNFT()"
            >
              Mint NFT Vault
              <b-icon-plus />
            </div>
            -->
            <div
              v-if="core.states.is_connected && core.states.is_holder"
              class="regular-button disabled"
            >
              Loading
              <Renew32 />
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
        <h2>Approve {{ formatVISR(activeAludel) }}</h2>
        <p>
          By clicking Submit you approve {{ formatVISR(activeAludel) }} for
          deposit
        </p>
      </template>
      <template v-if="progress.initialStep === 1" slot="content">
        <h2>Depositing {{ formatVISR(activeAludel) }}</h2>
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
      :size="modal.size"
      :primary-button-disabled="false"
      :visible="withdrawMessageVisible"
      :auto-hide-off="true"
      @primary-click="withdrawalMessageProceed"
      @secondary-click="depositMessageCancel"
    >
      <template slot="label"> Alert </template>
      <template slot="title"> Active Withdrawal Migration </template>
      <template slot="content">
        <p>
          Limit and base position of this hypervisor have been merged.
          Depositors to ETH-ENS are advised to redeem their vETH-ENS to await
          migration to new ETH-ENS hypervisor
        </p>
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button"> Proceed </template>
    </cv-modal>

    <cv-modal
      :size="modal.size"
      :primary-button-disabled="false"
      :visible="depositMessageVisible"
      :auto-hide-off="true"
      @primary-click="depositMessageProceed"
      @secondary-click="depositMessageCancel"
    >
      <template slot="label"> Alert </template>
      <template slot="title"> Deposits Paused </template>
      <template slot="content">
        <p>
          This hypervisor is not currently accepting deposits

          <!-- Visor is migrating to a new dual deposit mechanism which will allow -->
          <!-- much higher deposits in a single transaction. New deposits will be -->
          <!-- suspended until the new deposit flow is completed. Withdraws function -->
          <!-- as normal. -->
        </p>
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button"> Proceed </template>
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
        <h2>Unstaking {{ formatVISR(activeAludel) }}</h2>
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
        GAMMA Finance Fee Distribution Withdrawal
      </template>
      <template v-if="downloadProgress.initialStep === 0" slot="content">
        <!-- <h2>Unstaking {{activeAludel}}</h2> -->
        <p>
          Choose the number of {{ formatVISR(activeAludel) }} that you want to
          unstake from GAMMA Finance fee distribution contract. Your withdraw
          will be your proportion of GAMMA tokens, not
          {{ formatVISR(activeAludel) }} tokens.
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
            label="Unstake and claim GAMMA based on (%)"
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
            <span class="amount-label" v-if="activeAludel == 'GAMMA'"
              >Amount of {{ formatVISR(activeAludel) }}</span
            >
            <span class="amount-label" v-if="activeAludel == 'xGAMMA'"
              >Amount of {{ formatVISR(activeAludel) }} you are unstaking</span
            >
            <span class="amount-value">
              {{ modelStakedNumber }} {{ formatVISR(activeAludel) }}
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
      <template slot="primary-button"> Unstake and claim GAMMA </template>
    </cv-modal>

    <cv-modal
      ref="modalLP"
      :size="modal.size"
      :primary-button-disabled="
        !(parseFloat(modelLPNumber) > 0) && vaultWalletSelected
      "
      :visible="false"
      :auto-hide-off="true"
      @primary-click="submitLP"
      @secondary-click="closeLP"
    >
      <template slot="title">
        {{ formatVISR(activeAludel) }} Hypervisor Withdrawal
      </template>

      <template slot="content">
        <template v-if="isSpecialPair && !vaultWalletSelected">
          <div class="bx--form-item dropdown">
            <cv-dropdown
              v-model="withdrawalMode"
              class="withdraw-mode-dropdown"
              :value="withdrawalMode"
              label="Withdraw Mode"
            >
              <cv-dropdown-item value="Wallet"> From Wallet </cv-dropdown-item>
              <cv-dropdown-item value="Vault"> From Vault </cv-dropdown-item>
            </cv-dropdown>
          </div>
        </template>
        <template v-else>
          <!-- <h2>Unstaking {{activeAludel}}</h2> -->
          <p>
            Use the slider to choose the percentage of shares that you want to
            withdraw from
            {{ formatVISR(activeAludel) }}
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
              min-label="0%"
              max-label="Max"
              @change="onLPPercentageChanged"
            >
            </cv-slider>
            <cv-text-input
              :value="lpNumberPercentage + '%'"
              class="slider-percentage-input"
            />
            <cv-link class="slider-max-button" @click="onMaxLpNumber">
              Max
            </cv-link>
          </div>
          <div class="slider-amount">
            <div class="amount-row">
              <span class="amount-label"
                >Amount of {{ activeAludel.split("-")[0] }}</span
              >
              <span class="amount-value">
                {{ lpBalance0 }}% {{ activeAludel.split("-")[0] }}
              </span>
            </div>
            <div class="amount-row">
              <span class="amount-label"
                >Amount of {{ activeAludel.split("-")[1] }}</span
              >
              <span class="amount-value">
                {{ lpBalance1 }}% {{ activeAludel.split("-")[1] }}
              </span>
            </div>
          </div>
        </template>
      </template>
      <template slot="secondary-button"> Cancel </template>
      <template slot="primary-button">
        {{ !vaultWalletSelected ? "Next" : "Withdraw" }}
      </template>
    </cv-modal>
  </div>
</template>

<script>
// @ is an alias to /src

import { mapState } from "vuex";
import Notification from "@/components/shared/notification";
import RowExpand32 from "@carbon/icons-vue/es/row--expand/32";
import RowCollapse32 from "@carbon/icons-vue/es/row--collapse/32";
import Renew32 from "@carbon/icons-vue/es/renew/32";
import NewTab32 from "@carbon/icons-vue/es/new-tab/32";
import { ChartAverage24, Growth32 } from "@carbon/icons-vue";
import { PairAnalyticItems, SPECIAL_PAIRS } from "@/constants";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "LoremTable",
  components: {
    Notification,
    RowExpand32,
    RowCollapse32,
    Renew32,
    NewTab32,
    Growth32,
    ChartAverage24,
  },
  data() {
    return {
      PairAnalyticItems: PairAnalyticItems,
      core: this.$parent.$root.core,
      hypes: this.$parent.$root.core.uniswapv3.hypes,
      utils: this.$parent.$root.core.web3.utils,
      isLoading: false,
      vaultWalletSelected: false,
      withdrawalMode: "Wallet",
      loading: {
        endingText: "Ending...",
        errorText: "Error.",
        loadingText: "Loading...",
        loadedText: "Complete.",
        state: "loading",
      },
      dataTable: {},
      itemSelected: "",
      skeletonRows: 5,
      rowSelects: [],
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
      modelProgram: "",
      modelNumber: "1",
      modelDownloadNumber: "1",
      modelStakedNumber: "0",
      stackedNumberPercentage: "0",
      lpNumberPercentage: "0",
      lpBalance0: "0",
      lpBalance1: "0",
      modelLPNumber: "0",
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
      contains: "text",
      link: "",
      permitSig: false,
      permissionLockSig: false,
      permissionUnlockSig: false,
      deadline: 0,
      nonce: 0,
      activeAludel: "USDT-ETH",
      etherscanVisor: false,
      etherscanVisorLink: "",
      depositMessageVisible: false,
      withdrawMessageVisible: false,
      visorSelect: "",
      override: false,
      toggleButton: "Stake GAMMA",
      filterValue: "",
      sortBy: null,
      filteredData: [],
    };
  },
  computed: {
    successInfoVisible() {
      return this.successInfo.visible;
    },
    errorInfoVisible() {
      return this.errorInfo.visible;
    },
    ...mapState(["isLogin"]),
    properAddress() {
      let depositAddress = this.core.crucible._address;

      if (this.isSpecialPair) {
        depositAddress =
          this.withdrawalMode == "Wallet"
            ? this.core.accounts[0]
            : this.core.crucible._address;
      }

      return depositAddress;
    },
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
    page() {
      return Math.floor(
        (this.dataTable.pagination.start - 1) /
          this.dataTable.pagination.pageSize
      );
    },
    isSpecialPair() {
      return SPECIAL_PAIRS.includes(this.core.translateWETH(this.activeAludel));
      //return true;
    },

    ...mapGetters({
      getDataTable: "DataTable/getDataTable",
      getFilteredData: "DataTable/getFilteredData",
      expandedData: "DataTable/getExpandedData",
      getLoading: "DataTable/getLoading",
      updating: "DataTable/getUpdating",
      getIsTableLoaded: "DataTable/getIsTableLoaded",
      getToggleButton: "DataTable/getToggleButton",
      multiple_visors: "DataTable/getMultipleVisors",
      gammaStats: "GammaState/getGammaStats",
      gammaStakingApy: "GammaState/getGammaStakingApy",
      isGammaStatsLoading: "GammaState/getIsGammaStatsLoading",
      getEtherscanVisorLink: "DataTable/getEtherscanVisorLink",
      isConnected: "DataTable/getIsConnected",
      getIsInitializedPresigined: "DataTable/getIsInitializedPresigined",
    }),
  },
  // Watch any change from state or vuex
  watch: {
    successInfoVisible() {
      this.errorInfo.visible = this.successInfo.visible
        ? false
        : this.errorInfo.visible;
    },
    errorInfoVisible() {
      this.successInfo.visible = this.errorInfo.visible
        ? false
        : this.successInfo.visible;
    },
    "$store.state.NotificationInfo.errorInfo": {
      immediate: true,
      deep: true,
      handler() {
        Object.assign(
          this.errorInfo,
          this.$store.state.NotificationInfo.errorInfo
        );
      },
    },
    "$store.state.NotificationInfo.successInfo": {
      immediate: true,
      deep: true,
      handler() {
        Object.assign(
          this.successInfo,
          this.$store.state.NotificationInfo.successInfo
        );
      },
    },
    "$store.state.DataTable.etherscanVisorLink": {
      immediate: true,
      deep: true,
      handler() {
        this.etherscanVisorLink =
          this.$store.state.DataTable.etherscanVisorLink;
      },
    },
    "$store.state.DataTable.toggleButton": {
      immediate: true,
      deep: true,
      handler() {
        this.toggleButton = this.$store.state.DataTable.toggleButton;
      },
    },
    "$store.state.DataTable.dataTable": {
      immediate: true,
      deep: true,
      async handler() {
        Object.assign(this.dataTable, this.$store.state.DataTable.dataTable);
        let amount = await this.core.getUserVaultBalance();
        this.setFilteredData({
          filterValue: this.filterValue,
          sortBy: this.sortBy,
          amount: amount,
        });

        let expandedData = await this.core.getExpandedData(this.dataTable);
        this.setExpandedData(expandedData);
      },
    },
    "$store.state.DataTable.filteredData": {
      immediate: true,
      deep: true,
      handler() {
        Object.assign(
          this.filteredData,
          this.$store.state.DataTable.filteredData
        );
      },
    },
    "$store.state.DataTable.loading": {
      immediate: true,
      deep: true,
      handler() {
        let loading = this.$store.state.DataTable.loading;
        Object.assign(this.loading, loading);
        if (loading.progress) this.progress.loading = true;
      },
    },
    "$store.state.Notifications.isLoading": {
      immediate: true,
      deep: true,
      handler() {
        this.isLoading = this.$store.state.DataTable.isLoading;
      },
    },
    "$store.state.DataTable.isInitialLoaded": {
      immediate: true,
      deep: true,
      async handler() {
        if (this.$store.state.DataTable.isInitialLoaded) this.isLoading = false;
        else this.isLoading = true;
      },
    },
  },
  async mounted() {
    // When presignin initializeV3 is not done.
    if (!this.getIsInitializedPresigined) {
      let dataTable = {};
      Object.assign(dataTable, this.getDataTable);
      this.$set(dataTable, "data", this.core.tableData);
      dataTable.pagination.numberOfItems = dataTable.data.length;

      this.setUpdating(true);
      this.setIsTableLoaded(false);
      await this.core.initializingDashboard(true);
      this.setIsInitializedPresigined(true);
      await this.updateLPRows();

      // Set filteredData & expandedData onto store with current state
      let expandedDataTemp = await this.core.getExpandedData(dataTable);
      this.setDataTable(dataTable);
      this.setExpandedData(expandedDataTemp);
      this.setUpdating(false);
      this.setIsTableLoaded(true);
    }

    if (!this.updating && this.getIsTableLoaded) {
      let curPair = this.core.currentPair;
      await this.updateAPY(this.core.translateWETH(curPair, true));
      await this.updateRow(this.core.translateWETH(curPair, true));

      let amount = await this.core.getUserVaultBalance();
      this.setFilteredData({
        filterValue: this.filterValue,
        sortBy: this.sortBy,
        amount: amount,
      });
    }
  },
  async updated() {
    this.setPaginationWidth();
    // document.getElementsByClassName('bx--toolbar-search-container-expandable')[0].classList.add("bx--toolbar-search-container-active");
  },
  async created() {
    Object.assign(this.dataTable, this.getDataTable);
    window.addEventListener("resize", this.setPaginationWidth);
  },
  destroyed() {
    window.removeEventListener("resize", this.setPaginationWidth);
  },
  methods: {
    ...mapActions({
      setFilteredData: "DataTable/setFilteredData",
      setDataTable: "DataTable/setDataTable",
      setExpandedData: "DataTable/setExpandedData",
      setEtherscanVisorLink: "DataTable/setEtherscanVisorLink",
      setMultipleVisors: "DataTable/setMultipleVisors",
      setUpdating: "DataTable/setUpdating",
      setToggleButton: "DataTable/setToggleButton",
      setIsTableLoaded: "DataTable/setIsTableLoaded",
      setIsInitializedPresigined: "DataTable/setIsInitializedPresigined",
    }),

    // Convert address
    abbreviateAddressFunc(address = null) {
      this.setEtherscanVisorLink(
        "https://etherscan.io/address/" + this.core.crucible._address
      );
      if (!address && this.core.accounts.length == 0) return;
      if (!address) address = this.core.accounts[0];

      return (
        address.substring(0, 5) +
        "..." +
        address.substring(
          address.length - (address.length - 38),
          address.length
        )
      );
    },
    onConnectWallet() {
      this.$parent.$children[0].connect();
    },
    formatVISR(name) {
      if (name.includes("VISR")) {
        return name.replace("vVISR", "xGAMMA").replace("VISR", "GAMMA");
      }
      return name;
    },

    hasAnalyticView(pair) {
      return (
        pair == "GAMMA" ||
        pair == "xGAMMA" ||
        PairAnalyticItems.some((item) => {
          return item.route == pair;
        })
      );
    },
    setPaginationWidth() {
      const paginationDom =
        document.getElementsByClassName("bx--pagination")[0];
      if (paginationDom) {
        paginationDom.style.width =
          document.getElementsByClassName("bx--data-table")[0].offsetWidth +
          "px";
      }
    },
    onSort(sortBy) {
      this.sortBy = sortBy;
    },
    async actionOnFilter(searchQuery) {
      this.filterValue = searchQuery;
      let amount = await this.core.getUserVaultBalance();
      this.setFilteredData({
        filterValue: this.filterValue,
        sortBy: this.sortBy,
        amount: amount,
      });
    },
    actionOnPagination(val) {
      this.dataTable.pagination.pageSize = val.length;
      this.dataTable.pagination.start = val.start;
    },

    async toggleVersion() {
      this.switchVault();
      //this.$router.push({ name: 'ActiveLiquidity' })
    },
    async switchVault() {
      if (this.core.crucibles.length > 1) {
        this.setMultipleVisors(true);
        this.toggleButton = "Loading";
        await this.core.nextNFT();
        this.setUpdating(true);
        await this.updateLPRows();

        let amount = await this.core.getUserVaultBalance();
        this.setFilteredData({
          filterValue: this.filterValue,
          sortBy: this.sortBy,
          amount: amount,
        });

        let expandedData = await this.core.getExpandedData(this.dataTable);
        this.setExpandedData(expandedData);

        this.setUpdating(false);
        this.core.version = (
          await this.core.crucible.methods.VERSION().call()
        ).substr(0, 9);

        this.setEtherscanVisorLink(
          "https://etherscan.io/address/" + this.core.crucible._address
        );
      }
    },
    async redeemGas() {
      this.clearMessages();
      const gasPrice = await this.core.gasPrice();
      this.core.redeem.methods
        .redeem()
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
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
            }
          );
        })
        .on("error", (err) => {
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["redeem"]);
        });
    },
    async mintNFT() {
      this.clearMessages();
      const gasPrice = await this.core.gasPrice();
      this.core.crucibleFactory.methods
        .createSelected(
          "0x5649534f522d322e302e35000000000000000000000000000000000000000000"
        )
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
          //this.core.crucibleFactory.methods .create() .send({ from: this.core.accounts[0], gasPrice: gasPrice }, (err, txHash) => {
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
                  //change Upgrade to toggle if > 1 visor
                  if (this.core.crucibles.length > 1) {
                    this.setMultipleVisors(true);
                  }
                  this.toggleButton = "Stake GAMMA";
                  this.core.states.legacy = false;
                  this.core.states.is_current = true;

                  this.setEtherscanVisorLink(
                    "https://etherscan.io/address/" +
                      this.core.crucible._address
                  );
                  this.core.states.is_holder = true;
                  this.loading.state = "loaded";
                  this.dataTable.title = "Rewards Programs";
                  this.dataTable.helperText =
                    "Below are all the active Uni v3 pairs and fee distribution hypervisors";
                });
              });
            },
            () => {
              this.clearMessages();
            }
          );
        })
        .on("error", (err) => {
          this.clearMessages();
          this.errorInfo.copy = err.message;
          this.errorInfo.visible = true;
          setTimeout(() => {
            this.errorInfo.visible = false;
          }, 4000);
          clearInterval(this.core.polls["mint"]);
        });
    },
    async approve() {
      this.clearMessages();
      this.loading.loadingText = "Approving...";
      const gasPrice = await this.core.gasPrice();
      this.core.tokens[this.activeAludel].methods
        .approve(this.core.transmuter._address, this.core.max)
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
          this.core.pollTx(
            txHash,
            "approve",
            () => {
              this.isLoading = false;
              this.progress.loading = false;
              this.progress.initialStep++;
            },
            (err) => {
              this.clearMessages();
              this.errorInfo.copy = err.message;
              this.errorInfo.visible = true;
              this.close();
            }
          );
        })
        .on("error", (err) => {
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
      const gasPrice = await this.core.gasPrice();
      this.core.transmuter.methods
        .stake(
          this.core.aludels[this.activeAludel]._address,
          this.core.crucible._address,
          unitAmount,
          permission
        )
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
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
            () => {
              this.clearMessages();
              this.close();
            }
          );
        })
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
        this.core.aludels[this.activeAludel]._address,
        this.core.tokens[this.activeAludel]._address,
        unitAmount
      );

      const gasPrice = await this.core.gasPrice();
      this.core.aludels[this.activeAludel].methods
        .unstakeAndClaim(this.core.crucible._address, unitAmount, permission)
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
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
            () => {
              this.clearMessages();
              this.close();
            }
          );
        })
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
      if (this.stackedNumberPercentage == 100) {
        balUnlocked = await this.core.tokens["xGAMMA"].methods
          .balanceOf(this.core.crucible._address)
          .call();
      }
      const gasPrice = await this.core.gasPrice();
      await this.core.rewards.methods
        .leave(balUnlocked)
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
          this.core.pollTx(
            txHash,
            "withdrawVVISR",
            async (block) => {
              this.isLoading = false;
              this.progress.loading = false;
              this.progress.initialStep++;
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
              await this.updateRow(this.activeAludel);
            },
            () => {
              this.clearMessages();
              this.close();
            }
          );
        })
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
      let depositAddress = this.core.crucible._address;

      if (this.isSpecialPair) {
        depositAddress =
          this.withdrawalMode == "Wallet"
            ? this.core.accounts[0]
            : this.core.crucible._address;
      }

      let units = this.core.BN(this.modelLPNumber.toString());
      units = this.core
        .BN(units)
        .div(this.core.BN("1.000001"))
        .toFixed(0)
        .toString();
      this.loading.loadingText = "Withdrawing...";
      const gasPrice = await this.core.gasPrice();
      this.core.uniswapv3.hypes[
        this.core.translateWETH(this.activeAludel)
      ].hype.methods
        .withdraw(units, this.core.accounts[0], depositAddress)
        .send(
          { from: this.core.accounts[0], gasPrice },
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
                  this.core.translateWETH(this.activeAludel)
                );
                await this.updateRow(this.activeAludel);
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

    async transferERC20() {
      this.loading.loadingText = "Unstaking...";

      let balUnlocked = await this.getBalanceUnlocked(this.activeAludel);
      if (this.activeAludel == "GAMMA") {
        balUnlocked = await this.getUnitAmount(this.modelStakedNumber);
      }

      const gasPrice = await this.core.gasPrice();
      await this.core.crucible.methods
        .transferERC20(
          this.core.tokens[this.activeAludel]._address,
          this.core.accounts[0],
          balUnlocked
        )
        .send({ from: this.core.accounts[0], gasPrice }, (err, txHash) => {
          this.core.pollTx(
            txHash,
            "transfer",
            async (block) => {
              this.isLoading = false;
              this.progress.loading = false;
              this.progress.initialStep++;
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

              await this.updateRow(this.activeAludel);
            },
            () => {
              this.clearMessages();
              this.close();
            }
          );
        })
        .on("error", (err) => {
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
      let totalBalance = await this.core.tokens[aludel].methods
        .balanceOf(this.core.crucible._address)
        .call();
      let balUnlocked = this.core.web3.utils
        .toBN(totalBalance)
        .sub(this.core.web3.utils.toBN(balLocked));
      return balUnlocked;
    },
    async updateNonLPRows() {
      const arraysOfPromises = this.core.tableData.map(async (row) => {
        if (row && !this.core.isLP(row[0]) && row[0] != "GAMMA") {
          await this.updateRow(row[0]);
          await this.updateAPY(row[0]);
        }
      });
      await Promise.all(arraysOfPromises);
    },
    async updateLPRows() {
      const arraysOfPromises = this.core.uniswapv3.pairs.map(async (pair) => {
        if (this.core.states.is_holder) {
          await this.updateRow(this.core.translateWETH(pair, true));
        }
        await this.updateAPY(this.core.translateWETH(pair, true));
      });

      await Promise.all(arraysOfPromises);

      if (this.core.states.is_holder) {
        await this.updateRow("GAMMA");
        await this.updateRow("xGAMMA");
      }
      await this.updateAPY("GAMMA");
    },
    async updateRow(aludel) {
      if (!this.core.tokens[aludel]) return;
      let dec = this.core.tokens[aludel]._address
        ? await this.core.tokens[aludel].methods.decimals().call()
        : 18;

      if (aludel == "GAMMA" || aludel == "xGAMMA") {
        //id not lp or visr-eth
        let balLocked = this.core.accounts[0]
          ? await this.core.tokens[aludel].methods
              .balanceOf(this.core.accounts[0])
              .call()
          : 0;

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
        let bal;
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
        }

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
    async prettyPrintAmount(aludel, amount) {
      let dec = await this.core.tokens[aludel].methods.decimals().call();
      let amountFormatted = this.core
        .BN(amount)
        .div(this.core.BN(10).pow(this.core.BN(dec)));
      return amountFormatted.toString();
    },
    async getUnitAmount(amount) {
      let decimals = await this.core.tokens[this.activeAludel].methods
        .decimals()
        .call();
      let unitAmount = this.core.ethers.utils.parseUnits(amount, decimals);
      return unitAmount;
    },
    goStake() {
      this.$router.push({ name: "Visr" });
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
    depositMessageProceed() {
      this.depositMessageVisible = false;
      this.withdrawMessageVisible = false;
    },
    depositMessageCancel() {
      this.depositMessageVisible = false;
      this.withdrawMessageVisible = false;
    },
    withdrawalMessageProceed() {
      this.withdrawMessageVisible = false;
      this.$router.push({ name: "Ens" });
    },
    async save() {
      if (this.activeAludel == "xGAMMA") {
        this.$router.push({ name: "Visr" });
        return;
      }
      let paused = ["ETH-USDT", "ETH-ENS"];
      if (paused.includes(this.activeAludel)) {
        this.depositMessageVisible = true;
        return;
      }

      if (!this.isSpecialPair) {
        this.depositMessageVisible = true;
        return;
      }
      if (this.core.isLP(this.activeAludel)) {
        this.core.currentPair = this.core.translateWETH(
          this.activeAludel,
          false
        );
        this.$router.push({ name: "ActiveLiquidity" });
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
      }
      this.$refs.modal.show();
    },
    async download() {
      console.log(
        this.activeAludel,
        this.core.silo.includes(this.core.accounts[0])
      );
      this.vaultWalletSelected = !this.isSpecialPair;
      if (this.isSpecialPair && this.core.crucible._address === undefined) {
        this.vaultWalletSelected = true;
      }

      if (this.activeAludel == "GAMMA") {
        this.$refs.modalStaked.show();
      } else if (this.activeAludel == "xGAMMA") {
        this.$router.push({ name: "Visr" });
        //this.$refs.modalStaked.show();
      } else if (
        this.activeAludel == "ETH-ENS" &&
        !this.core.silo.includes(this.core.accounts[0])
      ) {
        console.log("not in silo");
        this.withdrawMessageVisible = true;
        //this.$router.push({ name: "Ens" });
      } else if (this.core.isLP(this.activeAludel)) {
        this.lpMax();
        this.$refs.modalLP.show();
      } else {
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
      }
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
    async stakedMax() {
      let balLocked;
      if (this.activeAludel == "xGAMMA")
        balLocked = this.core.tokens["xGAMMA"].methods.balanceOf(
          this.core.crucible.address
        );
      else balLocked = await this.getBalanceUnlocked(this.activeAludel);
      let formattedBalance = await this.prettyPrintAmount(
        this.activewAludel,
        balLocked
      );
      this.modelStakedNumber = formattedBalance;
    },
    async lpMax() {
      let depositAddress = this.core.crucible._address;

      if (this.isSpecialPair) {
        depositAddress =
          this.withdrawalMode == "Wallet"
            ? this.core.accounts[0]
            : this.core.crucible._address;
      }
      this.modelLPNumber = await this.core.uniswapv3.hypes[
        this.core.translateWETH(this.activeAludel)
      ].hype.methods
        .balanceOf(depositAddress)
        .call();
    },
    async onStackedPercentageChanged() {
      if (!this.core.states.is_connected) {
        return;
      }
      const balLocked = await this.core.tokens["xGAMMA"].methods
        .balanceOf(this.core.accounts[0])
        .call();
      const stakedAmount = await this.prettyPrintAmount(
        this.activeAludel,
        balLocked
      );

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
    onMaxLpNumber() {
      this.lpNumberPercentage = "100";
    },
    async updateAPY(aludel) {
      this.core.updateTable(aludel, "apy", "-");
    },
    async onLPPercentageChanged() {
      if (!this.core.states.is_connected) {
        return;
      }

      const maxLPNumber = await this.core.uniswapv3.hypes[
        this.core.translateWETH(this.activeAludel)
      ].hype.methods
        .balanceOf(this.properAddress)
        .call();
      console.log(this.withdrawalMode, this.properAddress);

      this.modelLPNumber = (
        maxLPNumber *
        (this.lpNumberPercentage / 100)
      ).toString();

      if (this.expandedData[this.activeAludel]) {
        this.lpBalance0 = this.expandedData[this.activeAludel].balance0;
        this.lpBalance1 = this.expandedData[this.activeAludel].balance1;
      }

      if (this.isSpecialPair) {
        // Pierre you can put percentage value here. pls use this.properAddress for the wallet address.
        // this.lpBalance0 =
        // this.lpBalance1 =
      }
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
    analyticsViewClick(pair) {
      pair = pair == "xGAMMA" ? "Visr" : pair;
      this.$router.push({ name: pair });
    },
    valutDetailClick(pair) {
      this.$route.params.pair = pair.toLowerCase();
      this.$router.push({ name: "VaultDetail" });
    },
    selectRow(e, v, pair) {
      v = v + this.dataTable.pagination.start - 1;
      this.activeAludel = pair;

      const i = this.rowSelects.indexOf(`${v}`);
      for (let i = 0; i < this.dataTable.data.length; i++) {
        this.selects[i] = false;
      }
      this.selects[v] = true;

      if (i > -1) {
        this.rowSelects = [];
        // this.rowSelects.splice(i, 1)
        for (let i = 0; i < this.dataTable.data.length; i++) {
          this.selects[i] = false;
        }
      } else {
        this.rowSelects = [];
        this.rowSelects.push(`${v - this.dataTable.pagination.start + 1}`);

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
      this.$refs.modalStaked.hide();
      this.$refs.modalLP.hide();
    },
    submitStaked() {
      this.isLoading = true;
      this.loading.loadingText = "Submitting...";
      this.loading.state = "loading";
      this.progress.loading = true;
      if (this.activeAludel == "GAMMA") {
        this.transferERC20();
      }
      if (this.activeAludel == "xGAMMA") {
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
      if (this.isSpecialPair && !this.vaultWalletSelected) {
        this.vaultWalletSelected = true;
      } else {
        this.isLoading = true;
        this.loading.loadingText = "Submitting...";
        this.loading.state = "loading";
        this.progress.loading = true;
        this.withdrawLP();
      }
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
