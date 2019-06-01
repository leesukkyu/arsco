<template>
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>
      <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
          <div class="pswp__counter"></div>
          <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
          <button class="pswp__button pswp__button--share" title="Share"></button>
          <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
          <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>
        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["post", "config"],
  watch: {
    post: function(post) {
      if (post) {
        let _this, pswpElement, items, options, gallery, obj;
        _this = this;
        pswpElement = this.$el;
        items = [];
        options = {
          index: 0,
          shareButtons: [
            {
              id: "download",
              label: "Download image",
              url: "{{raw_image_url}}",
              download: true
            },
            {
              id: "copylink",
              label: "copylink",
              url: "{{raw_image_url}}"
            }
          ],
          // Parse output of share links
          parseShareButtonOut: (function() {
            // 클립보드에 링크 복사
            window.copyLinkToClipBoard = function(e) {
              if (e) {
                e.stopPropagation();
                e.preventDefault();
              }
              let t = document.createElement("textarea");
              document.body.appendChild(t);
              t.value = gallery.currItem.src;
              t.select();
              document.execCommand("copy");
              document.body.removeChild(t);
              this.document.querySelector(
                '.pswp [data-copy-checkbox="copyLink"]'
              ).checked = true;
              this.setTimeout(function() {
                this.document.querySelector(
                  '.pswp [data-copy-checkbox="copyLink"]'
                ).checked = false;
              }, 3000);
            };
            return function(shareButtonData, shareButtonOut) {
              if (shareButtonData.id == "download") {
                return shareButtonOut;
              } else if (shareButtonData.id == "copylink") {
                return (
                  '<a onclick="downloadImg(event)" data-href="' +
                  gallery.currItem.src +
                  '" id="downloadImgLink">다운로드</a><a style="cursor:pointer;" onclick="copyLinkToClipBoard(event);">copyLink<div id="copyCheckboxWrap" class="copy-checkbox-container"><input data-copy-checkbox="copyLink" type="checkbox" id="cbtest"><label for="cbtest" class="check-box" style="vertical-align: top;"></label></div></a>'
                );
              }
            };
          })()
        };
        if (this.post.type == "image") {
          obj = {
            src: this.getMediaUrl(
              this.post.type,
              this.post.images.standard_resolution.url
            ),
            w: this.post.images.standard_resolution.width,
            h: this.post.images.standard_resolution.height
          };
          items.push(obj);
        } else if (this.post.type == "carousel") {
          this.post.carousel_media.filter(
            function(media) {
              if (media.type == "video") {
                // todo video는 html로
                let obj = {
                  html:
                    '<div style="height:100%;"><div data-video-box style="margin:auto;width:80%;max-width:\'+ media.videos.standard_resolution.width +\'px; position:relative; top:50%;"><video onloadeddata="this.parentElement.style.marginTop = \'-\' + this.clientHeight / 2 + \'px\'" style="width:100%;" controls src=" ' +
                    this.getMediaUrl(
                      media.type,
                      media.videos.standard_resolution.url
                    ) +
                    ' "></video></div></div>'
                };
                items.push(obj);
              } else if (media.type == "image") {
                let obj = {
                  src: this.getMediaUrl(
                    media.type,
                    media.images.standard_resolution.url
                  ),
                  w: media.images.standard_resolution.width,
                  h: media.images.standard_resolution.height
                };
                items.push(obj);
              }
            }.bind(this)
          );
        } else if (this.post.type == "video") {
          // 비디오 포스트인데 비디오가 없는 경우.
          if (this.post.videos) {
            obj = {
              html:
                '<div style="height:100%;"><div data-video-box style="margin:auto;width:80%;max-width:\'+ this.post.videos.standard_resolution.width +\'px; position:relative; top:50%;"><video onloadeddata="this.parentElement.style.marginTop = \'-\' + this.clientHeight / 2 + \'px\'" style="width:100%;" controls src=" ' +
                this.getMediaUrl(
                  media.type,
                  this.post.videos.standard_resolution.url
                ) +
                ' "></video></div></div>'
            };
          } else {
            obj = {
              src: this.getMediaUrl(
                "image",
                this.post.images.standard_resolution.url
              ),
              w: this.post.images.standard_resolution.width,
              h: this.post.images.standard_resolution.height
            };
          }
          items.push(obj);
        }
        gallery = new PhotoSwipe(
          pswpElement,
          PhotoSwipeUI_Default,
          items,
          options
        );
        gallery.listen("destroy", function() {
          console.log((_this.$parent.popupPost = null));
        });
        gallery.init();
        window.gallery = gallery;
        window.downloadImg = function(e) {
          e.preventDefault();
          let x = new XMLHttpRequest();
          let href = $(e.target).attr("data-href");
          x.open("GET", href, true);
          x.responseType = "blob";
          x.onload = function(e) {
            download(
              x.response,
              href.slice(href.lastIndexOf("/") + 1, href.lastIndexOf("?")),
              "image/gif"
            );
          };
          x.send();
        };
      }
    }
  },
  methods: {
    getMediaUrl: function(type, url) {
      // 팝업은 항상 standard_resolution
      if (type == "image") {
        if (this.config.USE_ARSCO_SERVER) {
          return (
            this.config.ARSCO_IMAGE_PATH +
            "standard_resolution" +
            "/" +
            _getFileNameFromUrl(url)
          );
        } else {
          return url;
        }
      } else if (type == "video") {
        // 영상은 항상 아스코 서버에서 불러와야 함.
        return (
          this.config.ARSCO_VIDEO_PATH +
          "standard_resolution" +
          "/" +
          _getFileNameFromUrl(url)
        );
      }
    }
  }
};
</script>

