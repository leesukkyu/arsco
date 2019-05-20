var app = new Vue({
	el: '#app',
	data: {
		id: null,
		pw: null,
		errMsg : '',
		loading : false
	},
	beforeMount() {
	},
	created() {
		this.$set(this.$vuetify.theme, 'primary', '#37378f');
	},
	mounted: function () {

	},
	methods: {
		submit : function(){
			this.loading = true;
			$.ajax({
				method: 'post',
				url: '/admin/login',
				data: {
					username: this.id,
					password: this.pw,
				},
				success: function (rs) {
					if (rs.err) {
						app.errMsg = '아이디와 비밀번호를 확인하세요.';
					} else {
						window.location = rs.redirect;
					}
				},
				complete  : function(){
					app.loading = false;
				}
			})
		}
	},
})
