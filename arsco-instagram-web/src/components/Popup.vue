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
    <input
      id="clipboard-input"
      style="position: absolute;background: rgb(255, 255, 255);width: 1px;height: 1px;z-index: 0;"
    />
    <canvas crossorigin="anonymous" id="myCanvas" />
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
            return function(shareButtonData, shareButtonOut) {
              if (shareButtonData.id == "download") {
                return shareButtonOut;
              } else if (shareButtonData.id == "copylink") {
                return (
                  '<a style="cursor:pointer;" data-href="' +
                  gallery.currItem.src +
                  '" id="downloadImgLink" onclick="window.downloadImg(event)">다운로드</a><a data-clipboard-target="#clipboard-input" data-clip-board style="cursor:pointer;">copyLink</a>'
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
        // 갤러리 시작.
        gallery = new PhotoSwipe(
          pswpElement,
          PhotoSwipeUI_Default,
          items,
          options
        );
        // 갤러리 후처리.
        gallery.listen("destroy", function() {
          _this.$parent.popupPost = null;
          window.clipboard.destroy();
        });
        // 갤러리 변경 훅.
        gallery.listen("afterChange", function(a) {
          var copyLink;
          copyLink = this.currItem.src.replace(ARSCO_CONFIG.IP_DOMAIN, ARSCO_CONFIG.DNS_DOMAIN);
          if(copyLink.lastIndexOf('?')){
            copyLink = copyLink.slice(0, copyLink.lastIndexOf('?'))
          }
          $("#clipboard-input").val(copyLink);
          $(".pswp__item").on('mousedown, touchstart','.pswp__img', function(e){
            e.stopPropagation();
          })
        });
        gallery.init();

        // 클립보드 설정
        window.clipboard = new ClipboardJS("[data-clipboard-target]");
        window.clipboard.on("success", function(e) {
          M.toast({ html: "복사되었습니다.", classes: "rounded" });
          console.log("test7");
        });
        // 이미지 다운로드
        window.downloadImg = function(e) {
          e.stopPropagation();
          e.preventDefault();
          try {
            download($(e.target).attr("data-href"), "test2.jpg");
            // alert("xxxxxx");
            // console.log("test0");
            // var c = document.getElementById("myCanvas");
            // $(c)
            //   .attr("width", gallery.currItem.w)
            //   .attr("height", gallery.currItem.h);
            // var ctx = c.getContext("2d");
            // var img = new Image();
            // $("img.pswp__img").attr("crossOrigin", "Anonymous");
            // img.setAttribute("crossOrigin", "anonymous");
            // img.src = $(e.target).attr("data-href");
            // img.onload = function() {
            //   ctx.drawImage(img, 0, 0);
            //   var base64 = c.toDataURL();
            //   saveAs(c.toDataURL(), "test.jpg")
            // };
          } catch (error) {
            console.log(error);
          }
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

