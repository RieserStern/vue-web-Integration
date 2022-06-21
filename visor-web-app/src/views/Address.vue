<template>
  <div class="address-page">
    <div class="address-page-inner">
      <div class="cvInputWrap">
        <div class="cvInputBox">
          <div class="cvInputLabel">
            Enter Address
          </div>
          <cv-search
            v-model="searchAddress"
            :label="cvInputLabel"
            :class="{'has_erro-cv-input': !isSearchValid && searchAddress !== ''}"
            @input="onInput"
          />
          <div class="cvInputSubLabel">
            <template v-if="searchAddress !== ''">
              <template v-if="isSearchValid">
                <span>Success Text here</span>
              </template>
              <template v-else>
                <span>Error Text here</span>
              </template>
            </template>
            <template v-else-if="searchAddress === ''">
              <span>Text here</span>
            </template>
          </div>
        </div>
        <a
          v-if="isSearchValid && searchAddress !== ''"
          href="#"
          class="goAddress"
        >
          Success Continue
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import lists from '../assets/list'

export default {
  name: 'Address',
  data () {
    return {
      cvInputLabel: 'Enter Address',
      searchAddress: '',
      isSearchValid: false,
      iconAlways: {
        props: {
          title: {}
        },
        functional: true,
        _Ctor: {}
      },
      light: false,
      label: 'Text input label',
      disabled: false,
      passwordVisible: false,
      passwordHideLabel: 'Hide password',
      passwordShowLabel: 'Show password',
      placeholder: 'Sample placeholder',
      use_helperTextSlot: true,
      use_invalidMessageSlot: true
    }
  },
  methods: {
    onInput () {
      if (this.searchAddress !== '') {
        if (lists.indexOf(this.searchAddress) > -1) {
          this.isSearchValid = true
        } else {
          this.isSearchValid = false
        }
      } else {
        this.isSearchValid = true
      }
    }
  }
}
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
