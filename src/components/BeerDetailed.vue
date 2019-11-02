<template>
    <sui-modal v-model="open">
      <!-- <sui-modal-header>{{beer.name}}</sui-modal-header> -->
      <sui-modal-content image>
        <sui-image wrapped size="medium" :src="beer.image_url" />
        <sui-modal-description>
          <sui-header>{{beer.name}}</sui-header>
          <p>{{beer.description}}</p>
        </sui-modal-description>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button secondary @click.native="close">
          Close
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
</template>

<script>
export default {
    props: {
        'open': {
            type: Boolean,
            required: true
        },
        'beer': {
            type: Object,
            required: true
        }
    },
    methods: {
        close() {
            this.$emit('closeModal');
        }
    }
}
</script>