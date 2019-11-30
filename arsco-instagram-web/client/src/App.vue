<template>
  <div>
    <label class="company-title">
      <img @click="init()" src="images/logo_horizontal.svg" class="logo-img">
    </label>
    <div class="nav-wrap">
      <ul class="nav-box">
        <li
          class="nav-item"
          v-for="(item, menu_name, index) in menus"
          :key="index"
          :class="{
					active : item.isActive
				}"
          @click="openFilterListWrap(item, menu_name, menus)"
        >{{menu_name}}</li>
      </ul>
    </div>

    <div>
      <div v-if="filterObject.length != 0" class="filter-object-wrap">
        <span class="ti-filter vm arsco-color filter-object-title"></span>
        <filter-object
          v-for="(item, index) in filterObject"
          :key="index"
          :item="item"
          :index="index"
        >{{item}}</filter-object>
      </div>
    </div>

    <!-- 데탑 -->
    <transition-group
      v-if="!isMobile && checkMenuOpen"
      name="filter"
      tag="div"
      class="filter-type-list-container"
    >
      <div
        v-for="(menu, menu_name, index) in menus"
        v-show="menu.isActive"
        :key="index"
        class="filter-type-list-wrap"
      >
        <custom-filter-list-wrap
          v-if="menu_name == 'customTags'"
          :menu="menu"
          class="filter-list-wrap clearfix"
        ></custom-filter-list-wrap>

        <ul v-else class="filter-list-wrap">
          <li
            class="filter-list-box"
            v-for="(node, index) in menu.list"
            :key="index"
            :class="{
							'active' : node.checked,
						  }"
          >
            <button class="filter-list-btn" @click="setFilter(node, menu_name)">{{node.name}}</button>
          </li>
        </ul>

        <div class="calendar-wrap" v-show="calendarViewModel">
          <calendar></calendar>
        </div>
        <div @click="closeFilterContainer()" class="filter-type-list-container-close-btn">
          <span class="ti-close"></span>
        </div>
      </div>
    </transition-group>

    <!-- 모바일 -->
    <div v-else-if="isMobile && checkMenuOpen" tag="div" class="filter-type-list-container">
      <div v-on:scroll.stop style="height:100%;overflow: scroll;">
        <div
          v-for="(menu, menu_name, index) in menus"
          v-show="menu.isActive"
          :key="index"
          class="filter-type-list-wrap"
        >
          <custom-filter-list-wrap
            v-if="menu_name == 'customTags'"
            :menu="menu"
            class="filter-list-wrap clearfix"
          ></custom-filter-list-wrap>

          <ul v-else class="filter-list-wrap">
            <li
              class="filter-list-box"
              v-for="(node, index) in menu.list"
              :key="index"
              :class="{
							'active' : node.checked,
						  }"
            >
              <button class="filter-list-btn" @click="setFilter(node, menu_name)">{{node.name}}</button>
            </li>
          </ul>

          <div class="calendar-wrap" v-show="calendarViewModel">
            <calendar></calendar>
          </div>
        </div>
      </div>
      <div @click="closeFilterContainer()" class="filter-type-list-container-close-btn">
        <span class="ti-close"></span>
      </div>
    </div>

    <div
      v-if="!isMobile"
      tag="div"
      name="post-content-area"
      class="post-content-area"
      style="max-width:1920px;margin:auto;"
    >
      <div :cols="4" class="post-wrap clearfix">
        <div class="post-box-wrap">
          <div
            v-for="(item, index) in filteredList"
            :key="item._id"
            @click="openPopup(item)"
            class="post-box"
            v-if="index %4 == 0"
          >
            <image-post-component v-if="item.type == 'image'" :item="item" :config="config"></image-post-component>
            <video-post-component v-if="item.type == 'video'" :item="item" :config="config"></video-post-component>
            <carousel-post-component v-if="item.type == 'carousel'" :item="item" :config="config"></carousel-post-component>
          </div>
        </div>
        <div class="post-box-wrap">
          <div
            v-for="(item, index) in filteredList"
            :key="item._id"
            @click="openPopup(item)"
            class="post-box"
            v-if="index %4 == 1"
          >
            <image-post-component v-if="item.type == 'image'" :item="item" :config="config"></image-post-component>
            <video-post-component v-if="item.type == 'video'" :item="item" :config="config"></video-post-component>
            <carousel-post-component v-if="item.type == 'carousel'" :item="item" :config="config"></carousel-post-component>
          </div>
        </div>
        <div class="post-box-wrap">
          <div
            v-for="(item, index) in filteredList"
            :key="item._id"
            @click="openPopup(item)"
            class="post-box"
            v-if="index %4 == 2"
          >
            <image-post-component v-if="item.type == 'image'" :item="item" :config="config"></image-post-component>
            <video-post-component v-if="item.type == 'video'" :item="item" :config="config"></video-post-component>
            <carousel-post-component v-if="item.type == 'carousel'" :item="item" :config="config"></carousel-post-component>
          </div>
        </div>
        <div class="post-box-wrap">
          <div
            v-for="(item, index) in filteredList"
            :key="item._id"
            @click="openPopup(item)"
            class="post-box"
            v-if="index %4 == 3"
          >
            <image-post-component v-if="item.type == 'image'" :item="item" :config="config"></image-post-component>
            <video-post-component v-if="item.type == 'video'" :item="item" :config="config"></video-post-component>
            <carousel-post-component v-if="item.type == 'carousel'" :item="item" :config="config"></carousel-post-component>
          </div>
        </div>
      </div>
    </div>

    <div v-else tag="div" name="post-content-area" class="post-content-area">
      <div :cols="2" class="post-wrap clearfix">
        <div class="post-box-wrap">
          <div
            v-for="(item, index) in filteredList"
            :key="item._id"
            @click="openPopup(item)"
            class="post-box"
            v-if="index %2 == 0"
          >
            <image-post-component v-if="item.type == 'image'" :item="item" :config="config"></image-post-component>
            <video-post-component v-if="item.type == 'video'" :item="item" :config="config"></video-post-component>
            <carousel-post-component v-if="item.type == 'carousel'" :item="item" :config="config"></carousel-post-component>
          </div>
        </div>
        <div class="post-box-wrap">
          <div
            v-for="(item, index) in filteredList"
            :key="item._id"
            @click="openPopup(item)"
            class="post-box"
            v-if="index %2 == 1"
          >
            <image-post-component v-if="item.type == 'image'" :item="item" :config="config"></image-post-component>
            <video-post-component v-if="item.type == 'video'" :item="item" :config="config"></video-post-component>
            <carousel-post-component v-if="item.type == 'carousel'" :item="item" :config="config"></carousel-post-component>
          </div>
        </div>
      </div>
    </div>

    <div v-show="!beforeLoad && filteredList.length == 0" class="noFilteredList">
      <div>
        <span class="ti-face-sad"></span>
      </div>
      <span class="text">해당 포스트가 없습니다.</span>
    </div>

    <transition name="popup">
      <popup tag="div" v-show="popupPost" :post="popupPost" :config="config"></popup>
    </transition>

    <transition name="ajax">
      <ajax-loading-animation v-if="beforeLoad"></ajax-loading-animation>
    </transition>
  </div>
