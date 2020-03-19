<template>
  <div>
    <div class="img-wrap">
      <video
        style="width:100%;"
        v-if="item.videos"
        controls
        class="img-box"
        :src="getMediaUrl(item)"
      ></video>
      <img style="width:100%;" v-if="!item.videos && item.images" :src="getMediaUrl(item)">
    </div>
    <div class="text-wrap">
      <div class="text-box">{{ getText(item) }}</div>
    </div>
  </div>
</template>

<script>
import { _getFileNameFromUrl } from '../../public/js/common.js';
export default {
  props: ["item", "config"],
  beforeMount() {
  },
  methods: {
    getMediaUrl: function(item) {
      let url;
      if (item.videos) {
        url = item.videos[this.config.RESOLUTION_TYPE].url;
        // 영상은 항상 아스코 서버에서 불러와야 함.
        return (
          this.config.ARSCO_VIDEO_PATH +
          this.config.RESOLUTION_TYPE +
          "/" +
          _getFileNameFromUrl(url)
        );
      } else if (!item.videos && item.images) {
        url = item.images[this.config.RESOLUTION_TYPE].url;
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