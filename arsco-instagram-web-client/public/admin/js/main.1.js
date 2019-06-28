var colorTagTree =
{
	checked: 'false',
	key: '색깔',
	name: '색깔',
	childList: [
		{
			checked: 'false',
			key: '월넛',
			name: '월넛',
			thumbnail: 'Walnut.jpg'
		},
		{
			checked: 'false',
			key: '엔틱',
			name: '엔틱',
			thumbnail: 'Antique.jpg'
		},
		{
			checked: 'false',
			key: '체리',
			name: '체리',
			thumbnail: 'Cherry.jpg'
		},
		{
			checked: 'false',
			key: '블랙',
			name: '블랙',
			thumbnail: 'Black.jpg'
		},
		{
			checked: 'false',
			key: '화이트',
			name: '화이트',
			thumbnail: 'White.jpg'
		},
		{
			checked: 'false',
			key: '진회색',
			name: '진회색',
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
			key: '주황',
			name: '주황',
			thumbnail: 'Orange.jpg'
		},
		{
			checked: 'false',
			key: '노랑',
			name: '노랑',
			thumbnail: 'Yellow.jpg'
		},
		{
			checked: 'false',
			key: '초록',
			name: '초록',
			thumbnail: 'YellowGreen.jpg'
		}
	]
}

