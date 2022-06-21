<template>
  <div class="liquidity-page">
    <div class="liquidity-body">
      <div v-if="isLoading" class="liquidity-loading">
        <cv-loading overlay description="Approving" />
        <p class="liquidity-loading text">Approving...</p>
      </div>
      <div class="liquidity-header">
        <h2>Providing Liquidity For Active Management</h2>
        <p>
          You are going through the process of providing liquidity to a Visor
          manged pool
        </p>
      </div>
      <div class="liquidity-content">
        <div class="bx--form-item dropdown">
          <cv-dropdown v-model="coinType" value="" label="Dropdown title">
            <cv-dropdown-item value="1">
              <span>Provide active liquidity with ETH</span>
            </cv-dropdown-item>
            <cv-dropdown-item value="2">
              Provide active liquidity with USDT
            </cv-dropdown-item>
            <cv-dropdown-item value="3">
              Provide active liquidity with both ETH and USDT
            </cv-dropdown-item>
          </cv-dropdown>
        </div>

        <div v-if="coinType == 3" class="bx--form-item textinputs">
          <cv-text-input label="Number input label" />
          <cv-text-input label="Number input label" />
        </div>

        <div v-if="coinType != 3" class="bx--form-item number">
          <cv-text-input
            v-model="modelNumber"
            label="Number"
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
          <cv-button kind="primary" size="" class="plus" @click="plus()">
            +
          </cv-button>
        </div>
      </div>

      <div class="liquidity-footer">
        <cv-button kind="secondary"> Cancel </cv-button>
        <cv-button kind="primary"> Next </cv-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Liquidity",
  components: {},
  data() {
    return {
      coinType: "",
      isLoading: false,
      loading: {
        endingText: "Ending...",
        errorText: "Error.",
        loadingText: "Approving...",
        loadedText: "Complete.",
        state: "loading",
      },
      modelNumber: "1",
    };
  },
  computed: {},
  mounted() {},
  methods: {
    onNumberInput() {},
    max() {
      this.modelNumber = "100";
    },
    minus() {
      this.modelNumber = `${--this.modelNumber}`;
    },
    plus() {
      this.modelNumber = `${++this.modelNumber}`;
    },
  },
};
</script>

<style lang="scss">
.liquidity-page {
  font-family: "IBM Plex Sans" !important;
  width: 100%;
  min-height: calc(100% - 81px);
  display: flex;
  align-items: center;
  &.loading {
    display: flex;
    align-items: center;
  }
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
    max-width: 500px;
    margin: auto;
    .liquidity-header {
      h2 {
        font-size: 21px;
        color: white;
        font-family: "IBM Plex Sans";
        margin: 10px 0;
      }
      p {
        font-family: "IBM Plex Sans";
        font-size: 16px;
        color: white;
        padding-right: 65px;
      }
    }
    .liquidity-content {
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
              border-top: 1px solid rgb(57, 57, 57);
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
