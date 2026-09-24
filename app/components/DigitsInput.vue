<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<{
  maxLength?: number
  allowLeadingZero?: boolean
}>(), {
  maxLength: 10,
  allowLeadingZero: false,
})

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, props.maxLength)
  if (!props.allowLeadingZero) value = value.replace(/^0+(?=\d)/, '')

  input.value = value
  model.value = value
}
</script>

<template>
  <input
    :value="model"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    autocomplete="off"
    @input="onInput"
  >
</template>
