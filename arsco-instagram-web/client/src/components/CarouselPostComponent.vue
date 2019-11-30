<template>
  <div>
    <div class="img-wrap carousel-wrap slide-wrap">
      <div>
        <div v-bind:style="{height : maxMediaHeight}" class="carousel carousel-slider center">
          <div class="carousel-item" v-for="(item, index) in item.carousel_media" :key="index">
            <img
              data-media
              v-if="item.type=='image'"
              :src="getMediaUrl(item.type, item.images[config.RESOLUTION_TYPE].url)"
              class="img-box slide-item"
            >
            <video
              controls
              data-media
              v-if="item.type=='video'"
              :src="getMediaUrl(item.type, item.videos[config.RESOLUTION_TYPE].url)"
              class="img-box slide-item"
            ></video>
          </div>
        </div>
      </div>
    </div>
    <div class="text-wrap">
      <div class="text-box">{{ getText(item) }}</div>
    </div>
  </div>
</template>

<script>


export default {
  props: ["item", "config"],
  data: function() {
    return {
      maxHeight: "150",
      elWidth: 0
    };
  },
  mounted() {
    let tempHeight;
    $(this.$el)
      .find(".carousel.carousel-slider")
      .carousel({
        fullWidth: true,
        indicators: true
      });

    this.elWidth = this.$el.clientWidth;
    for (let i in this.item.carousel_media) {
      if (this.item.carousel_media[i].type == "image") {
        tempHeight =
          this.item.carousel_media[i].images[this.config.RESOLUTION_TYPE]
            .height *
          (this.elWidth /
            this.item.carousel_media[i].images[this.config.RESOLUTION_TYPE]
              .width);
      } else if (this.item.carousel_media[i].type == "video") {
        tempHeight =
          this.item.carousel_media[i].videos[this.config.RESOLUTION_TYPE]
            .height *
          (this.elWidth /
            this.item.carousel_media[i].videos[this.config.RESOLUTION_TYPE]
              .width);
      }
      if (this.maxHeight < tempHeight) {
        this.maxHeight = tempHeight;
      }
    }
  },
  methods: {
    move: function(index) {
      this.activeIndex = index;
      this.activeImg = this.imgs[index];
    },
    getMediaUrl: function(type, url) {
      let fileName = _getFileNameFromUrl(url);
      if (type == "image") {
        if (this.config.USE_ARSCO_SERVER) {
          return (
            this.config.ARSCO_IMAGE_PATH +
            this.config.RESOLUTION_TYPE +
            "/" +
            fileName
          );
        } else {
          return url;
        }
      } else if (type == "video") {
        // 영상은 항상 아스코 서버에서 불러와야 함.
        return (
          this.config.ARSCO_VIDEO_PATH +
          this.config.RESOLUTION_TYPE +
          "/" +
          fileName
        );
      }
    },
    getText: function(item) {
      if (item.caption && item.caption.text) {
        return item.caption.text;
      } else {
        return "";
      }
    }
  },
  computed: {
    maxMediaHeight: function() {
      return this.maxHeight + "px";
    }
  }
};
</script>
