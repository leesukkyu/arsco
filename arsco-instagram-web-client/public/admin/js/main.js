var colorTagTree =
{
	checked: 'false',
	key: '색깔',
	name: '색깔',
	childList: [
		{
			checked: 'false',
			key: '블랙',
			name: '블랙',
			thumbnail: 'Black.jpg'
		},
		{
			checked: 'false',
			key: '체리',
			name: '체리',
			thumbnail: 'Cherry.jpg'
		},
		{
			checked: 'false',
			key: '화이트',
			name: '화이트',
			thumbnail: 'White.jpg'
		},
		{
			checked: 'false',
			key: '다크그레이',
			name: '다크그레이',
			thumbnail: 'DarkGrey.jpg'
		},
		{
			checked: 'false',
			key: '베이지',
			name: '베이지',
			thumbnail: 'Beige.jpg'
		},
		{
			checked: 'false',
			key: '레드',
			name: '레드',
			thumbnail: 'Red.jpg'
		},
		{
			checked: 'false',
			key: '오렌지',
			name: '오렌지',
			thumbnail: 'Orange.jpg'
		},
		{
			checked: 'false',
			key: '옐로우',
			name: '옐로우',
			thumbnail: 'Yellow.jpg'
		},
		{
			checked: 'false',
			key: '엔틱',
			name: '엔틱',
			thumbnail: 'Antique.jpg'
		},
		{
			checked: 'false',
			key: '그린',
			name: '그린',
			thumbnail: 'YellowGreen.jpg'
		},
		{
			checked: 'false',
			key: '월넛',
			name: '월넛',
			thumbnail: 'Walnut.jpg'
		},
	]
}

// 로딩 서버 설정
Vue.component('server-setting', {
	template: `<v-card flat class="pa-3">
					<v-btn :loading="loading" depressed small color="primary" @click="save">서버 설정 저장</v-btn>
					<v-radio-group v-model="serverSettingValue" column>
						<v-radio
							label="arsco 서버"
							color="primary"
							value="arsco"
						></v-radio>
						<v-radio
							label="instagram 서버"
							color="primary"
							value="instagram"
						></v-radio>
					</v-radio-group>
				</v-card>`,
	props: ['serverConfig'],
	data: function () {
		return {
			serverSettingValue: null,
			loading: false
		}
	},
	watch: {
		serverConfig: function (value) {
			if (value) {
				this.serverSettingValue = value.loadServer;
			}
		}
	},
	methods: {
		save: function () {
			this.loading = true;
			var _this = this;
			$.ajax({
				url: '/api/saveLoadServerSetting.json',
				method: 'post',
				type: 'json',
				data: {
					loadServer: this.serverSettingValue
				},
				success: function (rs) {
					console.log(rs);
					alert('서버 설정이 저장되었습니다.');
				},
				complete: function () {
					_this.loading = false;
				}
			})
		}
	}
});

