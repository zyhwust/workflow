<template>
	<div id="overlay" v-if="isActive.display" @click="disappear">
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isActive: this.$root.overlay2
			}
		},
		methods: {
			disappear: function() {
				var $vm = this;
				for(var key in $vm.$root.$data) {
					if(Object.prototype.toString.call($vm.$root.$data[key])=== '[object Object]') {
						if($vm.$root.$data[key].hasOwnProperty('display')) {
							$vm.$root.$data[key]['display'] = false;
						}
					}
				}
			}
		}
	}
</script>

<style>
	#overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;	
		background-color: #000;
		opacity: .5;
		z-index: 8;
	}
</style>


