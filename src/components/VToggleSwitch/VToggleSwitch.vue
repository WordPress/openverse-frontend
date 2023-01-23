<template>
  <div class="button">
    <label for="toggle-switch" />
    <input id="toggle-switch" type="checkbox" class="checkbox" />
    <div class="knob" />
    <div class="layer" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api"

export default defineComponent({
  name: "VToggleSwitch",
})
</script>

<style scoped>
.button {
  position: relative;
  width: 36px;
  height: 18px;
}

.button,
.button .layer {
  border-radius: 100px;
}

.knob {
  z-index: 2;
}

.layer {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #1e1e1e;
  transition: 0.15s ease-out;
  z-index: 1;
}

.knob,
.layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.checkbox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.button .knob:before {
  content: "";
  position: absolute;
  top: 3px;
  left: 4px;
  width: 12px;
  height: 12px;
  background-color: #1e1e1e;
  border-radius: 50%;
  transition: 0.15s cubic-bezier(0.18, 0.89, 0.35, 1.15) ease-out;
}

.button .checkbox:checked + .knob:before {
  content: "";
  left: 21px;
  @apply bg-white;
}

.button .checkbox:checked ~ .layer {
  @apply bg-trans-blue;
  border: none;
}
</style>