// 커스텀 필터 설정
Vue.component('custom-filter-setting', {
	template: `<v-card flat class="pa-3">
					<v-btn @click="save" class="mb-3" :loading = "loading" depressed small color="primary">커스텀 필터 저장</v-btn>
					<v-btn @click="addRootNode" class="mb-3" depressed small color="primary"><v-icon>add</v-icon>상위 태그 생성</v-btn>
					<v-treeview :items="treeData" item-key="key" item-text="name" item-children="childList">
							<template slot="prepend" slot-scope="{  item, /*open,  leaf*/  }">
								<v-btn @click="addNode(item)" class="ma-0" color="green" small flat icon>
									<v-icon>add</v-icon>
								</v-btn>
								<v-btn @click="removeNode(item)" class="ma-0" color="error" small flat icon>
									<v-icon>close</v-icon>
						  		</v-btn>
							</template>
							<template slot="label" slot-scope="{  item, /*open,  leaf*/  }">
								<v-text-field v-model="item.name"></v-text-field>
							</template>
					</v-treeview>
				</v-card>`,
	props: ['serverConfig'],
	data: function () {
		return {
			serverTreeData: [],
			treeData: [],
			addKey: 0,
			loading: false
		}
	},
	watch: {
		serverConfig: function (value) {
			this.serverTreeData = value.tree;
			this.treeData = value.tree;
			for (var i in this.treeData) {
				if (this.treeData[i].name == '색깔') {
					this.treeData.splice(i, 1)
				}
			}
		}
	},
	methods: {
		findNode: (function () {
			var key;
			var isFind;
			var findObj = {};
			var loop = function (node, pNode, index) {
				if (isFind) {
					return;
				}
				if (node.key == key) {
					isFind = true;
					findObj.node = node;
					findObj.pNode = pNode;
					findObj.index = index;
				}
				if (node.childList) {
					for (var i in node.childList) {
						loop(node.childList[i], node.childList, i);
					}
				}
			}
			return function (k) {
				key = k;
				isFind = false;
				findObj = {};
				for (var i in this.treeData) {
					loop(this.treeData[i], this.treeData, i);
				}
				return findObj;
			}
		})(),
		addRootNode : function(){
			this.treeData.push({
				checked: 'false',
				key: this.addKey++,
				name: '새로운 태그 필터',
				childList: []
			})
		},
		addNode: function (obj) {
			console.log(obj);
			if (!obj.childList) {
				console.log('xx');
				this.$set(obj, 'childList', []);
			}
			obj.childList.push({
				checked: 'false',
				key: this.addKey++,
				name: '새로운 태그 필터',
				childList: []
			})
		},
		removeNode: function (obj) {
			var findObj;
			findObj = this.findNode(obj.key)
			findObj.pNode.splice(findObj.index, 1);
		},
		save: (function () {
			var keyMap = {};
			var duplicationNameList = [];

			var check = function () {
				console.log('check');
				for (var i = this.treeData.length - 1; i >= 0; i--) {
					duplicationCheckAndSetKey(this.treeData[i], this.treeData, i);
				}
			}
			var duplicationCheckAndSetKey = function (node, pNode, index) {
				node.key = node.name;
				// 생성만 하고 아무것도 안한건 지워준다.
				if (node.name == '새로운 태그 필터') {
					pNode.splice(index, 1)
				} else {
					if (keyMap[node.name]) {
						duplicationNameList.push(node.name);
					} else {
						keyMap[node.name] = true;
					}
					if (node.childList) {
						for (var i = node.childList.length - 1; i >= 0; i--) {
							duplicationCheckAndSetKey(node.childList[i], node.childList, i);
						}
					}
				}
			}

			return function () {
				var copy;
				var _this = this;

				duplicationNameList = [];
				keyMap = {};
				check.call(this);

				// 중복 허용
				if (false && duplicationNameList.length) {
					alert('중복되는 태그가 있습니다. \n' + duplicationNameList.toString());
				} else {
					this.loading = true;
					copy = JSON.parse(JSON.stringify(this.treeData))
					copy.push(colorTagTree);
					$.ajax({
						url: '/api/saveTagTree.json',
						method: 'post',
						type: 'json',
						data: {
							tree: copy
						},
						success: function (rs) {
							console.log(rs);
							alert('저장되었습니다.');
						},
						complete: function () {
							_this.loading = false;
						}
					})
				}
			}
		})()
	}
});

