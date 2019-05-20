<template>
  <div>
    <div class="img-wrap">
      <img class="img-box lazy" :data-src="getMediaUrl(item.images[config.RESOLUTION_TYPE].url)">
    </div>
    <div class="text-wrap">
      <div class="text-box">{{ getText(item) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item", "config"],
  methods: {
    getMediaUrl: function(url) {
      if (this.config.USE_ARSCO_SERVER) {
        return (
          this.config.ARSCO_IMAGE_PATH +
          this.config.RESOLUTION_TYPE +
          "/" +
          _getFileNameFromUrl(url)
        );
      } else {
        return url;
      }
    },
    getText: function(item) {
      if (item.caption && item.caption.text) {
        return item.caption.text;
      } else {
        return "";
      }
    }
  }
};
</script>