// 월넛, 엔틱, 체리, 블랙, 화이트, 진회색, 베이지, 레드, 주황, 노랑, 초록
var Index = {
	treeData: null,
	serverTreeData: null,
	id: 1,
	init: function () {
		this.attachEvent();
		this.loadConfig();
	},
	attachEvent: function () {
		$('#logout').click(function () {
			$.ajax({
				method: 'get',
				url: '/admin/logout',
				success: function (rs) {
					if (rs.err) {
						alert('로그아웃을 다시 시도해 주세요.');
					} else {
						window.location = rs.redirect;
					}
				}
			})
		})

		$('#saveCustomTag').click(function () {
			if (confirm('저장하시겠습니까?')) {
				Index.saveTree();
			}
		})

		$('#saveLoadServerSetting').click(function () {
			if (confirm('저장하시겠습니까?')) {
				Index.saveLoadServerSetting();
			}
		})
	},
	saveLoadServerSetting: function () {
		var loadServer;
		if ($('input[name="server"]:checked').length == 0) {
			alert('서버를 선택하세요');
		} else {
			loadServer = $('input[name="server"]:checked').attr('value');
			$.ajax({
				url: '/api/saveLoadServerSetting.json',
				method: 'post',
				type: 'json',
				data: {
					loadServer: loadServer
				},
				success: function (rs) {
					console.log(rs);
					alert('저장되었습니다.');
				}
			})
		}
	},
	saveTree: function () {
		var newTreeData;
		newTreeData = $('#customTagTreeWrap').tree('getTree');
		newTreeData = Index.getData(newTreeData.children);
		if (newTreeData.error === true) {
			alert('[에러] 중복된 태그명이 있습니다. \n "' + newTreeData.list.toString() + '"');
		} else {
			newTreeData.list.push(colorTagTree);
			$.ajax({
				url: '/api/saveTagTree.json',
				method: 'post',
				type: 'json',
				data: {
					tree: newTreeData.list
				},
				success: function (rs) {
					console.log(rs);
					alert('저장되었습니다.');
				}
			})
		}
	},
	loadConfig: function () {
		$.ajax({
			url: '/api/loadConfig.json',
			method: 'get',
			type: 'json',
			success: function (rs) {
				console.log();
				Index.serverTreeData = rs.tree;
				Index.treeData = Index.setData(rs.tree);
				Index.initTree();
				$('input[name="server"][value="' + rs.loadServer + '"]').attr('checked', true);
			}
		})
	},
	initTree: function () {
		var $tree = $('#customTagTreeWrap');
		n = $tree.tree({
			selectable: false,
			data: Index.treeData,
			closedIcon: $('<span class="ti-arrow-circle-right"></span>'),
			openedIcon: $('<span class="ti-arrow-circle-down"></span>'),
			autoOpen: 1,
			dragAndDrop: true,
			onCreateLi: function (node, $li) {
				// Append a link to the jqtree-element div.
				// The link has an url '#node-[id]' and a data property 'node-id'.
				$li.find('.jqtree-element')
					.attr('data-node-id', node.id)
					.append('<input data-node-input class="jqtree-input" style="margin-left:3px;" type="text" value="' + node.name + '">')
					.append('<button class="btn" data-node-edit><span class="ti-pencil"></span></button>')
					.append('<button class="btn" data-add-node="' + node.id + '" style="margin-left:3px;"><span class="ti-plus"></span></button>')
					.append('<button class="btn" data-del-node="' + node.id + '" style="margin-left:3px;"><span class="ti-close"></span></button>')
			}
		});

		$tree.on(
			'click', '[data-node-edit]',
			function (e) {
				var $el = $(this).closest('.jqtree-element');
				var value;
				if ($el.hasClass('edit')) {
					var e = jQuery.Event('keyup', {
						keyCode: 13
					});
					$el.find('[data-node-input]').trigger(e);
				} else {
					$el.addClass('edit');
					value = $el.find('input').val();
					$el.find('input').val('').focus().val(value + '');
				}
			}
		);

		$tree.on(
			'keyup', '[data-node-input]',
			function (e) {
				if (e.keyCode == 13) {
					var $el = $(this).closest('.jqtree-element');
					$el.removeClass('edit');
					$el.find('.jqtree-title').text($(this).val());
					var node_id = $el.data('node-id');
					var node = $tree.tree('getNodeById', node_id);
					node.name = $(this).val();
				}
			}
		);

		$(document).on(
			'click', '[data-add-node]',
			function (e) {
				var $parentNode, parentNodeId;
				parentNodeId = $(this).data('add-node');
				if (parentNodeId == 'root') {
					$tree.tree(
						'appendNode', {
							name: '새로운 태그',
							id: Index.id++
						}
					);
				} else {
					$parentNode = $tree.tree('getNodeById', parentNodeId);
					$tree.tree(
						'appendNode', {
							name: 'new_node',
							id: Index.id++
						},
						$parentNode
					);
				}
			});

		$(document).on(
			'click', '[data-del-node]',
			function (e) {
				$node = $tree.tree('getNodeById', $(this).data('del-node'));
				$tree.tree('removeNode', $node);
			})
	},
	setData: (function () {
		var traval = function (parent, node) {
			var obj = {
				id: Index.id++,
				name: node.name,
			}
			if (node.childList) {
				obj.children = [];
				for (var i in node.childList) {
					traval(obj.children, node.childList[i]);
				}
			}
			parent.push(obj);
		}
		return function (treeData) {
			var parent = [];
			for (var i in treeData) {
				if(treeData[i].key != '색깔'){
					traval(parent, treeData[i]);
				}
			}
			return parent;
		}
	})(),
	getData: (function () {
		var map, isError, errorList;
		var traval = function (parent, node) {
			if (!map[node.name]) {
				map[node.name] = true;
			} else {
				errorList.push(node.name);
				isError = true;
			}
			var obj = {
				key: node.name,
				name: node.name,
				checked: false
			}
			if (node.children) {
				obj.childList = [];
				for (var i in node.children) {
					traval(obj.childList, node.children[i]);
				}
			}
			parent.push(obj);
		}
		return function (treeData) {
			var parent = [];
			map = {};
			isError = false;
			errorList = [];
			for (var i in treeData) {
				traval(parent, treeData[i]);
			}
			if (isError) {
				return {
					error: true,
					list: errorList
				};
			} else {
				return {
					error: false,
					list: parent
				};
			}
		}
	})()
}
Index.init();