// 포스트 설정
Vue.component('post-setting', {
	template: `<v-card flat class="pa-3">
  <v-btn @click="del" class="mb-3" :loading = "loading" depressed small color="primary">delete</v-btn>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="postList"
    :pagination.sync="pagination"
    select-all
		item-key="index"
		:loading="tableLoading"
	class="elevation-1"
	flat
  >
    <template slot="headers" slot-scope="props">
      <tr>
        <th>
          <v-checkbox
            :input-value="props.all"
            :indeterminate="props.indeterminate"
            primary
            hide-details
            @click.stop="toggleAll"
          ></v-checkbox>
        </th>
        <th
          v-for="header in props.headers"
          :key="header.text"
          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
          @click="changeSort(header.value)"
        >
          <v-icon small>arrow_upward</v-icon>
          {{ header.text }}
        </th>
      </tr>
    </template>
    <template slot="items" slot-scope="props">
      <tr :active="props.selected" @click="props.selected = !props.selected">
        <td>
          <v-checkbox
            :input-value="props.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td class="text-xs-center">{{ props.item.index }}</td>
				<td class="text-xs-center">{{ getDateText(props.item.created_time) }}</td>
        <td class="text-xs-center">{{ getText(props.item) }}</td>
      </tr>
    </template>
  </v-data-table>
             </v-card>`,
	props: [],
	data: function () {
		return {
			pagination: {
				sortBy: 'name'
			},
			selected: [],
			headers: [
				{
					text: 'No',
					align: 'center',
					value: 'index'
				},
				{
					text: '작성일',
					align: 'center',
					value: 'created_time'
				},
				{
					text: '텍스트',
					align: 'center',
					sortable: false
				}
			],
			postList: [],
			loading: false,
			tableLoading : false
		}
	},
	beforeMount() {
		var _this = this;
		this.tableLoading = true;
		$.ajax({
			url: '/api/getAllPost.json',
			method: 'get',
			type: 'json',
			success: function (rs) {
				if (rs) {
					for (var i in rs) {
						rs[i].index = (+i + 1);
					}
					_this.postList = rs;
					_this.tableLoading = false;
				}
			}
		})

	},
	methods: {
		toggleAll() {
			if (this.selected.length) this.selected = []
			else this.selected = this.postList.slice()
		},
		changeSort(column) {
			if (this.pagination.sortBy === column) {
				this.pagination.descending = !this.pagination.descending
			} else {
				this.pagination.sortBy = column
				this.pagination.descending = false
			}
		},
		del: function () {
			var _this = this;
			var idList = [];
			this.loading = true;
			if (this.selected.length) {
				for (var i in this.selected) {
					idList.push(this.selected[i]._id);
				}
				$.ajax({
					url: '/api/deletePost.json',
					method: 'post',
					type: 'json',
					data: {
						idList: idList
					},
					success: function (rs) {
						var index;
						for (var i in _this.selected) {
							index = _this.postList.indexOf(_this.selected[i]);
							_this.postList.splice(index, 1);
						}
						for (var i in _this.postList) {
							_this.postList[i].index = (+i + 1);
						}
						_this.selected = [];
						alert('삭제되었습니다');
					},
					complete: function () {
						_this.loading = false;
					}
				})
			}
		},
		getText: function (item) {
			if (item.caption && item.caption.text) {
				return item.caption.text
			} else {
				return '';
			}
		},
		getDateText: function (created_time) {
			var _date = new Date(created_time * 1000);
			return _date.getFullYear() + '.' + (+_date.getMonth() + 1) + '.' + _date.getDate() + ' ' + _date.getHours() + ':' + (_date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes());
		}
	}
});

var app = new Vue({
	el: '#app',
	data: function () {
		return {
			active: null,
			tabItems: [{
				name: '로딩 서버 설정',
				component: 'serverSetting'
			}, {
				name: '커스텀 필터 설정',
				component: 'customFilterSetting'
			}, {
				name: '포스트 설정',
				component: 'postSetting'
			}],
			serverConfig: null
		}
	},
	beforeMount() {
		$.ajax({
			url: '/api/loadConfig.json',
			method: 'get',
			type: 'json',
			success: function (rs) {
				app.serverConfig = rs;
				console.log(rs);
				console.log('suc');
				// Index.serverTreeData = rs.tree;
				// Index.treeData = Index.setData(rs.tree);
				// Index.initTree();
				// $('input[name="server"][value="' + rs.loadServer + '"]').attr('checked', true);
			}
		})
	},
	created() {
		this.$set(this.$vuetify.theme, 'primary', '#37378f');
	},
	mounted: function () {

	},
	methods: {
	},
})