</template>

<script>
import AjaxLoadingAnimation from "./components/AjaxLoadingAnimation.vue";
import Calendar from "./components/Calendar.vue";
import CarouselPostComponent from "./components/CarouselPostComponent.vue";
import CustomFilterListNode from "./components/CustomFilterListNode.vue";
import CustomFilterListWrap from "./components/CustomFilterListWrap.vue";
import FilterObject from "./components/FilterObject.vue";
import ImagePostComponent from "./components/ImagePostComponent.vue";
import Popup from "./components/Popup.vue";
import VideoPostComponent from "./components/VideoPostComponent.vue";

export default {
  name: "app",
  components: {
    "ajax-loading-animation": AjaxLoadingAnimation,
    calendar: Calendar,
    "carousel-post-component": CarouselPostComponent,
    "custom-filter-list-node": CustomFilterListNode,
    "custom-filter-list-wrap": CustomFilterListWrap,
    "filter-object": FilterObject,
    "image-post-component": ImagePostComponent,
    popup: Popup,
    "video-post-component": VideoPostComponent
  },
  data: function() {
    return {
      config: {
        ARSCO_IMAGE_PATH:
          ARSCO_CONFIG.ARSCO_MEDIA_SERVER +
          "/" +
          ARSCO_CONFIG.ARSCO_ID +
          "/images/",
        ARSCO_VIDEO_PATH:
          ARSCO_CONFIG.ARSCO_MEDIA_SERVER +
          "/" +
          ARSCO_CONFIG.ARSCO_ID +
          "/videos/",
        USE_ARSCO_SERVER: false,
        RESOLUTION_TYPE: ""
      },
      menus: {
        // 화면에 표시 될 view data
        customTags: {
          isActive: false,
          list: [],
          map: {}
        },
        tags: {
          isActive: false,
          list: [],
          map: {}
        },
        locations: {
          isActive: false,
          list: [],
          map: {}
        },
        date: {
          isActive: false,
          list: [
            {
              key: "week",
              name: "일주 이내",
              checked: false
            },
            {
              key: "month",
              name: "한달 이내",
              checked: false
            },
            {
              key: "custom",
              name: "특정 기간 검색",
              checked: false
            }
          ],
          map: {}
        }
      },
      // 전체 게시물
      posts: [],
      // 필터된 게시물 MVVM pattern
      // filteredPosts: []
      filterObject: [],
      filterObject_union: [],
      // 팝업으로 뜰 포스트
      popupPost: null,
      // 로딩 중 플래그
      beforeLoad: true
    };
  },
  beforeMount() {
    let tagMap;
    let _this = this;
    this.beforeLoad = true;
    // 설정 로딩
    this.$http.get("/api/loadConfig.json", {}).then(rs => {
      // 1. 커스텀 태그 설정
      let travalTree;
      //customTags = [];
      travalTree = function(tree) {
        tree.checked = false;
        tree.checked_union = false;
        if (tree.childList) {
          for (let i in tree.childList) {
            travalTree(tree.childList[i]);
          }
        }
      };
      for (let i in rs.tree) {
        travalTree(rs.tree[i]);
      }
      this.menus.customTags.list = _COPY(rs.tree);

      // 2. 로딩 서버 설정
      if (rs.loadServer == "arsco") {
        this.config.USE_ARSCO_SERVER = true;
      } else {
        this.config.USE_ARSCO_SERVER = false;
      }

      // 3. 인스타 그램 포스트 로딩
      this.$http.get("/api/getAllPost.json", {}).then(rs => {
        let posts;
        let tagList = [];
        posts = rs;
        tagMap = {};
        for (let i in posts) {
          posts[i].created_time = posts[i].created_time * 1000;
          if (1544359705399 < posts[i].created_time) {
            // setting tag list
            for (let j in posts[i].tags) {
              tagList.push(posts[i].tags[j]);
            }
          } else {
            //2018년 12월 9일 이전 포스팅에서는 tag 데이터를 가져오지 않음.
          }
        }
        tagList.sort();
        for (let i in tagList) {
          if (!tagMap[tagList[i]]) {
            this.menus.tags.list.push({
              key: tagList[i],
              name: tagList[i],
              checked: false
            });
            tagMap[tagList[i]] = true;
          }
        }
        this.posts = _COPY(posts);
        this.setFilterData();
        setTimeout(
          function() {
            this.beforeLoad = false;
          }.bind(this),
          200
        );
      });
    });
  },
  mounted() {
    console.log("xx");
  },
  updated() {
    this.$nextTick(function() {
      console.log("updated");
      window.lazy();
    });
  },
  computed: {
    filteredList() {
      let _this = this;
      return _this.filterObject.length == 0 &&
        _this.filterObject_union.length == 0
        ? _this.posts
        : _this.filterObject.length == 0
        ? this.unionFilter(_this.posts)
        : _this.filterObject_union.length == 0
        ? this.intersectionFilter(_this.posts)
        : this.intersectionFilter(this.unionFilter(_this.posts));

      // _this.posts
      //   .filter(function(post) {
      //     // 1. 합집합 결과 리스트
      //     return _this.filterObject_union.some(function(obj) {
      //       console.log(obj);
      //       type = obj.type;
      //       if (type == "tag") {
      //         return post.tags.some(function(tag) {
      //           return obj.tagName == tag;
      //         });
      //       }
      //       if (type == "customTag") {
      //         return post.tags.some(function(tag) {
      //           return obj.tagName == tag;
      //         });
      //       } else if (type == "date") {
      //         if (
      //           obj.startDate <= post.created_time &&
      //           obj.endDate >= post.created_time
      //         ) {
      //           return true;
      //         } else {
      //           return false;
      //         }
      //       } else {
      //         return true;
      //       }
      //     });
      //   })
      //   // 2. 합집합 리스트에서 다시 교집합 필터
      //   .filter(function(post) {
      //     return _this.filterObject.every(function(obj) {
      //       console.log(obj);
      //       type = obj.type;
      //       if (type == "tag") {
      //         return post.tags.some(function(tag) {
      //           return obj.tagName == tag;
      //         });
      //       }
      //       if (type == "customTag") {
      //         return post.tags.some(function(tag) {
      //           return obj.tagName == tag;
      //         });
      //       } else if (type == "date") {
      //         if (
      //           obj.startDate <= post.created_time &&
      //           obj.endDate >= post.created_time
      //         ) {
      //           return true;
      //         } else {
      //           return false;
      //         }
      //       } else {
      //         return true;
      //       }
      //     });
      //   });
    },
    calendarViewModel() {
      let _this = this;
      return (
        _this.menus.date.isActive && _this.menus.date.map["custom"].checked
      );
    },
    isMobile() {
      this.config.RESOLUTION_TYPE =
        window.innerWidth < 1024 ? "low_resolution" : "standard_resolution";
      return window.innerWidth < 1024;
    },
    checkMenuOpen() {
      return Object.values(this.menus).some(function(menu) {
        return menu.isActive;
      });
    }
  },
  methods: {
    // 합집합 필터
    unionFilter: function(list) {
      let _this = this;
      let type;
      return list.filter(function(post) {
        // 1. 합집합 결과 리스트
        return _this.filterObject_union.some(function(obj) {
          console.log(obj);
          type = obj.type;
          if (type == "tag") {
            return post.tags.some(function(tag) {
              return obj.tagName == tag;
            });
          }
          if (type == "customTag") {
            return post.tags.some(function(tag) {
              return obj.tagName == tag;
            });
          } else if (type == "date") {
            if (
              obj.startDate <= post.created_time &&
              obj.endDate >= post.created_time
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
      });
    },
    // 교집합 필터
    intersectionFilter: function(list) {
      let _this = this;
      let type;
      return list.filter(function(post) {
        return _this.filterObject.every(function(obj) {
          console.log(obj);
          type = obj.type;
          if (type == "tag") {
            return post.tags.some(function(tag) {
              return obj.tagName == tag;
            });
          }
          if (type == "customTag") {
            return post.tags.some(function(tag) {
              return obj.tagName == tag;
            });
          } else if (type == "date") {
            if (
              obj.startDate <= post.created_time &&
              obj.endDate >= post.created_time
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
      });
    },

    setFilterData() {
      // 1. tags의 맵을 생성.
      for (let i in this.menus.tags.list) {
        this.menus.tags.map[this.menus.tags.list[i].key] = this.menus.tags.list[
          i
        ];
      }
      // 2. date 맵을 생성.
      for (let i in this.menus.date.list) {
        this.menus.date.map[this.menus.date.list[i].key] = this.menus.date.list[
          i
        ];
      }
      // 3. customTags 맵을 생성, 자식에 부모 정보 주입.
      this.TraversalChildNode(
        this.menus.customTags.list,
        function(node, i, parentNode) {
          if (parentNode) {
            Object.defineProperty(node[i], "parentNode", {
              enumerable: false,
              configurable: false,
              writable: false,
              value: parentNode
            });
          }
          this.menus.customTags.map[node[i].key ? node[i].key : "root"] =
            node[i];
        }.bind(this)
      );
      console.log(this);
    },
    // 커스텀 태그를 탐색하면서 자식을 cb로 밀어넣어줌.
    TraversalChildNode(root, cb) {
      let search = function(node, parentNode) {
        for (let i in node) {
          if (node[i].childList) {
            if (cb) {
              cb(node, i, parentNode);
            }
            search(node[i].childList, node[i]);
          } else {
            if (cb) {
              cb(node, i, parentNode);
            }
          }
        }
      };
      search(root);
    },
    // 커스텀 태그를 탐색
    findCustomTagsByTagName(tagName, cb) {
      let result;
      let search = function(node) {
        for (let i in node) {
          if (i == tagName) {
            result = node[i];
            if (cb) {
              cb(node, i);
            }
            break;
          }
          if (typeof node[i] == "object") {
            search(node[i]);
          }
        }
        return result;
      };
      return search(this.menus.customTags.list);
    },
    // 필터 리스트를 오픈
    openFilterListWrap(item, menu_name, menus) {
      console.log(item, menu_name, menus);
      for (let i in menus) {
        if (item == menus[i]) {
          if (menus[i].isActive) {
            menus[i].isActive = false;
          } else {
            menus[i].isActive = true;
          }
        } else {
          menus[i].isActive = false;
        }
      }
    },
    // 필터 걸기 전처기리
    setFilter(node, type, forceValue) {
      if (type == "tags") {
        this.setFilterByTag(node, forceValue);
      } else if (type == "customTags") {
        this.setFilterByCustomTag(node, forceValue);
      } else if (type == "date") {
        this.setFilterByDate(node, forceValue);
      }
    },
    // 태그로 필터 걸기
    setFilterByTag(node, forceValue) {
      if (forceValue == undefined) {
        node.checked = !node.checked;
      } else {
        if (node.checked == forceValue) {
          return;
        }
        node.checked = forceValue;
      }
      // 태그 추가
      if (node.checked) {
        this.filterObject.push({
          type: "tag",
          tagName: node.name,
          node: node
        });
      }
      // 태그 삭제
      else {
        for (let i in this.filterObject) {
          if (
            this.filterObject[i].type == "tag" &&
            this.filterObject[i].tagName == node.name
          ) {
            this.filterObject.splice(i, 1);
          }
        }
      }
    },
    // 커스텀 태그로 필터 걸기
    setFilterByCustomTag(node, forceValue) {
      if (forceValue == undefined) {
        node.checked = !node.checked;
      } else {
        if (node.checked == forceValue) {
          return;
        }
        node.checked = forceValue;
      }

      // 태그 추가
      if (node.checked) {
        this.filterObject.push({
          type: "customTag",
          tagName: node.name,
          node: node
        });
      }
      // 태그 삭제
      else {
        for (let i in this.filterObject) {
          if (
            this.filterObject[i].type == "customTag" &&
            this.filterObject[i].tagName == node.name
          ) {
            this.filterObject.splice(i, 1);
          }
        }
      }
    },
    // 날짜로 필터 걸기
    setFilterByDate(node, forceValue) {
      let startDate, endDate;
      node.checked = !node.checked;
      if (forceValue != undefined) {
        node.checked = forceValue;
      }
      // 날짜 추가
      if (node.checked) {
        if (node.key == "week") {
          this.filterObject.push({
            type: "date",
            startDate: new _Date()
              .lastWeek()
              .start()
              .done()
              .getTime(),
            endDate: new _Date()
              .end()
              .done()
              .getTime(),
            periodType: "week",
            node: node
          });
        } else if (node.key == "month") {
          this.filterObject.push({
            type: "date",
            startDate: new _Date()
              .lastMonth()
              .start()
              .done()
              .getTime(),
            endDate: new _Date()
              .end()
              .done()
              .getTime(),
            periodType: "month",
            node: node
          });
        }
      }
      // 날짜 삭제
      else {
        if (node.key == "week") {
          startDate = new _Date()
            .lastWeek()
            .start()
            .done()
            .getTime();
          endDate = new _Date()
            .end()
            .done()
            .getTime();
        } else if (node.key == "month") {
          startDate = new _Date()
            .lastMonth()
            .start()
            .done()
            .getTime();
          endDate = new _Date()
            .end()
            .done()
            .getTime();
        }
        for (let i in this.filterObject) {
          if (
            this.filterObject[i].startDate == startDate &&
            this.filterObject[i].endDate == endDate
          ) {
            this.filterObject.splice(i, 1);
          }
        }
      }
    },
    setFilter_union(node, type, forceValue) {
      if (type == "tags") {
        this.setFilterByTag_union(node, forceValue);
      } else if (type == "customTags") {
        this.setFilterByCustomTag_union(node, forceValue);
      } else if (type == "date") {
        this.setFilterByDate_union(node, forceValue);
      }
    },
    setFilterByTag_union() {
      console.log("태그 합집합");
    },
    setFilterByCustomTag_union(node, forceValue) {
      if (forceValue == undefined) {
        node.checked_union = !node.checked_union;
      } else {
        if (node.checked_union == forceValue) {
          return;
        }
        node.checked_union = forceValue;
      }
      //태그 추가
      if (node.checked_union) {
        this.filterObject_union.push({
          type: "customTag",
          tagName: node.name,
          node: node
        });
      }
      // 태그 삭제
      else {
        for (let i in this.filterObject_union) {
          if (
            this.filterObject_union[i].type == "customTag" &&
            this.filterObject_union[i].tagName == node.name
          ) {
            this.filterObject_union.splice(i, 1);
          }
        }
      }
    },
    setFilterByDate_union() {
      console.log("날짜 합집합");
    },
    // 팝업 오픈
    openPopup(post) {
      this.popupPost = post;
    },
    closeFilterContainer() {
      return Object.values(this.menus).forEach(function(menu) {
        menu.isActive = false;
      });
    },
    init() {
      Object.values(this.menus).forEach(function(menu) {
        menu.isActive = false;
        menu.list.forEach(function(filter) {
          filter.checked = false;
        });
      });
      this.filterObject = [];
    }
  }
};
</script>
